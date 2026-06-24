package com.example.backend_spring.repository;

import com.example.backend_spring.entity.Note;
import com.example.backend_spring.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Repository cho entity Note (bảng Note).
 *
 * Lưu ý quan trọng về Soft Delete:
 * - Entity Note có @SQLRestriction("isDeleted = false") → mọi query JPA tự động thêm WHERE isDeleted=false
 * - Để query notes trong THÙNG RÁC (isDeleted=true), phải dùng @Query native SQL thuần
 *   và BỎ QUA @SQLRestriction bằng cách dùng nativeQuery = true hoặc @FilterDef
 */
@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {

    /**
     * Lấy notes đang HOẠT ĐỘNG của user, sắp xếp pinned trước → mới nhất.
     * @SQLRestriction tự động thêm WHERE isDeleted=false.
     *
     * Tương đương:
     * NoteModel::with('images')->where('isDeleted', false)->where('ownerId', $userId)
     *   ->orderByDesc('isPinned')->orderByDesc('updatedAt')->paginate($perPage)
     */
    Page<Note> findByOwnerOrderByIsPinnedDescUpdatedAtDesc(User owner, Pageable pageable);

    /**
     * Tìm kiếm full-text trong title + content (active notes).
     * Tương đương: ->where('title', 'LIKE', "%{$keyword}%")->orWhere('content', 'LIKE', ...)
     */
    Page<Note> findByOwnerAndTitleContainingIgnoreCaseOrOwnerAndContentContainingIgnoreCaseOrderByIsPinnedDescUpdatedAtDesc(
            User owner, String titleKeyword,
            User owner2, String contentKeyword,
            Pageable pageable
    );

    /**
     * Tìm note theo ID và owner (bảo mật — chỉ xem được note của mình).
     * Tương đương: NoteModel::where('id', $id)->where('ownerId', auth()->id())->first()
     */
    Optional<Note> findByIdAndOwner(Long id, User owner);

    // ===== TRASH QUERIES (bypass @SQLRestriction bằng nativeQuery) =====

    /**
     * Lấy notes trong thùng rác (isDeleted = true) của user.
     * Phải dùng nativeQuery để bypass @SQLRestriction("isDeleted = false").
     *
     * Tương đương:
     * NoteModel::with('images')->where('isDeleted', true)->where('ownerId', $userId)
     *   ->orderByDesc('deletedAt')->get()
     */
    @Query(value = "SELECT * FROM Note WHERE ownerId = :ownerId AND isDeleted = true ORDER BY deletedAt DESC",
            nativeQuery = true)
    List<Note> findTrashedNotesByOwnerId(@Param("ownerId") Long ownerId);

    /**
     * Khôi phục note từ thùng rác (set isDeleted = false, deletedAt = null).
     * Tương đương: $note->update(['isDeleted' => false, 'deletedAt' => null])
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE Note SET isDeleted = false, deletedAt = NULL WHERE id = :id AND ownerId = :ownerId",
            nativeQuery = true)
    int restoreNote(@Param("id") Long id, @Param("ownerId") Long ownerId);

    /**
     * Xóa vĩnh viễn note trong thùng rác (hard delete).
     * Phải dùng native query vì @SQLDelete ngăn DELETE thông thường.
     * Tương đương: $note->delete() (force delete trong Laravel)
     */
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM Note WHERE id = :id AND ownerId = :ownerId AND isDeleted = true",
            nativeQuery = true)
    int forceDeleteNote(@Param("id") Long id, @Param("ownerId") Long ownerId);

    /**
     * Toggle pin/unpin note.
     */
    @Modifying
    @Transactional
    @Query(value = "UPDATE Note SET isPinned = NOT isPinned WHERE id = :id AND ownerId = :ownerId",
            nativeQuery = true)
    int togglePin(@Param("id") Long id, @Param("ownerId") Long ownerId);

    /**
     * Đếm số note của user (dùng cho Admin stats).
     * Tương đương: AccountModel::withCount('notes')
     */
    long countByOwner(User owner);
}
