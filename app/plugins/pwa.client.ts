/**
 * PWA Service Worker Registration Plugin (client-only)
 * Registers the service worker and handles update prompts.
 */
export default defineNuxtPlugin(() => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Register service worker after page loads
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[PWA] Service Worker registered:', registration.scope);

      // Check for updates every 60 minutes
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);

      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
            // New version available — show update toast
            showUpdateToast();
          }
        });
      });
    } catch (error) {
      console.warn('[PWA] Service Worker registration failed:', error);
    }
  });
});

/**
 * Shows a non-intrusive toast notification when a new version is available
 */
function showUpdateToast() {
  const toast = document.createElement('div');
  toast.id = 'pwa-update-toast';
  toast.innerHTML = `
    <div style="
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      border-radius: 16px;
      background: rgba(0, 36, 60, 0.92);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      color: #fff;
      font-family: 'Inter', sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    ">
      <span style="font-size: 13px; opacity: 0.9;">Versi baru tersedia!</span>
      <button onclick="window.location.reload()" style="
        border: none;
        background: linear-gradient(135deg, #7b5900 0%, #fcca66 100%);
        color: #00243c;
        font-family: 'Inter', sans-serif;
        font-size: 13px;
        font-weight: 700;
        padding: 8px 16px;
        border-radius: 10px;
        cursor: pointer;
        white-space: nowrap;
      ">Perbarui</button>
    </div>
  `;

  // Inject slide-up animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
}
