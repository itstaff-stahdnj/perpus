<template>
  <Teleport to="body">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex items-center justify-center select-none"
      @click.self="close"
      @contextmenu.prevent
    >
      <div class="bg-zinc-950 border border-zinc-800 rounded-2xl w-full h-full sm:h-[96vh] sm:max-w-7xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <!-- Header & Toolbar -->
        <div class="bg-zinc-900 px-3 sm:px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between gap-2 sm:gap-3 shrink-0 text-white z-30">
          <div class="flex items-center gap-2.5 min-w-0">
            <!-- Sidebar Toggle -->
            <button 
              @click="sidebarOpen = !sidebarOpen"
              class="w-8 h-8 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Panel Halaman"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
            </button>

            <span class="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-base shrink-0">
              📖
            </span>
            <div class="min-w-0">
              <h3 class="font-extrabold text-xs sm:text-sm text-zinc-100 truncate leading-tight">
                {{ title || 'Pembaca E-Book Digital' }}
              </h3>
              <p class="text-[10px] text-zinc-400 truncate flex items-center gap-1.5">
                <span>⚡ PDF.js</span>
                <span>•</span>
                <!-- IndexedDB Offline Status Pill -->
                <button 
                  @click="toggleSaveOffline" 
                  class="font-bold flex items-center gap-1 px-1.5 py-0.5 rounded transition-all cursor-pointer text-[10px]"
                  :class="isOfflineReady ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30' : (isSavingOffline ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 animate-pulse' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700')"
                  :title="isOfflineReady ? 'Tersimpan di IndexedDB (Klik untuk Hapus Cache)' : 'Klik untuk Simpan Offline ke IndexedDB'"
                >
                  <span>{{ isOfflineReady ? '💾 Offline Ready' : (isSavingOffline ? '⏳ Menyimpan...' : '📥 Simpan Offline') }}</span>
                </button>
                <span>•</span>
                <span class="text-rose-400 font-bold flex items-center gap-0.5">
                  <Icon name="material-symbols:lock" class="text-[12px]" />
                  <span>Dokumen Dilindungi</span>
                </span>
              </p>
            </div>
          </div>

          <!-- Controls Group -->
          <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            <!-- Page Navigation -->
            <button 
              @click="prevPage" 
              :disabled="currentPage <= 1"
              class="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-default flex items-center justify-center transition-colors cursor-pointer"
              title="Halaman Sebelumnya (←)"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
            </button>

            <div class="flex items-center gap-1 bg-zinc-950 border border-zinc-800 px-2 py-1 rounded-lg text-[11px] font-bold">
              <input 
                type="number" 
                :value="currentPage" 
                @change="jumpToPage(($event.target as HTMLInputElement).value)"
                class="w-8 bg-zinc-800 border border-zinc-700 text-white text-center font-extrabold rounded px-1 py-0.5 text-[11px] focus:outline-none focus:border-blue-500"
                min="1"
                :max="totalPages"
              />
              <span class="text-zinc-500">/</span>
              <span class="text-zinc-300">{{ totalPages || '-' }}</span>
            </div>

            <button 
              @click="nextPage" 
              :disabled="currentPage >= totalPages"
              class="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-default flex items-center justify-center transition-colors cursor-pointer"
              title="Halaman Selanjutnya (→)"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
            </button>

            <div class="w-px h-5 bg-zinc-700 hidden sm:block"></div>

            <!-- Zoom Controls -->
            <button @click="zoomOut" class="hidden sm:flex w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 items-center justify-center transition-colors cursor-pointer" title="Perkecil (-)">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15"/></svg>
            </button>

            <span class="hidden sm:inline text-[11px] font-extrabold text-blue-400 min-w-[40px] text-center">{{ Math.round(scale * 100) }}%</span>

            <button @click="zoomIn" class="hidden sm:flex w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 items-center justify-center transition-colors cursor-pointer" title="Perbesar (+)">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            </button>

            <button @click="fitWidth" class="hidden lg:flex px-2 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 items-center justify-center text-[10px] font-bold transition-colors cursor-pointer gap-1" title="Sesuaikan Lebar">
              ↔ Lebar
            </button>

            <div class="w-px h-5 bg-zinc-700 hidden sm:block"></div>

            <!-- Theme Switcher -->
            <div class="hidden md:flex items-center gap-1">
              <button 
                v-for="t in themes" :key="t.key"
                @click="currentTheme = t.key"
                class="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all cursor-pointer"
                :class="currentTheme === t.key ? 'bg-blue-600 text-white scale-105' : 'bg-zinc-800 hover:bg-zinc-700'"
                :title="t.label"
              >
                {{ t.icon }}
              </button>
            </div>

            <div class="w-px h-5 bg-zinc-700"></div>

            <!-- Fullscreen -->
            <button 
              @click="toggleFullscreen" 
              class="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
              title="Layar Penuh (F)"
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>
            </button>

            <!-- Close -->
            <button 
              @click="close" 
              class="w-9 h-9 bg-rose-600 hover:bg-rose-500 text-white rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 z-40 shadow-lg shadow-rose-600/30 hover:scale-105 active:scale-95"
              title="Tutup Reader (ESC)"
            >
              <Icon name="material-symbols:close" class="text-xl font-bold" />
            </button>
          </div>
        </div>

        <!-- Main Body: PDF.js Canvas Renderer -->
        <div 
          class="flex-1 relative overflow-hidden flex transition-colors duration-300"
          :class="themeClasses"
        >
          
          <!-- Sidebar Thumbnails -->
          <aside 
            class="shrink-0 border-r border-zinc-800 overflow-y-auto transition-all duration-300 flex flex-col gap-2 p-2"
            :class="sidebarOpen ? 'w-[180px] sm:w-[200px]' : 'w-0 p-0 border-0 overflow-hidden'"
            :style="sidebarOpen ? '' : 'width: 0; padding: 0; border: 0;'"
          >
            <div 
              v-for="n in totalPages" :key="n"
              @click="goToPage(n)"
              class="cursor-pointer rounded-lg p-1.5 border-2 transition-all text-center shrink-0"
              :class="n === currentPage ? 'border-blue-500 bg-blue-950/50' : 'border-transparent hover:border-zinc-600 bg-zinc-900'"
            >
              <canvas :ref="(el) => setThumbRef(n, el as HTMLCanvasElement)" class="w-full h-auto rounded"></canvas>
              <span class="text-[10px] font-bold text-zinc-400 mt-0.5 block">Hlm {{ n }}</span>
            </div>
          </aside>

          <!-- Canvas Scroller -->
          <div ref="scrollerRef" class="flex-1 overflow-auto flex flex-col items-center py-6 px-4 gap-4" style="scroll-behavior: smooth;">
            <div class="rounded-md overflow-hidden shadow-2xl" :class="canvasShadowClass">
              <canvas ref="mainCanvasRef" class="block max-w-full h-auto"></canvas>
            </div>
          </div>

          <!-- Loading Overlay -->
          <div 
            v-if="loading" 
            class="absolute inset-0 bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-20"
          >
            <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p class="text-sm font-extrabold text-white animate-pulse">Memuat E-Book Digital...</p>
            <p class="text-xs text-zinc-400 font-semibold">{{ loadingMessage }}</p>
          </div>

          <!-- Error State -->
          <div v-if="!loading && errorMessage" class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md mx-auto">
            <div class="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-3xl">
              <Icon name="material-symbols:warning" />
            </div>
            <div class="space-y-1">
              <h4 class="text-base font-bold text-white">Tidak Dapat Membuka E-Book</h4>
              <p class="text-xs text-zinc-400 leading-relaxed">{{ errorMessage }}</p>
            </div>
            <button @click="close" class="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer">
              Tutup Pembaca
            </button>
          </div>

          <!-- Mobile Floating Nav -->
          <div class="sm:hidden absolute bottom-3 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 z-30">
            <button @click="prevPage" :disabled="currentPage <= 1" class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center disabled:opacity-30 cursor-pointer">◀</button>
            <span class="text-xs font-extrabold text-white min-w-[48px] text-center">{{ currentPage }} / {{ totalPages || '-' }}</span>
            <button @click="nextPage" :disabled="currentPage >= totalPages" class="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center disabled:opacity-30 cursor-pointer">▶</button>
          </div>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useIndexedDB } from '~/composables/useIndexedDB';
import { usePdfCache } from '~/composables/usePdfCache';

const props = defineProps<{
  modelValue: boolean;
  pdfUrl?: string;
  title?: string;
  bookId?: number | string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

// Composables
const { getReadingProgress, saveReadingProgress } = useIndexedDB();
const { getCachedPdfBlob, savePdfToIndexedDb, removePdfFromDb } = usePdfCache();

// State
const loading = ref(true);
const loadingMessage = ref('Menyiapkan PDF.js...');
const errorMessage = ref('');
const currentPage = ref(1);
const totalPages = ref(0);
const scale = ref(0.6);
const sidebarOpen = ref(false);
const currentTheme = ref<'dark' | 'sepia' | 'light'>('dark');

// Offline & IndexedDB states
const isOfflineReady = ref(false);
const isSavingOffline = ref(false);
const offlineBlobUrl = ref<string | null>(null);
const restoredProgress = ref(false);

const mainCanvasRef = ref<HTMLCanvasElement | null>(null);
const scrollerRef = ref<HTMLElement | null>(null);
const thumbRefs = new Map<number, HTMLCanvasElement>();

let pdfDoc: any = null;
let pageRendering = false;
let pageNumPending: number | null = null;
let pdfjsLib: any = null;

const themes = [
  { key: 'dark' as const, icon: '🌙', label: 'Mode Gelap (D)' },
  { key: 'sepia' as const, icon: '📜', label: 'Mode Sepia (S)' },
  { key: 'light' as const, icon: '☀️', label: 'Mode Terang (L)' },
];

const themeClasses = ref('bg-[#0b0f19]');
const canvasShadowClass = ref('shadow-black/50');

watch(currentTheme, (t) => {
  if (t === 'sepia') {
    themeClasses.value = 'bg-[#f4ecd8]';
    canvasShadowClass.value = 'shadow-amber-900/20';
  } else if (t === 'light') {
    themeClasses.value = 'bg-[#f1f5f9]';
    canvasShadowClass.value = 'shadow-black/15';
  } else {
    themeClasses.value = 'bg-[#0b0f19]';
    canvasShadowClass.value = 'shadow-black/50';
  }
}, { immediate: true });

const setThumbRef = (n: number, el: HTMLCanvasElement) => {
  if (el) thumbRefs.set(n, el);
};

// Cleanup Object URL Blob
const cleanupBlobUrl = () => {
  if (offlineBlobUrl.value) {
    URL.revokeObjectURL(offlineBlobUrl.value);
    offlineBlobUrl.value = null;
  }
};

// Load PDF.js from CDN
const loadPdfJs = async (): Promise<any> => {
  if ((window as any).pdfjsLib) return (window as any).pdfjsLib;

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const lib = (window as any).pdfjsLib;
      if (lib) {
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(lib);
      } else {
        reject(new Error('PDF.js tidak dapat dimuat'));
      }
    };
    script.onerror = () => reject(new Error('Gagal memuat PDF.js CDN'));
    document.head.appendChild(script);
  });
};

// Build stream URL from pdfUrl prop
const getStreamUrl = (): string => {
  if (!props.pdfUrl || props.pdfUrl.trim() === '') return '';

  let url = props.pdfUrl.trim();

  if (url.includes('api/pdf-stream')) {
    return url.startsWith('/') ? url : `/${url}`;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return `/api/pdf-stream?url=${encodeURIComponent(url)}&quality=high`;
  }

  return `/api/pdf-stream?url=${encodeURIComponent(url)}&quality=high`;
};

// Save PDF Blob to IndexedDB in background
const saveBlobToDbInBackground = async () => {
  if (!props.pdfUrl || isSavingOffline.value) return;
  isSavingOffline.value = true;
  try {
    const streamUrl = getStreamUrl();
    const res = await fetch(streamUrl, { credentials: 'include' });
    if (res.ok) {
      const blob = await res.blob();
      await savePdfToIndexedDb(props.pdfUrl, blob, props.title, props.bookId);
      isOfflineReady.value = true;
    }
  } catch (e) {
    console.warn('Gagal menyimpan blob ke IndexedDB di background:', e);
  } finally {
    isSavingOffline.value = false;
  }
};

// Manual toggle to save/delete offline cache
const toggleSaveOffline = async () => {
  if (!props.pdfUrl) return;
  if (isOfflineReady.value) {
    await removePdfFromDb(props.pdfUrl);
    isOfflineReady.value = false;
  } else {
    await saveBlobToDbInBackground();
  }
};

// Render a specific page to the main canvas
const renderPage = async (num: number) => {
  if (!pdfDoc || !mainCanvasRef.value) return;

  pageRendering = true;
  try {
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({ scale: scale.value });

    const canvas = mainCanvasRef.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI rendering
    const outputScale = window.devicePixelRatio || 1;
    canvas.width = Math.floor(viewport.width * outputScale);
    canvas.height = Math.floor(viewport.height * outputScale);
    canvas.style.width = Math.floor(viewport.width) + 'px';
    canvas.style.height = Math.floor(viewport.height) + 'px';

    const transform = outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

    await page.render({
      canvasContext: ctx,
      transform,
      viewport
    }).promise;

    currentPage.value = num;

    // Save reading progress to IndexedDB automatically
    if (props.pdfUrl) {
      saveReadingProgress({
        pdfUrl: props.pdfUrl,
        bookId: props.bookId,
        currentPage: num,
        totalPages: totalPages.value,
        scale: scale.value,
        theme: currentTheme.value,
      });
    }

    // Scroll to top
    if (scrollerRef.value) {
      scrollerRef.value.scrollTop = 0;
    }
  } catch (err) {
    console.error('Render page error:', err);
  } finally {
    pageRendering = false;
    if (pageNumPending !== null) {
      const pending = pageNumPending;
      pageNumPending = null;
      renderPage(pending);
    }
  }
};

const queueRenderPage = (num: number) => {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
};

// Navigation
const prevPage = () => {
  if (currentPage.value > 1) {
    queueRenderPage(currentPage.value - 1);
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    queueRenderPage(currentPage.value + 1);
  }
};

const goToPage = (n: number) => {
  if (n >= 1 && n <= totalPages.value) {
    queueRenderPage(n);
  }
};

const jumpToPage = (val: string) => {
  let num = parseInt(val);
  if (isNaN(num) || num < 1) num = 1;
  if (num > totalPages.value) num = totalPages.value;
  queueRenderPage(num);
};

// Zoom
const zoomIn = () => {
  scale.value = Math.min(scale.value + 0.25, 3.0);
  queueRenderPage(currentPage.value);
};

const zoomOut = () => {
  scale.value = Math.max(scale.value - 0.25, 0.5);
  queueRenderPage(currentPage.value);
};

const fitWidth = async () => {
  if (!pdfDoc || !scrollerRef.value) return;
  const page = await pdfDoc.getPage(currentPage.value);
  const unscaledVP = page.getViewport({ scale: 1.0 });
  const availableWidth = scrollerRef.value.clientWidth - 48;
  scale.value = Math.round((availableWidth / unscaledVP.width) * 100) / 100;
  queueRenderPage(currentPage.value);
};

// Fullscreen
const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
};

// Generate thumbnails (lazy, first 50 pages)
const generateThumbnails = async () => {
  if (!pdfDoc) return;
  const limit = Math.min(pdfDoc.numPages, 50);

  for (let i = 1; i <= limit; i++) {
    const canvas = thumbRefs.get(i);
    if (!canvas) continue;

    try {
      const page = await pdfDoc.getPage(i);
      const vp = page.getViewport({ scale: 0.18 });
      canvas.width = vp.width;
      canvas.height = vp.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
      }
    } catch {
      // Skip failed thumbnails
    }
  }
};

// Load PDF document (IndexedDB Cache-First strategy)
const loadPdf = async () => {
  if (!props.pdfUrl || !props.modelValue) return;

  loading.value = true;
  errorMessage.value = '';
  loadingMessage.value = 'Memuat engine PDF.js...';
  currentPage.value = 1;
  totalPages.value = 0;
  restoredProgress.value = false;
  cleanupBlobUrl();

  try {
    pdfjsLib = await loadPdfJs();

    // 1. Restore reading progress from IndexedDB
    let targetPage = 1;
    const savedProgress = await getReadingProgress(props.pdfUrl);
    if (savedProgress) {
      targetPage = savedProgress.currentPage || 1;
      if (savedProgress.scale) scale.value = savedProgress.scale;
      if (savedProgress.theme) currentTheme.value = savedProgress.theme as any;
      restoredProgress.value = true;
    }

    // 2. Check IndexedDB for cached PDF Blob
    loadingMessage.value = 'Memeriksa cache IndexedDB...';
    const cachedBlob = await getCachedPdfBlob(props.pdfUrl);

    let docSource: any = null;

    if (cachedBlob) {
      loadingMessage.value = 'Memuat E-Book dari IndexedDB (Offline Ready)...';
      isOfflineReady.value = true;
      offlineBlobUrl.value = URL.createObjectURL(cachedBlob);
      docSource = { url: offlineBlobUrl.value };
    } else {
      isOfflineReady.value = false;
      loadingMessage.value = 'Menghubungkan ke server...';
      const streamUrl = getStreamUrl();
      if (!streamUrl) {
        errorMessage.value = 'URL berkas PDF kosong atau belum diunggah.';
        loading.value = false;
        return;
      }
      docSource = {
        url: streamUrl,
        rangeChunkSize: 65536 * 4,
        disableAutoFetch: false,
        disableStream: false,
        withCredentials: true,
      };
    }

    const loadingTask = pdfjsLib.getDocument(docSource);
    loadingTask.onProgress = (data: any) => {
      if (data.total > 0) {
        const pct = Math.round((data.loaded / data.total) * 100);
        loadingMessage.value = `Mengunduh: ${pct}% (${(data.loaded / 1048576).toFixed(1)} MB / ${(data.total / 1048576).toFixed(1)} MB)`;
      }
    };

    pdfDoc = await loadingTask.promise;
    totalPages.value = pdfDoc.numPages;

    if (targetPage > totalPages.value) targetPage = 1;

    await nextTick();
    await renderPage(targetPage);

    loading.value = false;

    // Generate thumbnails in background
    await nextTick();
    setTimeout(() => generateThumbnails(), 500);

    // Save blob to IndexedDB automatically if loaded from network
    if (!cachedBlob && props.pdfUrl && navigator.onLine) {
      saveBlobToDbInBackground();
    }

  } catch (err: any) {
    console.error('PDF.js load error:', err);
    
    if (err?.message?.includes('401') || err?.message?.includes('403') || err?.message?.includes('Login')) {
      errorMessage.value = '🔑 Login SSO Diperlukan. Silakan masuk ke akun portal perpustakaan Anda terlebih dahulu.';
    } else {
      errorMessage.value = 'Gagal memuat PDF: ' + (err?.message || 'Respons server tidak valid atau file belum diunggah.');
    }
    loading.value = false;
  }
};

// Close
const close = () => {
  cleanupBlobUrl();
  pdfDoc = null;
  totalPages.value = 0;
  currentPage.value = 1;
  errorMessage.value = '';
  restoredProgress.value = false;
  thumbRefs.clear();
  emit('update:modelValue', false);
};

// Keyboard shortcuts
const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.modelValue) return;
  if (e.target instanceof HTMLInputElement) return;

  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P')) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  if (e.key === 'Escape') {
    close();
  } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
    e.preventDefault();
    prevPage();
  } else if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
    e.preventDefault();
    nextPage();
  } else if (e.key === '+' || e.key === '=') {
    zoomIn();
  } else if (e.key === '-') {
    zoomOut();
  } else if (e.key === 'f' || e.key === 'F') {
    toggleFullscreen();
  } else if (e.key === 's' || e.key === 'S') {
    currentTheme.value = 'sepia';
  } else if (e.key === 'd' || e.key === 'D') {
    currentTheme.value = 'dark';
  } else if (e.key === 'l' || e.key === 'L') {
    currentTheme.value = 'light';
  }
};

onMounted(() => {
  if (process.client) {
    window.addEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  cleanupBlobUrl();
  pdfDoc = null;
  thumbRefs.clear();
  if (process.client) {
    window.removeEventListener('keydown', handleKeyDown);
  }
});

watch(() => props.modelValue, (val) => {
  if (val) {
    nextTick(() => loadPdf());
  } else {
    close();
  }
});

watch(() => props.pdfUrl, () => {
  if (props.modelValue) {
    nextTick(() => loadPdf());
  }
});
</script>

