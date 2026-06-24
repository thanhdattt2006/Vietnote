package com.example.backend_spring.repository;

import com.example.backend_spring.entity.NoteImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Repository cho entity NoteImage (bảng NoteImage).
 */
@Repository
public interface NoteImageRepository extends JpaRepository<NoteImage, Long> {

    /**
     * Lấy tất cả ảnh theo noteId.
     * Dùng trong forceDelete để lấy imageUrl trước khi xóa (Phase 6 Cloudinary cleanup).
     */
    List<NoteImage> findByNoteId(Long noteId);

    /**
     * Xóa tất cả ảnh của note (dùng khi force delete note).
     */
    @Modifying
    @Transactional
    @Query(value = "DELETE FROM NoteImage WHERE noteId = :noteId", nativeQuery = true)
    void deleteAllByNoteId(@Param("noteId") Long noteId);
}
