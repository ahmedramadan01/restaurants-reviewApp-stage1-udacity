var cache_name = "restaurantsReview-v1";
var urlsToCahce = [
  '/',
  'index.html',
  'restaurant.html',
  'js/main.js',
  'js/restaurant_info.js',
  'js/dbhelper.js',
  'css/styles.css',
]
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cache_name)
    .then(function(cache){
      console.log('opened cache');
      return cache.addAll(urlsToCahce);
    })
  )
});

addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;     // if valid response is found in cache return it
        } else {
          return fetch(event.request)     //fetch from internet
            .then(function(res) {
              return caches.open(cache_name)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());    //save the response for future
                  return res;   // return the fetched data
                })
            })
            .catch(function(err) {       // fallback mechanism
              return caches.open(CACHE_CONTAINING_ERROR_MESSAGES)
                .then(function(cache) {
                  return cache.match('/offline.html');
                });
            });
        }
      })
  );
});
