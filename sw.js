self.importScripts('cw2/main.js');

if('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
    };

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache);
        })
    );
});

var cacheName = 'manifest.json';
var appShellFiles = [
    '/desktop/cw2/english.png',
    '/desktop/cw2/History.png',
    '/desktop/cw2/IT.png',
    '/desktop/cw2/Math.png',
    '/desktop/cw2/Science.png',
    '/desktop/cw2/index.html',
    '/desktop/cw2/style.css',
    '/desktop/cw2/sw.js',

];


var gamesImages = [];
for (var i = 0; i < games.length; i++) {
    gamesImages.push('data/img/' + games[i].slug + '.jpg');
}
var contentToCache = appShellFiles.concat(gamesImages);

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install'); e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all: app shell and content');
            return cache.addAll(contentToCache);
        })
    );
});

self.addEventListener('fetch', (e) => {
    console.log('[Service Worker] Fetched resource ' + e.request.url);
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            console.log('[Service Worker] Fetching resource: ' + e.request.url);
            return r || fetch(e.request).then(function (response) {
                return caches.open(cacheName).then(function (cache) {
                    console.log('[Service Worker] Caching new resource: ' + e.request.url);
                    cache.put(e.request, response.clone());
                    return response;
                });
            });
        }));
});

var cacheName = 'manifest.json';

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('js13kPWA-v2').then((cache) => {
            return cache.addAll(contentToCache);
        })
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
