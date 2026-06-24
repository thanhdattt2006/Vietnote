package com.example.backend_spring.controller;

import com.example.backend_spring.dto.request.FeedbackRequest;
import com.example.backend_spring.service.FeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * FeedbackController — Xử lý phản hồi từ người dùng (public endpoint).
 *
 * POST /api/responses  → submitFeedback (public, không cần token)
 */
@RestController
@RequestMapping("/api/responses")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    /**
     * POST /api/responses
     * Tương đương: ResponseController::store() trong Laravel.
     * Gửi feedback + async email cảm ơn.
     */
    @PostMapping
    public ResponseEntity<?> store(@Valid @RequestBody FeedbackRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feedbackService.submitFeedback(request));
    }
}
