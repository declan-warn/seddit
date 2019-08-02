(async function() {
    if (Notification.permission === "default") {
        await Notification.requestPermission();
    } else if (Notification.permission === "denied") {
        alert("Notifications blocked. Please enable them.");
    }

    
})();