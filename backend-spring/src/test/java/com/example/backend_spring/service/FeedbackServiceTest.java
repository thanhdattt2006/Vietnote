package com.example.backend_spring.service;

import com.example.backend_spring.dto.request.FeedbackRequest;
import com.example.backend_spring.entity.Feedback;
import com.example.backend_spring.repository.FeedbackRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FeedbackServiceTest {

    @Mock private FeedbackRepository feedbackRepository;
    @Mock private EmailService emailService;

    @InjectMocks private FeedbackService feedbackService;

    @Test
    void submitFeedback_Success() {
        FeedbackRequest request = new FeedbackRequest();
        request.setName("Test");
        request.setGmail("test@gmail.com");
        request.setSubject("Subject");
        request.setContent("Content");

        Feedback feedback = Feedback.builder().name("Test").gmail("test@gmail.com").build();
        when(feedbackRepository.save(any(Feedback.class))).thenReturn(feedback);

        Map<String, Object> result = feedbackService.submitFeedback(request);

        assertTrue((Boolean) result.get("success"));
        verify(emailService, times(1)).sendThankYouEmail(anyString(), anyString());
    }

    @Test
    void getFeedbacks_Success() {
        Page<Feedback> page = new PageImpl<>(List.of(new Feedback()));
        when(feedbackRepository.findAllByOrderBySentAtDesc(any(PageRequest.class))).thenReturn(page);

        Page<Feedback> result = feedbackService.getFeedbacks(0, 10);

        assertEquals(1, result.getTotalElements());
    }

    @Test
    void deleteFeedback_Success() {
        Feedback feedback = new Feedback();
        when(feedbackRepository.findById(1L)).thenReturn(Optional.of(feedback));

        Map<String, String> result = feedbackService.deleteFeedback(1L);

        assertEquals("Đã xóa phản hồi", result.get("message"));
        verify(feedbackRepository, times(1)).delete(feedback);
    }
}
