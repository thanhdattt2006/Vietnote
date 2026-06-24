<!DOCTYPE html>
<html lang="vi">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ $subjectContent }}</title>
  <style>
    /* Reset và base styles */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1a472a 0%, #2d5016 50%, #8b0000 100%);
      padding: 20px;
      line-height: 1.6;
    }

    /* Container chính với hiệu ứng tuyết rơi */
    .email-container {
      max-width: 650px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
    }

    /* Header Giáng Sinh với animation */
    .christmas-header {
      background: linear-gradient(135deg, #c41e3a 0%, #165b33 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .christmas-header::before {
      content: '🎄';
      position: absolute;
      font-size: 100px;
      opacity: 0.1;
      left: -20px;
      top: -20px;
      animation: rotate 10s linear infinite;
    }

    .christmas-header::after {
      content: '🎅';
      position: absolute;
      font-size: 80px;
      opacity: 0.1;
      right: -10px;
      bottom: -10px;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    @keyframes bounce {

      0%,
      100% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-20px);
      }
    }

    .header-title {
      color: #ffffff;
      font-size: 32px;
      font-weight: bold;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      margin-bottom: 10px;
      position: relative;
      z-index: 1;
    }

    .header-subtitle {
      color: #ffd700;
      font-size: 16px;
      font-weight: 500;
      position: relative;
      z-index: 1;
    }

    /* Body content với border Giáng Sinh */
    .email-body {
      padding: 40px 30px;
      background: #ffffff;
    }

    .greeting {
      font-size: 20px;
      color: #c41e3a;
      font-weight: 600;
      margin-bottom: 25px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .greeting::before {
      content: '🎁';
      font-size: 24px;
    }

    /* Content box với viền lấp lánh */
    .content-box {
      padding: 25px;
      border-radius: 15px;
      background: linear-gradient(135deg, #fff9f0 0%, #ffe8e8 100%);
      border: 3px solid transparent;
      background-clip: padding-box;
      position: relative;
      margin-bottom: 30px;
    }

    .content-box::before {
      content: '';
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      background: linear-gradient(45deg, #c41e3a, #ffd700, #165b33, #c41e3a);
      border-radius: 15px;
      z-index: -1;
      animation: borderGlow 3s linear infinite;
      background-size: 300% 300%;
    }

    @keyframes borderGlow {
      0% {
        background-position: 0% 50%;
      }

      50% {
        background-position: 100% 50%;
      }

      100% {
        background-position: 0% 50%;
      }
    }

    .content-text {
      color: #333333;
      font-size: 16px;
      line-height: 1.8;
    }

    /* Signature section */
    .signature {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px dashed #c41e3a;
    }

    .signature p {
      color: #555555;
      font-size: 15px;
      margin-bottom: 5px;
    }

    .team-name {
      color: #c41e3a;
      font-weight: 600;
      font-size: 16px;
    }

    /* Footer Giáng Sinh */
    .christmas-footer {
      background: linear-gradient(135deg, #165b33 0%, #c41e3a 100%);
      padding: 30px;
      text-align: center;
      color: #ffffff;
    }

    .footer-icons {
      font-size: 30px;
      margin-bottom: 15px;
      letter-spacing: 15px;
    }

    .footer-text {
      font-size: 14px;
      opacity: 0.9;
      line-height: 1.6;
    }

    .footer-wish {
      margin-top: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #ffd700;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }

    /* Snowflakes decoration */
    .snowflake {
      position: absolute;
      color: #ffffff;
      font-size: 20px;
      opacity: 0.8;
      animation: fall linear infinite;
    }

    @keyframes fall {
      0% {
        top: -10%;
        transform: translateX(0) rotate(0deg);
      }

      100% {
        top: 110%;
        transform: translateX(100px) rotate(360deg);
      }
    }

    /* Responsive design */
    @media (max-width: 600px) {
      .email-container {
        border-radius: 10px;
      }

      .christmas-header {
        padding: 30px 20px;
      }

      .header-title {
        font-size: 24px;
      }

      .email-body {
        padding: 30px 20px;
      }

      .greeting {
        font-size: 18px;
      }

      .content-box {
        padding: 20px;
      }

      .content-text {
        font-size: 15px;
      }
    }
  </style>
</head>

<body>
  <!-- Snowflakes cho hiệu ứng tuyết rơi -->
  <div class="snowflake" style="left: 10%; animation-duration: 10s; animation-delay: 0s;">❄</div>
  <div class="snowflake" style="left: 30%; animation-duration: 8s; animation-delay: 2s;">❅</div>
  <div class="snowflake" style="left: 50%; animation-duration: 12s; animation-delay: 4s;">❄</div>
  <div class="snowflake" style="left: 70%; animation-duration: 9s; animation-delay: 1s;">❅</div>
  <div class="snowflake" style="left: 90%; animation-duration: 11s; animation-delay: 3s;">❄</div>

  <div class="email-container">
    <!-- Header Giáng Sinh -->
    <div class="christmas-header">
      <div class="header-title">🎄 VIETNOTE 🎄</div>
      <div class="header-subtitle">{{ $subjectContent }}</div>
    </div>

    <!-- Body content -->
    <div class="email-body">
      <div class="greeting">
        Xin chào quý thành viên Vietnote!
      </div>

      <div class="content-box">
        <div class="content-text">
          {!! nl2br(e($bodyContent)) !!}
        </div>
      </div>

      <div class="signature">
        <p>Trân trọng,</p>
        <p class="team-name">Đội ngũ Admin Vietnote</p>
      </div>
    </div>

    <!-- Footer Giáng Sinh -->
    <div class="christmas-footer">
      <div class="footer-icons">🎅🎁🔔⛄🎄</div>
      <div class="footer-text">
        Cảm ơn bạn đã đồng hành cùng Vietnote!<br>
        Chúc bạn có một mùa lễ hội ấm áp và tràn đầy niềm vui.
      </div>
      <div class="footer-wish">
        🌟 Merry Christmas & Happy New Year! 🌟
      </div>
    </div>
  </div>
</body>

</html>
