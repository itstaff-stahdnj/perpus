<template>
  <Teleport to="body">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none"
      @click.self="close"
      @contextmenu.prevent
    >
      <div class="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        <!-- Reader Header & Toolbar -->
        <div class="bg-zinc-950 px-4 py-3 border-b border-zinc-800 flex items-center justify-between gap-3 shrink-0 text-white">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center text-base shrink-0">
              📖
            </span>
            <div class="min-w-0">
              <h3 class="font-extrabold text-sm sm:text-base text-zinc-100 truncate leading-tight">
                {{ title || 'Pembaca E-Book Digital' }}
              </h3>
              <p class="text-[11px] text-zinc-400 truncate flex items-center gap-1">
                <span>⚡ Mode Baca Online Saja</span>
                <span>•</span>
                <span class="text-rose-400 font-bold flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-[12px]">lock</span>
                  <span>Dokumen Dilindungi</span>
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- Protected Badge (Download Disabled) -->
            <div 
              v-if="activePdfUrl"
              class="px-3 py-1.5 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-1.5"
              title="Fitur download dan cetak dinonaktifkan untuk melindungi hak cipta"
            >
              <span class="material-symbols-outlined text-sm text-rose-400">lock</span>
              <span class="hidden sm:inline">Tidak Dapat Di-download</span>
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

        <!-- Reader Main Viewer Body -->
        <div class="flex-1 bg-zinc-900 relative overflow-hidden flex flex-col items-center justify-center">
          
          <template v-if="activePdfUrl">
            <!-- Loading State -->
            <div v-if="loading" class="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-3 z-10 text-zinc-300">
              <div class="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <p class="text-xs font-bold animate-pulse">Memuat E-Book Digital (Mode Proteksi)...</p>
            </div>

            <!-- Embedded PDF Viewer -->
            <iframe 
              :src="viewerSrc" 
              class="w-full h-full border-0 pointer-events-auto"
              @load="loading = false"
              title="E-Book Reader"
            ></iframe>
          </template>

          <div v-else class="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md">
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

        <!-- Reader Footer Status -->
        <div class="bg-zinc-950 px-4 py-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full" :class="activePdfUrl ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"></span>
            <span>🔒 Hak Cipta Dilindungi • Proteksi Unduhan PDF Aktif • STAH DNJ</span>
          </div>
          <span class="font-mono text-zinc-500 text-[10px]">Read-Only Mode</span>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  pdfUrl?: string;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const loading = ref(true);

const activePdfUrl = computed(() => {
  if (!props.pdfUrl || props.pdfUrl.trim() === '') return '';
  if (props.pdfUrl.startsWith('http://') || props.pdfUrl.startsWith('https://') || props.pdfUrl.startsWith('data:')) {
    return props.pdfUrl;
  }
  const cleanPath = props.pdfUrl.startsWith('/') ? props.pdfUrl : `/${props.pdfUrl}`;
  return `https://portal-perpus.stahdnj.ac.id${cleanPath}`;
});

const viewerSrc = computed(() => {
  if (!activePdfUrl.value) return '';
  return `/api/pdf-stream?url=${encodeURIComponent(activePdfUrl.value)}#toolbar=0&navpanes=0&scrollbar=0`;
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
