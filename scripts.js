/* scripts.js - Shared JavaScript for all CADAO pages */

/**
 * Contact Form Functionality:
 * - On submission, attempts to open the user's default email client (e.g., Gmail, Outlook) with a pre-filled email.
 * - Email details:
 *   To: cadao.development@gmail.com
 *   Subject: Contact Form Submission from [Name]
 *   Body: Name: [name]\nEmail: [email]\n\nMessage: [message]
 * - Users must press "Send" in their email client to send the email.
 * - If the email client fails to open, displays the email content for manual copying.
 * - Form validation ensures valid inputs before processing.
 * - No external services or APIs are used.
 */

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    } else {
        console.warn('Navbar element not found');
    }
});

// Card animation observer
const animateCards = () => {
    const cards = document.querySelectorAll('.card, .gallery-grid img, .contact-form input, .contact-form textarea');
    if (cards.length === 0) {
        console.warn('No elements found for card animation');
        return;
    }
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
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
        console.warn('Validation failed: Name is empty or too short');
        return 'Name must be at least 2 characters long.';
    }
    if (!email || !emailRegex.test(email.trim())) {
        console.warn('Validation failed: Invalid or empty email');
        return 'Please enter a valid email address.';
    }
    if (!message || message.trim().length < 10) {
        console.warn('Validation failed: Message is empty or too short');
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
        console.error('Contact form elements not found:', { form, sendButton, formMessage });
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();
        const message = form.querySelector('textarea[name="message"]').value.trim();

        console.log('Form submission attempt:', { name, email, message, to: 'cadao.development@gmail.com' });

        // Validate form inputs
        const validationError = validateForm(name, email, message);
        if (validationError) {
            formMessage.textContent = validationError;
            formMessage.className = 'form-message error';
            return;
        }

        // Disable button and show preparing state
        sendButton.disabled = true;
        sendButton.classList.add('loading');
        sendButton.textContent = 'Preparing...';
        formMessage.textContent = '';

        // Prepare mailto URL
        const subject = encodeURIComponent('Contact Form Submission from ' + name);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoUrl = `mailto:cadao.development@gmail.com?subject=${subject}&body=${body}`;

        try {
            // Attempt to open email client
            const link = document.createElement('a');
            link.href = mailtoUrl;
            link.click();
            formMessage.innerHTML = 'Opening your email client. Please press "Send" to submit the email.<br>If nothing happens, copy this and email <a href="mailto:cadao.development@gmail.com">cadao.development@gmail.com</a>:<br><pre>To: cadao.development@gmail.com\nSubject: Contact Form Submission from ' + name + '\n\nName: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message + '</pre>';
            formMessage.className = 'form-message success';
            form.reset();
            console.log('Mailto URL triggered:', mailtoUrl);
        } catch (error) {
            formMessage.innerHTML = 'Failed to open email client. Please copy this and email <a href="mailto:cadao.development@gmail.com">cadao.development@gmail.com</a>:<br><pre>To: cadao.development@gmail.com\nSubject: Contact Form Submission from ' + name + '\n\nName: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message + '</pre>';
            formMessage.className = 'form-message error';
            console.error('Mailto error:', error);
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
    console.log('Page loaded, initializing scripts');
    animateCards();
    setupContactForm();
});
