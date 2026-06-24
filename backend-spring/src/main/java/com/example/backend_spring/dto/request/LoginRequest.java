package com.example.backend_spring.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** DTO cho POST /api/auth/login */
@Data
public class LoginRequest {

    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotBlank(message = "Password không được để trống")
    private String password;
}
