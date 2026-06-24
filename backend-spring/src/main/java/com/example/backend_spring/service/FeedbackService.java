package com.example.backend_spring.service;

import com.example.backend_spring.dto.request.FeedbackRequest;
import com.example.backend_spring.entity.Feedback;
import com.example.backend_spring.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * FeedbackService — Logic xử lý phản hồi từ người dùng.
 * Migrate từ Laravel ResponseController.
 */
@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final EmailService emailService;

    /**
     * Lưu feedback + gửi email cảm ơn bất đồng bộ.
     *
     * Tương đương:
     * ResponseModel::create([...])
     * Mail::to($gmail)->queue(new ThankYouMail($data))
     */
    public Map<String, Object> submitFeedback(FeedbackRequest request) {
        Feedback feedback = Feedback.builder()
                .name(request.getName())
                .gmail(request.getGmail().toLowerCase().trim())
                .subject(request.getSubject())
                .content(request.getContent())
                .build();

        feedback = feedbackRepository.save(feedback);

        // Gửi email cảm ơn bất đồng bộ (@Async) — không block response
        emailService.sendThankYouEmail(feedback.getGmail(), feedback.getName());

        return Map.of(
            "success", true,
            "message", "Gửi phản hồi thành công! Email cảm ơn đang được xử lý.",
            "data", feedback
        );
    }

    /**
     * Lấy danh sách feedbacks (Admin only).
     * Tương đương: ResponseModel::orderBy('sentAt', 'desc')->paginate(10)
     */
    public Page<Feedback> getFeedbacks(int page, int size) {
        return feedbackRepository.findAllByOrderBySentAtDesc(PageRequest.of(page, size));
    }

    /**
     * Xóa feedback theo ID (Admin only).
     * Tương đương: $feedback->delete()
     */
    public Map<String, String> deleteFeedback(Long id) {
        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found"));
        feedbackRepository.delete(feedback);
        return Map.of("message", "Đã xóa phản hồi");
    }
}
