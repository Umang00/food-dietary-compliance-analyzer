// Food Scanner UI Mockup - Interactive Script

document.addEventListener('DOMContentLoaded', function () {
    // Toggle switches functionality
    const toggles = document.querySelectorAll('.toggle input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function () {
            const parent = this.closest('.toggle');
            if (this.checked) {
                parent.classList.add('active');
            } else {
                parent.classList.remove('active');
            }
        });
    });

    // Community card selection
    const communityCards = document.querySelectorAll('.community-card');
    communityCards.forEach(card => {
        card.addEventListener('click', function () {
            // Remove selected from all cards
            communityCards.forEach(c => {
                c.classList.remove('selected');
                const checkmark = c.querySelector('.checkmark');
                if (checkmark) checkmark.remove();
            });

            // Add selected to clicked card
            this.classList.add('selected');

            // Add checkmark if not present
            if (!this.querySelector('.checkmark')) {
                const checkmark = document.createElement('div');
                checkmark.className = 'checkmark';
                checkmark.textContent = '✓';
                this.appendChild(checkmark);
            }
        });
    });

    // Smooth scroll for navigation
    const navLinks = document.querySelectorAll('.screen-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Password toggle visibility
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(btn => {
        btn.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = '🙈';
            } else {
                input.type = 'password';
                this.textContent = '👁️';
            }
        });
    });

    // Animate processing bar on scroll into view
    const processingBars = document.querySelectorAll('.processing-bar');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate the progress bar
                const bar = entry.target;
                let width = 0;
                const interval = setInterval(() => {
                    if (width >= 95) {
                        clearInterval(interval);
                    } else {
                        width += 5;
                        bar.style.width = width + '%';

                        // Update status text based on progress
                        const statusText = bar.closest('.processing-content')?.querySelector('.processing-status');
                        const percentText = bar.closest('.processing-content')?.querySelector('.processing-percent');

                        if (percentText) {
                            percentText.textContent = width + '%';
                        }

                        if (statusText) {
                            if (width < 20) {
                                statusText.textContent = 'Compressing images...';
                            } else if (width < 40) {
                                statusText.textContent = 'Uploading...';
                            } else if (width < 60) {
                                statusText.textContent = 'Extracting ingredients...';
                            } else if (width < 80) {
                                statusText.textContent = 'Checking dietary rules...';
                            } else {
                                statusText.textContent = 'Finalizing results...';
                            }
                        }
                    }
                }, 100);
            }
        });
    }, { threshold: 0.5 });

    processingBars.forEach(bar => observer.observe(bar));

    // Button click feedback
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Expand/collapse buttons
    const expandBtns = document.querySelectorAll('.expand-btn');
    expandBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const isExpanded = this.textContent.startsWith('▼');
            if (isExpanded) {
                this.textContent = this.textContent.replace('▼', '▶');
            } else {
                this.textContent = this.textContent.replace('▶', '▼');
            }
        });
    });

    // Camera capture button animation
    const captureBtn = document.querySelector('.capture-btn');
    if (captureBtn) {
        captureBtn.addEventListener('click', function () {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    }

    // Date section collapse
    const dateHeaders = document.querySelectorAll('.date-header');
    dateHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const cards = this.parentElement.querySelectorAll('.scan-card');
            const icon = this.textContent.startsWith('▼') ? '▶' : '▼';
            const text = this.textContent.substring(2);
            this.textContent = icon + ' ' + text;

            cards.forEach(card => {
                card.style.display = icon === '▶' ? 'none' : 'flex';
            });
        });
    });

    // Search box functionality (filter restriction items)
    const searchBoxes = document.querySelectorAll('.search-box input');
    searchBoxes.forEach(searchBox => {
        searchBox.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const restrictionItems = this.closest('.screen-content').querySelectorAll('.restriction-item');

            restrictionItems.forEach(item => {
                const name = item.querySelector('.restriction-name').textContent.toLowerCase();
                item.style.display = name.includes(searchTerm) ? 'flex' : 'none';
            });
        });
    });

    // Bottom nav interaction
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            const parentNav = this.closest('.bottom-nav');
            parentNav.querySelectorAll('.nav-item').forEach(nav => {
                nav.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    console.log('🥫 Food Scanner UI Mockup loaded successfully!');
    console.log('Scroll down to view all screens. Click on elements to see interactions.');
});
