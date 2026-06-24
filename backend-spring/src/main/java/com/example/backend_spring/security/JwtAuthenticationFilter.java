package com.example.backend_spring.security;

import com.example.backend_spring.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JwtAuthenticationFilter — Chạy 1 lần mỗi request, trước khi đến Controller.
 *
 * Luồng xử lý:
 * 1. Đọc header: Authorization: Bearer <token>
 * 2. Trích xuất username từ token qua JwtService
 * 3. Load UserDetails từ DB
 * 4. Validate token
 * 5. Set SecurityContextHolder → Spring Security biết request này đã authenticated
 *
 * Tương đương: middleware('auth:sanctum') trong Laravel routes
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // 1. Không có header hoặc không phải Bearer → bỏ qua, để SecurityFilterChain xử lý
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Trích xuất token (bỏ "Bearer " prefix)
        final String jwt = authHeader.substring(7);
        final String username;

        try {
            username = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            // Token malformed / expired → tiếp tục chain, SecurityFilterChain sẽ trả 401
            filterChain.doFilter(request, response);
            return;
        }

        // 3. Chỉ authenticate nếu chưa có authentication trong context (tránh xử lý lại)
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // 4. Load user từ DB
            UserDetails userDetails = userRepository.findByUsername(username)
                    .orElse(null);

            if (userDetails != null && jwtService.isTokenValid(jwt, userDetails)) {
                // 5. Tạo authentication token và set vào SecurityContext
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
