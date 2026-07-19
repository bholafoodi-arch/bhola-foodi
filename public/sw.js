self.addEventListener("push", (event) => {
  let data = { title: "Bhola Foodi", body: "New update received." };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.error("Error parsing push data:", e);
    if (event.data) {
      data = { title: "Bhola Foodi", body: event.data.text() };
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=192",
    badge: data.badge || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=96",
    vibrate: [200, 100, 200],
    data: {
      url: data.data?.url || "/dashboard?tab=orders"
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || "/dashboard?tab=orders";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If there is an open window, navigate/focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus().then((focusedClient) => {
            if ("navigate" in focusedClient) {
              return focusedClient.navigate(targetUrl);
            }
          });
        }
      }
      // If no open window, open a new one
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
