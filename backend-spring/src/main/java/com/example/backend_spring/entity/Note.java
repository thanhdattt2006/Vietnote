package com.example.backend_spring.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entity map tới bảng 'Note' trong DB cũ (Laravel).
 *
 * 🪄 Soft Delete được xử lý TỰ ĐỘNG bởi Hibernate:
 * - @SQLDelete: Override câu DELETE thành UPDATE isDeleted=true, deletedAt=CURRENT_TIMESTAMP
 * - @SQLRestriction: Tự động thêm WHERE isDeleted=false vào MỌI query SELECT
 * → Không cần tự check isDeleted trong Service nữa (giống @SoftDeletes của Laravel)
 *
 * Lưu ý: @Where đã deprecated từ Hibernate 6.3, dùng @SQLRestriction thay thế.
 */
@Entity
@Table(name = "Note")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE Note SET isDeleted = true, deletedAt = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("isDeleted = false")
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String title;

    /**
     * Lưu HTML content thuần (với link ảnh Cloudinary từ Frontend).
     * Backend KHÔNG xử lý Base64 hay File IO (đã decoupled theo Phase 6).
     */
    @Column(columnDefinition = "LONGTEXT", nullable = true)
    private String content;

    /**
     * Map với cột 'isPinned' — Boolean, default false
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isPinned = false;

    /**
     * Soft delete flag — set true khi user xóa vào thùng rác.
     * Khi @SQLDelete chạy, cột này được set true tự động.
     */
    @Column(nullable = false)
    @Builder.Default
    private Boolean isDeleted = false;

    /**
     * Timestamp khi bị soft-deleted.
     * Map với cột 'deletedAt' (camelCase) — đúng với naming strategy.
     */
    @Column(nullable = true)
    private LocalDateTime deletedAt;

    /**
     * Map với cột 'createdAt' — camelCase, set khi tạo mới.
     */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Map với cột 'updatedAt' — camelCase, tự update khi có thay đổi.
     */
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    /**
     * FK → Account.id (map cột 'ownerId').
     * LAZY loading để tránh N+1 query khi lấy danh sách note.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ownerId", nullable = false)
    private User owner;

    /**
     * Quan hệ 1-N với NoteImage.
     * CascadeType.ALL + orphanRemoval=true để xóa ảnh khi forceDelete note.
     */
    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @Builder.Default
    private List<NoteImage> images = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
