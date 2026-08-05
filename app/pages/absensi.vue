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

      <div class="flex items-center gap-4 md:gap-6">
        <div class="flex flex-col items-end">
          <span class="text-headline-lg text-xl md:text-2xl font-bold font-mono tracking-wider">{{ currentTime }}</span>
          <span class="text-xs md:text-label-md opacity-90">{{ currentDate }}</span>
        </div>
        <div class="h-10 w-[1px] bg-white/20 hidden sm:block"></div>
        <button 
          @click="toggleFullscreen" 
          class="flex items-center gap-2 bg-secondary text-white hover:bg-on-secondary-container px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
          :title="isFullscreen ? 'Keluar Layar Penuh' : 'Aktifkan Mode Display Kiosk'"
        >
          <span class="material-symbols-outlined text-lg">{{ isFullscreen ? 'fullscreen_exit' : 'fullscreen' }}</span>
          <span class="hidden sm:inline">{{ isFullscreen ? 'Keluar Display' : 'Mode Display TV / Kiosk' }}</span>
        </button>
        <NuxtLink to="/" class="material-symbols-outlined text-3xl text-secondary-fixed hover:scale-110 transition-transform" title="Beranda">
          account_balance
        </NuxtLink>
      </div>
    </header>

    <!-- Main Content Grid 3-Kolom -->
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
              <p v-if="alertSuccess && lastCheckedUser" class="text-xs mt-1 opacity-90 font-medium">
                {{ lastCheckedUser.name }} — {{ lastCheckedUser.nim || lastCheckedUser.role }}
              </p>
            </div>
          </div>
          <button @click="alertMessage = ''" class="hover:bg-white/20 p-2 rounded-full transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <!-- Kolom 1 (Kiri): Scan Kartu Anggota -->
      <section class="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
        <div class="bg-white rounded-2xl card-shadow p-6 flex flex-col items-center border border-outline-variant relative overflow-hidden h-full">
          <div class="w-full flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl mb-4 text-xs font-bold shadow-xs">
            <div class="flex items-center gap-2">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span>Sensor Scanner (Standby)</span>
            </div>
            <span class="material-symbols-outlined text-sm text-emerald-600">qr_code_2</span>
          </div>

          <div class="text-center">
            <h2 class="font-headline-md text-headline-md text-primary font-bold mb-1">Scan Kartu Anggota</h2>
            <p class="font-body-md text-on-surface-variant text-xs">Arahkan QR Code Kartu ke Sensor Scanner USB/Kamera</p>
          </div>

          <div class="w-full mt-4">
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-primary">qr_code_scanner</span>
              <input 
                ref="qrInputRef"
                v-model="currentID" 
                type="text" 
                class="w-full pl-10 pr-4 py-3 bg-surface-container-low border-2 border-primary/40 focus:border-secondary rounded-xl text-center font-mono font-bold text-base text-primary outline-none transition-all placeholder:text-xs placeholder:font-sans"
                placeholder="Arahkan scanner QR Code..." 
                @keyup.enter="handleCheckIn"
              />
            </div>
          </div>

          <div class="relative w-full h-64 border-4 border-dashed border-primary/30 rounded-2xl flex items-center justify-center overflow-hidden bg-surface-container-low my-4">
            <div class="absolute inset-0 flex items-center justify-center opacity-10">
              <span class="material-symbols-outlined text-[140px] text-primary">qr_code_scanner</span>
            </div>
            <div class="scanning-line absolute left-0 right-0 h-1 bg-secondary shadow-[0_0_15px_rgba(200,155,60,0.8)] z-10"></div>
            <div class="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-secondary rounded-tl-sm"></div>
            <div class="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-secondary rounded-tr-sm"></div>
            <div class="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-secondary rounded-bl-sm"></div>
            <div class="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-secondary rounded-br-sm"></div>

            <div class="text-center p-4 z-0">
              <span class="material-symbols-outlined text-6xl text-secondary mb-2 animate-bounce">sensors</span>
              <p class="text-sm font-bold text-primary">Siap Menerima Scan QR</p>
              <p class="text-xs text-on-surface-variant">Arahkan QR Code Kartu ke Scanner</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Kolom 2 (Tengah): Masukkan QR Token Manual -->
      <section class="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
        <div class="bg-white rounded-2xl card-shadow p-6 flex flex-col border border-outline-variant h-full">
          <div class="mb-4">
            <h2 class="font-headline-md text-headline-md text-primary font-bold mb-1">Input QR Token Manual</h2>
            <p class="font-body-md text-on-surface-variant text-xs">Masukkan kode QR Token/NIM jika kartu tidak terbaca</p>
          </div>

          <!-- Display Screen -->
          <div class="bg-surface-container-high rounded-xl p-4 mb-4 flex items-center justify-center border-2 border-outline-variant min-h-[70px]">
            <span class="text-2xl md:text-3xl font-bold tracking-[0.15em] text-primary font-mono">
              {{ currentID || '— — — — —' }}
            </span>
          </div>

          <!-- Keypad Grid -->
          <div class="grid grid-cols-3 gap-2.5 flex-grow">
            <button v-for="num in ['1','2','3','4','5','6','7','8','9']" :key="num" 
                    @click="pressKey(num)" 
                    class="keypad-button h-14 md:h-16 bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant rounded-xl text-xl font-bold text-primary transition-colors active:scale-95 cursor-pointer">
              {{ num }}
            </button>
            
            <button @click="clearID" class="keypad-button h-14 md:h-16 bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded-xl text-xs font-bold transition-colors uppercase active:scale-95 cursor-pointer">
              CLEAR
            </button>
            
            <button @click="pressKey('0')" class="keypad-button h-14 md:h-16 bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant rounded-xl text-xl font-bold text-primary transition-colors active:scale-95 cursor-pointer">
              0
            </button>
            
            <button @click="backspaceID" class="keypad-button h-14 md:h-16 bg-surface-container-high hover:bg-outline-variant border border-outline-variant rounded-xl text-primary font-bold transition-colors active:scale-95 flex items-center justify-center cursor-pointer">
              <span class="material-symbols-outlined text-xl">backspace</span>
            </button>
          </div>

          <button 
            :disabled="submitting || !currentID"
            @click="handleCheckIn"
            class="w-full mt-4 py-3.5 bg-secondary hover:bg-on-secondary-container text-white font-bold text-base rounded-xl transition-all shadow-md active:scale-[98%] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <span class="material-symbols-outlined text-xl">login</span>
            <span>{{ submitting ? 'Memproses...' : 'Check-In Masuk' }}</span>
          </button>
        </div>
      </section>

      <!-- Kolom 3 (Kanan): Jumlah Pengunjung Hari Ini (Tanpa Daftar Hadir) -->
      <section class="col-span-12 lg:col-span-4 flex flex-col gap-gutter">
        <!-- Card 1: Counter Total Pengunjung -->
        <div class="bg-white rounded-2xl card-shadow p-6 flex flex-col border border-outline-variant relative overflow-hidden">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-3">
              <div class="p-2.5 bg-secondary/10 rounded-xl text-secondary">
                <span class="material-symbols-outlined text-3xl">groups</span>
              </div>
              <div>
                <h3 class="font-headline-md text-headline-md text-primary font-bold">Pengunjung Hari Ini</h3>
                <p class="text-xs text-on-surface-variant">Statistik Kehadiran Akumulatif</p>
              </div>
            </div>
            <button @click="refreshAttendanceData" :disabled="loadingToday" class="p-2 text-secondary hover:bg-secondary/10 rounded-full transition-colors cursor-pointer" title="Refresh Data">
              <span class="material-symbols-outlined text-lg" :class="{ 'animate-spin': loadingToday }">refresh</span>
            </button>
          </div>

          <div class="bg-surface-container-low border border-outline-variant/60 rounded-2xl p-6 text-center my-2">
            <span class="font-label-md text-xs bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {{ todayDate }}
            </span>
            <div class="text-5xl md:text-6xl font-extrabold text-primary my-3 font-mono">
              {{ todayTotal }}
            </div>
            <p class="text-xs text-on-surface-variant font-medium">Total Pemustaka Hadir</p>
          </div>

          <div class="mt-4">
            <div class="flex justify-between text-xs text-on-surface-variant font-medium mb-1.5">
              <span>Kapasitas Ruang Baca</span>
              <span>{{ todayTotal }}/100 Kursi</span>
            </div>
            <div class="w-full bg-surface-container-high rounded-full h-3.5 overflow-hidden">
              <div class="bg-secondary h-full rounded-full transition-all duration-1000" :style="{ width: `${occupancyPercent}%` }"></div>
            </div>
          </div>
        </div>

        <!-- Card 2: Pengunjung Terakhir Check-In -->
        <div v-if="lastCheckedUser" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center gap-4 text-emerald-900 shadow-xs">
          <div class="p-3 bg-emerald-500 text-white rounded-full shrink-0">
            <span class="material-symbols-outlined text-2xl">person_check</span>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wider text-emerald-700 font-bold">Terakhir Check-In</p>
            <h4 class="font-bold text-base text-emerald-950">{{ lastCheckedUser.name }}</h4>
            <p class="text-xs text-emerald-800">{{ lastCheckedUser.nim || lastCheckedUser.role }}</p>
          </div>
        </div>

        <!-- Card 3: Informasional Kiosk / Tata Tertib -->
        <div class="bg-primary-container rounded-2xl card-shadow p-6 flex flex-col gap-3 border-l-8 border-secondary text-white flex-grow">
          <div class="flex items-center gap-3">
            <span class="material-symbols-outlined text-secondary-fixed text-3xl">info</span>
            <h3 class="font-headline-md text-headline-md text-white font-bold">Informasi Pemustaka</h3>
          </div>
          <p class="font-body-md text-white/90 leading-relaxed text-xs">
            Harap Tenang &amp; Menjaga Kebersihan Lingkungan Perpustakaan.<br/>
            Hormati rekan akademisi yang sedang melakukan riset. Pastikan perangkat seluler dalam mode hening.
          </p>
          <div class="mt-auto pt-4 border-t border-white/10 flex justify-between text-[11px] text-white/70">
            <span>Jam Operasional: 08.00 - 16.00 WIB</span>
            <span>STAH DNJ</span>
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
          <span class="text-secondary font-bold">Pengunjung: {{ todayTotal }}</span>
          <NuxtLink to="/layanan" class="hover:text-secondary transition-colors">Tata Tertib</NuxtLink>
          <NuxtLink to="/tentang" class="hover:text-secondary transition-colors">Meja Bantuan</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePustakaApi, type SiteSettings, type AttendanceRecord, type AttendanceTodayResponse } from '../composables/usePustakaApi';

definePageMeta({
  layout: false
});

const { getSettings, getAttendanceToday, submitAttendance } = usePustakaApi();

const isFullscreen = ref(false);

const toggleFullscreen = () => {
  if (!process.client) return;
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().then(() => {
      isFullscreen.value = true;
    }).catch(err => {
      console.error('Gagal mengaktifkan mode fullscreen:', err);
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen.value = false;
      });
    }
  }
};

const siteSettings = ref<SiteSettings | null>(null);
const currentID = ref('');
const qrInputRef = ref<HTMLInputElement | null>(null);
const currentTime = ref('');
const currentDate = ref('');
const submitting = ref(false);
const alertMessage = ref('');
const alertSuccess = ref(true);
const loadingToday = ref(false);

// Real API data
const todayData = ref<AttendanceTodayResponse | null>(null);
const todayAttendees = ref<AttendanceRecord[]>([]);
const todayTotal = ref(0);
const todayDate = ref('');
const lastCheckedUser = ref<{ name: string; nim?: string; role?: string } | null>(null);
const lastCheckedRecordId = ref<number | null>(null);

const occupancyPercent = computed(() => {
  return Math.min(todayTotal.value, 100);
});

let clockTimer: any = null;
let refreshTimer: any = null;

const updateClock = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  currentTime.value = `${hours}:${minutes}:${seconds}`;

  currentDate.value = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const formatTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    });
  } catch {
    return '-';
  }
};

const pressKey = (val: string) => {
  if (currentID.value.length < 16) {
    currentID.value += val;
  }
};

const clearID = () => {
  currentID.value = '';
};

const backspaceID = () => {
  currentID.value = currentID.value.slice(0, -1);
};

const isToday = (dateString?: string) => {
  if (!dateString) return false;
  try {
    const d = new Date(dateString);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() &&
           d.getMonth() === now.getMonth() &&
           d.getDate() === now.getDate();
  } catch {
    return false;
  }
};

const formatTodayDateLabel = (dateInput?: string) => {
  const now = new Date();
  if (dateInput) {
    try {
      const parsed = new Date(dateInput);
      if (!isNaN(parsed.getTime())) {
        return parsed.toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    } catch {}
  }
  return now.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const refreshAttendanceData = async () => {
  loadingToday.value = true;
  try {
    const res = await getAttendanceToday();
    if (res?.success && res.data) {
      todayData.value = res.data;
      const rawList = res.data.daftar_hadir || [];
      
      // Filter strictly by created_at or tanggal timestamp matching TODAY
      const todayList = rawList.filter(item => {
        const targetDate = item.created_at || item.tanggal;
        if (!targetDate) return true;
        return isToday(targetDate);
      });

      todayAttendees.value = todayList;
      todayTotal.value = todayList.length;
      todayDate.value = formatTodayDateLabel(res.data.tanggal);
    } else {
      todayDate.value = formatTodayDateLabel();
    }
  } catch (e) {
    console.error('Error fetching today attendance:', e);
    todayDate.value = formatTodayDateLabel();
  } finally {
    loadingToday.value = false;
  }
};

const handleCheckIn = async () => {
  const targetToken = currentID.value.trim();
  if (!targetToken) return;

  submitting.value = true;
  alertMessage.value = '';
  lastCheckedUser.value = null;
  lastCheckedRecordId.value = null;

  try {
    const res = await submitAttendance(targetToken);
    if (res?.success) {
      alertSuccess.value = true;
      alertMessage.value = res.message || `Presensi berhasil tercatat!`;
      
      // Extract user info from the response
      if (res.data?.user) {
        lastCheckedUser.value = {
          name: res.data.user.name,
          nim: res.data.user.nim || undefined,
          role: res.data.user.role
        };
        lastCheckedRecordId.value = res.data.id;
      }
      
      currentID.value = '';
      
      // Refresh attendance list to show new entry
      await refreshAttendanceData();
    } else {
      alertSuccess.value = false;
      alertMessage.value = res.message || 'Presensi gagal. QR Token tidak valid.';
    }
  } catch (err: any) {
    alertSuccess.value = false;
    alertMessage.value = err.message || 'Terjadi kesalahan sistem presensi.';
  } finally {
    submitting.value = false;

    setTimeout(() => {
      alertMessage.value = '';
      lastCheckedUser.value = null;
    }, 5000);
  }
};

const handleGlobalKeyPress = (e: KeyboardEvent) => {
  // Auto focus input if physical QR barcode scanner device starts typing anywhere on the page
  if (document.activeElement !== qrInputRef.value && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
    qrInputRef.value?.focus();
  }
};

onMounted(async () => {
  updateClock();
  clockTimer = setInterval(updateClock, 1000);

  // Auto focus scanner input for physical QR scanner devices
  setTimeout(() => {
    qrInputRef.value?.focus();
  }, 300);

  if (process.client) {
    window.addEventListener('keydown', handleGlobalKeyPress);
  }

  // Load settings
  try {
    const res = await getSettings();
    if (res?.success && res.data) {
      siteSettings.value = res.data;
    }
  } catch (e) {
    console.error('Error fetching settings for attendance kiosk:', e);
  }

  // Load today's attendance data
  await refreshAttendanceData();

  // Auto-refresh every 30 seconds
  refreshTimer = setInterval(refreshAttendanceData, 30000);
});

onUnmounted(() => {
  if (clockTimer) clearInterval(clockTimer);
  if (refreshTimer) clearInterval(refreshTimer);
  if (process.client) {
    window.removeEventListener('keydown', handleGlobalKeyPress);
  }
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

.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 3px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.25);
}

.animate-pulse-once {
  animation: highlight-fade 2s ease-out;
}
@keyframes highlight-fade {
  0% { background-color: rgba(252, 202, 102, 0.4); }
  100% { background-color: transparent; }
}
</style>
