package com.example.backend_spring.controller;

import com.example.backend_spring.dto.request.NoteRequest;
import com.example.backend_spring.entity.Note;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * NoteController — Quản lý ghi chú.
 *
 * Route mapping (tương đương Laravel api.php — trong middleware('auth:sanctum') group):
 *
 *   GET    /api/notes                  → index (list active, paginated)
 *   POST   /api/notes                  → store (create)
 *   GET    /api/notes/trash            → trash (list deleted)
 *   GET    /api/notes/search           → search (by title/content)
 *   GET    /api/notes/{id}             → show (single note)
 *   PUT    /api/notes/{id}             → update
 *   DELETE /api/notes/{id}             → destroy (soft delete → trash)
 *   POST   /api/notes/{id}/restore     → restore (from trash)
 *   POST   /api/notes/{id}/pin         → pin (toggle pin)
 *   DELETE /api/notes/{id}/force       → forceDelete (permanent delete)
 *
 * Lưu ý thứ tự route: /trash và /search phải đứng TRƯỚC /{id}
 * để tránh Spring nhầm "trash" là một Long id.
 */
@RestController
@RequestMapping("/api/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    /**
     * GET /api/notes?page=0&limit=20
     * Tương đương: NoteModel::where('isDeleted', false)->orderByDesc('isPinned')->paginate($perPage)
     */
    @GetMapping
    public ResponseEntity<Page<Note>> index(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(noteService.getActiveNotes(currentUser, page, limit));
    }

    /**
     * GET /api/notes/trash
     * Tương đương: NoteModel::where('isDeleted', true)->orderByDesc('deletedAt')->get()
     * PHẢI khai báo TRƯỚC @GetMapping("/{id}") để tránh ambiguity.
     */
    @GetMapping("/trash")
    public ResponseEntity<List<Note>> trash(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(noteService.getTrashNotes(currentUser));
    }

    /**
     * GET /api/notes/search?keyword=abc&page=0&limit=20
     * Tương đương: ->where('title', 'LIKE', "%{$keyword}%")->orWhere('content', 'LIKE', ...)
     */
    @GetMapping("/search")
    public ResponseEntity<Page<Note>> search(
            @AuthenticationPrincipal User currentUser,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(noteService.searchNotes(keyword, currentUser, page, limit));
    }

    /**
     * GET /api/notes/{id}
     * Tương đương: NoteModel::where('id', $id)->where('ownerId', auth()->id())->first()
     */
    @GetMapping("/{id}")
    public ResponseEntity<Note> show(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(noteService.getNoteById(id, currentUser));
    }

    /**
     * POST /api/notes
     * Tương đương: NoteModel::create([...]) — không còn extractAndUploadImages() nữa
     */
    @PostMapping
    public ResponseEntity<Note> store(
            @Valid @RequestBody NoteRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(noteService.createNote(request, currentUser));
    }

    /**
     * PUT /api/notes/{id}
     * Tương đương: $note->update([...])
     */
    @PutMapping("/{id}")
    public ResponseEntity<Note> update(
            @PathVariable Long id,
            @Valid @RequestBody NoteRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(noteService.updateNote(id, request, currentUser));
    }

    /**
     * DELETE /api/notes/{id} → Soft delete (chuyển vào thùng rác)
     * @SQLDelete annotation tự động biến DELETE thành UPDATE isDeleted=true
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> destroy(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(noteService.deleteToTrash(id, currentUser));
    }

    /**
     * POST /api/notes/{id}/restore
     * Tương đương: $note->update(['isDeleted' => false, 'deletedAt' => null])
     */
    @PostMapping("/{id}/restore")
    public ResponseEntity<Map<String, String>> restore(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(noteService.restoreFromTrash(id, currentUser));
    }

    /**
     * POST /api/notes/{id}/pin → Toggle pin/unpin
     * Tương đương: $note->isPinned = !$note->isPinned; $note->save()
     */
    @PostMapping("/{id}/pin")
    public ResponseEntity<Map<String, Object>> pin(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(noteService.togglePin(id, currentUser));
    }

    /**
     * DELETE /api/notes/{id}/force → Xóa vĩnh viễn (chỉ được xóa note trong trash)
     * Tương đương: $note->delete() (force delete trong Laravel)
     */
    @DeleteMapping("/{id}/force")
    public ResponseEntity<Map<String, String>> forceDelete(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(noteService.forceDelete(id, currentUser));
    }
}
