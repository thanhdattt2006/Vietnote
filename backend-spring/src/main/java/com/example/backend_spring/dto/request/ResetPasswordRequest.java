package com.example.backend_spring.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/** DTO cho POST /api/auth/reset-password */
@Data
public class ResetPasswordRequest {

    @NotBlank @Email
    private String username;

    @NotBlank(message = "Mã OTP không được để trống")
    private String token;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    @Size(min = 6, message = "Mật khẩu tối thiểu 6 ký tự")
    private String password;
}
