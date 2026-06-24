package com.example.backend_spring.security;

import com.example.backend_spring.security.oauth2.CustomOAuth2UserService;
import com.example.backend_spring.security.oauth2.OAuth2AuthenticationSuccessHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.backend_spring.repository.UserRepository;

import java.util.List;

/**
 * SecurityConfig — Cấu hình toàn bộ Spring Security.
 *
 * Thay thế Laravel:
 * - config/cors.php             → corsConfigurationSource()
 * - middleware('auth:sanctum')  → SecurityFilterChain + JwtAuthenticationFilter
 * - middleware('admin')         → @PreAuthorize("hasRole('ADMIN')") trong Controller
 * - Socialite OAuth2            → oauth2Login() + CustomOAuth2UserService
 *
 * Kiến trúc: Stateless (JWT) — KHÔNG dùng Session.
 *
 * @EnableMethodSecurity: Bật @PreAuthorize để dùng trong AdminController.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity                   // Bật @PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final OAuth2AuthenticationSuccessHandler oAuth2SuccessHandler;
    private final UserRepository userRepository;

    @Value("${application.frontend-url}")
    private String frontendUrl;

    // ===== SECURITY FILTER CHAIN =====

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Tắt CSRF (Stateless JWT không cần CSRF protection)
            .csrf(AbstractHttpConfigurer::disable)

            // 2. CORS Configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 3. Session: STATELESS — không tạo session, mỗi request tự xác thực bằng JWT
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // 4. Authorization Rules
            .authorizeHttpRequests(auth -> auth
                // --- PUBLIC ROUTES (không cần token) ---
                // Tương đương: Route::post('/register', ...) ở ngoài middleware group

                // Auth endpoints
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/forgot-password").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/verify-otp").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/reset-password").permitAll()

                // OAuth2 endpoints (Spring Boot tự xử lý /oauth2/authorization/{provider}
                // và /oauth2/callback/{provider})
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/login/**").permitAll()   // Spring OAuth2 internal redirect

                // Public data
                .requestMatchers(HttpMethod.POST, "/api/responses").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/notes/*/images").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/test").permitAll()

                // --- ADMIN ROUTES (phải có token + role ADMIN) ---
                // @PreAuthorize ở Controller level, nhưng vẫn cần authenticated ở đây
                .requestMatchers("/api/admin/**").hasRole("ADMIN")

                // --- TẤT CẢ CÒN LẠI: phải authenticated ---
                .anyRequest().authenticated()
            )

            // 5. JWT Filter — Chạy TRƯỚC UsernamePasswordAuthenticationFilter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)

            // 6. OAuth2 Login Configuration
            .oauth2Login(oauth2 -> oauth2
                // Spring tự build /oauth2/authorization/{provider} redirect URL
                .userInfoEndpoint(userInfo ->
                    userInfo.userService(customOAuth2UserService)
                )
                // Sau khi OAuth2 thành công → sinh JWT → redirect frontend
                .successHandler(oAuth2SuccessHandler)
            )

            // 7. Disable form login (dùng JWT, không cần form login page)
            .formLogin(AbstractHttpConfigurer::disable)
            .httpBasic(AbstractHttpConfigurer::disable);

        return http.build();
    }

    // ===== CORS CONFIGURATION =====

    /**
     * Tương đương config/cors.php của Laravel.
     * Cho phép Frontend (localhost:5173 local, Vercel production) gọi API.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
            "http://localhost:5173",          // Vite dev server (frontend mới)
            "http://localhost:3000",          // Create React App (legacy)
            "https://vietnote.vercel.app"     // Production frontend
        ));

        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);     // Tương đương 'supports_credentials' => true

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // ===== AUTHENTICATION PROVIDER =====

    /**
     * DaoAuthenticationProvider: Load user từ DB và dùng BCrypt để verify password.
     * Spring Security tự gọi khi authenticate bằng username/password.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * UserDetailsService: Tìm user theo username (email) từ DB.
     * Tương đương: AccountModel::where('username', $request->username)->first()
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                    "User not found: " + username
                ));
    }

    /**
     * BCrypt password encoder (bcrypt rounds 12 — khớp với BCRYPT_ROUNDS=12 trong .env Laravel)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * AuthenticationManager: Dùng trong AuthService.login() để authenticate credentials.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }
}
