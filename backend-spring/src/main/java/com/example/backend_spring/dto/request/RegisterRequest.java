package com.example.backend_spring.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/** DTO cho POST /api/auth/register */
@Data
public class RegisterRequest {

    @NotBlank(message = "Username không được để trống")
    @Email(message = "Username phải là email hợp lệ")
    private String username;

    @NotBlank(message = "Password không được để trống")
    @Size(min = 6, message = "Password tối thiểu 6 ký tự")
    private String password;

    private String name;
    private Integer age;
    private String gender;   // male / female / other
}
