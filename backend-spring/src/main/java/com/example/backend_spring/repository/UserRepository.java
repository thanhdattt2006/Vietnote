package com.example.backend_spring.repository;

import com.example.backend_spring.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository cho entity User (bảng Account).
 * Thay thế toàn bộ AccountModel::where('username', ...) trong Laravel.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Tương đương: AccountModel::where('username', $username)->first()
     * Dùng trong: login, forgotPassword, resetPassword, OAuth2 lookup
     */
    Optional<User> findByUsername(String username);

    /**
     * Tương đương: AccountModel::where('username', $email)->exists()
     * Dùng trong: register để check duplicate email
     */
    boolean existsByUsername(String username);

    /**
     * Tương đương: AccountModel::where('username', $email)->where('provider', $provider)->first()
     * Dùng trong: OAuth2UserService để tìm user theo provider + email
     */
    Optional<User> findByUsernameAndProvider(String username, String provider);

    /**
     * Tìm theo providerId — fallback khi OAuth user đổi email
     */
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}
