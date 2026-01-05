import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Get configuration from environment variables
const getEmailConfig = () => ({
  fromName: process.env.EMAIL_FROM_NAME,
  fromAddress: process.env.EMAIL_FROM_ADDRESS,
  toAddresses: process.env.EMAIL_TO?.split(',').map(e => e.trim()) || [],
  companyName: process.env.COMPANY_NAME,
  companyTagline: process.env.COMPANY_TAGLINE,
  companyEmail: process.env.COMPANY_EMAIL,
});

// Helper function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text?.toString().replace(/[&<>"']/g, (m) => map[m]) || '';
}

// Send contact form submission notification
export async function sendContactFormSubmission(formData, retryAttempt = 0) {
  const { name, email, message } = formData;
  const config = getEmailConfig();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #0ea5e9;
          color: #fff;
          padding: 30px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .info-box {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border: 2px solid #0ea5e9;
        }
        .field {
          margin-bottom: 15px;
        }
        .field-label {
          font-weight: bold;
          color: #0ea5e9;
          display: block;
          margin-bottom: 5px;
        }
        .field-value {
          color: #333;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }
        .message-box {
          background-color: #fff;
          padding: 20px;
          border-radius: 8px;
          border-left: 4px solid #0ea5e9;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Contact Form Submission</h1>
        <p>${escapeHtml(config.companyName)}</p>
      </div>
      <div class="content">
        <p>You have received a new message from your website contact form.</p>
        <div class="info-box">
          <div class="field">
            <span class="field-label">Name:</span>
            <div class="field-value">${escapeHtml(name)}</div>
          </div>
          <div class="field">
            <span class="field-label">Email:</span>
            <div class="field-value">${escapeHtml(email)}</div>
          </div>
        </div>
        <div class="message-box">
          <span class="field-label">Message:</span>
          <div style="margin-top: 10px; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString('en-GB', {
          dateStyle: 'long',
          timeStyle: 'short'
        })}</p>
      </div>
      <div class="footer">
        <p>${escapeHtml(config.companyName)} - ${escapeHtml(config.companyTagline)}</p>
        <p>${escapeHtml(config.companyEmail)}</p>
      </div>
    </body>
    </html>
  `;

  const textContent = `
New Contact Form Submission - ${config.companyName}

You have received a new message from your website contact form.

Name: ${name}
Email: ${email}

Message:
${message}

Submitted at: ${new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' })}

---
${config.companyName} - ${config.companyTagline}
${config.companyEmail}
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: `${config.fromName} <${config.fromAddress}>`,
      to: config.toAddresses,
      subject: `New Contact Form Message from ${name}`,
      html: htmlContent,
      text: textContent,
      replyTo: email,
    });

    if (error) {
      // Check if it's a rate limit error
      if (error.statusCode === 429 && retryAttempt < 3) {
        console.log(`Rate limited, retrying in 3 seconds... (Attempt ${retryAttempt + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, 3000));
        return sendContactFormSubmission(formData, retryAttempt + 1);
      }
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
}
