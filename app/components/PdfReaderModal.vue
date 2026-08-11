<template>
  <Teleport to="body">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-3 select-none"
      @click.self="close"
      @contextmenu.prevent
    >
      <div class="bg-zinc-950 border border-zinc-800 rounded-none sm:rounded-2xl w-full h-full sm:h-[95vh] sm:max-w-6xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <!-- Header & Toolbar -->
        <div class="bg-zinc-900 px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0 text-white z-20">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-base shrink-0">
              📖
            </span>
            <div class="min-w-0">
              <h3 class="font-extrabold text-xs sm:text-sm text-zinc-100 truncate leading-tight">
                {{ title || 'Pembaca E-Book Digital Flipbook' }}
              </h3>
              <p class="text-[10px] text-zinc-400 truncate flex items-center gap-1.5">
                <span>⚡ Mode FlipHTML5 3D</span>
                <span>•</span>
                <span class="text-rose-400 font-bold flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-[12px]">lock</span>
                  <span>Dokumen Dilindungi</span>
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- View Mode Switcher: 3D Flipbook vs Scroll PDF -->
            <div class="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
              <button 
                @click="readerMode = 'flipbook'"
                class="px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                :class="readerMode === 'flipbook' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'"
              >
                <span>📖 3D Flipbook</span>
              </button>
              <button 
                @click="readerMode = 'scroll'"
                class="px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                :class="readerMode === 'scroll' ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'"
              >
                <span>📜 Scroll Mode</span>
              </button>
            </div>

            <!-- Close Reader Button -->
            <button 
              @click="close" 
              class="w-9 h-9 bg-zinc-800 hover:bg-rose-900/80 hover:text-rose-200 text-zinc-300 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup Reader"
            >
              <span class="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        <!-- Main Body: 3D Flipbook Viewer vs Scroll Viewer -->
        <div class="flex-1 bg-zinc-950 relative overflow-hidden flex flex-col">
          
          <template v-if="activePdfUrl">
            <!-- Mode 1: FlipHTML5 Style 3D Flipbook -->
            <FlipbookViewer 
              v-if="readerMode === 'flipbook'" 
              :pdf-url="streamPdfUrl" 
              :title="title"
              class="w-full h-full"
            />

            <!-- Mode 2: Standard PDF Scroll Viewer -->
            <div v-else class="w-full h-full relative">
              <div v-if="loading" class="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-3 z-10 text-zinc-300">
                <div class="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <p class="text-xs font-bold animate-pulse">Memuat E-Book Digital (Scroll Mode)...</p>
              </div>

              <iframe 
                :src="viewerSrc" 
                class="w-full h-full border-0 pointer-events-auto"
                @load="loading = false"
                title="E-Book Scroll Reader"
              ></iframe>
            </div>
          </template>

          <!-- Empty / Error State -->
          <div v-else class="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md mx-auto my-auto">
            <div class="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-3xl">
              📄
            </div>
            <div class="space-y-1">
              <h4 class="text-lg font-bold text-white">Berkas PDF Belum Tersedia</h4>
              <p class="text-xs text-zinc-400 leading-relaxed">
                Buku digital ini belum memiliki berkas dokumen PDF yang terunggah di server perpustakaan. Silakan hubungi petugas pustakawan untuk pengunggahan file.
              </p>
            </div>
            <button 
              @click="close"
              class="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white rounded-xl transition-colors cursor-pointer"
            >
              Tutup Pembaca
            </button>
          </div>

        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import FlipbookViewer from './FlipbookViewer.vue';

const props = defineProps<{
  modelValue: boolean;
  pdfUrl?: string;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const loading = ref(true);
const readerMode = ref<'flipbook' | 'scroll'>('flipbook');

const activePdfUrl = computed(() => {
  if (!props.pdfUrl || props.pdfUrl.trim() === '') return '';
  let url = props.pdfUrl.trim();

  if (url.startsWith('http://') || url.startsWith('https://')) {
    try {
      const parsed = new URL(url);
      if (!parsed.pathname.startsWith('/storage/')) {
        parsed.pathname = `/storage${parsed.pathname.startsWith('/') ? '' : '/'}${parsed.pathname}`;
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }

  let cleanPath = url.startsWith('/') ? url : `/${url}`;
  if (!cleanPath.startsWith('/storage/')) {
    cleanPath = `/storage${cleanPath}`;
  }
  return `https://portal-perpus.stahdnj.ac.id${cleanPath}`;
});

const streamPdfUrl = computed(() => {
  if (!activePdfUrl.value) return '';
  return `/api/pdf-stream?url=${encodeURIComponent(activePdfUrl.value)}`;
});

const viewerSrc = computed(() => {
  if (!activePdfUrl.value) return '';
  return `${streamPdfUrl.value}#toolbar=0&navpanes=0&scrollbar=0`;
});

const close = () => {
  emit('update:modelValue', false);
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.modelValue) return;
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P')) {
    e.preventDefault();
    e.stopPropagation();
    alert('⚠️ Pengunduhan dan pencetakan dokumen PDF dilindungi oleh hak cipta Perpustakaan STAH DNJ.');
  }
};

onMounted(() => {
  if (process.client) {
    window.addEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('keydown', handleKeyDown);
  }
});

watch(() => props.modelValue, (val) => {
  if (val) {
    loading.value = true;
  }
});
</script>
