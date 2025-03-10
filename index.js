export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Definir las rutas a cachear
    const cachePaths = ["/", "/index.html"];

    if (cachePaths.includes(url.pathname)) {
      const cache = caches.default;
      let response = await cache.match(request);

      if (!response) {
        response = await fetch(request);
        let newResponse = new Response(response.body, response);
        newResponse.headers.set("Cache-Control", "public, max-age=600");
        newResponse.headers.set("X-Worker-Cache", "MISS");
        ctx.waitUntil(cache.put(request, newResponse.clone()));
        return newResponse;
      } else {
        let cachedResponse = new Response(response.body, response);
        cachedResponse.headers.set("X-Worker-Cache", "HIT");
        return cachedResponse;
      }
    }
    return fetch(request);
  }
};
