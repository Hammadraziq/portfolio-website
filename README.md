# Hammad Portfolio Website

A modern, responsive portfolio website built with Bootstrap 5, featuring a dark theme with purple gradients and smooth animations.

## 🚀 Features

### Design & Layout
- **Dark Theme**: Modern dark background with purple gradient accents
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Smooth Animations**: Scroll-triggered animations and hover effects
- **Typography**: Clean Inter font family for optimal readability

### Sections
1. **Hero Section**: Profile image, introduction, and social links
2. **About Me**: Personal information, skills, and education
3. **Portfolio**: Showcase of work across different platforms (Dribbble, Behance, GitHub)
4. **Certificates & Awards**: Filterable certificates with categories
5. **Experience**: Timeline-based experience display
6. **Contact**: Contact form and information

### Interactive Features
- **Smooth Scrolling**: Navigation links with smooth scroll behavior
- **Certificate Filtering**: Filter certificates by category
- **Form Validation**: Contact form with email validation
- **Notifications**: Toast notifications for user feedback
- **Scroll Progress**: Visual progress indicator
- **Typing Animation**: Animated hero title
- **Counter Animations**: Animated statistics
- **Timeline Animations**: Animated experience timeline

## 📁 Project Structure

```
portfolio-website/
├── index.html          # Main HTML file
├── css/
│   └── custom.css      # Custom styles and animations
├── js/
│   └── custom.js       # Interactive functionality
├── assets/
│   └── profile-placeholder.jpg  # Profile image (placeholder)
└── README.md           # Project documentation
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup
- **Bootstrap 5**: Responsive grid system and components
- **CSS3**: Custom styling with CSS variables and animations
- **JavaScript**: Interactive functionality and animations
- **Font Awesome**: Icons
- **Google Fonts**: Inter font family

## 🎨 Color Scheme

- **Primary Color**: `#6c5ce7` (Purple)
- **Secondary Color**: `#a29bfe` (Light Purple)
- **Background**: `#1a1a1a` (Dark Gray)
- **Card Background**: `#2d2d2d` (Medium Gray)
- **Text**: `#ffffff` (White)
- **Muted Text**: `#b0b0b0` (Light Gray)

## 📱 Responsive Breakpoints

- **Desktop**: 992px and above
- **Tablet**: 768px - 991px
- **Mobile**: Below 768px

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Local web server (optional, for development)

### Installation

1. **Clone or Download** the project files
2. **Open** `index.html` in your web browser
3. **Customize** the content to match your portfolio

### Local Development Server

For the best experience during development, use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then visit `http://localhost:8000` in your browser.

## ✏️ Customization

### Content Updates

1. **Personal Information**: Update the hero section with your name and description
2. **Profile Image**: Replace `assets/profile-placeholder.jpg` with your photo
3. **About Section**: Modify the content in the about section
4. **Portfolio**: Update portfolio links and descriptions
5. **Certificates**: Add your certificates with appropriate categories
6. **Experience**: Update the timeline with your work experience
7. **Contact**: Update contact information and form handling

### Styling Changes

1. **Colors**: Modify CSS variables in `css/custom.css`
2. **Fonts**: Change the Google Fonts import in `index.html`
3. **Animations**: Adjust animation timing in CSS and JavaScript
4. **Layout**: Modify Bootstrap classes for different layouts

### Adding New Sections

1. Add the HTML structure in `index.html`
2. Add corresponding styles in `css/custom.css`
3. Add any JavaScript functionality in `js/custom.js`

## 🔧 Features Explained

### Certificate Filtering
The certificates section includes a filtering system that allows users to filter certificates by category. The JavaScript handles the filtering logic and smooth transitions.

### Contact Form
The contact form includes:
- Input validation
- Email format checking
- Loading states
- Success/error notifications
- Form reset after submission

### Scroll Animations
Elements animate into view as the user scrolls down the page, creating an engaging user experience.

### Timeline Animation
The experience timeline features alternating left/right positioning with smooth animations.

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the project
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

If you have any questions or need help customizing the portfolio, please open an issue in the repository.
