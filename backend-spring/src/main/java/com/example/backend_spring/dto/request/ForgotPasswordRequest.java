package com.example.backend_spring.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** DTO cho POST /api/auth/forgot-password */
@Data
public class ForgotPasswordRequest {

    @NotBlank(message = "Username không được để trống")
    @Email(message = "Username phải là email hợp lệ")
    private String username;
}
