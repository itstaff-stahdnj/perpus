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
              <!-- Show last checked-in user info -->
              <p v-if="alertSuccess && lastCheckedUser" class="text-xs mt-1 opacity-80">
                {{ lastCheckedUser.name }} — {{ lastCheckedUser.nim || lastCheckedUser.role }}
              </p>
            </div>
          </div>
          <button @click="alertMessage = ''" class="hover:bg-white/20 p-2 rounded-full transition-colors">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
      </div>

      <!-- Left Column: Scanner + Keypad -->
      <section class="col-span-12 lg:col-span-5 flex flex-col gap-gutter">
        <!-- Scanner Card -->
        <div class="bg-white rounded-2xl card-shadow p-8 flex flex-col items-center border border-outline-variant">
          <div class="text-center">
            <h2 class="font-headline-md text-headline-md text-primary font-bold mb-2">Scan Kartu Anggota</h2>
            <p class="font-body-md text-body-md text-on-surface-variant">Arahkan QR Code atau Barcode ke sensor kamera</p>
          </div>

          <div class="relative w-64 h-64 border-4 border-dashed border-outline-variant rounded-2xl flex items-center justify-center overflow-hidden bg-surface-container-low my-6">
            <div class="absolute inset-0 flex items-center justify-center opacity-10">
              <span class="material-symbols-outlined text-[140px]">qr_code_scanner</span>
            </div>

            <!-- Scanner Animation Line -->
            <div class="scanning-line absolute left-0 right-0 h-1 bg-secondary shadow-[0_0_15px_rgba(200,155,60,0.8)] z-10"></div>

            <!-- Decorative Corners -->
            <div class="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-secondary rounded-tl-sm"></div>
            <div class="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-secondary rounded-tr-sm"></div>
            <div class="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-secondary rounded-bl-sm"></div>
            <div class="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-secondary rounded-br-sm"></div>

            <div 
              class="w-56 h-56 bg-cover bg-center rounded-lg opacity-80" 
              style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDEWFAJHfXWrShr6KikZRRh1EeRBsjE_Quqr01mYxhTG94UIuBiKlLd13jwYLPa7tXOslnOM0dOiRkoMhvw7mtwtgjYuNn2Pp3xrfqApcKsaNumSMKqrsQf6rjANHBsC7HAS2AZ2po1epCpB6grisXEsicPtSIT4hnbJSxALaLYf0-7Adtg_zDva185rlQ4JhG07YXZ78NW7h3x1o04C81Whxc2bBTUPLGOF6JDd3kljhpeTRXR0tyBZg')"
            ></div>
          </div>
        </div>

        <!-- Manual Entry Card -->
        <div class="bg-white rounded-2xl card-shadow p-8 flex flex-col border border-outline-variant">
          <div class="mb-4">
            <h2 class="font-headline-md text-headline-md text-primary font-bold mb-1">Input QR Token Manual</h2>
            <p class="font-body-md text-body-md text-on-surface-variant text-sm">Masukkan kode QR Token jika kartu tidak terbaca</p>
          </div>

          <!-- Display Screen -->
          <div class="bg-surface-container-high rounded-xl p-5 mb-6 flex items-center justify-center border-2 border-outline-variant min-h-[80px]">
            <span class="text-3xl md:text-[48px] font-bold tracking-[0.15em] text-primary font-mono">
              {{ currentID || '— — — — —' }}
            </span>
          </div>

          <!-- Keypad Grid -->
          <div class="grid grid-cols-3 gap-3">
            <button v-for="num in ['1','2','3','4','5','6','7','8','9']" :key="num" 
                    @click="pressKey(num)" 
                    class="keypad-button h-16 md:h-20 bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant rounded-xl text-2xl font-bold text-primary transition-colors active:scale-95 cursor-pointer">
              {{ num }}
            </button>
            
            <button @click="clearID" class="keypad-button h-16 md:h-20 bg-rose-100 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 rounded-xl text-sm font-bold transition-colors uppercase active:scale-95 cursor-pointer">
              CLEAR
            </button>
            
            <button @click="pressKey('0')" class="keypad-button h-16 md:h-20 bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant rounded-xl text-2xl font-bold text-primary transition-colors active:scale-95 cursor-pointer">
              0
            </button>
            
            <button @click="backspaceID" class="keypad-button h-16 md:h-20 bg-surface-container-high hover:bg-outline-variant border border-outline-variant rounded-xl text-primary font-bold transition-colors active:scale-95 flex items-center justify-center cursor-pointer">
              <span class="material-symbols-outlined text-2xl">backspace</span>
            </button>
          </div>

          <!-- Check-In Button -->
          <button 
            :disabled="submitting || !currentID"
            @click="handleCheckIn"
            class="w-full mt-6 py-4 bg-secondary hover:bg-on-secondary-container text-white font-bold text-lg rounded-xl transition-all shadow-md active:scale-[98%] flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            <span class="material-symbols-outlined text-2xl">login</span>
            <span>{{ submitting ? 'Memproses...' : 'Check-In Masuk' }}</span>
          </button>
        </div>
      </section>

      <!-- Right Column: Today's Attendance List -->
      <section class="col-span-12 lg:col-span-7 flex flex-col gap-gutter">
        <!-- Live Occupancy Card -->
        <div class="bg-white rounded-2xl card-shadow p-6 flex flex-col gap-4 border border-outline-variant">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-secondary text-3xl">groups</span>
              <h3 class="font-headline-md text-headline-md text-primary font-bold">Pengunjung Hari Ini</h3>
            </div>
            <div class="flex items-center gap-2">
              <span v-if="loadingToday" class="material-symbols-outlined text-on-surface-variant animate-spin text-sm">progress_activity</span>
              <span class="font-label-md text-xs bg-secondary-fixed text-on-secondary-fixed px-3 py-1 rounded-full font-bold uppercase">
                {{ todayDate }}
              </span>
            </div>
          </div>

          <div class="flex justify-between items-end mb-1">
            <span class="font-body-lg text-on-surface-variant">Total Kehadiran</span>
            <span class="font-headline-md font-bold text-primary text-2xl">{{ todayTotal }}</span>
          </div>

          <div class="w-full bg-surface-container-high rounded-full h-4 overflow-hidden">
            <div class="bg-secondary h-full rounded-full transition-all duration-1000" :style="{ width: `${occupancyPercent}%` }"></div>
          </div>
          <p class="font-caption text-caption text-on-surface-variant italic">
            Kapasitas ruang baca: {{ todayTotal }}/100 — Data diperbarui otomatis setiap 30 detik.
          </p>
        </div>

        <!-- Attendance Table Card -->
        <div class="bg-white rounded-2xl card-shadow border border-outline-variant flex flex-col overflow-hidden flex-grow">
          <div class="p-6 pb-3 border-b border-outline-variant flex justify-between items-center">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-primary text-2xl">list_alt</span>
              <h3 class="font-headline-md text-lg text-primary font-bold">Daftar Hadir Hari Ini</h3>
            </div>
            <button @click="refreshAttendanceData" :disabled="loadingToday" class="flex items-center gap-1 text-sm text-secondary hover:text-on-secondary-container transition-colors cursor-pointer disabled:opacity-50">
              <span class="material-symbols-outlined text-lg" :class="{ 'animate-spin': loadingToday }">refresh</span>
              <span class="hidden sm:inline">Refresh</span>
            </button>
          </div>

          <!-- Empty state -->
          <div v-if="!loadingToday && todayAttendees.length === 0" class="flex-grow flex flex-col items-center justify-center p-12 text-center">
            <span class="material-symbols-outlined text-6xl text-outline-variant mb-4">event_busy</span>
            <h4 class="text-lg font-bold text-on-surface-variant mb-1">Belum Ada Pengunjung</h4>
            <p class="text-sm text-on-surface-variant/70">Belum ada presensi yang tercatat untuk hari ini.</p>
          </div>

          <!-- Loading state -->
          <div v-else-if="loadingToday && todayAttendees.length === 0" class="flex-grow flex items-center justify-center p-12">
            <div class="flex flex-col items-center gap-3">
              <span class="material-symbols-outlined text-4xl text-secondary animate-spin">progress_activity</span>
              <p class="text-sm text-on-surface-variant">Memuat data kehadiran...</p>
            </div>
          </div>

          <!-- Attendance List -->
          <div v-else class="overflow-y-auto max-h-[480px] scrollbar-thin">
            <table class="w-full text-left">
              <thead class="bg-surface-container-low sticky top-0 z-10">
                <tr class="text-xs uppercase text-on-surface-variant tracking-wider">
                  <th class="px-6 py-3 font-semibold">No</th>
                  <th class="px-6 py-3 font-semibold">Pemustaka</th>
                  <th class="px-6 py-3 font-semibold hidden md:table-cell">NIM/ID</th>
                  <th class="px-6 py-3 font-semibold hidden lg:table-cell">Prodi</th>
                  <th class="px-6 py-3 font-semibold text-right">Waktu Masuk</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(item, idx) in todayAttendees" 
                  :key="item.id" 
                  class="border-b border-outline-variant/50 hover:bg-surface-container-low/50 transition-colors"
                  :class="{ 'bg-secondary-fixed/20 animate-pulse-once': item.id === lastCheckedRecordId }"
                >
                  <td class="px-6 py-4 font-mono text-sm text-on-surface-variant">{{ idx + 1 }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <img 
                        :src="item.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user?.name || 'U')}&color=4f46e5&background=e0e7ff`" 
                        :alt="item.user?.name" 
                        class="w-9 h-9 rounded-full ring-2 ring-outline-variant/30 object-cover"
                      />
                      <div>
                        <p class="font-semibold text-sm text-on-surface">{{ item.user?.name || '-' }}</p>
                        <p class="text-xs text-on-surface-variant capitalize md:hidden">{{ item.user?.role || '-' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden md:table-cell">
                    <span class="font-mono text-sm text-on-surface-variant">{{ item.user?.nim || item.user?.nidn || '-' }}</span>
                  </td>
                  <td class="px-6 py-4 hidden lg:table-cell">
                    <span class="text-sm text-on-surface-variant">{{ item.user?.prodi || '-' }}</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <span class="inline-flex items-center gap-1 bg-primary-fixed/40 text-on-primary-fixed-variant px-3 py-1 rounded-full text-xs font-semibold font-mono">
                      <span class="material-symbols-outlined text-sm">schedule</span>
                      {{ formatTime(item.created_at) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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

const refreshAttendanceData = async () => {
  loadingToday.value = true;
  try {
    const res = await getAttendanceToday();
    if (res?.success && res.data) {
      todayData.value = res.data;
      todayAttendees.value = res.data.daftar_hadir || [];
      todayTotal.value = res.data.total_hadir || 0;
      todayDate.value = res.data.tanggal || new Date().toISOString().split('T')[0];
    }
  } catch (e) {
    console.error('Error fetching today attendance:', e);
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

onMounted(async () => {
  updateClock();
  clockTimer = setInterval(updateClock, 1000);

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
