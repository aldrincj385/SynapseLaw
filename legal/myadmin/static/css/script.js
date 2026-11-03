// Mobile menu toggle
document.querySelector('.mobile-menu').addEventListener('click', function() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
});

// Demo upload button functionality
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        if (this.classList.contains('upload-btn') ||
            this.classList.contains('sample-upload-btn')) {

            // Create file input element
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.pdf,.docx,.txt,.rtf';

            fileInput.addEventListener('change', function() {
                if (this.files && this.files[0]) {
                    const fileName = this.files[0].name;

                    // Simulate analysis loading
                    const resultDiv = document.getElementById('analysis-result');
                    const originalContent = resultDiv.innerHTML;

                    resultDiv.innerHTML = `
                        <div class="loading-analysis">
                            <p><i class="fas fa-spinner fa-spin"></i> Analyzing "${fileName}"...</p>
                            <p>This may take a moment.</p>
                            <div class="progress-bar">
                                <div class="progress-fill"></div>
                            </div>
                        </div>
                    `;

                    // Animate progress bar
                    const progressFill = document.querySelector('.progress-fill');
                    let width = 0;
                    const interval = setInterval(() => {
                        if (width >= 100) {
                            clearInterval(interval);

                            // Show analysis results after "completion"
                            setTimeout(() => {
                                resultDiv.innerHTML = originalContent;
                                showNotification('Analysis completed successfully!', 'success');
                            }, 500);
                        } else {
                            width += 10;
                            progressFill.style.width = width + '%';
                        }
                    }, 150);
                }
            });

            fileInput.click();
        }

        if (this.classList.contains('demo-btn')) {
            showNotification('Opening demo video...', 'info');
        }

        if (this.classList.contains('trial-btn')) {
            showNotification('Starting your free trial...', 'success');
        }

        if (this.classList.contains('schedule-btn')) {
            showNotification('Redirecting to scheduling page...', 'info');
        }
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            document.querySelector('.nav-links').classList.remove('active');
        }
    });
});

// Notification function
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;

    // Add styles for notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background-color: var(--card-bg);
            color: var(--light);
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            border-left: 4px solid var(--secondary);
            animation: slideIn 0.3s ease-out;
        }
        
        .notification-success {
            border-left-color: #4ade80;
        }
        
        .notification-info {
            border-left-color: var(--accent);
        }
        
        .notification-close {
            background: none;
            border: none;
            color: var(--gray);
            cursor: pointer;
            font-size: 1rem;
        }
        
        .notification-close:hover {
            color: var(--light);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .progress-bar {
            width: 100%;
            height: 6px;
            background-color: var(--border-color);
            border-radius: 3px;
            margin-top: 10px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background-color: var(--accent);
            width: 0%;
            transition: width 0.3s;
            border-radius: 3px;
        }
        
        .loading-analysis {
            text-align: center;
            padding: 20px 0;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(notification);

    // Add close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add slideOut animation
const slideOutStyle = document.createElement('style');
slideOutStyle.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(slideOutStyle);

// Add hover effect to feature cards on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Observe feature cards and steps
document.querySelectorAll('.feature-card, .step').forEach(el => {
    observer.observe(el);
});

// Theme toggle functionality (optional)
const themeToggle = document.createElement('button');
themeToggle.className = 'theme-toggle';
themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
themeToggle.title = 'Toggle Light/Dark Mode';
themeToggle.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: var(--secondary);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    transition: all 0.3s;
`;

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    if (document.body.classList.contains('light-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        themeToggle.title = 'Switch to Dark Mode';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Switch to Light Mode';
    }
});

document.body.appendChild(themeToggle);

// Add light mode styles
const lightModeStyles = document.createElement('style');
lightModeStyles.textContent = `
    body.light-mode {
        --primary: #f8f9fa;
        --secondary: #2d6bc9;
        --accent: #e63946;
        --light: #212529;
        --dark: #f8f9fa;
        --gray: #6c757d;
        --light-blue: #e8f4fd;
        --card-bg: white;
        --border-color: #dee2e6;
        --dark-blue: #f1f3f5;
    }
    
    body.light-mode .hero {
        background: linear-gradient(135deg, var(--light-blue) 0%, white 100%);
    }
    
    body.light-mode .hero-text h1 {
        background: linear-gradient(90deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    body.light-mode .steps::before {
        background-color: var(--light-blue);
    }
`;
document.head.appendChild(lightModeStyles);