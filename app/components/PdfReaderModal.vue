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
                {{ title || 'Pembaca E-Book Digital (Fast Reader)' }}
              </h3>
              <p class="text-[10px] text-zinc-400 truncate flex items-center gap-1.5">
                <span>⚡ Mode Membaca Ringan &amp; Hemat Data</span>
                <span>•</span>
                <span class="text-rose-400 font-bold flex items-center gap-0.5">
                  <Icon name="material-symbols:lock" class="text-[12px]" />
                  <span>Dokumen Dilindungi</span>
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <!-- Network Adaptive Quality Selector -->
            <div class="hidden sm:flex items-center gap-1.5 bg-zinc-950 px-2 py-1 rounded-xl border border-zinc-800 text-[11px]">
              <span class="text-zinc-400 font-medium hidden lg:inline">Jaringan:</span>
              <span class="font-bold text-amber-400 flex items-center gap-1 text-[10px] sm:text-[11px]">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                {{ networkLabel }}
              </span>
              <select 
                :value="manualQualityOverride || 'auto'"
                @change="(e: any) => setManualQuality(e.target.value)"
                class="bg-zinc-900 text-zinc-200 border border-zinc-700 text-[10px] rounded-lg px-1.5 py-0.5 font-bold focus:outline-none cursor-pointer"
                title="Pilih Kualitas PDF"
              >
                <option value="auto">⚡ Auto (Otomatis)</option>
                <option value="low">📉 Hemat Data (Low)</option>
                <option value="high">✨ Original (High)</option>
              </select>
            </div>

            <!-- View Mode Indicator: Fast Light Reader -->
            <div class="flex items-center bg-zinc-950 px-3 py-1 rounded-xl border border-zinc-800 text-xs">
              <span class="text-blue-400 font-bold text-[11px] flex items-center gap-1">
                <Icon name="material-symbols:chrome-reader-mode" class="text-sm" />
                <span>Mode Membaca Ringan</span>
              </span>
            </div>

            <!-- Close Reader Button -->
            <button 
              @click="close" 
              class="w-9 h-9 bg-zinc-800 hover:bg-rose-900/80 hover:text-rose-200 text-zinc-300 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup Reader"
            >
              <Icon name="material-symbols:close" class="text-lg" />
            </button>
          </div>
        </div>

        <!-- Main Body: Ultra-Light Fast Reader via Blob URL Stream -->
        <div class="flex-1 bg-zinc-950 relative overflow-hidden flex flex-col">
          
          <div v-if="loading" class="absolute inset-0 bg-zinc-900 flex flex-col items-center justify-center gap-3 z-20 text-zinc-300">
            <div class="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p class="text-xs font-bold animate-pulse">Memuat E-Book Digital (Fast Reader)...</p>
          </div>

          <template v-if="pdfBlobUrl">
            <div class="w-full h-full relative">
              <object 
                :data="`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`" 
                type="application/pdf"
                class="w-full h-full"
              >
                <iframe 
                  :src="`${pdfBlobUrl}#toolbar=0&navpanes=0&scrollbar=0`" 
                  class="w-full h-full border-0 pointer-events-auto"
                  title="E-Book Reader"
                ></iframe>
              </object>
            </div>
          </template>

          <!-- Error / Missing PDF State -->
          <div v-else-if="!loading && (errorMessage || !activePdfUrl)" class="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md mx-auto my-auto text-zinc-200">
            <div class="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center text-3xl">
              <Icon name="material-symbols:warning" />
            </div>
            <div class="space-y-1">
              <h4 class="text-base font-bold text-white">Tidak Dapat Membuka E-Book</h4>
              <p class="text-xs text-zinc-400 leading-relaxed">
                {{ errorMessage || 'Dokumen PDF belum terunggah atau lokasi berkas di server backend perpustakaan tidak ditemukan.' }}
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
import { useNetworkQuality } from '~/composables/useNetworkQuality';

const { effectivePdfQuality, networkLabel, manualQualityOverride, setManualQuality } = useNetworkQuality();

const props = defineProps<{
  modelValue: boolean;
  pdfUrl?: string;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const loading = ref(true);
const errorMessage = ref('');
const pdfBlobUrl = ref('');
const readerMode = ref<'scroll' | 'flipbook'>('scroll');

const activePdfUrl = computed(() => {
  if (!props.pdfUrl || props.pdfUrl.trim() === '') return '';
  let url = props.pdfUrl.trim();

  // If already a relative or full Nuxt proxy endpoint (/api/pdf-stream)
  if (url.includes('api/pdf-stream')) {
    return url.startsWith('/') ? url : `/${url}`;
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  let cleanPath = url.startsWith('/') ? url : `/${url}`;
  if (!cleanPath.startsWith('/storage/') && !cleanPath.startsWith('/api/')) {
    cleanPath = `/storage${cleanPath}`;
  }
  return `https://portal-perpus.stahdnj.ac.id${cleanPath}`;
});

const streamPdfUrl = computed(() => {
  if (!activePdfUrl.value) return '';
  
  if (activePdfUrl.value.includes('api/pdf-stream')) {
    let cleanStream = activePdfUrl.value.startsWith('/') ? activePdfUrl.value : `/${activePdfUrl.value}`;
    if (!cleanStream.includes('quality=')) {
      cleanStream += `${cleanStream.includes('?') ? '&' : '?'}quality=${effectivePdfQuality.value}`;
    }
    return cleanStream;
  }

  return `/api/pdf-stream?url=${encodeURIComponent(activePdfUrl.value)}&quality=${effectivePdfQuality.value}`;
});

const cleanupBlob = () => {
  if (pdfBlobUrl.value) {
    URL.revokeObjectURL(pdfBlobUrl.value);
    pdfBlobUrl.value = '';
  }
};

const loadPdfStream = async () => {
  if (!props.pdfUrl || !props.modelValue) return;

  cleanupBlob();
  loading.value = true;
  errorMessage.value = '';

  try {
    const targetUrl = streamPdfUrl.value;
    const response = await fetch(targetUrl, {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/pdf, */*'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      if (text.includes('Login SSO') || response.status === 401 || response.status === 403) {
        errorMessage.value = '🔑 Login SSO Diperlukan. Silakan masuk ke akun portal perpustakaan Anda terlebih dahulu.';
      } else {
        errorMessage.value = 'Dokumen PDF belum terunggah atau lokasi berkas di server backend perpustakaan tidak ditemukan.';
      }
      loading.value = false;
      return;
    }

    const blob = await response.blob();
    if (blob.type.includes('text/html')) {
      const htmlText = await blob.text();
      if (htmlText.includes('Login SSO')) {
        errorMessage.value = '🔑 Login SSO Diperlukan. Silakan masuk ke akun portal perpustakaan Anda terlebih dahulu.';
      } else {
        errorMessage.value = 'Format berkas tidak valid atau lokasi file PDF tidak ditemukan.';
      }
      loading.value = false;
      return;
    }

    const pdfBlob = new Blob([blob], { type: 'application/pdf' });
    pdfBlobUrl.value = URL.createObjectURL(pdfBlob);
  } catch (err: any) {
    console.error('Failed to fetch PDF blob:', err);
    errorMessage.value = 'Terjadi kendala koneksi saat memuat dokumen e-book.';
  } finally {
    loading.value = false;
  }
};

const close = () => {
  cleanupBlob();
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
  cleanupBlob();
  if (process.client) {
    window.removeEventListener('keydown', handleKeyDown);
  }
});

watch(() => props.modelValue, (val) => {
  if (val) {
    loadPdfStream();
  } else {
    cleanupBlob();
  }
});

watch([effectivePdfQuality, () => props.pdfUrl], () => {
  if (props.modelValue) {
    loadPdfStream();
  }
});
</script>
