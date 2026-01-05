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

// Send cancellation email to customer(s) - supports BCC for bulk
export async function sendCancellationEmail({ to, bcc, tourDate, startTime, numberOfTourists, message }) {
  const config = getEmailConfig();
  
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const formattedDate = new Date(tourDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ef4444; color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444; }
        .message-box { background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Tour Cancellation Notice</h1>
        <p>${escapeHtml(config.companyName)}</p>
      </div>
      <div class="content">
        <p>We regret to inform you that your tour booking has been cancelled.</p>
        <div class="info-box">
          <p><strong>Tour Date:</strong> ${escapeHtml(formattedDate)}</p>
          <p><strong>Time:</strong> ${escapeHtml(formatTime(startTime))}</p>
          ${numberOfTourists ? `<p><strong>Party Size:</strong> ${numberOfTourists} guest${numberOfTourists > 1 ? 's' : ''}</p>` : ''}
        </div>
        <div class="message-box">
          <p><strong>Message from the organizer:</strong></p>
          <p>${escapeHtml(message)}</p>
        </div>
        <p>If you have any questions, please contact us at ${escapeHtml(config.companyEmail)}</p>
      </div>
      <div class="footer">
        <p>${escapeHtml(config.companyName)} - ${escapeHtml(config.companyTagline)}</p>
      </div>
    </body>
    </html>
  `;

  try {
    const emailOptions = {
      from: `${config.fromName} <${config.fromAddress}>`,
      to: Array.isArray(to) ? to : [to],
      subject: `Tour Cancellation - ${formattedDate}`,
      html: htmlContent,
    };
    
    // Add BCC if provided (for bulk cancellations)
    if (bcc && bcc.length > 0) {
      emailOptions.bcc = bcc;
    }

    await resend.emails.send(emailOptions);
    return { success: true };
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    return { success: false, error };
  }
}

// Send booking confirmation email
export async function sendBookingConfirmationEmail({ to, tourDate, startTime, numberOfTourists }) {
  const config = getEmailConfig();
  
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const formattedDate = new Date(tourDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #0ea5e9; color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #0ea5e9; }
        .notice-box { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Booking Confirmed!</h1>
        <p>${escapeHtml(config.companyName)}</p>
      </div>
      <div class="content">
        <p>Thank you for booking with us! Your tour reservation has been confirmed.</p>
        <div class="info-box">
          <p><strong>Tour Date:</strong> ${escapeHtml(formattedDate)}</p>
          <p><strong>Time:</strong> ${escapeHtml(formatTime(startTime))}</p>
          <p><strong>Party Size:</strong> ${numberOfTourists} guest${numberOfTourists > 1 ? 's' : ''}</p>
        </div>
        <div class="notice-box">
          <p><strong>Important:</strong> Tours are not currently running, but will resume soon. We will reach out with more information about your tour closer to the date.</p>
        </div>
        <p>If you have any questions, please contact us at ${escapeHtml(config.companyEmail)}</p>
      </div>
      <div class="footer">
        <p>${escapeHtml(config.companyName)} - ${escapeHtml(config.companyTagline)}</p>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: `${config.fromName} <${config.fromAddress}>`,
      to: [to],
      subject: `Booking Confirmed - ${formattedDate}`,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return { success: false, error };
  }
}

// Send admin notification for new booking
export async function sendBookingAdminNotification({ tourDate, startTime, numberOfTourists, contactEmail }) {
  const config = getEmailConfig();
  
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    return `${h % 12 || 12}:${minutes} ${h >= 12 ? 'PM' : 'AM'}`;
  };

  const formattedDate = new Date(tourDate).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #22c55e; color: #fff; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
        .info-box { background-color: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>New Booking Received!</h1>
        <p>${escapeHtml(config.companyName)}</p>
      </div>
      <div class="content">
        <p>A new tour booking has been submitted.</p>
        <div class="info-box">
          <p><strong>Tour Date:</strong> ${escapeHtml(formattedDate)}</p>
          <p><strong>Time:</strong> ${escapeHtml(formatTime(startTime))}</p>
          <p><strong>Party Size:</strong> ${numberOfTourists} guest${numberOfTourists > 1 ? 's' : ''}</p>
          <p><strong>Contact Email:</strong> <a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a></p>
        </div>
        <p>Log in to the <a href="https://brighton-tours.co.uk/admin/dashboard">admin dashboard</a> to manage this booking.</p>
      </div>
      <div class="footer">
        <p>${escapeHtml(config.companyName)} - ${escapeHtml(config.companyTagline)}</p>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: `${config.fromName} <${config.fromAddress}>`,
      to: config.toAddresses,
      subject: `New Booking: ${formattedDate} - ${numberOfTourists} guest${numberOfTourists > 1 ? 's' : ''}`,
      html: htmlContent,
    });
    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error };
  }
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
