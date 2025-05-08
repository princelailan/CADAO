/* scripts.js - Shared JavaScript for all pages */

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    console.log('Scroll position:', window.scrollY); // Debug: Log scroll position
});

// Card animation observer
const animateCards = () => {
    const cards = document.querySelectorAll('.card, .gallery-grid img, .contact-form input, .contact-form textarea');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                console.log('Animating element:', entry.target); // Debug: Log animated element
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    });
};

// Form validation
const validateForm = (name, email, message) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || name.trim().length < 2) {
        console.warn('Validation failed: Name is empty or too short'); // Debug: Log validation issue
        return 'Name must be at least 2 characters long.';
    }
    if (!email || !emailRegex.test(email.trim())) {
        console.warn('Validation failed: Invalid or empty email'); // Debug: Log validation issue
        return 'Please enter a valid email address.';
    }
    if (!message || message.trim().length < 10) {
        console.warn('Validation failed: Message is empty or too short'); // Debug: Log validation issue
        return 'Message must be at least 10 characters long.';
    }
    return null;
};

// Contact form handling for mailto
const setupContactForm = () => {
    const form = document.querySelector('#contactForm');
    const sendButton = document.querySelector('#sendButton');
    const formMessage = document.querySelector('#formMessage');

    if (!form || !sendButton || !formMessage) {
        console.warn('Contact form elements not found'); // Debug: Log missing elements
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();
        const message = form.querySelector('textarea[name="message"]').value.trim();

        console.log('Form submission attempt:', { name, email, message }); // Debug: Log form data

        // Validate form inputs
        const validationError = validateForm(name, email, message);
        if (validationError) {
            formMessage.textContent = validationError;
            formMessage.className = 'form-message error';
            return;
        }

        // Disable button and show loading state
        sendButton.disabled = true;
        sendButton.classList.add('loading');
        sendButton.textContent = 'Opening Email...';
        formMessage.textContent = '';

        // Construct mailto URL
        const subject = encodeURIComponent('Contact Form Submission from ' + name);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoUrl = `mailto:cadao.development@gmail.com?subject=${subject}&body=${body}`;

        try {
            // Open email client
            window.location.href = mailtoUrl;
            formMessage.textContent = 'Opening your email client. Please send the email.';
            formMessage.className = 'form-message success';
            form.reset();
            console.log('Mailto URL opened:', mailtoUrl); // Debug: Log mailto URL
        } catch (error) {
            formMessage.textContent = 'Failed to open email client. Please try again.';
            formMessage.className = 'form-message error';
            console.error('Mailto error:', error); // Debug: Log error
        } finally {
            // Re-enable button and reset text
            sendButton.disabled = false;
            sendButton.classList.remove('loading');
            sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        }
    });
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing scripts'); // Debug: Log initialization
    animateCards();
    setupContactForm();
});

/**
 * Future Enhancements:
 * - Add smooth scrolling: window.scrollTo({ behavior: 'smooth' })
 * - Implement image lazy loading: Add loading="lazy" to img tags
 * - Add server-side validation if backend is added
 * - Integrate Google Analytics for tracking
 * - Log errors to a service like Sentry for production
 */
