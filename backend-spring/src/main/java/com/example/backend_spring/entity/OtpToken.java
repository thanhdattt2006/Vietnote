package com.example.backend_spring.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity map tới bảng 'password_reset_tokens' (bảng cũ của Laravel).
 *
 * Thay thế toàn bộ các DB::table('password_reset_tokens')->insert/where/delete
 * trong Laravel AuthController bằng JPA Repository chuẩn.
 *
 * OTP hết hạn sau 15 phút (check trong AuthService).
 */
@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Email (username) của user cần reset password.
     * Map với cột 'email' trong bảng password_reset_tokens.
     */
    @Column(nullable = false)
    private String email;

    /**
     * Mã OTP 6 chữ số (100000 - 999999).
     * Map với cột 'token'.
     */
    @Column(nullable = false)
    private String token;

    /**
     * Thời điểm tạo OTP để check hết hạn 15 phút.
     * Map với cột 'created_at' (snake_case theo bảng Laravel cũ).
     */
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Check xem OTP có hết hạn chưa (15 phút).
     */
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.createdAt.plusMinutes(15));
    }
}
