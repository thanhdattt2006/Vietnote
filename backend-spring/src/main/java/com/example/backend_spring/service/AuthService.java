package com.example.backend_spring.service;

import com.example.backend_spring.dto.request.*;
import com.example.backend_spring.entity.OtpToken;
import com.example.backend_spring.entity.User;
import com.example.backend_spring.repository.OtpTokenRepository;
import com.example.backend_spring.repository.UserRepository;
import com.example.backend_spring.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.Random;

/**
 * AuthService — Toàn bộ logic xác thực người dùng.
 *
 * Migrate 1-1 từ Laravel AuthController:
 * - register()       → AccountModel::create() + createToken()
 * - login()          → Hash::check() + createToken()
 * - forgotPassword() → DB::table('password_reset_tokens') + Mail::queue()
 * - verifyOtp()      → check record + Carbon::addMinutes(15)
 * - resetPassword()  → update password + createToken()
 * - updateProfile()  → $user->update()
 * - changePassword() → Hash::check() + Hash::make()
 * - deleteAccount()  → $user->delete()
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OtpTokenRepository otpTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // ===== REGISTER =====

    /**
     * Đăng ký tài khoản mới.
     * Tương đương: AccountModel::create([...]) + $user->createToken('auth_token')->plainTextToken
     */
    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException("Email đã được sử dụng");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .name(request.getName())
                .age(request.getAge())
                .gender(request.getGender())
                .provider("local")
                .role("user")
                .build();

        user = userRepository.save(user);
        String token = jwtService.generateToken(user);

        return Map.of(
            "message", "Register success",
            "token", token,
            "user", sanitizeUser(user)
        );
    }

    // ===== LOGIN =====

    /**
     * Đăng nhập.
     * Tương đương: Hash::check($request->password, $user->password) + createToken()
     * Dùng AuthenticationManager để Spring Security xử lý — tự động gọi UserDetailsService.
     */
    public Map<String, Object> login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getUsername(),
                    request.getPassword()
                )
            );
        } catch (AuthenticationException e) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String token = jwtService.generateToken(user);

        return Map.of(
            "message", "Login success",
            "token", token,
            "user", sanitizeUser(user)
        );
    }

    // ===== FORGOT PASSWORD =====

    /**
     * Gửi OTP qua email để reset password.
     *
     * Tương đương Laravel:
     * DB::table('password_reset_tokens')->where('email', $email)->delete()  → deleteByEmail()
     * DB::table('password_reset_tokens')->insert([...])                     → save()
     * Mail::to($email)->queue((new ResetPasswordOTP($token))->delay(...))   → emailService.sendOtpEmail() @Async
     */
    @Transactional
    public Map<String, Object> forgotPassword(ForgotPasswordRequest request) {
        String email = request.getUsername();

        userRepository.findByUsername(email)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy tài khoản với email này"));

        // Sinh OTP 6 chữ số
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        // Xóa OTP cũ (nếu có) → tránh duplicate
        otpTokenRepository.deleteByEmail(email);

        // Lưu OTP mới vào DB
        OtpToken otpToken = OtpToken.builder()
                .email(email)
                .token(otp)
                .build();
        otpTokenRepository.save(otpToken);

        // Gửi email bất đồng bộ — @Async trong EmailService, KHÔNG block response
        emailService.sendOtpEmail(email, otp);

        return Map.of("message", "Mã xác nhận đã được gửi vào email của bạn");
    }

    // ===== VERIFY OTP =====

    /**
     * Xác thực mã OTP.
     * Tương đương: DB::table('password_reset_tokens')->where(...)->first() + Carbon::addMinutes(15)->isPast()
     */
    public Map<String, Object> verifyOtp(VerifyOtpRequest request) {
        OtpToken otpToken = otpTokenRepository
                .findByEmailAndToken(request.getUsername(), request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Mã xác nhận không đúng"));

        if (otpToken.isExpired()) {
            throw new IllegalArgumentException("Mã đã hết hạn, vui lòng gửi lại");
        }

        return Map.of("message", "Mã hợp lệ");
    }

    // ===== RESET PASSWORD =====

    /**
     * Đặt lại mật khẩu sau khi verify OTP thành công.
     * Tương đương: $user->password = Hash::make($newPassword) + save() + createToken()
     */
    @Transactional
    public Map<String, Object> resetPassword(ResetPasswordRequest request) {
        OtpToken otpToken = otpTokenRepository
                .findByEmailAndToken(request.getUsername(), request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Mã xác nhận không đúng"));

        if (otpToken.isExpired()) {
            throw new IllegalArgumentException("Mã xác nhận đã hết hạn");
        }

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Cập nhật mật khẩu mới (BCrypt hash)
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepository.save(user);

        // Xóa OTP đã dùng
        otpTokenRepository.deleteByEmail(request.getUsername());

        // Tự động login sau khi reset (sinh token mới trả về)
        String token = jwtService.generateToken(user);

        return Map.of(
            "message", "Đổi mật khẩu thành công",
            "token", token,
            "user", sanitizeUser(user)
        );
    }

    // ===== UPDATE PROFILE =====

    /**
     * Cập nhật thông tin cá nhân.
     * Tương đương: $user->update(['name' => ..., 'age' => ..., 'gender' => ...])
     */
    public Map<String, Object> updateProfile(User currentUser, UpdateProfileRequest request) {
        if (request.getName() != null) currentUser.setName(request.getName());
        if (request.getAge() != null) currentUser.setAge(request.getAge());
        if (request.getGender() != null) currentUser.setGender(request.getGender());

        userRepository.save(currentUser);

        return Map.of(
            "message", "Cập nhật hồ sơ thành công",
            "user", sanitizeUser(currentUser)
        );
    }

    // ===== CHANGE PASSWORD =====

    /**
     * Đổi mật khẩu khi đã đăng nhập.
     * Tương đương: Hash::check($currentPassword, $user->password)
     */
    public Map<String, Object> changePassword(User currentUser, ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không đúng");
        }

        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);

        return Map.of("message", "Đổi mật khẩu thành công");
    }

    // ===== DELETE ACCOUNT =====

    /**
     * Xóa tài khoản vĩnh viễn.
     * Tương đương: $user->tokens()->delete() + $user->delete()
     * Note: JWT stateless nên không cần revoke token — chỉ xóa user khỏi DB.
     */
    @Transactional
    public Map<String, Object> deleteAccount(User currentUser) {
        userRepository.delete(currentUser);
        return Map.of("message", "Tài khoản đã bị xóa vĩnh viễn");
    }

    // ===== HELPER =====

    /**
     * Trả về user info an toàn (bỏ password).
     * Tương đương: $hidden = ['password'] trong Laravel Model.
     */
    private Map<String, Object> sanitizeUser(User user) {
        return Map.of(
            "id", user.getId(),
            "username", user.getUsername(),
            "name", user.getName() != null ? user.getName() : "",
            "age", user.getAge() != null ? user.getAge() : 0,
            "gender", user.getGender() != null ? user.getGender() : "",
            "role", user.getRole(),
            "provider", user.getProvider(),
            "avatarUrl", user.getAvatarUrl() != null ? user.getAvatarUrl() : "",
            "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
        );
    }
}
