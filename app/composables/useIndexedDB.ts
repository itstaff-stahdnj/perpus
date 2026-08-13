import { ref } from 'vue';

const DB_NAME = 'PerpusStahDB';
const DB_VERSION = 1;

export interface CachedEbook {
  pdfUrl: string;
  bookId?: number | string;
  title: string;
  data: Blob | ArrayBuffer;
  size: number;
  cachedAt: number;
}

export interface ReadingProgress {
  pdfUrl: string;
  bookId?: number | string;
  currentPage: number;
  totalPages: number;
  scale: number;
  theme: string;
  updatedAt: number;
}

export interface CatalogCache {
  key: string;
  data: any;
  timestamp: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function getDb(): Promise<IDBDatabase> {
  if (!process.client || typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.reject(new Error('IndexedDB tidak didukung pada lingkungan server.'));
  }

  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Store E-Book Blobs
      if (!db.objectStoreNames.contains('ebooks')) {
        const ebookStore = db.createObjectStore('ebooks', { keyPath: 'pdfUrl' });
        ebookStore.createIndex('cachedAt', 'cachedAt', { unique: false });
        ebookStore.createIndex('bookId', 'bookId', { unique: false });
      }

      // 2. Store Reading Progress
      if (!db.objectStoreNames.contains('reading_progress')) {
        const progressStore = db.createObjectStore('reading_progress', { keyPath: 'pdfUrl' });
        progressStore.createIndex('updatedAt', 'updatedAt', { unique: false });
      }

      // 3. Store Offline Catalog Cache
      if (!db.objectStoreNames.contains('catalog_cache')) {
        db.createObjectStore('catalog_cache', { keyPath: 'key' });
      }

      // 4. Store Offline Wishlist
      if (!db.objectStoreNames.contains('wishlist')) {
        db.createObjectStore('wishlist', { keyPath: 'id' });
      }
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = (event) => {
      dbPromise = null;
      console.error('IndexedDB open error:', (event.target as IDBOpenDBRequest).error);
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbPromise;
}

export const useIndexedDB = () => {
  const isSupported = ref<boolean>(process.client && typeof window !== 'undefined' && 'indexedDB' in window);

  // ── E-BOOK STORE ───────────────────────────────────────

  const saveEbook = async (item: {
    pdfUrl: string;
    bookId?: number | string;
    title?: string;
    data: Blob | ArrayBuffer;
    size?: number;
  }): Promise<boolean> => {
    if (!isSupported.value || !item.pdfUrl) return false;
    try {
      const db = await getDb();
      const tx = db.transaction('ebooks', 'readwrite');
      const store = tx.objectStore('ebooks');

      const size = item.size || (item.data instanceof Blob ? item.data.size : item.data.byteLength);
      const record: CachedEbook = {
        pdfUrl: item.pdfUrl,
        bookId: item.bookId,
        title: item.title || 'E-Book Digital',
        data: item.data,
        size,
        cachedAt: Date.now(),
      };

      await new Promise<void>((resolve, reject) => {
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      return true;
    } catch (err) {
      console.warn('Gagal menyimpan E-Book ke IndexedDB:', err);
      return false;
    }
  };

  const getEbook = async (pdfUrl: string): Promise<CachedEbook | null> => {
    if (!isSupported.value || !pdfUrl) return null;
    try {
      const db = await getDb();
      const tx = db.transaction('ebooks', 'readonly');
      const store = tx.objectStore('ebooks');

      return await new Promise<CachedEbook | null>((resolve, reject) => {
        const req = store.get(pdfUrl);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Gagal mengambil E-Book dari IndexedDB:', err);
      return null;
    }
  };

  const deleteEbook = async (pdfUrl: string): Promise<boolean> => {
    if (!isSupported.value || !pdfUrl) return false;
    try {
      const db = await getDb();
      const tx = db.transaction('ebooks', 'readwrite');
      const store = tx.objectStore('ebooks');

      await new Promise<void>((resolve, reject) => {
        const req = store.delete(pdfUrl);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      return true;
    } catch (err) {
      console.warn('Gagal menghapus E-Book dari IndexedDB:', err);
      return false;
    }
  };

  const getAllCachedEbooks = async (): Promise<Omit<CachedEbook, 'data'>[]> => {
    if (!isSupported.value) return [];
    try {
      const db = await getDb();
      const tx = db.transaction('ebooks', 'readonly');
      const store = tx.objectStore('ebooks');

      return await new Promise<Omit<CachedEbook, 'data'>[]>((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => {
          const list = (req.result || []).map((item: CachedEbook) => ({
            pdfUrl: item.pdfUrl,
            bookId: item.bookId,
            title: item.title,
            size: item.size,
            cachedAt: item.cachedAt,
          }));
          resolve(list);
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Gagal mengambil daftar E-Book dari IndexedDB:', err);
      return [];
    }
  };

  const clearAllEbooks = async (): Promise<boolean> => {
    if (!isSupported.value) return false;
    try {
      const db = await getDb();
      const tx = db.transaction('ebooks', 'readwrite');
      const store = tx.objectStore('ebooks');

      await new Promise<void>((resolve, reject) => {
        const req = store.clear();
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      return true;
    } catch (err) {
      console.warn('Gagal membersihkan cache E-Book di IndexedDB:', err);
      return false;
    }
  };

  // ── READING PROGRESS STORE ─────────────────────────────

  const saveReadingProgress = async (progress: {
    pdfUrl: string;
    bookId?: number | string;
    currentPage: number;
    totalPages: number;
    scale?: number;
    theme?: string;
  }): Promise<boolean> => {
    if (!isSupported.value || !progress.pdfUrl) return false;
    try {
      const db = await getDb();
      const tx = db.transaction('reading_progress', 'readwrite');
      const store = tx.objectStore('reading_progress');

      const record: ReadingProgress = {
        pdfUrl: progress.pdfUrl,
        bookId: progress.bookId,
        currentPage: progress.currentPage,
        totalPages: progress.totalPages,
        scale: progress.scale ?? 1.25,
        theme: progress.theme ?? 'dark',
        updatedAt: Date.now(),
      };

      await new Promise<void>((resolve, reject) => {
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      return true;
    } catch (err) {
      console.warn('Gagal menyimpan progress membaca ke IndexedDB:', err);
      return false;
    }
  };

  const getReadingProgress = async (pdfUrl: string): Promise<ReadingProgress | null> => {
    if (!isSupported.value || !pdfUrl) return null;
    try {
      const db = await getDb();
      const tx = db.transaction('reading_progress', 'readonly');
      const store = tx.objectStore('reading_progress');

      return await new Promise<ReadingProgress | null>((resolve, reject) => {
        const req = store.get(pdfUrl);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      console.warn('Gagal mengambil progress membaca dari IndexedDB:', err);
      return null;
    }
  };

  // ── CATALOG CACHE STORE ────────────────────────────────

  const saveCatalogCache = async (key: string, data: any): Promise<boolean> => {
    if (!isSupported.value || !key) return false;
    try {
      const db = await getDb();
      const tx = db.transaction('catalog_cache', 'readwrite');
      const store = tx.objectStore('catalog_cache');

      const record: CatalogCache = {
        key,
        data,
        timestamp: Date.now(),
      };

      await new Promise<void>((resolve, reject) => {
        const req = store.put(record);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
      });
      return true;
    } catch (err) {
      console.warn('Gagal menyimpan cache katalog ke IndexedDB:', err);
      return false;
    }
  };

  const getCatalogCache = async <T = any>(key: string, maxAgeMs = 86400000): Promise<T | null> => {
    if (!isSupported.value || !key) return null;
    try {
      const db = await getDb();
      const tx = db.transaction('catalog_cache', 'readonly');
      const store = tx.objectStore('catalog_cache');

      const result = await new Promise<CatalogCache | null>((resolve, reject) => {
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
      });

      if (!result) return null;
      if (maxAgeMs > 0 && Date.now() - result.timestamp > maxAgeMs) {
        return null; // Expired
      }
      return result.data as T;
    } catch (err) {
      console.warn('Gagal mengambil cache katalog dari IndexedDB:', err);
      return null;
    }
  };

  // ── STATS & UTILS ─────────────────────────────────────

  const getStorageStats = async (): Promise<{ count: number; totalSizeBytes: number }> => {
    if (!isSupported.value) return { count: 0, totalSizeBytes: 0 };
    try {
      const db = await getDb();
      const tx = db.transaction('ebooks', 'readonly');
      const store = tx.objectStore('ebooks');

      return await new Promise((resolve, reject) => {
        const req = store.getAll();
        req.onsuccess = () => {
          const items: CachedEbook[] = req.result || [];
          const totalSizeBytes = items.reduce((acc, curr) => acc + (curr.size || 0), 0);
          resolve({ count: items.length, totalSizeBytes });
        };
        req.onerror = () => reject(req.error);
      });
    } catch (err) {
      return { count: 0, totalSizeBytes: 0 };
    }
  };

  return {
    isSupported,
    saveEbook,
    getEbook,
    deleteEbook,
    getAllCachedEbooks,
    clearAllEbooks,
    saveReadingProgress,
    getReadingProgress,
    saveCatalogCache,
    getCatalogCache,
    getStorageStats,
  };
};
