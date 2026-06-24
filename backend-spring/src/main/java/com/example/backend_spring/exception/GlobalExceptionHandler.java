package com.example.backend_spring.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * GlobalExceptionHandler — Xử lý tập trung tất cả exception.
 *
 * Thay thế try-catch + debugError() trải rắc khắp các Controller của Laravel.
 *
 * Mapping:
 *   IllegalArgumentException            → 400 Bad Request   { message: "..." }
 *   MethodArgumentNotValidException     → 422 Unprocessable  { errors: { field: "message" } }
 *   BadCredentialsException             → 401 Unauthorized   { message: "Invalid credentials" }
 *   AccessDeniedException               → 403 Forbidden      { message: "Access denied" }
 *   Exception (fallback)                → 500 Internal Error  { message: "..." }
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Xử lý lỗi nghiệp vụ thông thường (not found, duplicate email, sai OTP...).
     * Tương đương: return response()->json(['message' => '...'], 400/404)
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", ex.getMessage()));
    }

    /**
     * Xử lý lỗi validate DTO (@Valid annotation fail).
     * Tương đương: $validator->fails() → return response()->json(['errors' => $validator->errors()], 422)
     *
     * Output format: { "errors": { "username": "Email không hợp lệ", "password": "..." } }
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String message   = error.getDefaultMessage();
            errors.put(fieldName, message);
        });

        return ResponseEntity.unprocessableEntity()
                .body(Map.of("errors", errors));
    }

    /**
     * Xử lý sai credentials khi login.
     * Tương đương: return response()->json(['message' => 'Invalid credentials'], 401)
     */
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
    }

    /**
     * Xử lý truy cập bị chặn bởi @PreAuthorize (role không đủ quyền).
     * Tương đương: CheckAdmin middleware → return response()->json(['message' => 'Forbidden'], 403)
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, String>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", "Bạn không có quyền truy cập Admin (Forbidden)"));
    }

    /**
     * Fallback — bắt tất cả exception không được xử lý ở trên.
     * Tương đương: private function debugError(Exception $e) { return response()->json([...], 500) }
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGenericException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Lỗi hệ thống: " + ex.getMessage()));
    }
}
