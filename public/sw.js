// Service Worker for K8sTroubleshoot
// Handles offline caching and progress synchronization

const CACHE_NAME = "k8s-troubleshoot-v1";
const urlsToCache = [
  "/",
  "/dashboard",
  "/scenarios",
  "/achievements",
  "/offline.html",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch(() => {
        // Ignore cache errors during install
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network first, then cache
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // API requests - network first with cache fallback
  if (request.url.includes("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful API responses
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Return cached response if network fails
          return caches.match(request);
        })
    );
    return;
  }

  // Static assets - cache first
  if (
    request.url.includes(".js") ||
    request.url.includes(".css") ||
    request.url.includes(".png") ||
    request.url.includes(".jpg") ||
    request.url.includes(".svg")
  ) {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // HTML - network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((response) => {
          if (response) {
            return response;
          }
          // Return offline page if nothing cached
          return caches.match("/offline.html");
        });
      })
  );
});

// Background Sync - Sync progress when online
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-progress") {
    event.waitUntil(syncProgressData());
  }
});

async function syncProgressData() {
  try {
    const db = await openIndexedDB();
    const pendingUpdates = await getPendingUpdates(db);

    for (const update of pendingUpdates) {
      try {
        const response = await fetch("/api/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
        });

        if (response.ok) {
          await removePendingUpdate(db, update.id);
        }
      } catch (error) {
        console.error("Failed to sync progress:", error);
      }
    }
  } catch (error) {
    console.error("Progress sync failed:", error);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("K8sTroubleshoot", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("pendingUpdates")) {
        db.createObjectStore("pendingUpdates", { keyPath: "id" });
      }
    };
  });
}

function getPendingUpdates(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pendingUpdates"], "readonly");
    const store = transaction.objectStore("pendingUpdates");
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removePendingUpdate(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["pendingUpdates"], "readwrite");
    const store = transaction.objectStore("pendingUpdates");
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// Message handler for client-to-worker communication
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SAVE_PROGRESS_OFFLINE") {
    saveProgressOffline(event.data.progress);
  }
});

async function saveProgressOffline(progressData) {
  try {
    const db = await openIndexedDB();
    const transaction = db.transaction(["pendingUpdates"], "readwrite");
    const store = transaction.objectStore("pendingUpdates");
    const id = `${Date.now()}-${Math.random()}`;

    store.add({
      id,
      ...progressData,
      timestamp: Date.now(),
    });

    // Request background sync
    if (self.registration && self.registration.sync) {
      await self.registration.sync.register("sync-progress");
    }
  } catch (error) {
    console.error("Failed to save progress offline:", error);
  }
}
