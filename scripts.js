/* scripts.js - Shared JavaScript for all CADAO pages */

/**
 * Contact Form Functionality:
 * - On submission, opens the user's default email client (e.g., Gmail, Outlook) with a pre-filled email.
 * - Email details:
 *   To: cadao.development@gmail.com
 *   Subject: Contact Form Submission from [Name]
 *   Body: Name: [name]\nEmail: [email]\n\nMessage: [message]
 * - Users must press "Send" in their email client to send the email.
 * - Form validation ensures valid inputs before opening the email client.
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
        return 'Name must be at least 2 characters long.';
    }
    if (!email || !emailRegex.test(email.trim())) {
        return 'Please enter a valid email address.';
    }
    if (!message || message.trim().length < 10) {
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
        console.warn('Contact form elements not found:', { form, sendButton, formMessage });
        return;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.querySelector('input[name="name"]').value.trim();
        const email = form.querySelector('input[name="email"]').value.trim();
        const message = form.querySelector('textarea[name="message"]').value.trim();

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
            // Open email client
            window.location.href = mailtoUrl;
            formMessage.textContent = 'Opening your email client. Please press "Send" to submit the email.';
            formMessage.className = 'form-message success';
            form.reset();
        } catch (error) {
            formMessage.textContent = 'Failed to open email client. Please email cadao.development@gmail.com directly with your message.';
            formMessage.className = 'form-message error';
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
    animateCards();
    setupContactForm();
});
