import random
import string
import aiosmtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from core.config import settings


def generate_otp(length: int = 6) -> str:
    """Generate a random numeric OTP."""
    return ''.join(random.choices(string.digits, k=length))


async def send_otp_email(to_email: str, full_name: str, otp_code: str) -> bool:
    """Send OTP verification email to the user."""
    if not settings.SMTP_HOST or settings.SMTP_USER == "your_email@gmail.com":
        # SMTP not configured — log to console for dev
        print(f"\n{'='*50}")
        print(f"[DEV MODE] OTP for {to_email}: {otp_code}")
        print(f"{'='*50}\n")
        return True

    html_body = f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {{ font-family: 'Inter', -apple-system, sans-serif; margin: 0; padding: 0; background: #f8fafc; color: #1e293b; }}
        .wrapper {{ max-width: 560px; margin: 40px auto; }}
        .card {{ background: #fff; border-radius: 24px; padding: 48px; box-shadow: 0 4px 24px rgba(0,0,0,0.06); }}
        .logo {{ font-size: 24px; font-weight: 900; color: #2563eb; letter-spacing: -0.5px; margin-bottom: 32px; }}
        .otp-box {{ background: #eff6ff; border: 2px dashed #3b82f6; border-radius: 16px; padding: 24px; text-align: center; margin: 32px 0; }}
        .otp-code {{ font-size: 48px; font-weight: 900; letter-spacing: 12px; color: #1d4ed8; font-family: monospace; }}
        .expiry {{ color: #64748b; font-size: 14px; margin-top: 8px; }}
        .footer {{ text-align: center; color: #94a3b8; font-size: 12px; margin-top: 32px; }}
        h1 {{ font-size: 24px; font-weight: 800; margin-bottom: 8px; }}
        p {{ color: #475569; line-height: 1.6; }}
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="card">
          <div class="logo">✈️ RoamRadar</div>
          <h1>Verify your email</h1>
          <p>Hey {full_name}, welcome to RoamRadar! Use the OTP below to confirm your email address and unlock your account.</p>

          <div class="otp-box">
            <div class="otp-code">{otp_code}</div>
            <div class="expiry">⏳ Expires in 10 minutes</div>
          </div>

          <p>If you didn't create a RoamRadar account, you can safely ignore this email.</p>
        </div>
        <div class="footer">
          © 2026 RoamRadar · Plan smarter, travel further.
        </div>
      </div>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Your RoamRadar OTP: {otp_code}"
    msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.SMTP_HOST,
            port=settings.SMTP_PORT,
            username=settings.SMTP_USER,
            password=settings.SMTP_PASSWORD,
            start_tls=True,
        )
        return True
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send OTP to {to_email}: {e}")
        return False
