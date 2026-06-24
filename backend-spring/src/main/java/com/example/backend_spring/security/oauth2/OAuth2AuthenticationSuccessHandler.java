package com.example.backend_spring.security.oauth2;

import com.example.backend_spring.security.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

/**
 * OAuth2AuthenticationSuccessHandler — Được gọi sau khi OAuth2 login thành công.
 *
 * Tương đương handleProviderCallback() trong Laravel AuthController:
 *
 * $token = $user->createToken('social-login')->plainTextToken;
 * return redirect($frontendUrl . '/auth/callback?token=' . $token . '&user=' . urlencode(json_encode($user)));
 *
 * Luồng Spring Boot:
 * 1. OAuth2 provider callback về /oauth2/callback/{provider}
 * 2. Spring Security gọi CustomOAuth2UserService.loadUser()
 * 3. Sau khi thành công, gọi handler này
 * 4. Sinh JWT → redirect về Frontend với token trong query param
 */
@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;

    @Value("${application.frontend-url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException {

        // Lấy CustomOAuth2User từ Authentication object
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();

        // Sinh JWT token từ User entity
        String token = jwtService.generateToken(oAuth2User.getUser());

        // Build redirect URL: http://localhost:5173/auth/callback?token=<jwt>
        String redirectUrl = UriComponentsBuilder
                .fromUriString(frontendUrl + "/auth/callback")
                .queryParam("token", URLEncoder.encode(token, StandardCharsets.UTF_8))
                .build()
                .toUriString();

        // Redirect về Frontend (giống redirect() của Laravel)
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
