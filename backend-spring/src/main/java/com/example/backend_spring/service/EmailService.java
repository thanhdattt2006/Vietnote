package com.example.backend_spring.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

/**
 * EmailService — Gửi mail bất đồng bộ (@Async).
 *
 * Tương đương cơ chế Queue của Laravel:
 * Mail::to($email)->queue((new ResetPasswordOTP($token))->delay(now()->addSeconds(5)))
 *
 * @Async: Method chạy trong thread pool riêng (đã bật @EnableAsync ở main class).
 * → HTTP request return ngay lập tức, email gửi ngầm — KHÔNG block response.
 *
 * Dùng MimeMessage để gửi HTML email (giống blade template của Laravel).
 */
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${application.mail.from-address}")
    private String fromAddress;

    @Value("${application.mail.from-name}")
    private String fromName;

    /**
     * Gửi OTP email bất đồng bộ.
     * Tương đương: Mail::to($email)->queue(new ResetPasswordOTP($token))
     *
     * @Async: Spring Boot sẽ chạy method này trong thread pool mặc định (SimpleAsyncTaskExecutor).
     */
    @Async
    public void sendOtpEmail(String toEmail, String otpCode) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(toEmail);
            helper.setSubject("Mã xác nhận đặt lại mật khẩu - Vietnote");
            helper.setText(buildOtpEmailHtml(otpCode), true); // true = HTML

            mailSender.send(message);
        } catch (Exception e) {
            // Log lỗi nhưng không ném exception (async method không propagate exception về caller)
            // Tương đương: Log::error("OTP QUEUE FAILED: " . $e->getMessage())
            System.err.println("[EmailService] Failed to send OTP email to " + toEmail + ": " + e.getMessage());
        }
    }

    /**
     * Gửi email cảm ơn khi user gửi feedback (bất đồng bộ).
     * Tương đương: Mail::to($gmail)->queue(new ThankYouMail($data))
     */
    @Async
    public void sendThankYouEmail(String toEmail, String name) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress, fromName);
            helper.setTo(toEmail);
            helper.setSubject("Cảm ơn bạn đã gửi phản hồi - Vietnote");
            helper.setText(buildThankYouEmailHtml(name), true);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("[EmailService] Failed to send thank-you email to " + toEmail + ": " + e.getMessage());
        }
    }

    // ===== HTML TEMPLATES (migrate từ Blade views) =====

    /**
     * HTML template cho OTP email — migrate từ reset_password_otp.blade.php
     */
    private String buildOtpEmailHtml(String otpCode) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Đặt lại mật khẩu - Vietnote</title>
              <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                       background: #0a0a0f; padding: 40px 20px; min-height: 100vh; }
                .container { max-width: 650px; margin: 0 auto;
                             background: linear-gradient(145deg, #1A1A24 0%%, #2A2A38 100%%);
                             border-radius: 20px; overflow: hidden;
                             box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                             border: 1px solid rgba(74,144,226,0.2); }
                .header { background: linear-gradient(135deg, #4A90E2 0%%, #357ABD 50%%, #2A5F8F 100%%);
                          padding: 50px 30px; text-align: center; }
                .logo { font-size: 24px; font-weight: 700; color: #fff; margin-bottom: 10px; }
                .header h1 { color: #fff; font-size: 32px; font-weight: 700; }
                .header p { color: rgba(255,255,255,0.9); font-size: 16px; margin-top: 8px; }
                .content { padding: 40px 35px; color: #e0e0e0; line-height: 1.8; }
                .content h2 { color: #4A90E2; font-size: 24px; margin-bottom: 20px; }
                .content p { color: #b8b8b8; margin-bottom: 16px; font-size: 15px; }
                .token-box { background: linear-gradient(145deg, rgba(74,144,226,0.15), rgba(42,42,56,0.8));
                             border: 2px solid #4A90E2; border-radius: 16px;
                             padding: 30px; margin: 30px 0; text-align: center;
                             box-shadow: 0 8px 32px rgba(74,144,226,0.3); }
                .token-label { color: #4A90E2; font-size: 14px; text-transform: uppercase;
                               letter-spacing: 2px; margin-bottom: 15px; font-weight: 600; }
                .token-code { color: #fff; font-size: 42px; font-weight: 700;
                              letter-spacing: 8px; font-family: 'Courier New', monospace;
                              text-shadow: 0 0 20px rgba(74,144,226,0.8); }
                .warning-box { background: rgba(255,107,107,0.1); border-left: 4px solid #ff6b6b;
                               border-radius: 8px; padding: 20px; margin: 25px 0; }
                .warning-text { color: #ffb8b8; font-size: 14px; }
                .footer { background: rgba(26,26,36,0.5); padding: 30px; text-align: center;
                          border-top: 1px solid rgba(74,144,226,0.1); }
                .footer p { color: #808080; font-size: 13px; margin-bottom: 8px; }
                .footer a { color: #4A90E2; text-decoration: none; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">🔐 Vietnote</div>
                  <h1>Đặt Lại Mật Khẩu</h1>
                  <p>Yêu cầu xác nhận bảo mật</p>
                </div>
                <div class="content">
                  <h2>Xin chào!</h2>
                  <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>Vietnote</strong> của bạn.</p>
                  <div class="token-box">
                    <div class="token-label">Mã Xác Nhận</div>
                    <div class="token-code">%s</div>
                  </div>
                  <div class="warning-box">
                    <p class="warning-text">
                      <strong>⏰ Quan trọng:</strong> Mã xác nhận này chỉ có hiệu lực trong
                      <strong>15 phút</strong>. Vui lòng sử dụng ngay để tránh hết hạn.
                    </p>
                  </div>
                  <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
                </div>
                <div class="footer">
                  <p><strong>Vietnote</strong></p>
                  <p>Nền tảng ghi chú thông minh cho mọi người</p>
                  <p style="margin-top:12px;">Cần hỗ trợ? <a href="mailto:thanhdattt2006@gmail.com">thanhdattt2006@gmail.com</a></p>
                  <p style="margin-top:8px; font-size:12px;">© Vietnote 1.0.0</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(otpCode);
    }

    /**
     * HTML template cho thank-you email sau khi user submit feedback.
     * Migrate từ thankyou.blade.php
     */
    private String buildThankYouEmailHtml(String name) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <title>Cảm ơn - Vietnote</title>
              <style>
                body { font-family: 'Segoe UI', sans-serif; background: #0a0a0f; padding: 40px 20px; }
                .container { max-width: 600px; margin: 0 auto;
                             background: linear-gradient(145deg, #1A1A24, #2A2A38);
                             border-radius: 20px; overflow: hidden;
                             border: 1px solid rgba(74,144,226,0.2); }
                .header { background: linear-gradient(135deg, #4A90E2, #2A5F8F);
                          padding: 40px 30px; text-align: center; }
                .header h1 { color: #fff; font-size: 28px; font-weight: 700; }
                .content { padding: 35px; color: #b8b8b8; line-height: 1.8; }
                .content h2 { color: #4A90E2; margin-bottom: 16px; }
                .footer { padding: 25px; text-align: center; color: #808080; font-size: 13px;
                          border-top: 1px solid rgba(74,144,226,0.1); }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header"><h1>💙 Vietnote</h1></div>
                <div class="content">
                  <h2>Xin chào %s!</h2>
                  <p>Cảm ơn bạn đã gửi phản hồi cho chúng tôi. Chúng tôi đã nhận được ý kiến của bạn
                     và sẽ xem xét trong thời gian sớm nhất.</p>
                  <p>Đội ngũ Vietnote trân trọng mọi góp ý từ người dùng để cải thiện dịch vụ.</p>
                </div>
                <div class="footer">
                  <p><strong>Vietnote</strong> — Nền tảng ghi chú thông minh</p>
                  <p style="margin-top:8px;">© Vietnote 1.0.0</p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(name != null ? name : "bạn");
    }
}
