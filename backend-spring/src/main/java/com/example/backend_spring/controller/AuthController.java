package com.example.backend_spring.controller;

import com.example.backend_spring.dto.request.*;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * AuthController — Xử lý toàn bộ các endpoint xác thực.
 *
 * Route mapping (tương đương Laravel api.php):
 *
 * PUBLIC (không cần token):
 *   POST /api/auth/register       → register
 *   POST /api/auth/login          → login
 *   POST /api/auth/forgot-password → forgotPassword
 *   POST /api/auth/verify-otp     → verifyOtp
 *   POST /api/auth/reset-password  → resetPassword
 *
 * PROTECTED (cần JWT token):
 *   POST   /api/auth/logout                → logout (stateless — FE xóa token)
 *   PUT    /api/account/update             → updateProfile
 *   POST   /api/account/change-password    → changePassword
 *   DELETE /api/account/delete             → deleteAccount
 *
 * OAuth2 routes được Spring Security tự xử lý:
 *   GET /oauth2/authorization/{provider}   → redirect to Google/Github
 *   GET /oauth2/callback/{provider}        → CustomOAuth2UserService + SuccessHandler
 */
@RestController
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // ===== PUBLIC ENDPOINTS =====

    @PostMapping("/api/auth/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/api/auth/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/api/auth/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/api/auth/verify-otp")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    @PostMapping("/api/auth/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    // ===== PROTECTED ENDPOINTS =====

    /**
     * Logout — JWT là stateless nên server không cần làm gì.
     * Frontend sẽ tự xóa token khỏi localStorage/memory.
     * Tương đương: $request->user()->currentAccessToken()->delete()
     */
    @PostMapping("/api/auth/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(java.util.Map.of("message", "Logged out successfully"));
    }

    /**
     * Lấy thông tin user hiện tại đang đăng nhập.
     * @AuthenticationPrincipal: Spring tự inject User entity từ SecurityContext.
     */
    @GetMapping("/api/auth/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(java.util.Map.of("user", currentUser));
    }

    @PutMapping("/api/account/update")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(authService.updateProfile(currentUser, request));
    }

    @PostMapping("/api/account/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        return ResponseEntity.ok(authService.changePassword(currentUser, request));
    }

    @DeleteMapping("/api/account/delete")
    public ResponseEntity<?> deleteAccount(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(authService.deleteAccount(currentUser));
    }
}
