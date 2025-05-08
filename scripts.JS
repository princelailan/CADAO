/* scripts.js - Shared JavaScript for all pages */

/**
 * EmailJS Setup Instructions for cadao.development@gmail.com:
 * 1. Sign up at https://www.emailjs.com/ and log in.
 * 2. Add a service:
 *    - Choose Gmail or your preferred email provider.
 *    - Note the Service ID (e.g., service_xxxxxxx).
 * 3. Create an email template:
 *    - Go to Email Templates and create a new template.
 *    - Use fields: {{from_name}}, {{from_email}}, {{message}}, {{reply_to}}.
 *    - Set the recipient email to cadao.development@gmail.com.
 *    - Note the Template ID (e.g., template_xxxxxxx).
 * 4. Get your User ID:
 *    - Find it in your EmailJS dashboard under Account > API Keys (e.g., user_xxxxxxx).
 * 5. Update this file:
 *    - Replace YOUR_EMAILJS_USER_ID with your User ID.
 *    - Replace YOUR_SERVICE_ID with your Service ID.
 *    - Replace YOUR_TEMPLATE_ID with your Template ID.
 * 6. Test the form:
 *    - Load the contact page in a browser.
 *    - Submit the form and check the console for logs.
 *    - Verify that emails arrive at cadao.development@gmail.com.
 * 7. Debug issues:
 *    - Check console logs for errors.
 *    - Ensure EmailJS credentials are correct.
 *    - Verify Gmail settings allow EmailJS (check spam/junk folder).
 */
emailjs.init("YOUR_EMAILJS_USER_ID"); // Replace with your EmailJS User ID

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

// Contact form submission
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

        console.log('Form submission attempt:', { name, email, message, to: 'cadao.development@gmail.com' }); // Debug: Log form data

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
        sendButton.textContent = 'Sending...';
        formMessage.textContent = '';

        // Send email via EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_name: name,
            from_email: email,
            message: message,
            reply_to: email
        })
        .then((response) => {
            formMessage.textContent = 'Message sent successfully! We will get back to you soon.';
            formMessage.className = 'form-message success';
            form.reset();
            console.log('Email sent successfully to cadao.development@gmail.com:', response); // Debug: Log success
        })
        .catch(error => {
            formMessage.textContent = 'Failed to send message. Please try again later.';
            formMessage.className = 'form-message error';
            console.error('EmailJS error:', error); // Debug: Log error
        })
        .finally(() => {
            // Re-enable button and reset text
            sendButton.disabled = false;
            sendButton.classList.remove('loading');
            sendButton.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        });
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