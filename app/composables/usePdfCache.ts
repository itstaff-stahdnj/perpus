import { ref } from 'vue';
import { useBookCover } from './useBookCover';
import { useNetworkQuality } from './useNetworkQuality';
import { useIndexedDB } from './useIndexedDB';
import type { Book } from './usePustakaApi';

const prefetchedPdfUrls = ref<Set<string>>(new Set());
const prefetchingCount = ref<number>(0);

export const usePdfCache = () => {
  const { extractPdfUrl, isEbookBook } = useBookCover();
  const { effectivePdfQuality } = useNetworkQuality();
  const { saveEbook, getEbook, deleteEbook, getAllCachedEbooks } = useIndexedDB();

  // Helper: Cek apakah PDF sudah ada di IndexedDB
  const isPdfCachedInDb = async (rawUrl: string): Promise<boolean> => {
    if (!rawUrl || !process.client) return false;
    const cached = await getEbook(rawUrl);
    return cached !== null;
  };

  // Helper: Ambil blob PDF dari IndexedDB
  const getCachedPdfBlob = async (rawUrl: string): Promise<Blob | null> => {
    if (!rawUrl || !process.client) return null;
    const cached = await getEbook(rawUrl);
    if (!cached) return null;
    if (cached.data instanceof Blob) return cached.data;
    return new Blob([cached.data], { type: 'application/pdf' });
  };

  // Helper: Simpan Blob ke IndexedDB
  const savePdfToIndexedDb = async (
    rawUrl: string,
    data: Blob | ArrayBuffer,
    title?: string,
    bookId?: number | string
  ): Promise<boolean> => {
    if (!rawUrl || !process.client) return false;
    return await saveEbook({
      pdfUrl: rawUrl,
      title: title || 'E-Book Digital',
      bookId,
      data,
    });
  };

  // Helper: Hapus PDF dari IndexedDB
  const removePdfFromDb = async (rawUrl: string): Promise<boolean> => {
    if (!rawUrl || !process.client) return false;
    prefetchedPdfUrls.value.delete(rawUrl);
    return await deleteEbook(rawUrl);
  };

  // Pre-fetch a single PDF URL into temporary session CacheStorage & persistent IndexedDB
  const prefetchPdf = async (rawUrl: string, title?: string, bookId?: number | string): Promise<boolean> => {
    if (!rawUrl || !process.client) return false;

    // 1. Cek dulu jika sudah ada di IndexedDB persistent store
    const alreadyInDb = await isPdfCachedInDb(rawUrl);
    if (alreadyInDb) {
      prefetchedPdfUrls.value.add(rawUrl);
      return true;
    }

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
      
      // Warm-up browser cache using fetch
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

        // Put into CacheStorage API if available
        if ('caches' in window) {
          try {
            const cache = await caches.open('stah-pdf-session-v1');
            await cache.put(pdfUrl, res.clone());
          } catch (e) {}
        }

        // Save blob to IndexedDB for offline reading
        try {
          const blob = await res.blob();
          await saveEbook({
            pdfUrl: rawUrl,
            title: title || 'E-Book Digital',
            bookId,
            data: blob,
          });
        } catch (e) {
          console.warn('Gagal menyimpan prefetch blob ke IndexedDB:', e);
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

    // Run idle prefetching sequentially
    const prefetchTask = async () => {
      for (const b of targetEbooks) {
        const pdfUrl = extractPdfUrl(b);
        if (pdfUrl) {
          await prefetchPdf(pdfUrl, b.judul, b.id);
        }
      }
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchTask);
    } else {
      setTimeout(prefetchTask, 1000);
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
    clearSessionCache,
    isPdfCachedInDb,
    getCachedPdfBlob,
    savePdfToIndexedDb,
    removePdfFromDb,
    getAllCachedEbooks,
  };
};

