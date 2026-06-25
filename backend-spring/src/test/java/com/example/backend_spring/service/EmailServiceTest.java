package com.example.backend_spring.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import jakarta.mail.internet.MimeMessage;
import java.util.Properties;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
public class EmailServiceTest {

    @Mock private JavaMailSender mailSender;

    @InjectMocks private EmailService emailService;

    private JavaMailSenderImpl realMailSender;

    @BeforeEach
    void setUp() {
        realMailSender = new JavaMailSenderImpl();
        realMailSender.setHost("localhost");
        ReflectionTestUtils.setField(emailService, "fromAddress", "test@vietnote.com");
        ReflectionTestUtils.setField(emailService, "fromName", "Vietnote");
    }

    @Test
    void sendOtpEmail_Success() {
        MimeMessage mimeMessage = realMailSender.createMimeMessage();
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendOtpEmail("test@gmail.com", "123456");

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }

    @Test
    void sendThankYouEmail_Success() {
        MimeMessage mimeMessage = realMailSender.createMimeMessage();
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);

        emailService.sendThankYouEmail("test@gmail.com", "Test User");

        verify(mailSender, times(1)).send(any(MimeMessage.class));
    }
}
