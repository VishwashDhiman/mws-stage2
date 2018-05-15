// Setting up storage of data in Cache memory for offline use
var CACHE_VERSION = 'restaurant-reviews';
//Adding default files to store in cache
var CACHE_FILES = [
	'/',
	'/index.html',
	'/manifest.json',
	'/restaurant.html',
	'/css/styles.css',
	'/js/dbhelper.js',
	'/js/main.js',
	'/js/indexedDB.js',
	'/js/restaurant_info.js',
	'/img/1.webp',
	'/img/2.webp',
	'/img/3.webp',
	'/img/4.webp',
	'/img/5.webp',
	'/img/6.webp',
	'/img/7.webp',
	'/img/8.webp',
	'/img/9.webp',
	'/img/10.webp',
	'/img/192x192.jpg',
	'/img/512x512.jpg',
];
//Installing Service Worker to store data
self.addEventListener('install', function (event) {
	event.waitUntil(
		caches.open(CACHE_VERSION).then(function (cache) {
			return cache.addAll(CACHE_FILES);
		})
	);
});
//Fetching data from memory
self.addEventListener('fetch', function (event) {
	event.respondWith(caches.match(event.request).then(function (response) {
		if (response !== undefined) {
			return response;
		} else {
			return fetch(event.request).then(function (response) {
				var responseClone = response.clone();
				caches.open(CACHE_VERSION).then(function (cache) {
					cache.put(event.request, responseClone);
				});
				return response;
			});
		}
	}));
});
//Activating the Service Worker
self.addEventListener('activate', function (event) {
	event.waitUntil(
		caches.keys().then(function (keys) {
			return Promise.all(keys.map(function (key, i) {
				if (key !== CACHE_VERSION) {
					return caches.delete(keys[i]);
				}
			}));
		})
	);
});
