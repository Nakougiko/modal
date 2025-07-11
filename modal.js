// modal.js

class Modal {
    /**
     * Internal method to create the modal
     * @param {Object} config - Modal configuration
     */
    static _create({ title = '', content = '', buttons = [], options = {} }) {
        // Remove any existing modal
        Modal.close();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');

        // Create modal container
        const modal = document.createElement('div');
        modal.classList.add('modal-container');

        // Apply size class if specified
        const size = options.size || 'small'; // Default to small if not specified
        modal.classList.add(`modal-${size}`); // e.g., modal-small

        // Add close (X) button in top-right if enabled (default: true)
        const showCloseButton = options.showCloseButton !== false;
        if (showCloseButton) {
            const closeBtn = document.createElement('button');
            closeBtn.classList.add('modal-close-btn');
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', Modal.close);
            modal.appendChild(closeBtn);
        }

        // Add title if provided
        if (title) {
            const header = document.createElement('div');
            header.classList.add('modal-header');
            header.innerHTML = `<h2>${title}</h2>`;
            modal.appendChild(header);
        }

        // Add content
        const body = document.createElement('div');
        body.classList.add('modal-body');
        body.innerHTML = content;
        modal.appendChild(body);

        // Add buttons if provided
        if (buttons.length > 0) {
            const footer = document.createElement('div');
            footer.classList.add('modal-footer');

            buttons.forEach(btn => {
                const button = document.createElement('button');
                button.textContent = btn.text;
                button.classList.add(...(btn.classes || []));
                button.onclick = () => {
                    if (btn.onClick) btn.onClick();
                    if (btn.closeOnClick !== false) Modal.close();
                };
                footer.appendChild(button);
            });

            modal.appendChild(footer);
        }

        // Append modal to overlay and to body
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Close on Escape key
        window.addEventListener('keydown', Modal._onKeyDown);

        // Close modal when clicking outside of it
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                Modal.close();
            }
        });
    }

    /**
     * Handles Escape key press
     */
    static _onKeyDown(e) {
        if (e.key === 'Escape') Modal.close();
    }

    /**
     * Closes the modal if it exists
     */
    static close() {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            const modal = overlay.querySelector('.modal-container');

            if (modal) {
                modal.classList.add('closing'); // Ajout de l'animation
                modal.addEventListener('animationend', () => {
                    overlay.remove();
                }, { once: true });
            } else {
                overlay.remove();
            }
        }

        window.removeEventListener('keydown', Modal._onKeyDown);
    }

    /**
     * Shows a simple alert modal
     * @param {string} message - Message to display
     * @param {string} title - Optional title
     * @returns {Promise<void>}
     */
    static alert(message, title = 'Information') {
        return new Promise(resolve => {
            Modal._create({
                title,
                content: `<p>${message}</p>`,
                buttons: [
                    {
                        text: 'OK',
                        classes: ['btn-primary'],
                        onClick: () => resolve()
                    }
                ]
            });
        });
    }

    /**
     * Shows a confirmation modal with Cancel / Confirm
     * @param {string} message - Confirmation message
     * @param {string} title - Optional title
     * @returns {Promise<boolean>} - true if confirmed, false if cancelled
     */
    static confirm(message, title = 'Confirm') {
        return new Promise(resolve => {
            Modal._create({
                title,
                content: `<p>${message}</p>`,
                buttons: [
                    {
                        text: 'Cancel',
                        classes: ['btn-secondary'],
                        onClick: () => resolve(false)
                    },
                    {
                        text: 'Confirm',
                        classes: ['btn-danger'],
                        onClick: () => resolve(true)
                    }
                ]
            });
        });
    }

    /**
     * Fully customizable modal
     * @param {Object} config - See _create() parameters
     */
    static custom(config) {
        Modal._create(config);
    }
}

export default Modal;
