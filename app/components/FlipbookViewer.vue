<template>
  <div class="w-full h-full flex flex-col bg-zinc-950 text-white select-none relative overflow-hidden">
    
    <!-- Top Control Bar (FlipHTML5 Style) -->
    <div class="bg-zinc-900/90 backdrop-blur-md px-4 py-2 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0 z-20">
      
      <!-- Left: Title & Page Indicator -->
      <div class="flex items-center gap-3 min-w-0">
        <div class="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
          📖
        </div>
        <div class="min-w-0">
          <h4 class="font-bold text-xs sm:text-sm text-zinc-100 truncate leading-tight">
            {{ title || 'E-Book Digital Flipbook' }}
          </h4>
          <p class="text-[10px] text-zinc-400 truncate flex items-center gap-1.5">
            <span>Mode Flipbook 3D</span>
            <span class="w-1 h-1 rounded-full bg-zinc-600"></span>
            <span class="text-emerald-400 font-semibold">{{ pageCount > 0 ? `${pageCount} Halaman` : 'Memuat...' }}</span>
          </p>
        </div>
      </div>

      <!-- Center: Navigation Controls -->
      <div class="flex items-center gap-1 sm:gap-2">
        <button 
          @click="flipPrev" 
          :disabled="currentPage <= 1 || loading"
          class="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 transition text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
          title="Halaman Sebelumnya"
        >
          <span class="material-symbols-outlined text-base">chevron_left</span>
          <span class="hidden md:inline">Sebelumnya</span>
        </button>

        <!-- Page Input Counter -->
        <div class="flex items-center gap-1 bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800 text-xs font-mono">
          <input 
            type="number" 
            v-model.number="pageInput"
            @keyup.enter="jumpToPage"
            min="1" 
            :max="pageCount || 1"
            class="w-8 sm:w-10 bg-transparent text-center font-bold text-blue-400 focus:outline-none focus:bg-zinc-800 rounded"
          />
          <span class="text-zinc-500">/</span>
          <span class="text-zinc-400">{{ pageCount || '--' }}</span>
        </div>

        <button 
          @click="flipNext" 
          :disabled="currentPage >= pageCount || loading"
          class="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-zinc-200 transition text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:cursor-not-allowed"
          title="Halaman Selanjutnya"
        >
          <span class="hidden md:inline">Selanjutnya</span>
          <span class="material-symbols-outlined text-base">chevron_right</span>
        </button>
      </div>

      <!-- Right: Action Buttons (Thumbnails, Fullscreen) -->
      <div class="flex items-center gap-1.5 shrink-0">
        <!-- Thumbnail Panel Toggle -->
        <button 
          @click="showThumbnails = !showThumbnails"
          class="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
          :class="{ 'text-blue-400 bg-blue-950/50 border border-blue-800/50': showThumbnails }"
          title="Tampilkan Miniatur Halaman"
        >
          <span class="material-symbols-outlined text-sm">grid_view</span>
        </button>

        <!-- Auto Play Toggle -->
        <button 
          @click="toggleAutoPlay"
          class="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
          :class="{ 'text-emerald-400 bg-emerald-950/50 border border-emerald-800/50': isAutoPlaying }"
          :title="isAutoPlaying ? 'Hentikan Putar Otomatis' : 'Putar Otomatis (Slideshow)'"
        >
          <span class="material-symbols-outlined text-sm">
            {{ isAutoPlaying ? 'pause' : 'play_arrow' }}
          </span>
        </button>

        <!-- Fullscreen Toggle -->
        <button 
          @click="toggleFullscreen"
          class="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition cursor-pointer"
          title="Layar Penuh (Fullscreen)"
        >
          <span class="material-symbols-outlined text-sm">
            {{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}
          </span>
        </button>
      </div>
    </div>

    <!-- Main Flipbook Container Area -->
    <div 
      ref="viewerAreaRef" 
      class="flex-1 relative flex items-center justify-center p-2 sm:p-6 overflow-hidden bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950"
    >
      
      <!-- Loading Overlay & Live Percentage Progress Bar -->
      <div 
        v-if="loading" 
        class="absolute inset-0 z-30 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center gap-5 text-zinc-200"
      >
        <div class="relative w-20 h-20 flex items-center justify-center">
          <div class="absolute inset-0 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
          <div class="text-base sm:text-lg font-black text-blue-400 font-mono">
            {{ downloadProgress > 0 ? `${downloadProgress}%` : '📖' }}
          </div>
        </div>

        <div class="text-center space-y-1.5 max-w-xs mx-auto">
          <p class="text-base font-black tracking-wide text-white">Menyiapkan Flipbook 3D</p>
          <p class="text-xs text-zinc-300 font-mono font-semibold">{{ loadingStatusText }}</p>
          <p v-if="fileSizeText" class="text-[11px] text-blue-400 font-mono bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/60 inline-block">
            📦 Ukuran File: {{ fileSizeText }}
          </p>
        </div>
        
        <!-- Live Loading Progress Bar -->
        <div class="w-64 sm:w-80 bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800 p-0.5 shadow-inner">
          <div 
            class="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full transition-all duration-300 rounded-full shadow-lg shadow-blue-500/50 relative overflow-hidden"
            :style="{ width: `${Math.max(downloadProgress, renderProgress, 5)}%` }"
          >
            <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div 
        v-if="errorMessage" 
        class="absolute inset-0 z-30 bg-zinc-950 flex flex-col items-center justify-center p-6 text-center space-y-4 max-w-md mx-auto"
      >
        <div class="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-3xl">
          📄
        </div>
        <div class="space-y-1">
          <h4 class="text-base font-bold text-white">Gagal Memuat Flipbook</h4>
          <p class="text-xs text-zinc-400 leading-relaxed">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Flipbook Render Engine Mount Point -->
      <div 
        ref="bookContainerRef" 
        class="flipbook-wrapper relative shadow-2xl transition-transform duration-300"
        :style="{ transform: `scale(${zoomLevel})` }"
      >
        <div ref="flipBookRef" class="st-page-flip-container shadow-2xl">
          <!-- Rendered PDF Pages will be inserted here dynamically -->
        </div>
      </div>

      <!-- Floating Prev/Next Click Zones for Touch/Click Ease -->
      <button 
        v-if="!loading && currentPage > 1"
        @click="flipPrev" 
        class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-14 bg-black/40 hover:bg-blue-600/80 text-white rounded-r-xl backdrop-blur-md flex items-center justify-center transition-all opacity-40 hover:opacity-100 cursor-pointer z-10"
        title="Halaman Sebelumnya"
      >
        <span class="material-symbols-outlined text-2xl">chevron_left</span>
      </button>

      <button 
        v-if="!loading && currentPage < pageCount"
        @click="flipNext" 
        class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-14 bg-black/40 hover:bg-blue-600/80 text-white rounded-l-xl backdrop-blur-md flex items-center justify-center transition-all opacity-40 hover:opacity-100 cursor-pointer z-10"
        title="Halaman Selanjutnya"
      >
        <span class="material-symbols-outlined text-2xl">chevron_right</span>
      </button>

    </div>

    <!-- Bottom Thumbnail Grid Drawer (FlipHTML5 Style) -->
    <transition name="slide-up">
      <div 
        v-if="showThumbnails" 
        class="bg-zinc-900 border-t border-zinc-800 p-3 h-32 shrink-0 overflow-x-auto flex items-center gap-3 z-20 scrollbar-thin"
      >
        <div 
          v-for="(thumb, idx) in thumbnailList" 
          :key="idx"
          @click="jumpToPageNum(idx + 1)"
          class="relative h-24 aspect-[3/4] bg-zinc-800 rounded-lg overflow-hidden border-2 cursor-pointer transition transform hover:scale-105 shrink-0"
          :class="currentPage === idx + 1 || (currentPage === idx + 2 && (idx + 1) % 2 === 0) ? 'border-blue-500 shadow-lg shadow-blue-500/30' : 'border-zinc-700 opacity-70 hover:opacity-100'"
        >
          <img :src="thumb" class="w-full h-full object-cover" :alt="`Hal ${idx + 1}`" />
          <span class="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-[9px] font-mono text-zinc-300 rounded font-bold">
            {{ idx + 1 }}
          </span>
        </div>
      </div>
    </transition>

    <!-- Bottom Bar Controls & Protections -->
    <div class="bg-zinc-950 px-4 py-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 shrink-0 z-20">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="font-semibold text-zinc-300">FlipHTML5 Reader Mode</span>
        <span class="text-zinc-600">•</span>
        <span class="text-rose-400 font-bold flex items-center gap-0.5">
          <span class="material-symbols-outlined text-[12px]">lock</span>
          <span>Dokumen Dilindungi</span>
        </span>
      </div>

      <!-- Zoom Controls -->
      <div class="flex items-center gap-2">
        <button 
          @click="zoomOut" 
          class="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-bold"
          title="Zoom Out"
        >-</button>
        <span class="font-mono text-zinc-400 text-[10px] min-w-12 text-center">{{ Math.round(zoomLevel * 100) }}%</span>
        <button 
          @click="zoomIn" 
          class="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-xs font-bold"
          title="Zoom In"
        >+</button>
        <button 
          @click="resetZoom" 
          class="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded text-[10px]"
        >Reset</button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useNetworkQuality } from '~/composables/useNetworkQuality';

const props = defineProps<{
  pdfUrl: string;
  title?: string;
}>();

const { effectivePdfQuality } = useNetworkQuality();

const activePdfUrlWithCompression = computed(() => {
  if (!props.pdfUrl) return '';
  if (props.pdfUrl.includes('quality=')) return props.pdfUrl;
  const sep = props.pdfUrl.includes('?') ? '&' : '?';
  return `${props.pdfUrl}${sep}quality=${effectivePdfQuality.value || 'low'}`;
});

const loading = ref(true);
const loadingStatusText = ref('Mengunduh berkas PDF...');
const errorMessage = ref('');
const renderProgress = ref(0);
const downloadProgress = ref(0);
const fileSizeText = ref('');

const pageCount = ref(0);
const currentPage = ref(1);
const pageInput = ref(1);

const zoomLevel = ref(0.6);
const soundEnabled = ref(false);
const showThumbnails = ref(false);
const isFullscreen = ref(false);
const isAutoPlaying = ref(false);

const thumbnailList = ref<string[]>([]);

const viewerAreaRef = ref<HTMLElement | null>(null);
const bookContainerRef = ref<HTMLElement | null>(null);
const flipBookRef = ref<HTMLElement | null>(null);

let pageFlipInstance: any = null;
let autoPlayTimer: any = null;
let pdfDocInstance: any = null;
let currentPdfScale = 1;
const renderedPagesMap = new Map<number, string>();
const renderingPagesSet = new Set<number>();

// Sound synthesizer disabled (silent mode)
const playPageFlipSound = () => {
  // Audio playback completely disabled for silent reading experience
  return;
};

// Render single PDF page on demand (Lazy Loading)
const renderSinglePage = async (pageNum: number): Promise<string | null> => {
  if (!pdfDocInstance) return null;
  if (renderedPagesMap.has(pageNum)) {
    return renderedPagesMap.get(pageNum)!;
  }
  if (renderingPagesSet.has(pageNum)) return null;

  try {
    renderingPagesSet.add(pageNum);
    const page = await pdfDocInstance.getPage(pageNum);
    const viewport = page.getViewport({ scale: currentPdfScale });

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (context) {
      await page.render({ canvasContext: context, viewport }).promise;
      const imgDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      renderedPagesMap.set(pageNum, imgDataUrl);

      const imgEl = document.getElementById(`flip-page-img-${pageNum}`) as HTMLImageElement;
      const loaderEl = document.getElementById(`flip-page-loader-${pageNum}`);

      if (imgEl) {
        imgEl.src = imgDataUrl;
        imgEl.classList.remove('hidden');
      }
      if (loaderEl) {
        loaderEl.classList.add('hidden');
      }

      if (thumbnailList.value.length < pageNum) {
        thumbnailList.value[pageNum - 1] = imgDataUrl;
      }

      return imgDataUrl;
    }
  } catch (e) {
    console.warn(`Lazy render error on page ${pageNum}:`, e);
  } finally {
    renderingPagesSet.delete(pageNum);
  }
  return null;
};

// Lazy render surrounding pages window & prune distant pages from RAM
const lazyRenderSurroundingPages = async (centerPageNum: number) => {
  if (!pdfDocInstance) return;
  const start = Math.max(1, centerPageNum - 2);
  const end = Math.min(pageCount.value, centerPageNum + 4);

  for (let p = start; p <= end; p++) {
    if (!renderedPagesMap.has(p)) {
      renderSinglePage(p);
    }
  }

  // Memory Pruning: Release GPU/RAM memory for pages far from active viewport
  for (const [p] of renderedPagesMap.entries()) {
    if (Math.abs(p - centerPageNum) > 10) {
      renderedPagesMap.delete(p);
      const imgEl = document.getElementById(`flip-page-img-${p}`) as HTMLImageElement;
      const loaderEl = document.getElementById(`flip-page-loader-${p}`);
      if (imgEl) {
        imgEl.src = '';
        imgEl.classList.add('hidden');
      }
      if (loaderEl) {
        loaderEl.classList.remove('hidden');
      }
    }
  }
};

// Render PDF Pages progressively with Lazy Loading
const loadAndRenderPdf = async () => {
  if (!props.pdfUrl || !process.client) return;

  const targetPdfUrl = activePdfUrlWithCompression.value || props.pdfUrl;

  loading.value = true;
  errorMessage.value = '';
  renderProgress.value = 0;
  downloadProgress.value = 0;
  fileSizeText.value = 'Menghubungkan server...';
  thumbnailList.value = [];
  renderedPagesMap.clear();
  renderingPagesSet.clear();
  pdfDocInstance = null;
  loadingStatusText.value = 'Membuka dokumen PDF (Compress Mode)...';

  try {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    // Fast PDF loading with Live Download Progress & Cookie credentials enabled
    const loadingTask = pdfjsLib.getDocument({
      url: targetPdfUrl,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
      withCredentials: true,
      rangeChunkSize: 131072,
      disableAutoFetch: true,
      disableStream: false
    });

    loadingTask.onProgress = (progressData: { loaded: number; total: number }) => {
      if (progressData.total > 0) {
        const percent = Math.min(99, Math.floor((progressData.loaded / progressData.total) * 100));
        const loadedMb = (progressData.loaded / (1024 * 1024)).toFixed(1);
        const totalMb = (progressData.total / (1024 * 1024)).toFixed(1);
        downloadProgress.value = percent;
        fileSizeText.value = `${loadedMb} MB dari ${totalMb} MB`;
        loadingStatusText.value = `Mengunduh Berkas PDF (${percent}%)`;
      } else if (progressData.loaded > 0) {
        const loadedMb = (progressData.loaded / (1024 * 1024)).toFixed(1);
        downloadProgress.value = Math.min(90, Math.floor((progressData.loaded / (5 * 1024 * 1024)) * 100));
        fileSizeText.value = `${loadedMb} MB dimuat...`;
        loadingStatusText.value = `Mengunduh Berkas PDF (${loadedMb} MB)...`;
      }
    };

    const pdfDoc = await loadingTask.promise;
    pdfDocInstance = pdfDoc;
    pageCount.value = pdfDoc.numPages;

    if (pageCount.value === 0) {
      throw new Error('Dokumen PDF tidak berisi halaman.');
    }

    if (flipBookRef.value) {
      flipBookRef.value.innerHTML = '';
    }

    currentPdfScale = Math.min(window.devicePixelRatio || 1, 1.05);
    thumbnailList.value = new Array(pageCount.value).fill('');

    // Step 1: Create HTML Skeleton Containers for ALL pages
    loadingStatusText.value = 'Menyiapkan struktur buku...';
    for (let pageNum = 1; pageNum <= pageCount.value; pageNum++) {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'page-element bg-white shadow-md relative flex items-center justify-center overflow-hidden border-r border-zinc-200';
      pageDiv.id = `flip-page-container-${pageNum}`;

      // Lazy Loading Placeholder Loader
      const loaderDiv = document.createElement('div');
      loaderDiv.id = `flip-page-loader-${pageNum}`;
      loaderDiv.className = 'absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-50 text-zinc-400 text-xs font-semibold select-none p-4 text-center';
      loaderDiv.innerHTML = `<span class="text-xl animate-pulse">📖</span><span>Halaman ${pageNum}</span><span class="text-[10px] text-zinc-400">Memuat tampilan...</span>`;
      pageDiv.appendChild(loaderDiv);

      // Lazy Image Element
      const imgEl = document.createElement('img');
      imgEl.id = `flip-page-img-${pageNum}`;
      imgEl.className = 'hidden w-full h-full object-contain select-none pointer-events-none';
      pageDiv.appendChild(imgEl);

      if (flipBookRef.value) {
        flipBookRef.value.appendChild(pageDiv);
      }
    }

    // Step 2: Render initial 2 pages IMMEDIATELY for instant launch
    loadingStatusText.value = 'Menyiapkan halaman pertama...';
    const initialCount = Math.min(2, pageCount.value);
    for (let p = 1; p <= initialCount; p++) {
      await renderSinglePage(p);
    }

    // Step 3: Initialize PageFlip with all DOM elements at once
    await nextTick();
    const { PageFlip } = await import('page-flip');

    if (flipBookRef.value) {
      pageFlipInstance = new PageFlip(flipBookRef.value, {
        width: 480,
        height: 640,
        size: 'stretch',
        minWidth: 300,
        maxWidth: 900,
        minHeight: 400,
        maxHeight: 1200,
        flippingTime: 400,
        maxShadowOpacity: 0.25,
        showCover: true,
        mobileScrollSupport: true,
        usePortrait: true
      });

      const pageElements = flipBookRef.value.querySelectorAll('.page-element');
      pageFlipInstance.loadFromHTML(pageElements);

      pageFlipInstance.on('flip', (e: any) => {
        currentPage.value = e.data + 1;
        pageInput.value = currentPage.value;
        playPageFlipSound();

        // Lazy render surrounding pages as user flips
        lazyRenderSurroundingPages(currentPage.value);
      });

      currentPage.value = 1;
      pageInput.value = 1;
    }

    // Hide loader immediately!
    loading.value = false;

    // Background pre-render next window (pages 5..8)
    setTimeout(() => {
      lazyRenderSurroundingPages(1);
    }, 200);

  } catch (err: any) {
    console.error('Flipbook Render Error:', err);
    errorMessage.value = err?.message || 'Gagal memproses dokumen PDF.';
    loading.value = false;
  }
};

// Navigation methods
const flipPrev = () => {
  if (pageFlipInstance) {
    pageFlipInstance.flipPrev();
  }
};

const flipNext = () => {
  if (pageFlipInstance) {
    pageFlipInstance.flipNext();
  }
};

const jumpToPage = () => {
  let target = pageInput.value;
  if (isNaN(target)) target = 1;
  target = Math.max(1, Math.min(target, pageCount.value));
  jumpToPageNum(target);
};

const jumpToPageNum = async (pageNum: number) => {
  if (pageFlipInstance && pageNum >= 1 && pageNum <= pageCount.value) {
    await lazyRenderSurroundingPages(pageNum);
    pageFlipInstance.flip(pageNum - 1);
  }
};

// Zoom Controls
const zoomIn = () => {
  if (zoomLevel.value < 1.8) zoomLevel.value += 0.15;
};
const zoomOut = () => {
  if (zoomLevel.value > 0.7) zoomLevel.value -= 0.15;
};
const resetZoom = () => {
  zoomLevel.value = 1;
};

// Auto Play / Slideshow
const toggleAutoPlay = () => {
  isAutoPlaying.value = !isAutoPlaying.value;
  if (isAutoPlaying.value) {
    autoPlayTimer = setInterval(() => {
      if (currentPage.value >= pageCount.value) {
        isAutoPlaying.value = false;
        clearInterval(autoPlayTimer);
      } else {
        flipNext();
      }
    }, 4000);
  } else if (autoPlayTimer) {
    clearInterval(autoPlayTimer);
  }
};

// Fullscreen Toggle
const toggleFullscreen = () => {
  if (!process.client) return;
  const container = viewerAreaRef.value?.parentElement;
  if (!container) return;

  if (!document.fullscreenElement) {
    container.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(() => {});
  } else {
    document.exitFullscreen().then(() => {
      isFullscreen.value = false;
    }).catch(() => {});
  }
};

watch(() => props.pdfUrl, () => {
  loadAndRenderPdf();
});

onMounted(() => {
  loadAndRenderPdf();
});

onUnmounted(() => {
  if (autoPlayTimer) clearInterval(autoPlayTimer);
  if (pageFlipInstance) {
    try {
      pageFlipInstance.destroy();
    } catch {}
  }
});
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
.scrollbar-thin::-webkit-scrollbar {
  height: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: #18181b;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #3f3f46;
  border-radius: 3px;
}
</style>
