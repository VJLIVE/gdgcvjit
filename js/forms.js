document.addEventListener('DOMContentLoaded', () => {
    // Initialize EmailJS with your Public Key
    emailjs.init('EAL3cdw9Tk1yzhBll'); // Double-check this key

    // Function to show custom prompt
    const showCustomPrompt = (title, message, isError = false) => {
        const prompt = document.getElementById('custom-prompt');
        const promptTitle = document.getElementById('prompt-title');
        const promptMessage = document.getElementById('prompt-message');
        const promptClose = document.getElementById('prompt-close');

        // Set title and message
        promptTitle.textContent = title;
        promptMessage.textContent = message;

        // Change styling based on success or error
        if (isError) {
            promptTitle.classList.remove('text-gray-900');
            promptTitle.classList.add('text-red-600');
            promptClose.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            promptClose.classList.add('bg-red-600', 'hover:bg-red-700');
        } else {
            promptTitle.classList.remove('text-red-600');
            promptTitle.classList.add('text-gray-900');
            promptClose.classList.remove('bg-red-600', 'hover:bg-red-700');
            promptClose.classList.add('bg-blue-600', 'hover:bg-blue-700');
        }

        // Show the prompt
        prompt.classList.remove('hidden');

        // Close the prompt when the button is clicked
        promptClose.addEventListener('click', () => {
            prompt.classList.add('hidden');
        });

        // Close on clicking outside the prompt
        prompt.addEventListener('click', (e) => {
            if (e.target === prompt) {
                prompt.classList.add('hidden');
            }
        });
    };

    // Join Form
    const joinForm = document.getElementById('join-form');
    if (joinForm) {
        const joinButton = joinForm.querySelector('button[type="submit"]');
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Change button text and disable it
            joinButton.textContent = 'Submitting...';
            joinButton.disabled = true;

            // Get the input elements directly
            const fullNameInput = joinForm.querySelector('input[name="full-name"]');
            const emailInput = joinForm.querySelector('input[name="email"]');
            const yearSelect = joinForm.querySelector('select[name="year"]');
            const branchInput = joinForm.querySelector('input[name="branch"]');
            const interestTextarea = joinForm.querySelector('textarea[name="interest"]');

            // Log the elements and their values for debugging
            console.log('Full Name Element:', fullNameInput, 'Value:', fullNameInput ? fullNameInput.value : 'Not found');
            console.log('Email Element:', emailInput, 'Value:', emailInput ? emailInput.value : 'Not found');
            console.log('Year Element:', yearSelect, 'Value:', yearSelect ? yearSelect.value : 'Not found');
            console.log('Branch Element:', branchInput, 'Value:', branchInput ? branchInput.value : 'Not found');
            console.log('Interest Element:', interestTextarea, 'Value:', interestTextarea ? interestTextarea.value : 'Not found');

            const formData = {
                full_name: fullNameInput ? fullNameInput.value : '',
                email: emailInput ? emailInput.value : '',
                year: yearSelect ? yearSelect.value : '',
                branch: branchInput ? branchInput.value : '',
                interest: interestTextarea ? interestTextarea.value || 'Not specified' : 'Not specified'
            };

            console.log('Join Form Data:', formData);

            emailjs.send('service_9jz7p95', 'template_n6363sp', formData)
                .then(() => {
                    showCustomPrompt('Success', 'Membership application submitted successfully!');
                    joinForm.reset();
                })
                .catch((error) => {
                    console.error('Join Form Error:', error);
                    showCustomPrompt('Error', 'Failed to submit application: ' + error.text, true);
                })
                .finally(() => {
                    // Revert button text and enable it
                    joinButton.textContent = 'Submit Application';
                    joinButton.disabled = false;
                });
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const contactButton = contactForm.querySelector('button[type="submit"]');
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Change button text and disable it
            contactButton.textContent = 'Submitting...';
            contactButton.disabled = true;

            const nameInput = contactForm.querySelector('input[name="name"]');
            const emailInput = contactForm.querySelector('input[name="email"]');
            const subjectInput = contactForm.querySelector('input[name="subject"]');
            const messageTextarea = contactForm.querySelector('textarea[name="message"]');

            console.log('Name Element:', nameInput, 'Value:', nameInput ? nameInput.value : 'Not found');
            console.log('Email Element:', emailInput, 'Value:', emailInput ? emailInput.value : 'Not found');
            console.log('Subject Element:', subjectInput, 'Value:', subjectInput ? subjectInput.value : 'Not found');
            console.log('Message Element:', messageTextarea, 'Value:', messageTextarea ? messageTextarea.value : 'Not found');

            const formData = {
                name: nameInput ? nameInput.value : '',
                email: emailInput ? emailInput.value : '',
                subject: subjectInput ? subjectInput.value : '',
                message: messageTextarea ? messageTextarea.value || 'No message provided' : 'No message provided'
            };

            console.log('Contact Form Data:', formData);

            // emailjs.send('service_zvsckfg', 'template_zrdtkdt', formData)
            //     .then(() => {
            //         showCustomPrompt('Success', 'Message sent successfully!');
            //         contactForm.reset();
            //     })
            //     .catch((error) => {
            //         console.error('Contact Form Error:', error);
            //         showCustomPrompt('Error', 'Failed to send message: ' + error.text, true);
            //     })
            //     .finally(() => {
            //         // Revert button text and enable it
            //         contactButton.textContent = 'Send Message';
            //         contactButton.disabled = false;
            //     });
        });
    }
});