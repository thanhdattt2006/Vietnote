package com.example.backend_spring.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** DTO cho POST /api/auth/verify-otp */
@Data
public class VerifyOtpRequest {

    @NotBlank @Email
    private String username;

    @NotBlank(message = "Mã OTP không được để trống")
    private String token;
}
