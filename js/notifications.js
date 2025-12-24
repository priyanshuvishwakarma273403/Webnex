/**
 * Professional Notification System
 * Displays random user connections/activities
 */

const NOTIFICATION_CONFIG = {
    names: [
        "Alex Thompson", "Sarah Chen", "Marcus Rodriguez", "Emma Wilson",
        "David Kim", "Priya Patel", "James Sterling", "Sofia Rossi",
        "Michael Chang", "Lucas Silva", "Emily Baker", "Ryan O'Connor",
        "Nina Dubrova", "Hassan Ahmed", "Elena Costa", "Thomas Wright",
        "Yuki Tanaka", "Sophie Martin", "Oliver Scott", "Isabella Santos",
        "William Taylor", "Ava Johnson", "Benjamin Lee", "Mia Brown"
    ],
    locations: [
        "United States", "United Kingdom", "Canada", "Singapore",
        "Germany", "Australia", "India", "France",
        "Japan", "Brazil", "Netherlands", "Sweden",
        "UAE", "South Korea", "Italy", "Spain",
        "Switzerland", "Ireland", "New Zealand", "Norway"
    ],
    actions: [
        "Just connected via LinkedIn",
        "Started a new project",
        "Scheduled a consultation",
        "Requested a quote",
        "Just subscribed",
        "Connected with sales"
    ],
    minDelay: 8000,  // Minimum 8 seconds
    maxDelay: 18000, // Maximum 18 seconds
    displayDuration: 5000 // Show for 5 seconds
};

class NotificationSystem {
    constructor() {
        this.init();
    }

    init() {
        // Create container if not exists
        if (!document.querySelector('.connection-toast-container')) {
            const container = document.createElement('div');
            container.className = 'connection-toast-container';
            document.body.appendChild(container);
            this.container = container;
        } else {
            this.container = document.querySelector('.connection-toast-container');
        }

        // Start loop
        this.scheduleNext();
    }

    getRandomItem(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    generateContent() {
        const name = this.getRandomItem(NOTIFICATION_CONFIG.names);
        const location = this.getRandomItem(NOTIFICATION_CONFIG.locations);
        // Sometimes show just "Connected", sometimes specific action
        const action = Math.random() > 0.7
            ? this.getRandomItem(NOTIFICATION_CONFIG.actions)
            : "New Connection Established";

        return { name, location, action };
    }

    createToast() {
        const data = this.generateContent();

        const card = document.createElement('div');
        card.className = 'connection-card';

        card.innerHTML = `
            <div class="status-indicator"></div>
            <div class="toast-content">
                <div class="toast-message">${data.name}</div>
                <div class="toast-meta">
                    <span>${data.location}</span>
                    <span class="meta-dot"></span>
                    <span>${data.action === "New Connection Established" ? "Connected" : "Active"}</span>
                </div>
            </div>
        `;

        return card;
    }

    show() {
        // Remove existing toast if any
        const existing = this.container.querySelector('.connection-card');
        if (existing) {
            existing.classList.remove('active');
            setTimeout(() => existing.remove(), 600);
        }

        // Create and add new toast
        const toast = this.createToast();
        this.container.appendChild(toast);

        // Small delay to allow reflow for transition
        setTimeout(() => {
            toast.classList.add('active');
        }, 50);

        // Hide after duration
        setTimeout(() => {
            if (toast && toast.parentElement) {
                toast.classList.remove('active');
                setTimeout(() => {
                    if (toast.parentElement) toast.remove();
                }, 600);
            }
        }, NOTIFICATION_CONFIG.displayDuration);
    }

    scheduleNext() {
        const delay = Math.floor(
            Math.random() * (NOTIFICATION_CONFIG.maxDelay - NOTIFICATION_CONFIG.minDelay + 1)
        ) + NOTIFICATION_CONFIG.minDelay;

        setTimeout(() => {
            this.show();
            this.scheduleNext();
        }, delay);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NotificationSystem();
});
