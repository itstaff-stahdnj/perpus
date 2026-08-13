import { ref } from 'vue';
import { usePustakaApi } from './usePustakaApi';
import { useIndexedDB } from './useIndexedDB';
import { usePdfCache } from './usePdfCache';

const isSyncing = ref(false);
const syncSuccess = ref<boolean | null>(null);
const syncMessage = ref('');
const lastSyncedAt = ref<string | null>(null);
let toastTimer: any = null;

export const useSyncData = () => {
  const { getBooks, getCategories } = usePustakaApi();
  const { saveCatalogCache } = useIndexedDB();
  const { prefetchCatalogPdfList } = usePdfCache();

  const triggerSync = async (): Promise<boolean> => {
    if (isSyncing.value) return false;

    isSyncing.value = true;
    syncSuccess.value = null;
    syncMessage.value = '🔄 Menyinkronkan data katalog, IndexedDB & D1...';

    if (toastTimer) clearTimeout(toastTimer);

    let clientSyncOk = false;
    let d1SyncOk = false;
    let syncedBookCount = 0;

    try {
      // STEP 1: Fetch fresh data & cache to Client-side IndexedDB
      const [resBooks, resCat] = await Promise.all([
        getBooks({ per_page: 1000, limit: 1000, all: 1 }).catch(() => null),
        getCategories().catch(() => null)
      ]);

      const books = resBooks?.data || (Array.isArray(resBooks) ? resBooks : []);
      const categories = resCat?.data || (Array.isArray(resCat) ? resCat : []);

      if (books.length > 0) {
        syncedBookCount = books.length;
        await saveCatalogCache('catalog_books', books);
        await saveCatalogCache('home_books', books);
        prefetchCatalogPdfList(books);
        clientSyncOk = true;
      }

      if (categories.length > 0) {
        await saveCatalogCache('catalog_categories', categories);
        await saveCatalogCache('home_categories', categories);
      }

      // STEP 2: Call Server Backup Sync to Cloudflare D1
      if (process.client && navigator.onLine) {
        try {
          const resD1: any = await $fetch('/api/backup/sync', { method: 'POST' });
          if (resD1?.success) {
            d1SyncOk = true;
          }
        } catch (err) {
          console.warn('Sync D1 Server error (offline or local dev):', err);
        }
      }

      // STEP 3: Provide feedback
      const nowTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      lastSyncedAt.value = nowTime;

      if (clientSyncOk || d1SyncOk) {
        syncSuccess.value = true;
        syncMessage.value = `🎉 Sinkronisasi Berhasil (${nowTime})! ${syncedBookCount > 0 ? syncedBookCount + ' Buku' : 'Data'} tersinkron ke IndexedDB & Cloudflare D1.`;
      } else {
        syncSuccess.value = false;
        syncMessage.value = '⚠️ Tidak dapat terhubung ke server. Menggunakan cache lokal IndexedDB.';
      }

      return true;
    } catch (err: any) {
      console.error('Error triggering sync:', err);
      syncSuccess.value = false;
      syncMessage.value = `⚠️ Gagal sinkronisasi: ${err?.message || 'Terjadi kesalahan jaringan.'}`;
      return false;
    } finally {
      isSyncing.value = false;

      toastTimer = setTimeout(() => {
        syncMessage.value = '';
      }, 5000);
    }
  };

  return {
    isSyncing,
    syncSuccess,
    syncMessage,
    lastSyncedAt,
    triggerSync,
  };
};
