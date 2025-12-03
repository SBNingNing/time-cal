const CACHE_NAME = 'magictime-v1';
const ASSETS = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './utils/timeUtils.ts',
  './components/CalcButton.tsx',
  './components/Display.tsx',
  'https://cdn.tailwindcss.com'
];

// 安装 Service Worker 并缓存资源
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 拦截网络请求：如果有缓存则使用缓存（离线模式），否则请求网络
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});