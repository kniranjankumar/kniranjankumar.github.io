// Service Worker for SF Chronicles PWA
const CACHE_NAME = 'sf-chronicles-v1';

// Install event
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // Focus existing window or open new one
            for (const client of clientList) {
                if (client.url.includes('/bday2026/') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/bday2026/');
            }
        })
    );
});

// Receive push messages
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || '🔓 New Chapter Unlocked!';
    const options = {
        body: data.body || 'A new chapter is now available.',
        icon: 'map_background.png',
        badge: 'map_background.png',
        vibrate: [200, 100, 200],
        tag: 'chapter-unlock',
        renotify: true
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Message handler for showing notifications from main page
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body } = event.data;
        self.registration.showNotification(title, {
            body: body,
            icon: 'map_background.png',
            badge: 'map_background.png',
            vibrate: [200, 100, 200],
            tag: 'chapter-unlock',
            renotify: true
        });
    }
});
