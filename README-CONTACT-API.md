# Portfolio Contact Form API

A serverless contact form API built with Node.js, Nodemailer, and Netlify Functions.

## Features

- ✅ **Serverless**: Runs on Netlify Functions
- ✅ **SMTP Support**: Works with Gmail, Outlook, and other SMTP providers
- ✅ **Form Validation**: Client-side and server-side validation
- ✅ **Beautiful Notifications**: Success, error, and info notifications
- ✅ **CORS Enabled**: Works from any domain
- ✅ **Environment Variables**: Secure credential management
- ✅ **Error Handling**: Comprehensive error handling and user feedback

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in your project root (for local development):

```env
SMTP_HOST = "your-smtp-host-here"
SMTP_USER = "your-smtp-user-here"
SMTP_PASS = "your-smtp-pass-here"
RECIPIENT_EMAIL = "recipient@example.com"
```

**For Gmail users:**
- Use `your-smtp-host-here` as host
- Use port `587`
- Enable 2-factor authentication
- Generate an "App Password" (not your regular password)

**For Netlify deployment:**
Set these environment variables in your Netlify dashboard:
1. Go to Site settings > Environment variables
2. Add each variable with its value

### 3. Local Development

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Start local development server
npm run dev
```

The API will be available at: `http://localhost:8888/.netlify/functions/contact`

### 4. Deploy to Netlify

```bash
# Build and deploy
netlify deploy --prod
```

## File Structure

```
├── api/
│   └── contact.js          # Serverless function
├── js/
│   └── contact.js          # Frontend contact handler
├── css/
│   └── custom.css          # Notification styles
├── package.json            # Dependencies
├── netlify.toml           # Netlify configuration
└── README-CONTACT-API.md  # This file
```

## API Endpoint

**URL:** `/.netlify/functions/contact`

**Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Hello! I'd like to discuss a project."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully!",
  "messageId": "abc123@example.com"
}
```

## Frontend Integration

### 1. Include the contact.js file

Add this to your HTML before the closing `</body>` tag:

```html
<script src="js/contact.js"></script>
```

### 2. Update your contact form

Make sure your form has the correct ID and name attributes:

```html
<form id="contactForm" method="post">
  <div class="form-group mb-3">
    <label for="name" class="form-label">Name</label>
    <input type="text" class="form-control" id="name" name="name" placeholder="Your name" required>
  </div>
  <div class="form-group mb-3">
    <label for="email" class="form-label">Email</label>
    <input type="email" class="form-control" id="email" name="email" placeholder="your.email@example.com" required>
  </div>
  <div class="form-group mb-4">
    <label for="message" class="form-label">Message</label>
    <textarea class="form-control" id="message" name="message" rows="5" placeholder="Tell me about your project..." required></textarea>
  </div>
  <button type="submit" class="btn btn-primary w-100">
    Send Message <i class="fas fa-paper-plane ms-2"></i>
  </button>
</form>
```

## SMTP Configuration Examples

### Gmail
```env
SMTP_HOST = "your-smtp-host-here"
SMTP_USER = "your-smtp-user-here"
SMTP_PASS = "your-smtp-pass-here"
RECIPIENT_EMAIL = "recipient@example.com"
```

## Troubleshooting

### Common Issues

1. **"Authentication failed" error**
   - Check your SMTP credentials
   - For Gmail, ensure you're using an App Password, not your regular password
   - Verify 2-factor authentication is enabled

2. **"Connection failed" error**
   - Check your SMTP host and port
   - Ensure your firewall allows the connection
   - Verify the SMTP server is accessible

3. **Form not submitting**
   - Check browser console for JavaScript errors
   - Verify the form has the correct ID (`contactForm`)
   - Ensure all required fields are filled

4. **CORS errors**
   - The API includes CORS headers
   - If you're still getting CORS errors, check your domain configuration

### Testing

Test the API locally:

```bash
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## Security Features

- ✅ **Input Validation**: Server-side validation of all inputs
- ✅ **Email Format Validation**: Ensures valid email addresses
- ✅ **CORS Protection**: Configurable CORS headers
- ✅ **Rate Limiting**: Can be added via Netlify plugins
- ✅ **Environment Variables**: Secure credential storage

## Customization

### Email Template

Modify the `createEmailTemplate` function in `api/contact.js` to customize the email appearance.

### Notification Styles

Update the CSS in `css/custom.css` to match your website's design.

### Form Validation

Modify the validation rules in `js/contact.js` to add custom validation logic.

## Support

If you encounter any issues:

1. Check the browser console for JavaScript errors
2. Check the Netlify function logs
3. Verify your environment variables are set correctly
4. Test the API endpoint directly

## License

MIT License - feel free to use and modify as needed!
