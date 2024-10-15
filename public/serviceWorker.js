const CACHE_NAME = 'curated-finds-cache-v1';
const urlsToCache = [
    '/',
    '/styles/globals.css',
];

/**
 * Installs the service worker and caches specified URLs.
 * This event is triggered when the service worker is installed.
 *
 * @param {InstallEvent} event - The install event.
 */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

/**
 * Activates the service worker and cleans up old caches.
 * This event is triggered when the service worker is activated.
 *
 * @param {ActivateEvent} event - The activate event.
 */
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

/**
 * Handles fetch events to serve cached responses or fetch new ones.
 * If the requested resource is in the cache, it returns the cached response.
 * Otherwise, it fetches the resource from the network and caches it.
 *
 * @param {FetchEvent} event - The fetch event.
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});

/**
 * Helper function to determine if a request is for an image.
 *
 * @param {Request} request - The fetch request.
 * @returns {boolean} - True if the request is for an image, false otherwise.
 */
function isImageRequest(request) {
    return request.url.match(/\.(jpg|jpeg|png|gif|svg)$/);
}

/**
 * Helper function to cache a response.
 * This function stores a response in the cache for the given request.
 *
 * @param {Request} request - The fetch request to cache the response for.
 * @param {Response} response - The response to cache.
 */
function cacheResponse(request, response) {
    const responseToCache = response.clone();
    caches.open(CACHE_NAME).then((cache) => {
        cache.put(request, responseToCache);
    });
}