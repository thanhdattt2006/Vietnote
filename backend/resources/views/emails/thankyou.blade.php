<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cảm ơn bạn</title>
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

    /* Info box với glass morphism effect */
    .info-box {
      background: rgba(74, 144, 226, 0.08);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(74, 144, 226, 0.2);
      border-left: 4px solid #4A90E2;
      border-radius: 12px;
      padding: 25px;
      margin: 30px 0;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }

    .info-box strong {
      color: #4A90E2;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: block;
      margin-bottom: 8px;
    }

    .info-box .value {
      color: #e0e0e0;
      font-size: 16px;
      margin-top: 5px;
      line-height: 1.6;
      white-space: pre-wrap;
      word-wrap: break-word;
    }

    .info-box .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(74, 144, 226, 0.3), transparent);
      margin: 15px 0;
    }

    /* Button với hiệu ứng hover */
    .btn-container {
      text-align: center;
      margin: 35px 0;
    }

    .btn {
      display: inline-block;
      padding: 16px 40px;
      background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 600;
      font-size: 15px;
      letter-spacing: 0.5px;
      box-shadow: 0 10px 30px rgba(74, 144, 226, 0.4);
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }

    .btn:hover {
      background: linear-gradient(135deg, #357ABD 0%, #4A90E2 100%);
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(74, 144, 226, 0.6);
    }

    /* Signature */
    .signature {
      margin-top: 40px;
      padding-top: 25px;
      border-top: 1px solid rgba(74, 144, 226, 0.2);
    }

    .signature p {
      color: #a0a0a0;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .signature strong {
      color: #e0e0e0;
      font-size: 16px;
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

    /* Icon style */
    .icon {
      display: inline-block;
      margin-right: 8px;
      font-size: 18px;
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

      .content h2 {
        font-size: 20px;
      }

      .btn {
        padding: 14px 30px;
        font-size: 14px;
      }
    }
  </style>
</head>

<body>
  <div class="email-container">
    <!-- Header với gradient neon -->
    <div class="header">
      <h1>🎉 Cảm ơn bạn đã tin tưởng!</h1>
      <p>Tôi đã nhận được phản hồi của bạn</p>
    </div>

    <!-- Content -->
    <div class="content">
      <h2><span class="icon">👋</span>Xin chào {{ $name }},</h2>
      <p>
        Cảm ơn bạn đã dành thời gian gửi phản hồi cho tôi!
        Ý kiến của bạn vô cùng quý giá và sẽ giúp tôi không ngừng cải thiện chất lượng dịch vụ.
      </p>

      <!-- Thông tin phản hồi với glass morphism -->
      <div class="info-box">
        <strong><span class="icon">📌</span>Tiêu đề</strong>
        <div class="value">{{ $subject }}</div>

        <div class="divider"></div>

        <strong><span class="icon">💬</span>Nội dung phản hồi</strong>
        <div class="value">{{ $content }}</div>
      </div>

      <p>
        Tôi sẽ xem xét kỹ lưỡng và phản hồi lại bạn trong thời gian sớm nhất.
        Nếu có bất kỳ thắc mắc nào, đừng ngần ngại liên hệ với tôi nhé!
      </p>

      <!-- Call to action button -->
      <div class="btn-container">
        <a href="https://yourwebsite.com" class="btn">
          <span class="icon">🌐</span>Truy cập Website
        </a>
      </div>

      <!-- Signature -->
      <div class="signature">
        <p>Trân trọng,</p>
        <strong>Võ Cao Thành Đạt (Dave)</strong>
        <p style="margin-top: 5px; color: #667eea;">Vietnote</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>© 2025 VietNote. All rights reserved.</p>
      <p>Bạn nhận được email này vì đã gửi phản hồi trên Vietnote của Dave.</p>
    </div>
  </div>
</body>

</html>
