package com.example.backend_spring.service;

import com.example.backend_spring.dto.request.*;
import com.example.backend_spring.entity.OtpToken;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.repository.OtpTokenRepository;
import com.example.backend_spring.repository.UserRepository;
import com.example.backend_spring.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private OtpTokenRepository otpTokenRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;
    @Mock private EmailService emailService;

    @InjectMocks private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .username("test@gmail.com")
                .password("encoded_password")
                .name("Test User")
                .role("user")
                .build();
    }

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("new@gmail.com");
        request.setPassword("password");
        request.setName("New User");

        when(userRepository.existsByUsername(request.getUsername())).thenReturn(false);
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(user)).thenReturn("mock-token");

        Map<String, Object> result = authService.register(request);

        assertEquals("Register success", result.get("message"));
        assertEquals("mock-token", result.get("token"));
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void register_EmailExists_ThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("test@gmail.com");

        when(userRepository.existsByUsername(anyString())).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> authService.register(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_Success() {
        LoginRequest request = new LoginRequest();
        request.setUsername("test@gmail.com");
        request.setPassword("password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(null);
        when(userRepository.findByUsername(request.getUsername())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("mock-token");

        Map<String, Object> result = authService.login(request);

        assertEquals("Login success", result.get("message"));
        assertEquals("mock-token", result.get("token"));
    }

    @Test
    void forgotPassword_Success() {
        ForgotPasswordRequest request = new ForgotPasswordRequest();
        request.setUsername("test@gmail.com");

        when(userRepository.findByUsername(request.getUsername())).thenReturn(Optional.of(user));

        Map<String, Object> result = authService.forgotPassword(request);

        assertEquals("Mã xác nhận đã được gửi vào email của bạn", result.get("message"));
        verify(otpTokenRepository, times(1)).deleteByEmail(request.getUsername());
        verify(otpTokenRepository, times(1)).save(any(OtpToken.class));
        verify(emailService, times(1)).sendOtpEmail(eq(request.getUsername()), anyString());
    }

    @Test
    void verifyOtp_Success() {
        VerifyOtpRequest request = new VerifyOtpRequest();
        request.setUsername("test@gmail.com");
        request.setToken("123456");

        OtpToken otpToken = OtpToken.builder()
                .email("test@gmail.com")
                .token("123456")
                .createdAt(java.time.LocalDateTime.now())
                .build();
        // Giả sử OTP chưa hết hạn
        when(otpTokenRepository.findByEmailAndToken(anyString(), anyString())).thenReturn(Optional.of(otpToken));

        Map<String, Object> result = authService.verifyOtp(request);

        assertEquals("Mã hợp lệ", result.get("message"));
    }

    @Test
    void updateProfile_Success() {
        UpdateProfileRequest request = new UpdateProfileRequest();
        request.setName("Updated Name");

        when(userRepository.save(any(User.class))).thenReturn(user);

        Map<String, Object> result = authService.updateProfile(user, request);

        assertEquals("Cập nhật hồ sơ thành công", result.get("message"));
        assertEquals("Updated Name", user.getName());
    }
}
