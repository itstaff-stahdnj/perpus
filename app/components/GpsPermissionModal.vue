<template>
  <transition name="fade">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-zinc-800 animate-in fade-in zoom-in duration-200 text-center space-y-6">
        
        <!-- Top Icon Header -->
        <div class="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div class="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"></div>
          <div class="w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center text-4xl shadow-lg shadow-blue-500/30">
            <span class="material-symbols-outlined text-4xl">location_on</span>
          </div>
        </div>

        <!-- Main Title & Description -->
        <div class="space-y-2">
          <span class="px-3 py-1 bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 rounded-full text-[11px] font-black uppercase tracking-wider">
            ⚠️ WAJIB UNTUK LAYANAN BUKU
          </span>
          <h3 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight pt-1">
            Aktifkan Akses Lokasi GPS
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-xs mx-auto">
            Sistem Perpustakaan STAH DNJ membutuhkan verifikasi GPS untuk memisahkan layanan <strong>Pinjam Mandiri di Kampus</strong> dan <strong>Reservasi Luar Kampus</strong>.
          </p>
        </div>

        <!-- Action Button -->
        <div class="space-y-3 pt-2">
          <button 
            @click="handleRequestGps"
            :disabled="requesting"
            class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span class="material-symbols-outlined text-lg" :class="requesting ? 'animate-spin' : ''">
              {{ requesting ? 'sync' : 'my_location' }}
            </span>
            <span>{{ requesting ? 'Mendeteksi Lokasi GPS...' : '📍 Izinkan & Aktifkan GPS Sekarang' }}</span>
          </button>

          <!-- Error / Permission Denied Helper -->
          <div v-if="errorMessage" class="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-2xl text-[11px] text-rose-800 dark:text-rose-300 text-left space-y-1">
            <p class="font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">warning</span>
              <span>Akses Lokasi Diblokir di Browser</span>
            </p>
            <p class="leading-normal">
              Silakan klik ikon gembok 🔒 di sebelah URL browser Anda, pilih <strong>Location (Lokasi)</strong>, ubah menjadi <strong>Allow (Izinkan)</strong>, lalu muat ulang halaman.
            </p>
          </div>
        </div>

        <!-- Security Footer Badge -->
        <div class="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-zinc-500">
          <span class="material-symbols-outlined text-sm text-emerald-500">verified_user</span>
          <span>Privasi dijamin: Lokasi hanya dipakai untuk verifikasi area kampus STAH DNJ.</span>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCampusNetwork } from '../composables/useCampusNetwork';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'granted'): void;
}>();

const { checkGeolocation, geoError } = useCampusNetwork();
const requesting = ref(false);
const errorMessage = ref<string | null>(null);

const handleRequestGps = () => {
  if (!process.client || !navigator.geolocation) {
    errorMessage.value = 'Browser Anda tidak mendukung layanan Geolocation GPS.';
    return;
  }

  requesting.value = true;
  errorMessage.value = null;

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      requesting.value = false;
      checkGeolocation();
      emit('granted');
      emit('close');
    },
    (err) => {
      requesting.value = false;
      if (err.code === err.PERMISSION_DENIED) {
        errorMessage.value = 'Izin lokasi ditolak. Mohon aktifkan izin GPS pada pengaturan browser Anda.';
      } else {
        errorMessage.value = 'Gagal mengambil koordinat GPS. Pastikan GPS/Location device Anda menyala.';
      }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
