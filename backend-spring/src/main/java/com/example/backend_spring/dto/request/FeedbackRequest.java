package com.example.backend_spring.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** DTO cho POST /api/responses (feedback từ khách) */
@Data
public class FeedbackRequest {

    @NotBlank(message = "Tên không được để trống")
    private String name;

    @NotBlank(message = "Gmail không được để trống")
    @Email(message = "Gmail không hợp lệ")
    private String gmail;

    @NotBlank(message = "Chủ đề không được để trống")
    private String subject;

    @NotBlank(message = "Nội dung không được để trống")
    private String content;
}
