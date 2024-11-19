if (reminder.length > 0) {
    const notificationMessages = reminder
        .map(notification => `<li>${notification.message}</li>`)
        .join("");

    Swal.fire({
        title: "Appointment Reminders",
        html: `<ul>${notificationMessages}</ul>`,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Confirm Reminder",
        cancelButtonText: "Remind Me Tomorrow"
    }).then(async result => {
        if (result.isConfirmed) {
            for (const notification of reminder) {
                await markNotificationAsRead(notification.id);
            }
            Swal.fire("Confirmed!", "Your reminders have been marked as read.", "success");
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire("Noted!", "We will remind you tomorrow.", "info");
        }
    });
}

async function markNotificationAsRead(notificationId) {
    try {
        const response = await fetch(`/rest/notifications/${notificationId}/mark-as-read`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ readState: false })
        });

        if (!response.ok) {
            console.error(`Failed to update notification ${notificationId}`);
        }
    } catch (error) {
        console.error(`Error updating notification ${notificationId}:`, error);
    }
}
