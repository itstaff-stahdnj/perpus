<template>
  <Teleport to="body">
    <div 
      v-if="modelValue" 
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      @click.self="close"
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
              <p class="text-[11px] text-zinc-400 truncate">
                ⚡ Mode Baca Online • Perpustakaan STAH DNJ
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- Open in New Tab Button -->
            <a 
              :href="activePdfUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Buka PDF di Tab Baru / Download"
            >
              <span class="material-symbols-outlined text-sm">open_in_new</span>
              <span class="hidden sm:inline">Buka Tab Baru</span>
            </a>

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
          
          <!-- Loading State -->
          <div v-if="loading" class="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-3 z-10 text-zinc-300">
            <div class="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p class="text-xs font-bold animate-pulse">Memuat E-Book Digital...</p>
          </div>

          <!-- Embedded PDF Viewer -->
          <iframe 
            :src="viewerSrc" 
            class="w-full h-full border-0"
            @load="loading = false"
            title="E-Book Reader"
          ></iframe>
        </div>

        <!-- Reader Footer Status -->
        <div class="bg-zinc-950 px-4 py-2 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400 shrink-0">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Hak Cipta Dilindungi • Koleksi Digital STAH DNJ</span>
          </div>
          <span class="font-mono text-zinc-500 text-[10px]">Akses Semua Perangkat</span>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  pdfUrl?: string;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const loading = ref(true);

// Fallback demo PDF if no PDF file URL is provided
const samplePdf = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const activePdfUrl = computed(() => {
  return props.pdfUrl && props.pdfUrl.trim() !== '' ? props.pdfUrl : samplePdf;
});

const viewerSrc = computed(() => {
  // Use browser embed or Google Drive PDF viewer fallback for online viewing
  return `https://docs.google.com/viewer?url=${encodeURIComponent(activePdfUrl.value)}&embedded=true`;
});

const close = () => {
  emit('update:modelValue', false);
};

watch(() => props.modelValue, (val) => {
  if (val) {
    loading.value = true;
  }
});
</script>
