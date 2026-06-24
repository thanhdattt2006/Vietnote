package com.example.backend_spring.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entity map tới bảng 'NoteImage' trong DB cũ (Laravel).
 *
 * Lưu URL ảnh Cloudinary. Với luồng mới (Phase 6):
 * - Frontend upload ảnh lên Cloudinary → nhận URL
 * - Frontend nhúng URL vào HTML content rồi gửi lên Backend
 * - Backend chỉ lưu HTML, KHÔNG xử lý ảnh nữa
 * → Table này giữ nguyên để backward-compatible với dữ liệu cũ
 */
@Entity
@Table(name = "NoteImage")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * FK → Note.id (map cột 'noteId').
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "noteId", nullable = false)
    private Note note;

    /**
     * Cloudinary URL hoặc /storage/ URL (ảnh cũ từ Laravel).
     * Map với cột 'imageUrl' — camelCase.
     */
    @Column(nullable = false)
    private String imageUrl;

    /**
     * Map với cột 'uploadedAt' — camelCase.
     */
    @Column(nullable = false)
    private LocalDateTime uploadedAt;

    @PrePersist
    protected void onCreate() {
        this.uploadedAt = LocalDateTime.now();
    }
}
