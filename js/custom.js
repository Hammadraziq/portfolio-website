// Configuration
const CONFIG = {
    BACKEND_URL: 'http://localhost:3000', // Backend server URL
    API_ENDPOINTS: {
        CONTACT: '/contact',
        HEALTH: '/health'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar transparency on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY;
        
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Certificate filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certificateItems = document.querySelectorAll('.certificate-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter certificates
            certificateItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.remove('hidden');
                    }, 100);
                } else {
                    item.classList.add('hidden');
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Scroll animations with fade-in from bottom
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add fade-in class to the section
                entry.target.classList.add('fade-in-visible');
                
                // Animate child elements with staggered delays
                const childElements = entry.target.querySelectorAll('.feature-card, .portfolio-card, .certificate-card, .timeline-content');
                childElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('fade-in-visible');
                    }, index * 100); // Staggered delay
                });
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Additional observer for individual elements that might not be in sections
    const elementObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, { threshold: 0.3 });

    // Observe individual elements
    const individualElements = document.querySelectorAll('.feature-card, .portfolio-card, .certificate-card, .timeline-content');
    individualElements.forEach(el => {
        elementObserver.observe(el);
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value.trim();
            const email = this.querySelector('input[type="email"]').value.trim();
            const message = this.querySelector('textarea').value.trim();
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Update button state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;    
            }, 2000);
            return false;
            try {
                // Send request to backend
                const response = await fetch(`${CONFIG.BACKEND_URL}${CONFIG.API_ENDPOINTS.CONTACT}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: message
                    })
                });
                
                const result = await response.json();
                
                if (result.success) {
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    this.reset();
                } else {
                    showNotification(`Error: ${result.error}`, 'error');
                }
                
            } catch (error) {
                console.error('Error sending message:', error);
                showNotification('Failed to send message. Please check your connection and try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                notification.classList.add('hide');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Multi-language typing animation for hero title
    const heroTitles = [
        "Olá, sou Hammad",           // Portuguese
        "Hello, I'm Hammad",          // English
        "مرحبا، أنا حماد",            // Arabic
        "Hola, soy Hammad",           // Spanish
        "Bonjour, je suis Hammad",    // French
        "Hallo, ich bin Hammad",      // German
        "Ciao, sono Hammad",          // Italian
        "Привет, я Хаммад",            // Russian
        "こんにちは、私はハマドです",    // Japanese
        "안녕하세요, 저는 하마드입니다"      // Korean
    ];

    let currentTitleIndex = 0;
    let isTyping = false;

    function typeWriter(element, text, speed = 80, onComplete = null) {
        if (isTyping) return;
        
        isTyping = true;
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                isTyping = false;
                if (onComplete) onComplete();
            }
        }
        
        type();
    }

    function eraseText(element, speed = 50, onComplete = null) {
        if (isTyping) return;
        
        isTyping = true;
        const text = element.textContent;
        let i = text.length;
        
        function erase() {
            if (i > 0) {
                element.innerHTML = text.substring(0, i - 1);
                i--;
                setTimeout(erase, speed);
            } else {
                isTyping = false;
                if (onComplete) onComplete();
            }
        }
        
        erase();
    }

    function cycleThroughTitles() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const currentText = heroTitles[currentTitleIndex];
        
        // Type the current title
        typeWriter(heroTitle, currentText, 80, () => {
            // Wait for 2 seconds, then erase
            setTimeout(() => {
                eraseText(heroTitle, 50, () => {
                    // Move to next title
                    currentTitleIndex = (currentTitleIndex + 1) % heroTitles.length;
                    // Wait for 1 second, then start next cycle
                    setTimeout(cycleThroughTitles, 1000);
                });
            }, 1000);
        });
    }

    // Initialize multi-language typing animation when hero section is visible
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const heroObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Start the cycling animation
                    cycleThroughTitles();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        heroObserver.observe(heroTitle);
    }

    // Counter animation for statistics
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        
        updateCounter();
    }

    // Animate counters when they come into view
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.textContent);
                animateCounter(entry.target, target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.querySelector('.hero-section');
        
        if (heroSection) {
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        }
    });

    // Mobile menu toggle enhancement
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', function() {
            navbarCollapse.classList.toggle('show');
        });
        
        // Close mobile menu when clicking on a link
        const mobileNavLinks = document.querySelectorAll('.navbar-nav .nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth < 992) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }

    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('btn-outline-primary')) {
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            }
        });
    });

    // Portfolio card hover effects
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.3 });

    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
        item.style.transition = 'all 0.6s ease';
        timelineObserver.observe(item);
    });

    // Social media links functionality
    const socialLinks = document.querySelectorAll('.social-icon');
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('i').className.includes('linkedin') ? 'LinkedIn' :
                           this.querySelector('i').className.includes('behance') ? 'Behance' : 'GitHub';
            
            showNotification(`Opening ${platform} profile...`, 'info');
            
            // Simulate opening social media profile
            setTimeout(() => {
                // In a real implementation, this would open the actual social media profile
                
                console.log(`Opening ${platform} profile`);
            }, 1000);
        });
    });

    // Portfolio link functionality
    const portfolioLinks = document.querySelectorAll('.portfolio-card .btn');
    portfolioLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.closest('.portfolio-card').querySelector('h4').textContent;
            
            showNotification(`Opening ${platform} portfolio...`, 'info');
            
            // Simulate opening portfolio
            setTimeout(() => {
                console.log(`Opening ${platform} portfolio`);
            }, 1000);
        });
    });

    // Initialize tooltips (if Bootstrap tooltips are used)
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Add scroll progress indicator
    function createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, #6c5ce7, #a29bfe);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }
    
    createScrollProgress();

    // Certificate modal functionality
     const certificateData = {
        atlantis: {
            title: "Atlantis Internship Completion",
            organization: "Atlantis",
            date: "2022",
            category: "Internship",
            description: "Internship Completion Certificate for the role of Web Developer at Atlantis. Successfully completed the internship program with excellent performance and significant contributions to the organization’s development initiatives",
            link: "https://drive.google.com/file/d/19UdlKz6zrqIl0tkvF7uxSad4Ln6cflUO/view?usp=sharing"
        },
        web_development: {
            title: "Advanced Web Development Course PSEB",
            organization: "PSEB IT Industry Academia Bridge Program",
            date: "2022",
            category: "pseb",
            description: "Earned certification after completing the full-stack web development course under PSEB IT Industry Academia Bridge Program.",
            link:"https://drive.google.com/file/d/19Mfk4EJw-o1lFvt7l45uEoD8zQsXBEIE/view?usp=sharing"
        },
        foundation: {
            title: "Foundation of Project Management",
            organization: "Google",
            date: "2023",
            category: "project_management",
            description: "Earned certification after completing the Foundations of Project Management course by Google, focused on project lifecycle, key roles, and core project management concepts.",
            link: "https://drive.google.com/file/d/1lUjvC0hs3xZXnWZZC-TN-PKLJAyJbVjs/view?usp=sharing"
        },
        start_project: {
            title: "Project Initiation: Starting a Successful Project",
            organization: "Google",
            date: "2023",
            category: "project_management",
            description: "Earned certification after completing the Project Initiation course by Google, focused on defining project goals, identifying stakeholders, and setting up project documentation.",
            link: "https://drive.google.com/file/d/1EIBDfc_VRGRjI6vJJ60oFBKX2v-PkOtx/view?usp=sharing"
        },
        planning_project: {
            title: "Project Planning: Putting It All Together",
            organization: "Google",
            date: "2023",
            category: "project_management",
            description: "Earned certification after completing the Project Planning course by Google, focused on creating project plans, managing risks, and setting timelines and milestones.",
            link: "https://drive.google.com/file/d/1CgFLdU7A8ewdgppzftsYv6J9q1lH5QaE/view?usp=sharing"
        },
        running_project: {
            title: "Project Execution: Running the Project",
            organization: "Google",
            date: "2023",
            category: "project_management",
            description: "Earned certification after completing the Project Execution course by Google, covering task management, quality assurance, and communication strategies during project implementation.",
            link: "https://drive.google.com/file/d/1xw-FFuRokTwDYQ0ZFtDBO_f4TbVjSgRE/view?usp=sharing"
        },
        agile: {
            title: "Agile Project Management",
            organization: "Google",
            date: "2023",
            category: "project_management",
            description: "Earned certification after completing the Agile Project Management course by Google, focusing on Agile principles, Scrum methodology, and iterative project delivery techniques.",
            link: "https://drive.google.com/file/d/1bRbcvg9yzPLfwJEr1vSLmD9MupsBQL3Z/view?usp=sharing"
        },
        capstone: {
            title: "Capstone: Applying Project Management in the Real World",
            organization: "Google",
            date: "2023",
            category: "project_management",
            description: "Earned certification after completing the Project Management Capstone course by Google, focused on applying project management skills through real-world scenarios and case studies.",
            link: "https://drive.google.com/file/d/1YnfKQCMeNGP64PL7JiMsqmKrTKXasvYQ/view?usp=sharing"
        },
        frontend: {
            title: "Introduction to Frontend",
            organization: "Coursera",
            date: "2023",
            category: "Programming",
            description: "Completed the HTML, CSS, and JavaScript for Web Developers course by Meta on Coursera. Gained practical skills in building responsive and interactive web pages using modern frontend technologies.",
            link: "https://drive.google.com/file/d/1ANcCeTzPRnIieD5nBsNsIYSONGIJ060Y/view?usp=sharing"
        },
        react: {
            title: "React Basics Certificate of Achievement",
            organization: "Coursera",
            date: "2023",
            category: "Programming",
            description: "Completed the React Basics course on Coursera. Gained foundational knowledge of React.js, including components, props, state management, and JSX. Developed interactive user interfaces and learned core concepts used in modern frontend development.",
            link: "https://drive.google.com/file/d/10jhQOaIpfWyfqUJPlzm0mVA_aecJWWtB/view?usp=sharing"
        }
    };

    // Certificate card click handlers
    const certificateCards = document.querySelectorAll('.certificate-card');
    const modal = document.getElementById('certificateModal');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalOrganization = document.getElementById('modalOrganization');
    const modalDate = document.getElementById('modalDate');
    const modalCategory = document.getElementById('modalCategory');
    const modalDescription = document.getElementById('modalDescription');
    const viewCertificateBtn = document.getElementById('viewCertificate');

    certificateCards.forEach(card => {
        card.addEventListener('click', function() {
            const certificateId = this.getAttribute('data-certificate');
            const data = certificateData[certificateId];
            
            if (data) {
                modalTitle.textContent = data.title;
                modalOrganization.textContent = data.organization;
                modalDate.textContent = data.date;
                modalCategory.textContent = data.category;
                modalDescription.textContent = data.description;
                viewCertificateBtn.href = data.link;
                modal.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal handlers
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // View certificate button handler
    viewCertificateBtn.addEventListener('click', function() {
        // Simulate opening certificate
        showNotification('Opening certificate...', 'info');
        setTimeout(() => {
            showNotification('Certificate opened successfully!', 'success');
        }, 1000);
    });

    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    
    if (cursor) {
        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', function() {
            cursor.style.opacity = '0';
        });
        
        // Show cursor when entering window
        document.addEventListener('mouseenter', function() {
            cursor.style.opacity = '1';
        });
    }

    // Theme switching functionality
    function initThemeSwitcher() {
        const themeOptions = document.querySelectorAll('.theme-option');
        const html = document.documentElement;
        
        // Load saved theme from localStorage
        const savedTheme = localStorage.getItem('selectedTheme') || 'dark';
        html.setAttribute('data-theme', savedTheme);
        
        // Function to update active theme in dropdown
        function updateActiveTheme(activeTheme) {
            themeOptions.forEach(option => {
                const theme = option.getAttribute('data-theme');
                if (theme === activeTheme) {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
        }
        
        // Set initial active theme
        updateActiveTheme(savedTheme);
        
        // Add click event listeners to theme options
        themeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const theme = option.getAttribute('data-theme');
                
                // Update data-theme attribute
                html.setAttribute('data-theme', theme);
                
                // Save to localStorage
                localStorage.setItem('selectedTheme', theme);
                
                // Update active state in dropdown
                updateActiveTheme(theme);
                
                // Add visual feedback
                option.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    option.style.transform = 'scale(1)';
                }, 200);
                
                // Show notification about theme change
                const themeName = theme.charAt(0).toUpperCase() + theme.slice(1);
                showNotification(`${themeName} theme activated!`, 'success');
            });
        });
    }

    // Initialize theme switcher when DOM is loaded
    initThemeSwitcher();

    // Test backend connection on page load
    // testBackendConnection();

    console.log('Portfolio website initialized successfully!');
    
}); 

// Function to test backend connection
async function testBackendConnection() {
    try {
        const response = await fetch(`${CONFIG.BACKEND_URL}${CONFIG.API_ENDPOINTS.HEALTH}`);
        if (response.ok) {
            console.log('✅ Backend server is running and accessible');
            // Optionally show a subtle notification that backend is connected
            showBackendStatus('connected');
        } else {
            console.warn('⚠️ Backend server responded with an error');
            showBackendStatus('error');
        }
    } catch (error) {
        console.error('❌ Backend server is not accessible:', error.message);
        showBackendStatus('disconnected');
    }
}

// Function to show backend connection status
function showBackendStatus(status) {
    // Create a small status indicator in the contact form
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Remove existing status indicator
    const existingStatus = contactForm.querySelector('.backend-status');
    if (existingStatus) {
        existingStatus.remove();
    }

    const statusIndicator = document.createElement('div');
    statusIndicator.className = `backend-status backend-status-${status}`;
    
    let statusText, statusIcon, statusClass;
    
    switch (status) {
        case 'connected':
            statusText = 'Backend connected';
            statusIcon = 'fas fa-check-circle';
            statusClass = 'success';
            break;
        case 'error':
            statusText = 'Backend error';
            statusIcon = 'fas fa-exclamation-triangle';
            statusClass = 'warning';
            break;
        case 'disconnected':
            statusText = 'Backend disconnected';
            statusIcon = 'fas fa-times-circle';
            statusClass = 'danger';
            break;
    }
    
    statusIndicator.innerHTML = `
        <small class="text-${statusClass}">
            <i class="${statusIcon}"></i> ${statusText}
        </small>
    `;
    
    // Insert after the form title
    const formTitle = contactForm.previousElementSibling;
    if (formTitle && formTitle.tagName === 'H4') {
        formTitle.insertAdjacentElement('afterend', statusIndicator);
    }
}