/* eslint-env serviceworker */
const CACHE_NAME = 'one-finger-pinball'
const ASSETS = [
  '/one-finger-pinball/',
  '/one-finger-pinball/index.html',
  '/one-finger-pinball/favicon.ico',
  '/one-finger-pinball/js/builder.js',
  '/one-finger-pinball/js/physics.js',
  '/one-finger-pinball/js/script.js',
  '/one-finger-pinball/css/style.css'
]

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', installEvent => {
  installEvent.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME)
    cache.addAll(ASSETS)
  })())
})

self.addEventListener('fetch', fetchEvent => {
  /*
  fetchEvent.waitUntil(
    (async () => {
      // Exit early if we don't have access to the client.
      // Eg, if it's cross-origin.
      if (!fetchEvent.clientId) return;

      // Get the client.
      const client = await self.clients.get(fetchEvent.clientId);
      // Exit early if we don't get the client.
      // Eg, if it closed.
      if (!client) return;

      // Send a message to the client.
      client.postMessage({
        msg: "Hey I just got a fetch from you!",
        url: fetchEvent.request.url,
        variable: "client"
      });
    })(),
  );
  */
  fetchEvent.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME)

    // Get the resource from the cache.
    const cachedResponse = await cache.match(fetchEvent.request)
    if (cachedResponse) {
      return cachedResponse
    } else {
      try {
        // If the resource was not in the cache, try the network.
        const fetchResponse = await fetch(fetchEvent.request)

        // Save the resource in the cache and return it.
        cache.put(fetchEvent.request, fetchResponse.clone())
        return fetchResponse
      } catch (e) {
        // The network failed.
      }
    }
  })())
})
