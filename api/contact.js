const nodemailer = require('nodemailer');

// Environment variables for SMTP configuration
const SMTP_HOST = process.env.SMTP_HOST || 'SMTP_HOST_HERE';
const SMTP_PORT = process.env.SMTP_PORT || 587;
const SMTP_USER = 'hamadraziq30@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS;
const RECIPIENT_EMAIL = SMTP_USER;
console.log(SMTP_HOST);
console.log(SMTP_PORT);
console.log(SMTP_USER);
console.log(RECIPIENT_EMAIL);
// Create transporter
const createTransport = () => {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Email template
const createEmailTemplate = (data) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <div style="background-color: #6c5ce7; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="margin-bottom: 20px;">
          <h3 style="color: #6c5ce7; margin-bottom: 10px;">Contact Information</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #6c5ce7; margin-bottom: 10px;">Message</h3>
          <p style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #6c5ce7;">
            ${data.message.replace(/\n/g, '<br>')}
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            This message was sent from your portfolio website contact form.
          </p>
        </div>
      </div>
    </div>
  `;
};

// Main handler function
exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight successful' })
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse request body
    const body = JSON.parse(event.body);
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Missing required fields: name, email, and message are required' 
        })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Check if SMTP credentials are configured
    if (!SMTP_USER || !SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Email service not configured. Please contact the administrator.' 
        })
      };
    }

    // Create transporter
    const transporter = createTransport();

    // Verify transporter configuration
    await transporter.verify();

    // Email options
    const mailOptions = {
      from: `"Portfolio Contact Form" <${SMTP_USER}>`,
      to: RECIPIENT_EMAIL,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: createEmailTemplate({ name, email, message }),
      text: `
        New Contact Form Submission
        
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', info.messageId);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully!',
        messageId: info.messageId
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);

    // Handle specific SMTP errors
    if (error.code === 'EAUTH') {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Authentication failed. Please check SMTP credentials.' 
        })
      };
    }

    if (error.code === 'ECONNECTION') {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Connection failed. Please check SMTP settings.' 
        })
      };
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to send email. Please try again later.' 
      })
    };
  }
};
