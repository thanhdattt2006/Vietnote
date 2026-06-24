package com.example.backend_spring.service;

import com.example.backend_spring.dto.request.NoteRequest;
import com.example.backend_spring.entity.Note;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * NoteService — Toàn bộ logic quản lý Note.
 *
 * Migrate từ Laravel NoteController. Điểm khác biệt quan trọng:
 *
 * 1. Soft Delete: @SQLDelete + @SQLRestriction trong Entity xử lý TỰ ĐỘNG.
 *    → deleteToTrash() chỉ cần gọi repository.delete(note) là xong.
 *    → Không cần update isDeleted=true thủ công như Laravel.
 *
 * 2. Pagination: Dùng Pageable của Spring Data JPA.
 *    → Tương đương ->paginate($perPage) của Eloquent.
 *
 * 3. Cloudinary: Backend KHÔNG xử lý Base64 (Phase 6 đã decoupled).
 *    → content là HTML thuần với link ảnh từ Frontend.
 *
 * 4. Restore/ForceDelete: Dùng nativeQuery trong NoteRepository
 *    để bypass @SQLRestriction.
 */
@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;

    // ===== INDEX (List active notes with pagination) =====

    /**
     * Lấy danh sách note đang hoạt động (paginated, pinned trước).
     *
     * Tương đương:
     * NoteModel::with('images')->where('isDeleted', false)->where('ownerId', $userId)
     *   ->orderByDesc('isPinned')->orderByDesc('updatedAt')->paginate($perPage)
     */
    public Page<Note> getActiveNotes(User owner, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        return noteRepository.findByOwnerOrderByIsPinnedDescUpdatedAtDesc(owner, pageable);
    }

    // ===== TRASH (List deleted notes) =====

    /**
     * Lấy notes trong thùng rác.
     * Dùng nativeQuery để bypass @SQLRestriction("isDeleted = false").
     *
     * Tương đương:
     * NoteModel::where('isDeleted', true)->where('ownerId', $userId)->orderByDesc('deletedAt')->get()
     */
    public List<Note> getTrashNotes(User owner) {
        return noteRepository.findTrashedNotesByOwnerId(owner.getId());
    }

    // ===== SHOW (Get single note) =====

    /**
     * Lấy chi tiết note theo id (chỉ xem được note của mình).
     *
     * Tương đương:
     * NoteModel::where('id', $id)->where('ownerId', auth()->id())->first()
     */
    public Note getNoteById(Long id, User owner) {
        return noteRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new IllegalArgumentException("Note not found or access denied"));
    }

    // ===== STORE (Create note) =====

    /**
     * Tạo note mới.
     *
     * Tương đương Laravel NoteController::store():
     * NoteModel::create([...]) — không còn extractAndUploadImages() nữa (Phase 6 decoupled)
     */
    public Note createNote(NoteRequest request, User owner) {
        Note note = Note.builder()
                .title(request.getTitle() != null ? request.getTitle() : "Untitled")
                .content(request.getContent())
                .isPinned(request.getIsPinned() != null ? request.getIsPinned() : false)
                .owner(owner)
                .build();
        return noteRepository.save(note);
    }

    // ===== UPDATE (Edit note) =====

    /**
     * Cập nhật note.
     *
     * Tương đương:
     * $note->update(['title' => ..., 'content' => ..., 'isPinned' => ...])
     */
    public Note updateNote(Long id, NoteRequest request, User owner) {
        Note note = noteRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        if (request.getTitle() != null) note.setTitle(request.getTitle());
        if (request.getContent() != null) note.setContent(request.getContent());
        if (request.getIsPinned() != null) note.setIsPinned(request.getIsPinned());

        return noteRepository.save(note);
    }

    // ===== DELETE TO TRASH (Soft delete) =====

    /**
     * Chuyển note vào thùng rác (soft delete).
     *
     * Tương đương: $note->update(['isDeleted' => true, 'deletedAt' => now()])
     *
     * Với Spring Boot: Chỉ cần gọi repository.delete(note).
     * @SQLDelete annotation sẽ tự động chuyển lệnh DELETE thành:
     * UPDATE Note SET isDeleted = true, deletedAt = CURRENT_TIMESTAMP WHERE id = ?
     */
    @Transactional
    public Map<String, String> deleteToTrash(Long id, User owner) {
        Note note = noteRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        noteRepository.delete(note);  // @SQLDelete intercepts này → soft delete
        return Map.of("message", "Note moved to trash");
    }

    // ===== RESTORE (Restore from trash) =====

    /**
     * Khôi phục note từ thùng rác.
     *
     * Tương đương: $note->update(['isDeleted' => false, 'deletedAt' => null])
     * Dùng nativeQuery để bypass @SQLRestriction.
     */
    @Transactional
    public Map<String, String> restoreFromTrash(Long id, User owner) {
        int updated = noteRepository.restoreNote(id, owner.getId());
        if (updated == 0) {
            throw new IllegalArgumentException("Note not found in trash");
        }
        return Map.of("message", "Note restored");
    }

    // ===== FORCE DELETE (Hard delete) =====

    /**
     * Xóa vĩnh viễn note (chỉ note đang trong thùng rác mới được xóa).
     *
     * Tương đương:
     * if (!$note->isDeleted) return error
     * foreach ($images as $image) { Storage::delete(); $image->delete(); }
     * $note->delete()
     *
     * Với Cloudinary: Backend không cần xóa file vật lý (Phase 6 optional).
     * CascadeType.ALL trong Note entity sẽ tự xóa NoteImage records.
     */
    @Transactional
    public Map<String, String> forceDelete(Long id, User owner) {
        int deleted = noteRepository.forceDeleteNote(id, owner.getId());
        if (deleted == 0) {
            throw new IllegalArgumentException("Note not found in trash or access denied");
        }
        return Map.of("message", "Note permanently deleted");
    }

    // ===== PIN / UNPIN =====

    /**
     * Toggle pin/unpin note.
     *
     * Tương đương:
     * $note->isPinned = !$note->isPinned;
     * $note->save();
     */
    @Transactional
    public Map<String, Object> togglePin(Long id, User owner) {
        // Lấy state hiện tại trước khi toggle
        Note note = noteRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new IllegalArgumentException("Note not found"));

        noteRepository.togglePin(id, owner.getId());

        // Reload để lấy trạng thái mới
        Note updated = noteRepository.findByIdAndOwner(id, owner)
                .orElseThrow(() -> new IllegalArgumentException("Note not found after toggle"));

        return Map.of(
            "message", updated.getIsPinned() ? "Note pinned" : "Note unpinned",
            "note", updated
        );
    }

    // ===== SEARCH =====

    /**
     * Tìm kiếm note theo title hoặc content (active notes).
     *
     * Tương đương:
     * NoteModel::where('title', 'LIKE', "%{$keyword}%")->orWhere('content', 'LIKE', ...)->paginate()
     */
    public Page<Note> searchNotes(String keyword, User owner, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        return noteRepository
                .findByOwnerAndTitleContainingIgnoreCaseOrOwnerAndContentContainingIgnoreCaseOrderByIsPinnedDescUpdatedAtDesc(
                        owner, keyword, owner, keyword, pageable
                );
    }
}
