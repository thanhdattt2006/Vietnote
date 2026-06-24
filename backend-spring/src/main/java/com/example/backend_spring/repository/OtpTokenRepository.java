package com.example.backend_spring.repository;

import com.example.backend_spring.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Repository cho entity OtpToken (bảng password_reset_tokens).
 *
 * Thay thế các lệnh DB::table('password_reset_tokens') raw trong Laravel:
 * - DB::table(...)->where('email', ...)->delete()      → deleteByEmail()
 * - DB::table(...)->insert([...])                      → save() từ Service
 * - DB::table(...)->where('email', ...).where('token') → findByEmailAndToken()
 */
@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    /**
     * Tìm OTP record theo email + token để verify.
     * Tương đương:
     * DB::table('password_reset_tokens')->where('email', $email)->where('token', $token)->first()
     */
    Optional<OtpToken> findByEmailAndToken(String email, String token);

    /**
     * Xóa OTP cũ trước khi tạo mới (tránh duplicate).
     * Tương đương: DB::table('password_reset_tokens')->where('email', $email)->delete()
     */
    @Modifying
    @Transactional
    @Query("DELETE FROM OtpToken o WHERE o.email = :email")
    void deleteByEmail(@Param("email") String email);
}
