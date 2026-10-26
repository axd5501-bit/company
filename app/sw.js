/*
 * 오프라인 캐시. 앱 파일을 바꾸면 VERSION 을 올려야 휴대폰에 새 버전이 반영된다.
 * (tests/pwa.test.js 가 ASSETS 목록과 실제 파일이 맞는지 확인한다)
 */
const VERSION = 'biztalk-v2.2.0';
const ASSETS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'fonts/PretendardVariable.woff2',
  'fonts/IBMPlexSans.woff2',
  'fonts/JetBrainsMono.woff2',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'icons/apple-touch-icon.png',
  'js/core.js',
  'js/data.js',
  'js/scenarios.js',
  'js/app.js',
  'js/views-learn.js',
  'js/views-practice.js',
  'js/views-ai.js',
  'js/views-more.js',
  'js/start.js',
  'vendor/anthropic-sdk.js'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(VERSION).then(function (cache) { return cache.addAll(ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (event) {
  const req = event.request;
  // AI API 등 외부 요청은 그대로 네트워크로
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then(function (hit) {
      return hit || fetch(req).then(function (res) {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then(function (cache) { cache.put(req, copy); });
        }
        return res;
      });
    })
  );
});
