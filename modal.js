// modal.js

class Modal {
    /**
     * Creates and displays a modal.
     * @param {Object} config - Modal configuration.
     * @param {string} [config.title=''] - Modal title.
     * @param {string} [config.content=''] - HTML content inside the modal.
     * @param {Array<Object>} [config.buttons=[]] - Button configurations.
     * @param {Object} [config.options={}] - Additional modal options.
     * @param {string} [config.options.size='small'] - Modal size ('small', 'medium', 'large').
     * @param {boolean} [config.options.showCloseButton=true] - Show close button.
     * @param {boolean} [config.options.escToClose=true] - Close on Escape key.
     * @param {boolean} [config.options.closeOnOutsideClick=true] - Close on outside click.
     * @param {function} [config.options.onClose] - Callback on modal close.
     */
    static _create({ title = '', content = '', buttons = [], options = {} }) {
        // Close any existing modal
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
            closeBtn.addEventListener('click', () => Modal.close());
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
        // WARNING: Using innerHTML can expose to XSS attacks if content is not sanitized.
        // Use textContent if the content does not require HTML.
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

        // Close on Escape key if enabled
        if (options.escToClose !== false) {
            window.addEventListener('keydown', Modal._onKeyDown, { once: true });
        }

        // Close modal when clicking outside of it if enabled
        if (options.closeOnOutsideClick !== false) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    Modal.close();
                }
            }, { once: true });
        }

        // Set up the custom close logic
        Modal._close = () => {
            if (options.onClose) options.onClose();
            Modal._closeInternal();
        };
    }

    /**
     * Handles Escape key press to close the modal.
     * @param {KeyboardEvent} e - Keydown event.
     */
    static _onKeyDown(e) {
        if (e.key === 'Escape') Modal.close();
    }

    /**
     * Closes the modal if it exists.
     */
    static close() {
        if (Modal._close) {
            Modal._close();
        } else {
            Modal._closeInternal();
        }

        // Ensure all event listeners are removed
        window.removeEventListener('keydown', Modal._onKeyDown);
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            overlay.removeEventListener('click', Modal._onOverlayClick);
        }
    }

    /**
     * Handles raw modal closure logic.
     * @param {function} [onClose] - Callback after modal is closed.
     */
    static _closeInternal(onClose) {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) {
            const modal = overlay.querySelector('.modal-container');

            if (modal) {
                modal.classList.add('closing'); // Add animation
                modal.addEventListener('animationend', () => {
                    overlay.remove();
                    if (onClose) onClose(); // Call onClose after removal
                }, { once: true });
            } else {
                overlay.remove();
                if (onClose) onClose(); // Call onClose if no modal
            }
        } else {
            //console.warn('Modal._closeInternal: No overlay found to close.');
        }

        window.removeEventListener('keydown', Modal._onKeyDown);
        Modal._close = null; // Reset custom close logic
    }

    /**
     * Displays an alert modal.
     * @param {string} message - Message to display.
     * @param {string} [title='Information'] - Modal title.
     * @param {Object} [options={}] - Additional modal options.
     * @returns {Promise<void>} Resolves when OK is clicked.
     */
    static alert(message, title = 'Information', options = {}) {
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
                ],
                options
            });
        });
    }

    /**
     * Displays a confirmation modal.
     * @param {string} message - Confirmation message.
     * @param {string} [title='Confirm'] - Modal title.
     * @param {Object} [options={}] - Additional modal options.
     * @returns {Promise<boolean>} Resolves true if confirmed, false otherwise.
     */
    static confirm(message, title = 'Confirm', options = {}) {
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
                ],
                options
            });
        });
    }

    /**
     * Displays a fully customizable modal.
     * @param {Object} config - Modal configuration (see _create parameters).
     */
    static custom(config) {
        Modal._create(config);
    }

    /**
     * Initializes a modal from an existing DOM element.
     * @param {string} id - ID of the existing modal element.
     * @param {Object} [options={}] - Modal options.
     * @param {boolean} [options.showCloseButton=true] - Show close button.
     * @param {boolean} [options.escToClose=true] - Close on Escape key.
     * @param {boolean} [options.closeOnOutsideClick=true] - Close on outside click.
     * @param {function} [options.onClose] - Callback on modal close.
     */
    static fromId(id, options = {}) {
        // Close any existing modal
        Modal.close();

        const existingModal = document.getElementById(id);
        if (!existingModal) {
            console.warn(`Modal.fromId: no element found with ID "${id}"`);
            return;
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');

        // Apply modal container class
        existingModal.classList.add('modal-container');

        // Remove the display:none style if it exists
        if (existingModal.style.display === 'none') {
            existingModal.style.display = '';
        }

        // Optionally add the top-right close button
        const showCloseButton = options.showCloseButton !== false;
        if (showCloseButton && !existingModal.querySelector('.modal-close-btn')) {
            const closeBtn = document.createElement('button');
            closeBtn.classList.add('modal-close-btn');
            closeBtn.innerHTML = '&times;';
            closeBtn.addEventListener('click', () => Modal.close());
            existingModal.appendChild(closeBtn);
        }

        // Save the original parent and next sibling of the modal for restoration
        const originalParent = existingModal.parentElement;
        const nextSibling = existingModal.nextSibling;

        // Append the modal to the overlay and the overlay to the document
        overlay.appendChild(existingModal);
        document.body.appendChild(overlay);

        // Set up the custom close logic
        Modal._close = () => {
            if (originalParent) {
                originalParent.insertBefore(existingModal, nextSibling);
                existingModal.style.display = 'none';
            }
            Modal._closeInternal(options.onClose);
        };

        // Handle Escape key to close the modal
        if (options.escToClose !== false) {
            window.addEventListener('keydown', Modal._onKeyDown, { once: true });
        }

        // Close modal when clicking outside of it
        Modal._onOverlayClick = (e) => {
            if (e.target === overlay) Modal.close();
        };
        overlay.addEventListener('click', Modal._onOverlayClick, { once: true });
    }
}

export default Modal;
