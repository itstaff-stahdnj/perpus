<template>
  <header class="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/85 dark:bg-zinc-900/85 border-b border-slate-200/80 dark:border-zinc-800/80 transition-colors duration-300 shadow-xs">
    <div class="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex justify-between items-center gap-4">
      
      <!-- Brand Logo & Site Title (Left) -->
      <div class="flex items-center gap-2.5 shrink-0 min-w-0">
        <NuxtLink to="/" class="flex items-center gap-2 max-w-[260px] sm:max-w-md group">
          <img 
            v-if="logoUrl" 
            :src="logoUrl" 
            alt="Logo STAH DNJ" 
            class="h-8 sm:h-9 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform" 
          />
          <div class="truncate">
            <h1 class="text-xs sm:text-base md:text-lg font-black text-slate-900 dark:text-white truncate leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {{ siteName }}
            </h1>
            <p class="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-400 block truncate leading-tight mt-0.5">STAH Dharma Nusantara Jakarta</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Desktop Navigation Links (Center) -->
      <nav class="hidden md:flex items-center gap-1 lg:gap-2 shrink">
        <NuxtLink 
          to="/" 
          class="text-xs lg:text-sm font-bold transition-all px-3 py-2 rounded-xl whitespace-nowrap"
          :class="route.path === '/' ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 font-extrabold' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'"
        >
          Beranda
        </NuxtLink>
        
        <NuxtLink 
          to="/buku" 
          class="text-xs lg:text-sm font-bold transition-all px-3 py-2 rounded-xl whitespace-nowrap"
          :class="route.path.startsWith('/buku') ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 font-extrabold' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'"
        >
          Katalog Buku
        </NuxtLink>
        
        <NuxtLink 
          to="/layanan" 
          class="text-xs lg:text-sm font-bold transition-all px-3 py-2 rounded-xl whitespace-nowrap"
          :class="route.path.startsWith('/layanan') ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 font-extrabold' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'"
        >
          Layanan
        </NuxtLink>

        <NuxtLink 
          to="/berita" 
          class="text-xs lg:text-sm font-bold transition-all px-3 py-2 rounded-xl whitespace-nowrap"
          :class="route.path.startsWith('/berita') ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 font-extrabold' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'"
        >
          Berita
        </NuxtLink>
        
        <NuxtLink 
          to="/tentang" 
          class="text-xs lg:text-sm font-bold transition-all px-3 py-2 rounded-xl whitespace-nowrap"
          :class="route.path.startsWith('/tentang') ? 'text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 font-extrabold' : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800'"
        >
          Tentang Kami
        </NuxtLink>
      </nav>

      <!-- Right Action Area (SSO Portal / User Account) -->
      <div class="flex items-center gap-2 shrink-0">

        <!-- Spotlight Command Palette (Ctrl+K) Trigger -->
        <button 
          @click="showCommandPalette = true" 
          class="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-zinc-700/80 cursor-pointer"
          title="Buka Command Center (Ctrl+K)"
        >
          <span class="material-symbols-outlined text-base text-primary dark:text-blue-400">search</span>
          <span class="hidden lg:inline text-[11px]">Cari & Pintasan</span>
          <kbd class="px-1.5 py-0.5 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded text-[9px] font-mono text-slate-500 dark:text-zinc-400">Ctrl K</kbd>
        </button>

        <!-- Dynamic Dark/Light Theme Switcher -->
        <ThemeToggle />

        <!-- Logged In State -->
        <div v-if="tokenCookie" class="flex items-center gap-2 sm:gap-3 pl-2 border-l border-outline-variant/60">
          <!-- Member Card Button -->
          <button 
            @click="showMemberCard = true"
            class="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Kartu Keanggotaan Digital (3D Card)"
          >
            <span class="material-symbols-outlined text-xl">badge</span>
          </button>

          <!-- Member Dashboard Button (Only for Mahasiswa, Dosen, Umum - Desktop Only) -->
          <NuxtLink 
            v-if="!isAdminUser"
            to="/dashboard" 
            class="hidden md:flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
            title="Buka Dashboard Member"
          >
            <Icon name="material-symbols:dashboard" class="text-base" />
            <span class="inline">Dashboard Member</span>
          </NuxtLink>

          <!-- Admin Panel Button (Only for Admin, Kepala Pustaka, Pustakawan - Desktop Only) -->
          <NuxtLink 
            v-else
            to="/admin" 
            class="hidden md:flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
            title="Buka Panel Administrasi Perpustakaan"
          >
            <Icon name="material-symbols:admin-panel-settings" class="text-base" />
            <span class="inline">Panel Admin</span>
          </NuxtLink>

          <!-- User Avatar & Profile Tag (Always Visible) -->
          <NuxtLink 
            v-if="profile"
            :to="isAdminUser ? '/admin' : '/dashboard'" 
            class="flex items-center gap-2 p-1 hover:bg-surface-container-high rounded-full sm:rounded-xl transition-all border border-outline-variant/60" 
            :title="`Profil ${profile.name}`"
          >
            <div class="w-8 h-8 sm:w-7 sm:h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold overflow-hidden border border-secondary/30 shrink-0">
              <img v-if="profile?.avatar_url" class="w-full h-full object-cover" :src="profile.avatar_url" :alt="profile.name" />
              <span v-else class="text-xs sm:text-[11px]">{{ (profile?.name || 'U').charAt(0) }}</span>
            </div>
            <div class="text-left hidden xl:block pr-2 max-w-[140px]">
              <p class="font-label-md text-xs text-primary font-bold truncate leading-tight">{{ profile?.name }}</p>
              <p class="text-[9px] text-slate-500 capitalize font-medium">{{ profile?.role || 'Member' }}</p>
            </div>
          </NuxtLink>

          <button @click="handleLogout" class="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-full transition-colors cursor-pointer shrink-0" title="Keluar (Logout)">
            <Icon name="material-symbols:logout" class="text-lg" />
          </button>
        </div>

        <!-- Logged Out State (Direct Login Button) -->
        <div v-else class="flex items-center gap-2 pl-2 border-l border-outline-variant/60">
          <NuxtLink 
            to="/login" 
            class="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            title="Masuk ke Sistem Perpustakaan"
          >
            <Icon name="material-symbols:vpn-key" class="text-base" />
            <span>Masuk</span>
          </NuxtLink>
        </div>
      </div>

    </div>

    <!-- Real-Time Continuous Staff Reservation Alert Bar -->
    <div v-if="isAdminUser && pendingReservationCount > 0" class="bg-amber-400 text-slate-950 px-4 py-2 text-xs font-bold border-b border-amber-500 shadow-inner">
      <div class="max-w-container-max mx-auto w-full flex items-center justify-between gap-3">
        <div class="flex items-center gap-2 min-w-0">
          <span class="material-symbols-outlined text-base animate-bounce shrink-0">notifications_active</span>
          <span class="truncate">🚨 PERHATIAN PUSTAKAWAN: Ada {{ pendingReservationCount }} reservasi buku baru yang perlu diambil dari rak!</span>
        </div>
        <NuxtLink to="/profil?tab=reservations" class="underline hover:text-slate-800 font-extrabold shrink-0">
          Kelola Reservasi di Profil &rarr;
        </NuxtLink>
      </div>
    </div>

    <!-- Modals -->
    <CommandPaletteModal v-model="showCommandPalette" @trigger-member-card="showMemberCard = true" />
    <DigitalMemberCardModal v-model="showMemberCard" :user="profile" />
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePustakaApi, type UserProfile } from '../composables/usePustakaApi';

const route = useRoute();
const { getProfile, getSettings, logout, tokenCookie } = usePustakaApi();
const { saveCatalogCache, getCatalogCache } = useIndexedDB();
const profile = ref<UserProfile | null>(null);
const siteName = ref('Perpustakaan STAH DNJ');
const logoUrl = ref<string | undefined>(undefined);
const pendingReservationCount = ref(0);
const showCommandPalette = ref(false);
const showMemberCard = ref(false);
let alertTimer: any = null;

const adminRoles = ['admin', 'kepala_pustaka', 'kepala_perpustakaan', 'pustakawan', 'staf', 'petugas', 'operator', 'super_admin'];

const isAdminUser = computed(() => {
  const roleStr = String(profile.value?.role || '').trim().toLowerCase();
  if (!roleStr || roleStr === 'mahasiswa' || roleStr === 'dosen' || roleStr === 'umum' || roleStr === 'member' || roleStr === 'pemustaka' || roleStr === 'user') {
    return false;
  }
  return adminRoles.some(r => roleStr === r || (roleStr.length > 2 && roleStr.includes(r)));
});

const checkPendingReservations = async () => {
  if (!tokenCookie.value || !isAdminUser.value) return;
  try {
    const res = await fetch('/api/pustaka/reservations/pending-alerts', {
      headers: {
        'x-api-key': 'stah_lib_7f3e9a1b8c2d4e6f5a0b9c8d7e6f5a4b',
        'Authorization': `Bearer ${tokenCookie.value}`
      }
    });
    const json = await res.json();
    if (json?.success && typeof json?.count === 'number') {
      pendingReservationCount.value = json.count;
    }
  } catch (e) {}
};

const handleLogout = async () => {
  await logout();
  profile.value = null;
  if (process.client) {
    window.location.href = '/login';
  }
};

onMounted(async () => {
  // STEP 1: Restore from IndexedDB cache for instant header
  try {
    const [cachedProfile, cachedSettings] = await Promise.all([
      getCatalogCache<UserProfile>('header_profile'),
      getCatalogCache<any>('header_settings')
    ]);
    if (cachedProfile) profile.value = cachedProfile;
    if (cachedSettings) {
      siteName.value = cachedSettings.app_name || 'Perpustakaan STAH DNJ';
      logoUrl.value = cachedSettings.logo_url;
    }
  } catch (e) {}

  // STEP 2: Fetch fresh data from API
  try {
    const [resProfile, resSettings] = await Promise.all([
      tokenCookie.value ? getProfile().catch(() => null) : null,
      getSettings().catch(() => null)
    ]);
    
    if (resProfile?.success && resProfile.data) {
      profile.value = resProfile.data as UserProfile;
      saveCatalogCache('header_profile', profile.value);
    }
    if (resSettings?.success && resSettings.data) {
      siteName.value = resSettings.data.app_name || 'Perpustakaan STAH DNJ';
      logoUrl.value = resSettings.data.logo_url;
      saveCatalogCache('header_settings', resSettings.data);
    }

    if (isAdminUser.value) {
      checkPendingReservations();
      alertTimer = setInterval(checkPendingReservations, 10000);
    }
  } catch (e) {
    console.error('Header load error:', e);
  }
});

onUnmounted(() => {
  if (alertTimer) clearInterval(alertTimer);
});
</script>

<style scoped>
.glass-header {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
