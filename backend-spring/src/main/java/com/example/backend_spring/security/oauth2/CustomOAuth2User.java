package com.example.backend_spring.security.oauth2;

import com.example.backend_spring.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

/**
 * Wrapper kết hợp OAuth2User (attributes từ provider) + User entity (từ DB).
 *
 * Mục đích: Cho phép OAuth2AuthenticationSuccessHandler truy cập
 * User entity để gọi JwtService.generateToken(user).
 */
@Getter
public class CustomOAuth2User implements OAuth2User {

    private final OAuth2User delegate;

    /**
     * User entity đã được upsert vào DB bởi CustomOAuth2UserService.
     */
    private final User user;

    public CustomOAuth2User(OAuth2User delegate, User user) {
        this.delegate = delegate;
        this.user = user;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return delegate.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getAuthorities();
    }

    @Override
    public String getName() {
        return user.getUsername();
    }
}
