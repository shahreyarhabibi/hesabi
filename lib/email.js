// lib/email.js

const apiKey = process.env.BREVO_API_KEY;
const senderEmail = process.env.BREVO_FROM_EMAIL;
const senderName = process.env.BREVO_FROM_NAME || "Hesabi";

/**
 * Send OTP verification email
 */
export async function sendOTPEmail(email, otp, firstName = "User") {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: email,
            name: firstName,
          },
        ],
        subject: "Verify Your Email - Hesabi",
        htmlContent: getOTPEmailTemplate(otp, firstName),
        textContent: `Your verification code is: ${otp}. This code expires in 1 minute.`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo error:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }

    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate HTML email template for OTP
 */
function getOTPEmailTemplate(otp, firstName) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Hesabi</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">
                Verify Your Email
              </h2>
              
              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Hi ${firstName},
              </p>
              
              <p style="margin: 0 0 30px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Thank you for signing up! Please use the verification code below to complete your registration:
              </p>
              
              <!-- OTP Code Box -->
              <div style="background-color: #f4f4f5; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #71717a; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Your verification code
                </p>
                <div style="font-size: 36px; font-weight: bold; color: #3b82f6; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <!-- Warning -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  ⚠️ This code will expire in <strong>1 minute</strong>. Do not share this code with anyone.
                </p>
              </div>
              
              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                If you didn't create an account with Hesabi, you can safely ignore this email.
              </p>
              
              <p style="margin: 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong>Hesabi Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f4f4f5; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #71717a; font-size: 14px;">
                © ${new Date().getFullYear()} Hesabi. All rights reserved.
              </p>
              <p style="margin: 10px 0 0; color: #a1a1aa; font-size: 12px;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export async function sendPasswordResetEmail(email, otp, firstName = "User") {
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [
          {
            email: email,
            name: firstName,
          },
        ],
        subject: "Reset Your Password - Hesabi",
        htmlContent: getPasswordResetEmailTemplate(otp, firstName),
        textContent: `Your password reset code is: ${otp}. This code expires in 1 minutes. If you didn't request this, please ignore this email.`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo error:", data);
      return { success: false, error: data.message || "Failed to send email" };
    }

    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Generate HTML email template for Password Reset
 */
function getPasswordResetEmailTemplate(otp, firstName) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 16px 16px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Hesabi</h1>
              <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">Password Reset Request</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 20px; color: #18181b; font-size: 24px; font-weight: 600;">
                Reset Your Password
              </h2>
              
              <p style="margin: 0 0 20px; color: #52525b; font-size: 16px; line-height: 1.6;">
                Hi ${firstName},
              </p>
              
              <p style="margin: 0 0 30px; color: #52525b; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password. Use the code below to proceed:
              </p>
              
              <!-- OTP Code Box -->
              <div style="background-color: #fef2f2; border: 2px solid #fecaca; border-radius: 12px; padding: 30px; text-align: center; margin-bottom: 30px;">
                <p style="margin: 0 0 10px; color: #991b1b; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Your reset code
                </p>
                <div style="font-size: 36px; font-weight: bold; color: #dc2626; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <!-- Warning -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                <p style="margin: 0; color: #92400e; font-size: 14px;">
                  ⚠️ This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.
                </p>
              </div>
              
              <!-- Security Notice -->
              <div style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                <p style="margin: 0; color: #166534; font-size: 14px;">
                  🔒 If you didn't request a password reset, please ignore this email. Your account is safe.
                </p>
              </div>
              
              <p style="margin: 0; color: #52525b; font-size: 16px; line-height: 1.6;">
                Best regards,<br>
                <strong>Hesabi Team</strong>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f4f4f5; border-radius: 0 0 16px 16px; text-align: center;">
              <p style="margin: 0; color: #71717a; font-size: 14px;">
                © ${new Date().getFullYear()} Hesabi. All rights reserved.
              </p>
              <p style="margin: 10px 0 0; color: #a1a1aa; font-size: 12px;">
                This is an automated message. Please do not reply to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
