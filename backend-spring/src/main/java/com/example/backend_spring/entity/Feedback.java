package com.example.backend_spring.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity map tới bảng 'Response' trong DB cũ (Laravel ResponseModel).
 *
 * Đặt tên Java class là Feedback (ngữ nghĩa rõ hơn Response) nhưng
 * vẫn map đúng tên bảng 'Response' để không phá schema DB cũ.
 */
@Entity
@Table(name = "Response")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Tên người gửi feedback.
     */
    @Column(nullable = true)
    private String name;

    /**
     * Email người gửi — map với cột 'gmail' (camelCase giữ nguyên theo DB cũ).
     */
    @Column(nullable = false)
    private String gmail;

    /**
     * Chủ đề / lý do phản hồi.
     */
    @Column(nullable = true)
    private String subject;

    /**
     * Nội dung phản hồi.
     */
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    /**
     * Thời điểm gửi — map với cột 'sentAt' (camelCase).
     */
    @Column(nullable = false)
    private LocalDateTime sentAt;

    @PrePersist
    protected void onCreate() {
        this.sentAt = LocalDateTime.now();
    }
}
