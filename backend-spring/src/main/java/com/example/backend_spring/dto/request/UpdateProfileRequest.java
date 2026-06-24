package com.example.backend_spring.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/** DTO cho PUT /api/account/update */
@Data
public class UpdateProfileRequest {
    private String name;
    private Integer age;
    private String gender;   // male / female / other
}
