// src/utils/emailService.js
import nodemailer from 'nodemailer';

/**
 * Lazy-create transporter to ensure env vars are available at call time
 */
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    throw new Error(`Email credentials missing. EMAIL_USER=${user}, EMAIL_PASS=${pass ? '***' : 'undefined'}`);
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
};

/**
 * Gửi email OTP để reset mật khẩu
 * @param {string} toEmail - Email người nhận
 * @param {string} otp - Mã OTP 6 số
 * @param {string} fullName - Tên người dùng
 */
export const sendPasswordResetEmail = async (toEmail, otp, fullName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"GreenShare 🌱" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔑 Mã xác nhận đặt lại mật khẩu GreenShare',
    html: `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #F8FAF8; margin: 0; padding: 20px; }
          .container { max-width: 480px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #2E7D32, #43A047); padding: 40px 32px; text-align: center; }
          .logo { font-size: 48px; margin-bottom: 12px; }
          .header-title { color: white; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
          .header-sub { color: rgba(255,255,255,0.8); font-size: 14px; margin-top: 6px; }
          .body { padding: 40px 32px; }
          .greeting { font-size: 16px; color: #374151; margin-bottom: 16px; }
          .desc { font-size: 14px; color: #6B7280; line-height: 1.6; margin-bottom: 32px; }
          .otp-box { background: #F0FDF4; border: 2px dashed #22C55E; border-radius: 20px; padding: 28px; text-align: center; margin-bottom: 28px; }
          .otp-label { font-size: 12px; font-weight: 700; color: #16A34A; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
          .otp-code { font-size: 48px; font-weight: 900; color: #1A2E1A; letter-spacing: 12px; font-family: 'Courier New', monospace; }
          .otp-expire { font-size: 12px; color: #9CA3AF; margin-top: 12px; }
          .warning { background: #FFFBEB; border-left: 4px solid #F59E0B; border-radius: 8px; padding: 14px 16px; margin-bottom: 28px; }
          .warning p { font-size: 13px; color: #92400E; margin: 0; line-height: 1.5; }
          .footer { background: #F8FAF8; padding: 24px 32px; text-align: center; border-top: 1px solid #F1F5F9; }
          .footer p { font-size: 12px; color: #9CA3AF; margin: 0; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🌱</div>
            <p class="header-title">GreenShare</p>
            <p class="header-sub">Nền tảng chia sẻ thực phẩm cộng đồng</p>
          </div>
          <div class="body">
            <p class="greeting">Xin chào <strong>${fullName}</strong>,</p>
            <p class="desc">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP dưới đây:</p>
            
            <div class="otp-box">
              <p class="otp-label">Mã xác nhận của bạn</p>
              <div class="otp-code">${otp}</div>
              <p class="otp-expire">⏱ Mã có hiệu lực trong 10 phút</p>
            </div>

            <div class="warning">
              <p>⚠️ <strong>Lưu ý bảo mật:</strong> Không chia sẻ mã này với bất kỳ ai. GreenShare sẽ không bao giờ yêu cầu mã OTP của bạn.</p>
            </div>

            <p class="desc">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>
          </div>
          <div class="footer">
            <p>© 2026 GreenShare · Chia sẻ để yêu thương 💚<br>Email tự động, vui lòng không trả lời.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
