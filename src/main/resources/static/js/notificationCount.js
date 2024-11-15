document.addEventListener("DOMContentLoaded", function () {
    const notificationBadge = document.querySelector('.notification-badge');
    const notificationList = document.querySelector('.dropdown-menu');
    const noNotificationsMessage = document.getElementById('no-notifications-message');
    const notificationDropdown = document.querySelector('.dropdown-toggle');

    function getTimeElapsed(dateString, timeString) {
        const notificationDate = new Date(dateString + 'T' + timeString);
        const now = new Date();
        const seconds = Math.floor((now - notificationDate) / 1000);

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const elapsed = Math.floor(seconds / secondsInUnit);
            if (elapsed > 1) return `hace ${elapsed} ${unit}s`;
            if (elapsed === 1) return `hace 1 ${unit}`;
        }
        return 'hace unos segundos';
    }

    function updateNotificationCount() {
        const notifications = document.querySelectorAll('.dropdown-menu li[id^="notification-"]');
        const appointmentCount = notifications.length;

        if (appointmentCount > 0) {
            notificationBadge.style.display = 'block';
            notificationBadge.textContent = appointmentCount;
            noNotificationsMessage.style.display = 'none';
        } else {
            notificationBadge.style.display = 'none';
            noNotificationsMessage.style.display = 'block';
        }
    }

    document.querySelectorAll('.time-elapsed').forEach(span => {
        const date = span.getAttribute('data-date');
        const time = span.getAttribute('data-time');
        span.textContent = getTimeElapsed(date, time);
    });

    updateNotificationCount();

    notificationList.addEventListener('click', function (event) {
        if (event.target && event.target.classList.contains('close-btn')) {
            const notificationElement = event.target.closest('li');
            if (notificationElement) {
                notificationElement.remove();
                updateNotificationCount();
                event.stopPropagation();
            }
        }
    });

    notificationDropdown.addEventListener('click', function (event) {
        const notifications = document.querySelectorAll('.dropdown-menu li[id^="notification-"]');
        if (notifications.length === 0) {
            event.stopPropagation();
        }
    });
});
