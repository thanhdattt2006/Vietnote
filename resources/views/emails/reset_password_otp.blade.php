<!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt lại mật khẩu - Vietnote</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #0a0a0f, #1A1A24, #2A2A38);
      padding: 40px 20px;
      min-height: 100vh;
    }

    .email-container {
      max-width: 650px;
      margin: 0 auto;
      background: linear-gradient(145deg, #1A1A24 0%, #2A2A38 100%);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(74, 144, 226, 0.2);
    }

    /* Header với hiệu ứng gradient neon */
    .header {
      background: linear-gradient(135deg, #4A90E2 0%, #357ABD 50%, #2A5F8F 100%);
      padding: 50px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
      transform: rotate(45deg);
      animation: shine 3s infinite;
    }

    @keyframes shine {
      0% {
        transform: translateX(-100%) translateY(-100%) rotate(45deg);
      }

      100% {
        transform: translateX(100%) translateY(100%) rotate(45deg);
      }
    }

    .header h1 {
      color: #ffffff;
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 10px;
      text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
      position: relative;
      z-index: 1;
    }

    .header p {
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      position: relative;
      z-index: 1;
    }

    /* Content area */
    .content {
      padding: 40px 35px;
      color: #e0e0e0;
      line-height: 1.8;
    }

    .content h2 {
      background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 600;
    }

    .content p {
      color: #b8b8b8;
      margin-bottom: 20px;
      font-size: 15px;
    }

    /* Token box với hiệu ứng glow */
    .token-box {
      background: linear-gradient(145deg, rgba(74, 144, 226, 0.15), rgba(42, 42, 56, 0.8));
      backdrop-filter: blur(10px);
      border: 2px solid #4A90E2;
      border-radius: 16px;
      padding: 30px;
      margin: 30px 0;
      text-align: center;
      box-shadow:
        0 8px 32px rgba(74, 144, 226, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
    }

    .token-box::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(74, 144, 226, 0.2), transparent);
      animation: slide 2s infinite;
    }

    @keyframes slide {
      0% {
        left: -100%;
      }

      100% {
        left: 100%;
      }
    }

    .token-label {
      color: #4A90E2;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 15px;
      font-weight: 600;
    }

    .token-code {
      color: #ffffff;
      font-size: 42px;
      font-weight: 700;
      letter-spacing: 8px;
      font-family: 'Courier New', monospace;
      text-shadow:
        0 0 20px rgba(74, 144, 226, 0.8),
        0 0 40px rgba(74, 144, 226, 0.4);
      position: relative;
      z-index: 1;
    }

    /* Warning box */
    .warning-box {
      background: rgba(255, 107, 107, 0.1);
      border-left: 4px solid #ff6b6b;
      border-radius: 8px;
      padding: 20px;
      margin: 25px 0;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .warning-icon {
      font-size: 24px;
      color: #ff6b6b;
      flex-shrink: 0;
    }

    .warning-text {
      color: #ffb8b8;
      font-size: 14px;
      line-height: 1.6;
      margin: 0;
    }

    /* Info box với glass morphism effect */
    .info-box {
      background: rgba(74, 144, 226, 0.08);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(74, 144, 226, 0.2);
      border-radius: 12px;
      padding: 20px;
      margin: 25px 0;
    }

    .info-box p {
      color: #b8b8b8;
      font-size: 14px;
      margin: 0;
      line-height: 1.6;
    }

    /* Security tips */
    .security-tips {
      background: rgba(42, 42, 56, 0.5);
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
    }

    .security-tips h3 {
      color: #4A90E2;
      font-size: 16px;
      margin-bottom: 15px;
      font-weight: 600;
    }

    .security-tips ul {
      list-style: none;
      padding: 0;
    }

    .security-tips li {
      color: #b8b8b8;
      font-size: 14px;
      margin-bottom: 10px;
      padding-left: 25px;
      position: relative;
      line-height: 1.6;
    }

    .security-tips li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #4A90E2;
      font-weight: bold;
    }

    /* Footer */
    .footer {
      background: rgba(26, 26, 36, 0.5);
      padding: 30px;
      text-align: center;
      border-top: 1px solid rgba(74, 144, 226, 0.1);
    }

    .footer p {
      color: #808080;
      font-size: 13px;
      margin-bottom: 8px;
      line-height: 1.6;
    }

    .footer a {
      color: #4A90E2;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer a:hover {
      color: #357ABD;
    }

    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 5px;
    }

    /* Responsive */
    @media only screen and (max-width: 600px) {
      body {
        padding: 20px 10px;
      }

      .header {
        padding: 40px 20px;
      }

      .header h1 {
        font-size: 26px;
      }

      .content {
        padding: 30px 20px;
      }

      .token-code {
        font-size: 32px;
        letter-spacing: 5px;
      }

      .security-tips {
        padding: 20px;
      }
    }
  </style>
</head>

<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">🔐 Vietnote</div>
      <h1>Đặt Lại Mật Khẩu</h1>
      <p>Yêu cầu xác nhận bảo mật</p>
    </div>

    <!-- Content -->
    <div class="content">
      <h2>Xin chào!</h2>

      <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>Vietnote</strong> của bạn.</p>

      <!-- Token Box -->
      <div class="token-box">
        <div class="token-label">Mã Xác Nhận</div>
        <div class="token-code">{{ $token }}</div>
      </div>

      <!-- Warning -->
      <div class="warning-box">
        <div class="warning-icon">⏰</div>
        <p class="warning-text">
          <strong>Quan trọng:</strong> Mã xác nhận này chỉ có hiệu lực trong <strong>15 phút</strong>.
          Vui lòng sử dụng ngay để tránh hết hạn.
        </p>
      </div>

      <!-- Info -->
      <div class="info-box">
        <p>
          <strong>Lưu ý:</strong> Nếu bạn không thực hiện yêu cầu này,
          vui lòng bỏ qua email và bảo mật tài khoản của bạn ngay lập tức.
        </p>
      </div>

      <!-- Security Tips -->
      <div class="security-tips">
        <h3>💡 Lời khuyên bảo mật</h3>
        <ul>
          <li>Không chia sẻ mã xác nhận này với bất kỳ ai</li>
          <li>Vietnote sẽ không bao giờ yêu cầu mã qua điện thoại hoặc tin nhắn</li>
          <li>Sử dụng mật khẩu mạnh kết hợp chữ, số và ký tự đặc biệt</li>
          <li>Bật xác thực hai yếu tố để tăng cường bảo mật</li>
        </ul>
      </div>

      <p style="color: #808080; font-size: 13px; margin-top: 30px;">
        Email này được gửi tự động. Vui lòng không trả lời trực tiếp.
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Vietnote</strong></p>
      <p>Nền tảng ghi chú thông minh cho mọi người</p>
      <p style="margin-top: 15px;">
        Cần hỗ trợ? Liên hệ: <a href="mailto:thanhdattt2006@gmail.com">thanhdattt2006@gmail.com</a>
      </p>
      <p style="margin-top: 10px; font-size: 12px;">
        © Vietnote 1.0.0
      </p>
    </div>
  </div>
</body>

</html>
