package com.example.backend_spring.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

/**
 * Entity map tới bảng 'Account' trong DB cũ (Laravel).
 * Implements UserDetails để tích hợp Spring Security.
 *
 * Thay đổi so với Laravel AccountModel:
 * - password → nullable (OAuth2 user không có password)
 * - Thêm provider (google/github/local) và providerId để OAuth2 lookup
 * - Thêm avatarUrl để lưu ảnh đại diện từ OAuth2
 * - role mặc định 'user', dùng để phân quyền ADMIN
 */
@Entity
@Table(name = "Account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * username = email (dùng làm login credential và OAuth2 lookup key)
     * Unique + not null theo migration cũ
     */
    @Column(nullable = false, unique = true)
    private String username;

    /**
     * Nullable — OAuth2 user không có password local.
     * Khi login bằng Google/Github thì field này là null.
     */
    @Column(nullable = true)
    private String password;

    @Column(nullable = true)
    private String name;

    @Column(nullable = true)
    private Integer age;

    /**
     * Enum string: male / female / other
     */
    @Column(nullable = true)
    private String gender;

    /**
     * OAuth2 provider: "local" | "google" | "github"
     * Thêm mới so với bảng cũ — cần thêm column này vào DB
     */
    @Column(nullable = false)
    @Builder.Default
    private String provider = "local";

    /**
     * ID từ phía provider (Google sub, Github id...)
     * Dùng để updateOrCreate trong OAuth2UserService
     */
    @Column(nullable = true)
    private String providerId;

    /**
     * Avatar URL từ OAuth2 provider (Google picture, Github avatar_url)
     */
    @Column(nullable = true)
    private String avatarUrl;

    /**
     * Role: "user" | "admin"
     * Map với cột 'role' trong bảng Account
     */
    @Column(nullable = false)
    @Builder.Default
    private String role = "user";

    /**
     * Map với cột 'createdAt' (camelCase) — đúng với naming strategy đã config
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ===== UserDetails interface (Spring Security) =====

    /**
     * Chuyển role string thành GrantedAuthority.
     * ROLE_USER hoặc ROLE_ADMIN để dùng với @PreAuthorize("hasRole('ADMIN')")
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
