document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS
    emailjs.init(window.env.EMAILJS_PUBLIC_KEY);

    const showCustomPrompt = (title, message, isError = false) => {
        const prompt = document.getElementById('custom-prompt');
        const promptTitle = document.getElementById('prompt-title');
        const promptMessage = document.getElementById('prompt-message');
        const promptClose = document.getElementById('prompt-close');

        promptTitle.textContent = title;
        promptMessage.textContent = message;

        if (isError) {
            promptTitle.classList.replace('text-gray-900', 'text-red-600');
            promptClose.classList.replace('bg-blue-600', 'bg-red-600');
            promptClose.classList.replace('hover:bg-blue-700', 'hover:bg-red-700');
        } else {
            promptTitle.classList.replace('text-red-600', 'text-gray-900');
            promptClose.classList.replace('bg-red-600', 'bg-blue-600');
            promptClose.classList.replace('hover:bg-red-700', 'hover:bg-blue-700');
        }

        prompt.classList.remove('hidden');
        promptClose.onclick = () => prompt.classList.add('hidden');
        prompt.onclick = (e) => { if (e.target === prompt) prompt.classList.add('hidden'); };
    };

    // JOIN FORM
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        const joinButton = joinForm.querySelector('button[type="submit"]');

        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            joinButton.textContent = 'Submitting...';
            joinButton.disabled = true;

            const formData = {
                full_name: joinForm.querySelector('input[name="full-name"]').value,
                email: joinForm.querySelector('input[name="email"]').value,
                year: joinForm.querySelector('select[name="year"]').value,
                branch: joinForm.querySelector('input[name="branch"]').value,
                interest: joinForm.querySelector('textarea[name="interest"]').value || 'Not specified'
            };

            emailjs.send(
                window.env.EMAILJS_JOIN_SERVICE_ID,
                window.env.EMAILJS_JOIN_TEMPLATE_ID,
                formData
            ).then(() => {
                showCustomPrompt('Success', 'Membership application submitted successfully!');
                joinForm.reset();
            }).catch((error) => {
                console.error('Join Form Error:', error);
                showCustomPrompt('Error', 'Failed to submit application: ' + error.text, true);
            }).finally(() => {
                joinButton.textContent = 'Submit Application';
                joinButton.disabled = false;
            });
        });
    }

    // CONTACT FORM
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const contactButton = contactForm.querySelector('button[type="submit"]');

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            contactButton.textContent = 'Submitting...';
            contactButton.disabled = true;

            const formData = {
                name: contactForm.querySelector('input[name="name"]').value,
                email: contactForm.querySelector('input[name="email"]').value,
                subject: contactForm.querySelector('input[name="subject"]').value,
                message: contactForm.querySelector('textarea[name="message"]').value || 'No message provided'
            };

            emailjs.send(
                window.env.EMAILJS_CONTACT_SERVICE_ID,
                window.env.EMAILJS_CONTACT_TEMPLATE_ID,
                formData
            ).then(() => {
                showCustomPrompt('Success', 'Message sent successfully!');
                contactForm.reset();
            }).catch((error) => {
                console.error('Contact Form Error:', error);
                showCustomPrompt('Error', 'Failed to send message: ' + error.text, true);
            }).finally(() => {
                contactButton.textContent = 'Send Message';
                contactButton.disabled = false;
            });
        });
    }
});
