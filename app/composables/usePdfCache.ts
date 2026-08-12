import { ref } from 'vue';
import { useBookCover } from './useBookCover';
import { useNetworkQuality } from './useNetworkQuality';
import type { Book } from './usePustakaApi';

const prefetchedPdfUrls = ref<Set<string>>(new Set());
const prefetchingCount = ref<number>(0);

export const usePdfCache = () => {
  const { extractPdfUrl, isEbookBook } = useBookCover();
  const { effectivePdfQuality, isSlowConnection } = useNetworkQuality();

  // Pre-fetch a single PDF URL into temporary session CacheStorage / browser HTTP cache
  const prefetchPdf = async (rawUrl: string): Promise<boolean> => {
    if (!rawUrl || !process.client) return false;

    const qualityParam = `&quality=${effectivePdfQuality.value}`;

    // Convert relative URL to full stream URL if needed
    const pdfUrl = rawUrl.startsWith('http') 
      ? `/api/pdf-stream?url=${encodeURIComponent(rawUrl)}${qualityParam}`
      : (rawUrl.includes('?') ? `${rawUrl}${qualityParam}` : `${rawUrl}?quality=${effectivePdfQuality.value}`);

    if (prefetchedPdfUrls.value.has(pdfUrl)) {
      return true; // Already cached in session
    }

    try {
      prefetchingCount.value++;
      
      // 1. Warm-up browser cache using fetch (with credentials cookie enabled)
      const res = await fetch(pdfUrl, {
        method: 'GET',
        cache: 'default',
        credentials: 'include',
        headers: {
          'X-Prefetch': '1'
        }
      });

      if (res.ok) {
        prefetchedPdfUrls.value.add(pdfUrl);

        // 2. Put into CacheStorage API if available (session lifetime)
        if ('caches' in window) {
          try {
            const cache = await caches.open('stah-pdf-session-v1');
            await cache.put(pdfUrl, res.clone());
          } catch (e) {}
        }
        return true;
      }
    } catch (err) {
      console.warn('PDF prefetch background info:', err);
    } finally {
      prefetchingCount.value = Math.max(0, prefetchingCount.value - 1);
    }

    return false;
  };

  // Pre-fetch list of E-Books on catalog page entry
  const prefetchCatalogPdfList = async (bookList: Book[]) => {
    if (!process.client || !bookList || !Array.isArray(bookList)) return;

    // Security check: Bypassed for unauthenticated guest users
    const hasToken = document.cookie.split('; ').some(row => row.startsWith('token=') || row.startsWith('auth_token=') || row.startsWith('pustaka_token='));
    if (!hasToken) return;

    // Filter E-Book items
    const ebooks = bookList.filter(b => isEbookBook(b));
    if (ebooks.length === 0) return;

    // Limit background prefetching to first 6 visible ebooks to save bandwidth
    const targetEbooks = ebooks.slice(0, 6);

    // Run idle prefetching sequentially or in small batch
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(async () => {
        for (const b of targetEbooks) {
          const pdfUrl = extractPdfUrl(b);
          if (pdfUrl) {
            await prefetchPdf(pdfUrl);
          }
        }
      });
    } else {
      setTimeout(async () => {
        for (const b of targetEbooks) {
          const pdfUrl = extractPdfUrl(b);
          if (pdfUrl) {
            await prefetchPdf(pdfUrl);
          }
        }
      }, 1000);
    }
  };

  // Clear cache manually or on session refresh
  const clearSessionCache = async () => {
    if (!process.client) return;
    prefetchedPdfUrls.value.clear();
    if ('caches' in window) {
      try {
        await caches.delete('stah-pdf-session-v1');
      } catch (e) {}
    }
  };

  return {
    prefetchedPdfUrls,
    prefetchingCount,
    prefetchPdf,
    prefetchCatalogPdfList,
    clearSessionCache
  };
};
