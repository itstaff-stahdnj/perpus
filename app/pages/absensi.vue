<template>
  <div class="min-h-screen flex flex-col bg-surface text-on-surface font-sans">
    <!-- Kiosk Top Header -->
    <header class="bg-primary dark:bg-primary-container text-white shadow-md fixed top-0 left-0 w-full z-50 h-20 flex justify-between items-center px-margin-mobile md:px-margin-desktop">
      <div class="flex flex-col">
        <NuxtLink to="/" class="flex items-center gap-2">
          <span class="text-headline-md font-headline-md font-bold text-secondary-fixed">
            {{ siteSettings?.app_name || 'Perpustakaan STAH Dharma Nusantara' }}
          </span>
        </NuxtLink>
        <span class="text-label-md font-label-md opacity-80 uppercase tracking-wider text-xs">System Presensi Kedatangan Akademik</span>
      </div>

      <div class="flex items-center gap-6 md:gap-8">
        <div class="flex flex-col items-end">
          <span class="text-headline-lg text-2xl md:text-headline-lg font-bold font-mono tracking-wider">{{ currentTime }}</span>
          <span class="text-xs md:text-label-md opacity-90">{{ currentDate }}</span>
        </div>
        <div class="h-10 w-[1px] bg-white/20 hidden sm:block"></div>
        <NuxtLink to="/" class="material-symbols-outlined text-3xl text-secondary-fixed hover:scale-110 transition-transform" title="Beranda">
          account_balance
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content Grid -->
    <main class="flex-grow pt-28 pb-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full grid grid-cols-12 gap-gutter">
      <!-- Success/Error Alert Toast -->
      <div v-if="alertMessage" class="col-span-12">
        <div 
          class="p-6 rounded-2xl shadow-xl flex items-center justify-between transition-all duration-500"
          :class="alertSuccess ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'"
        >
          <div class="flex items-center gap-4">
            <span class="material-symbols-outlined text-4xl">{{ alertSuccess ? 'check_circle' : 'error' }}</span>
            <div>
              <h4 class="font-bold text-lg">{{ alertSuccess ? 'Presensi Berhasil' : 'Presensi Gagal' }}</h4>
              <p class="text-sm opacity-95">{{ alertMessage }}</p>
            </div>
          </div>
          <button @click="alertMessage = ''" class="hover:bg-white/20 p-2 rounded-full transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <!-- Left Column: Scanner -->
      <section class="col-span-12 lg:col-span-5 flex flex-col gap-unit">
        <div class="bg-white rounded-2xl card-shadow p-8 flex flex-col items-center justify-between h-full min-h-[500px] border border-outline-variant">
          <div class="text-center">
            <h2 class="font-headline-md text-headline-md text-primary font-bold mb-2">Scan Kartu Anggota</h2>
            <p class="font-body-md text-body-md text-on-surface-variant">Arahkan QR Code atau Barcode ke sensor kamera</p>
          </div>

          <div class="relative w-72 h-72 border-4 border-dashed border-outline-variant rounded-2xl flex items-center justify-center overflow-hidden bg-surface-container-low my-6">
            <div class="absolute inset-0 flex items-center justify-center opacity-10">
              <span class="material-symbols-outlined text-[160px]">qr_code_scanner</span>
            </div>

            <!-- Scanner Animation Line -->
            <div class="scanning-line absolute left-0 right-0 h-1 bg-secondary shadow-[0_0_15px_rgba(200,155,60,0.8)] z-10"></div>

            <!-- Decorative Corners -->
            <div class="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-secondary rounded-tl-sm"></div>
            <div class="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-secondary rounded-tr-sm"></div>
            <div class="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-secondary rounded-bl-sm"></div>
            <div class="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-secondary rounded-br-sm"></div>

            <div 
              class="w-64 h-64 bg-cover bg-center rounded-lg opacity-80" 
              style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDEWFAJHfXWrShr6KikZRRh1EeRBsjE_Quqr01mYxhTG94UIuBiKlLd13jwYLPa7tXOslnOM0dOiRkoMhvw7mtwtgjYuNn2Pp3xrfqApcKsaNumSMKqrsQf6rjANHBsC7HAS2AZ2po1epCpB6grisXEsicPtSIT4hnbJSxALaLYf0-7Adtg_zDva185rlQ4JhG07YXZ78NW7h3x1o04C81Whxc2bBTUPLGOF6JDd3kljhpeTRXR0tyBZg')"
            ></div>
          </div>

          <button 
            :disabled="submitting"
            @click="handleCheckIn"
            class="w-full py-5 bg-secondary hover:bg-on-secondary-container text-white font-bold text-headline-md rounded-xl transition-all shadow-md active:scale-[98%] flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            <span class="material-symbols-outlined text-2xl">login</span>
            <span>{{ submitting ? 'Memproses...' : 'Check-In Masuk' }}</span>
          </button>
        </div>
      </section>

      <!-- Right Column: Manual Entry & Numeric Keypad -->
      <section class="col-span-12 lg:col-span-7 flex flex-col gap-gutter">
        <div class="bg-white rounded-2xl card-shadow p-8 flex flex-col h-full min-h-[500px] border border-outline-variant">
          <div class="mb-6">
            <h2 class="font-headline-md text-headline-md text-primary font-bold mb-2">Input ID Manual</h2>
            <p class="font-body-md text-body-md text-on-surface-variant">Gunakan keypad di bawah jika QR Code kartu tidak terbaca</p>
          </div>

          <!-- Display Screen -->
          <div class="bg-surface-container-high rounded-xl p-6 mb-8 flex items-center justify-center border-2 border-outline-variant min-h-[90px]">
            <span class="text-4xl md:text-[56px] font-bold tracking-[0.2em] text-primary font-mono">
              {{ currentID || '000-0' }}
            </span>
          </div>

          <!-- Keypad Grid -->
          <div class="grid grid-cols-3 gap-4 flex-grow">
            <button v-for="num in ['1','2','3','4','5','6','7','8','9']" :key="num" 
                    @click="pressKey(num)" 
                    class="keypad-button h-20 md:h-24 bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant rounded-xl text-3xl font-bold text-primary transition-colors active:scale-95">
              {{ num }}
            </button>
            
            <button @click="clearID" class="keypad-button h-20 md:h-24 bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded-xl text-lg font-bold transition-colors uppercase active:scale-95">
              CLEAR
            </button>
            
            <button @click="pressKey('0')" class="keypad-button h-20 md:h-24 bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant rounded-xl text-3xl font-bold text-primary transition-colors active:scale-95">
              0
            </button>
            
            <button @click="backspaceID" class="keypad-button h-20 md:h-24 bg-surface-container-high hover:bg-outline-variant border border-outline-variant rounded-xl text-primary font-bold transition-colors active:scale-95 flex items-center justify-center">
              <span class="material-symbols-outlined text-3xl">backspace</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Information Cards (Bottom Row) -->
      <section class="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-gutter mt-4">
        <!-- Live Occupancy Card -->
        <div class="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-4 border border-outline-variant">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-secondary text-3xl">groups</span>
              <h3 class="font-headline-md text-headline-md text-primary font-bold">Live Occupancy</h3>
            </div>
            <span class="font-label-md text-xs bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-bold uppercase">Real-time</span>
          </div>

          <div class="flex justify-between items-end mb-1">
            <span class="font-body-lg text-on-surface-variant">Kapasitas Pengunjung</span>
            <span class="font-headline-md font-bold text-primary text-xl">{{ currentOccupancy }}/100</span>
          </div>

          <div class="w-full bg-surface-container-high rounded-full h-4 overflow-hidden">
            <div class="bg-secondary h-full rounded-full transition-all duration-1000" :style="{ width: `${currentOccupancy}%` }"></div>
          </div>
          <p class="font-caption text-caption text-on-surface-variant italic">Data presensi diperbarui secara otomatis.</p>
        </div>

        <!-- Visitor Information Card -->
        <div class="bg-primary-container rounded-2xl card-shadow p-6 flex items-start gap-6 border-l-8 border-secondary text-white">
          <div class="bg-secondary-container p-3 rounded-xl shrink-0">
            <span class="material-symbols-outlined text-on-secondary-container text-3xl">info</span>
          </div>
          <div class="flex flex-col gap-2">
            <h3 class="font-headline-md text-headline-md text-white font-bold">Informasi Pemustaka</h3>
            <p class="font-body-md text-white/90 leading-relaxed text-sm">
              Harap Tenang &amp; Menjaga Kebersihan Lingkungan Perpustakaan. <br/>
              Hormati rekan akademisi yang sedang melakukan riset. Pastikan perangkat seluler dalam mode hening.
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Kiosk Footer -->
    <footer class="bg-surface-container-low border-t border-outline-variant w-full px-margin-mobile md:px-margin-desktop py-4 mt-auto">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-2 w-full max-w-container-max mx-auto text-xs text-on-surface-variant">
        <div>
          <p class="font-bold text-primary">© 2026 STAH Dharma Nusantara Jakarta</p>
          <p>Academic Library Management Kiosk System v2.4.0</p>
        </div>
        <div class="flex gap-6">
          <span class="text-secondary font-bold">Kapasitas: {{ currentOccupancy }}/100</span>
          <NuxtLink to="/layanan" class="hover:text-secondary transition-colors">Tata Tertib</NuxtLink>
          <NuxtLink to="/tentang" class="hover:text-secondary transition-colors">Meja Bantuan</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { usePustakaApi, type SiteSettings } from '../composables/usePustakaApi';

const { getSettings, submitAttendance } = usePustakaApi();

const siteSettings = ref<SiteSettings | null>(null);
const currentID = ref('');
const currentTime = ref('');
const currentDate = ref('');
const currentOccupancy = ref(45);
const submitting = ref(false);
const alertMessage = ref('');
const alertSuccess = ref(true);

let clockTimer: any = null;

const updateClock = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}`;

  currentDate.value = now.toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const pressKey = (val: string) => {
  if (currentID.value.length < 12) {
    currentID.value += val;
  }
};

const clearID = () => {
  currentID.value = '';
};

const backspaceID = () => {
  currentID.value = currentID.value.slice(0, -1);
};

const handleCheckIn = async () => {
  const targetId = currentID.value.trim() || '2026001';
  submitting.value = true;
  alertMessage.value = '';

  try {
    const res = await submitAttendance(targetId);
    if (res?.success) {
      alertSuccess.value = true;
      alertMessage.value = res.message || `Presensi berhasil tercatat untuk ID: ${targetId}`;
      if (currentOccupancy.value < 100) {
        currentOccupancy.value += 1;
      }
      currentID.value = '';
    } else {
      alertSuccess.value = false;
      alertMessage.value = res.message || 'Presensi gagal. Silakan coba lagi.';
    }
  } catch (err: any) {
    alertSuccess.value = false;
    alertMessage.value = err.message || 'Terjadi kesalahan sistem presensi.';
  } finally {
    submitting.value = false;

    setTimeout(() => {
      alertMessage.value = '';
    }, 4000);
  }
};

onMounted(async () => {
  updateClock();
  clockTimer = setInterval(updateClock, 1000);

  try {
    const res = await getSettings();
    if (res?.success && res.data) {
      siteSettings.value = res.data;
    }
  } catch (e) {
    console.error('Error fetching settings for attendance kiosk:', e);
  }
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
});
</script>

<style scoped>
.card-shadow {
  box-shadow: 0px 4px 12px rgba(10, 58, 90, 0.05);
}
.scanning-line {
  animation: scan 2s infinite ease-in-out;
}
@keyframes scan {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}
</style>
