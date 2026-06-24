package com.example.backend_spring.security.oauth2;

import com.example.backend_spring.entity.User;
import com.example.backend_spring.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

/**
 * CustomOAuth2UserService — Xử lý sau khi OAuth2 provider trả về user info.
 *
 * Tương đương Socialite::driver($provider)->stateless()->user() + updateOrCreate() trong Laravel:
 *
 * $user = AccountModel::updateOrCreate(
 *     ['username' => $socialUser->email],
 *     ['name' => $socialUser->name, 'password' => Hash::make(Str::random(16))]
 * );
 *
 * Luồng:
 * 1. Gọi OAuth2 provider API lấy user info (Google/Github)
 * 2. Tìm user trong DB theo email (username)
 * 3. Nếu chưa tồn tại → tạo mới (register ngầm)
 * 4. Nếu đã tồn tại → update name/avatar nếu cần
 * 5. Return CustomOAuth2User (wrap User entity + OAuth2 attributes)
 */
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        // Lấy user info từ provider (gọi API Google /userinfo, Github /user)
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Lấy tên provider: "google" hoặc "github"
        String provider = userRequest.getClientRegistration().getRegistrationId();

        // Trích xuất thông tin cần thiết theo từng provider
        String email = extractEmail(oAuth2User, provider);
        String name = extractName(oAuth2User, provider);
        String providerId = extractProviderId(oAuth2User, provider);
        String avatarUrl = extractAvatarUrl(oAuth2User, provider);

        // updateOrCreate: tìm theo email+provider, nếu chưa có thì tạo mới
        User user = userRepository.findByUsername(email)
                .map(existingUser -> updateExistingUser(existingUser, name, avatarUrl))
                .orElseGet(() -> createNewUser(email, name, provider, providerId, avatarUrl));

        // Wrap User entity vào CustomOAuth2User để SuccessHandler có thể lấy User entity
        return new CustomOAuth2User(oAuth2User, user);
    }

    // ===== PRIVATE HELPERS =====

    private User updateExistingUser(User user, String name, String avatarUrl) {
        // Cập nhật tên và avatar mới nhất từ provider (user có thể đổi tên/ảnh)
        user.setName(name);
        user.setAvatarUrl(avatarUrl);
        return userRepository.save(user);
    }

    private User createNewUser(String email, String name, String provider,
                               String providerId, String avatarUrl) {
        User newUser = User.builder()
                .username(email)
                .password(null)          // OAuth2 user không có local password
                .name(name)
                .provider(provider)
                .providerId(providerId)
                .avatarUrl(avatarUrl)
                .role("user")
                .build();
        return userRepository.save(newUser);
    }

    /**
     * Google trả về email trực tiếp.
     * Github có thể trả về email null nếu user để private → fallback sang login + @github.com
     */
    private String extractEmail(OAuth2User oAuth2User, String provider) {
        String email = oAuth2User.getAttribute("email");
        if (email == null && "github".equals(provider)) {
            String login = oAuth2User.getAttribute("login");
            email = login + "@github.com";
        }
        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider: " + provider);
        }
        return email.toLowerCase().trim();
    }

    private String extractName(OAuth2User oAuth2User, String provider) {
        String name = oAuth2User.getAttribute("name");
        if (name == null) {
            // Github fallback
            name = oAuth2User.getAttribute("login");
        }
        return name;
    }

    private String extractProviderId(OAuth2User oAuth2User, String provider) {
        Object id = oAuth2User.getAttribute("sub");   // Google dùng "sub"
        if (id == null) {
            id = oAuth2User.getAttribute("id");       // Github dùng "id" (Integer)
        }
        return id != null ? id.toString() : null;
    }

    private String extractAvatarUrl(OAuth2User oAuth2User, String provider) {
        if ("google".equals(provider)) {
            return oAuth2User.getAttribute("picture");
        } else if ("github".equals(provider)) {
            return oAuth2User.getAttribute("avatar_url");
        }
        return null;
    }
}
