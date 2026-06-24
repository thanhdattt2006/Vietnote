package com.example.backend_spring.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** DTO cho POST /api/notes và PUT /api/notes/{id} */
@Data
public class NoteRequest {

    private String title;

    /**
     * HTML content thuần — chứa link ảnh Cloudinary từ Frontend.
     * Backend KHÔNG xử lý Base64 (đã decoupled theo Phase 6).
     */
    private String content;

    private Boolean isPinned;
}
