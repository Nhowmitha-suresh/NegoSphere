import httpx
import smtplib
import socket
from typing import Tuple, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings
from app.core.logging import logger

class EmailService:
    async def send_verification_otp(
        self, recipient_email: str, otp_code: str, user_name: str = "User"
    ) -> Tuple[bool, Optional[str]]:
        """
        Dispatches a 6-digit verification code to recipient_email via SMTP, Resend API, or SendGrid API.
        
        Returns:
            (True, None) -> Email delivered successfully via real SMTP/API.
            (True, "DEV_FALLBACK") -> Local development fallback (no SMTP configured).
            (False, error_message) -> Sending failed with explicit error details.
        """
        logger.info(f"🔑 [OTP GENERATION] Generated 6-digit OTP code [{otp_code}] for recipient: {recipient_email}")

        subject = f"Your NegoSphere Verification Code: {otp_code}"
        
        html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #FAF7F2; color: #3F3024; margin: 0; padding: 20px; }}
    .card {{ max-width: 500px; margin: 0 auto; background: #FFFFFF; border: 1px solid #C9A76A; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px rgba(63, 48, 36, 0.08); }}
    .logo {{ font-size: 24px; font-weight: 800; color: #3F3024; font-family: Georgia, serif; text-align: center; margin-bottom: 20px; }}
    .code-box {{ background: #F8F6F1; border: 2px solid #C9A76A; border-radius: 12px; font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #3F3024; text-align: center; padding: 16px; margin: 24px 0; font-family: monospace; }}
    .footer {{ text-align: center; font-size: 11px; color: #7A5C45; margin-top: 24px; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">NegoSphere OS</div>
    <p>Hello {user_name},</p>
    <p>Use the following 6-digit security code to verify your NegoSphere account. This code will expire in <strong>10 minutes</strong>.</p>
    <div class="code-box">{otp_code}</div>
    <p>If you did not request this verification code, please ignore this message or report suspicious activity to security.</p>
    <div class="footer">
      &copy; 2026 NegoSphere Inc. All rights reserved. Enterprise AI Procurement.
    </div>
  </div>
</body>
</html>"""

        # 1. Try Standard SMTP (Gmail, SendGrid SMTP, Mailgun, Amazon SES, Custom SMTP)
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            logger.info(f"📧 [SMTP DISPATCH] Attempting email delivery via {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
            try:
                sender = settings.EMAIL_FROM
                # Format sender address if not explicitly set
                if "<" not in sender and "@" in settings.SMTP_USER:
                    sender = f"NegoSphere Security <{settings.SMTP_USER}>"

                msg = MIMEMultipart("alternative")
                msg["Subject"] = subject
                msg["From"] = sender
                msg["To"] = recipient_email
                msg.attach(MIMEText(html_body, "html"))

                logger.info(f"🔌 [SMTP CONNECT] Connecting to SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT}...")
                
                # Check for SSL (Port 465) vs STARTTLS (Port 587 / 25)
                if settings.SMTP_PORT == 465:
                    with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
                        server.ehlo()
                        logger.info(f"🔐 [SMTP AUTH] Authenticating SMTP user: {settings.SMTP_USER}...")
                        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                        logger.info(f"🚀 [SMTP SEND] Delivering OTP message to {recipient_email}...")
                        server.sendmail(sender, [recipient_email], msg.as_string())
                else:
                    with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as server:
                        server.ehlo()
                        logger.info(f"🔒 [SMTP TLS] Initiating STARTTLS encryption...")
                        server.starttls()
                        server.ehlo()
                        logger.info(f"🔐 [SMTP AUTH] Authenticating SMTP user: {settings.SMTP_USER}...")
                        server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                        logger.info(f"🚀 [SMTP SEND] Delivering OTP message to {recipient_email}...")
                        server.sendmail(sender, [recipient_email], msg.as_string())

                logger.info(f"✅ [SMTP SUCCESS] Verification email containing OTP code [{otp_code}] was delivered to {recipient_email} via SMTP!")
                return (True, None)

            except smtplib.SMTPAuthenticationError as e:
                err_msg = f"SMTP Authentication failed for {settings.SMTP_USER}. If using Gmail, make sure you use an 16-character App Password (not your normal Gmail password). Details: {e.smtp_error.decode('utf-8', errors='ignore') if hasattr(e, 'smtp_error') and isinstance(e.smtp_error, bytes) else str(e)}"
                logger.error(f"❌ [SMTP AUTH ERROR] {err_msg}")
                return (False, err_msg)
            except smtplib.SMTPConnectError as e:
                err_msg = f"Failed to connect to SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT}. Check host/port. Details: {str(e)}"
                logger.error(f"❌ [SMTP CONNECT ERROR] {err_msg}")
                return (False, err_msg)
            except socket.timeout:
                err_msg = f"Connection to SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT} timed out."
                logger.error(f"❌ [SMTP TIMEOUT ERROR] {err_msg}")
                return (False, err_msg)
            except Exception as e:
                err_msg = f"SMTP Exception during email dispatch to {recipient_email}: {str(e)}"
                logger.error(f"❌ [SMTP EXCEPTION] {err_msg}")
                return (False, err_msg)

        # 2. Try Resend API if API Key is configured
        if settings.RESEND_API_KEY:
            logger.info(f"📧 [RESEND DISPATCH] Attempting email delivery to {recipient_email} via Resend API...")
            try:
                async with httpx.AsyncClient(timeout=12.0) as client:
                    resp = await client.post(
                        "https://api.resend.com/emails",
                        headers={"Authorization": f"Bearer {settings.RESEND_API_KEY}"},
                        json={
                            "from": settings.EMAIL_FROM,
                            "to": [recipient_email],
                            "subject": subject,
                            "html": html_body
                        }
                    )
                    if resp.status_code in [200, 201]:
                        logger.info(f"✅ [RESEND SUCCESS] Successfully sent verification OTP to {recipient_email} via Resend API.")
                        return (True, None)
                    else:
                        err_msg = f"Resend API Error (HTTP {resp.status_code}): {resp.text}"
                        logger.error(f"❌ [RESEND API ERROR] {err_msg}")
                        return (False, err_msg)
            except Exception as e:
                err_msg = f"Failed sending email via Resend API: {str(e)}"
                logger.error(f"❌ [RESEND EXCEPTION] {err_msg}")
                return (False, err_msg)

        # 3. Try SendGrid API if API Key is configured
        if settings.SENDGRID_API_KEY:
            logger.info(f"📧 [SENDGRID DISPATCH] Attempting email delivery to {recipient_email} via SendGrid API...")
            try:
                from_email_clean = settings.EMAIL_FROM.split("<")[-1].replace(">", "").strip()
                async with httpx.AsyncClient(timeout=12.0) as client:
                    resp = await client.post(
                        "https://api.sendgrid.com/v3/mail/send",
                        headers={"Authorization": f"Bearer {settings.SENDGRID_API_KEY}"},
                        json={
                            "personalizations": [{"to": [{"email": recipient_email}]}],
                            "from": {"email": from_email_clean},
                            "subject": subject,
                            "content": [{"type": "text/html", "value": html_body}]
                        }
                    )
                    if resp.status_code in [200, 202]:
                        logger.info(f"✅ [SENDGRID SUCCESS] Successfully sent verification OTP to {recipient_email} via SendGrid API.")
                        return (True, None)
                    else:
                        err_msg = f"SendGrid API Error (HTTP {resp.status_code}): {resp.text}"
                        logger.error(f"❌ [SENDGRID API ERROR] {err_msg}")
                        return (False, err_msg)
            except Exception as e:
                err_msg = f"Failed sending email via SendGrid API: {str(e)}"
                logger.error(f"❌ [SENDGRID EXCEPTION] {err_msg}")
                return (False, err_msg)

        # 4. Local Development Fallback (when no SMTP credentials or API keys exist in env)
        logger.info(f"------------------------------------------------------------")
        logger.info(f"ℹ️ [DEV FALLBACK] No SMTP credentials configured in environment.")
        logger.info(f"📧 Simulated Email Recipient: {recipient_email}")
        logger.info(f"🔐 Security OTP Verification Code: [{otp_code}]")
        logger.info(f"------------------------------------------------------------")
        return (True, "DEV_FALLBACK")

email_service = EmailService()
