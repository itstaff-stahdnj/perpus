<template>
  <header class="fixed top-0 left-0 w-full z-50 shadow-[0px_4px_16px_rgba(10,58,90,0.06)] bg-surface/90 glass-header border-b border-outline-variant/30">
    <div class="max-w-container-max mx-auto h-16 px-4 md:px-margin-desktop flex justify-between items-center gap-4">
      
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
            <h1 class="font-headline-md text-xs sm:text-base md:text-lg font-bold text-primary truncate leading-tight group-hover:text-secondary transition-colors">
              {{ siteName }}
            </h1>
            <p class="text-[9px] sm:text-[10px] text-on-surface-variant block truncate leading-tight mt-0.5">STAH Dharma Nusantara Jakarta</p>
          </div>
        </NuxtLink>
      </div>

      <!-- Desktop Navigation Links (Center) -->
      <nav class="hidden md:flex items-center gap-1 lg:gap-2 xl:gap-4 shrink">
        <NuxtLink 
          to="/" 
          class="font-label-md text-xs lg:text-sm font-semibold hover:bg-surface-container-high transition-colors px-2.5 lg:px-3.5 py-2 rounded-xl whitespace-nowrap"
          :class="route.path === '/' ? 'text-secondary font-extrabold bg-secondary-fixed/50' : 'text-on-surface-variant hover:text-primary'"
        >
          Beranda
        </NuxtLink>
        
        <NuxtLink 
          to="/buku" 
          class="font-label-md text-xs lg:text-sm font-semibold hover:bg-surface-container-high transition-colors px-2.5 lg:px-3.5 py-2 rounded-xl whitespace-nowrap"
          :class="route.path.startsWith('/buku') ? 'text-secondary font-extrabold bg-secondary-fixed/50' : 'text-on-surface-variant hover:text-primary'"
        >
          Katalog Buku
        </NuxtLink>
        
        <NuxtLink 
          to="/layanan" 
          class="font-label-md text-xs lg:text-sm font-semibold hover:bg-surface-container-high transition-colors px-2.5 lg:px-3.5 py-2 rounded-xl whitespace-nowrap"
          :class="route.path.startsWith('/layanan') ? 'text-secondary font-extrabold bg-secondary-fixed/50' : 'text-on-surface-variant hover:text-primary'"
        >
          Layanan
        </NuxtLink>

        <NuxtLink 
          to="/berita" 
          class="font-label-md text-xs lg:text-sm font-semibold hover:bg-surface-container-high transition-colors px-2.5 lg:px-3.5 py-2 rounded-xl whitespace-nowrap"
          :class="route.path.startsWith('/berita') ? 'text-secondary font-extrabold bg-secondary-fixed/50' : 'text-on-surface-variant hover:text-primary'"
        >
          Berita
        </NuxtLink>
        
        <NuxtLink 
          to="/tentang" 
          class="font-label-md text-xs lg:text-sm font-semibold hover:bg-surface-container-high transition-colors px-2.5 lg:px-3.5 py-2 rounded-xl whitespace-nowrap"
          :class="route.path.startsWith('/tentang') ? 'text-secondary font-extrabold bg-secondary-fixed/50' : 'text-on-surface-variant hover:text-primary'"
        >
          Tentang Kami
        </NuxtLink>
      </nav>

      <!-- Right Action Area (SSO Portal / User Account) -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Logged In State -->
        <div v-if="tokenCookie" class="flex items-center gap-2 sm:gap-3 pl-2 border-l border-outline-variant/60">
          <!-- Member Profile Button (Nuxt Internal) -->
          <NuxtLink 
            v-if="!isAdminUser"
            to="/profil" 
            class="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
            title="Buka Profil &amp; Kartu Member"
          >
            <span class="material-symbols-outlined text-base">account_circle</span>
            <span class="hidden sm:inline">Profil Member</span>
          </NuxtLink>

          <!-- Admin Panel Link (Filament External) -->
          <a 
            v-else
            href="https://portal-perpus.stahdnj.ac.id/admin" 
            target="_blank"
            class="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
            title="Buka Panel Admin Filament"
          >
            <span class="material-symbols-outlined text-base">admin_panel_settings</span>
            <span class="hidden sm:inline">Panel Admin</span>
          </a>

          <!-- User Avatar & Profile Tag -->
          <NuxtLink 
            v-if="profile"
            to="/profil" 
            class="flex items-center gap-2 p-1 hover:bg-surface-container-high rounded-full sm:rounded-xl transition-all border border-outline-variant/60" 
            :title="`Profil ${profile.name}`"
          >
            <div class="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold overflow-hidden border border-secondary/30 shrink-0">
              <img v-if="profile?.avatar_url" class="w-full h-full object-cover" :src="profile.avatar_url" :alt="profile.name" />
              <span v-else class="text-[11px]">{{ (profile?.name || 'U').charAt(0) }}</span>
            </div>
            <div class="text-left hidden xl:block pr-2 max-w-[140px]">
              <p class="font-label-md text-xs text-primary font-bold truncate leading-tight">{{ profile?.name }}</p>
            </div>
          </NuxtLink>

          <button @click="handleLogout" class="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer shrink-0" title="Keluar (Logout)">
            <span class="material-symbols-outlined text-lg">logout</span>
          </button>
        </div>

        <!-- Logged Out State (SSO Login Button) -->
        <div v-else class="flex items-center gap-2 pl-2 border-l border-outline-variant/60">
          <a 
            href="https://portal-perpus.stahdnj.ac.id/sso/perpus" 
            class="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
            title="Masuk menggunakan SSO Portal STAH DNJ"
          >
            <span class="material-symbols-outlined text-base">vpn_key</span>
            <span>Masuk</span>
          </a>
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
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePustakaApi, type UserProfile } from '../composables/usePustakaApi';

const route = useRoute();
const { getProfile, getSettings, logout, tokenCookie } = usePustakaApi();
const profile = ref<UserProfile | null>(null);
const siteName = ref('Perpustakaan STAH DNJ');
const logoUrl = ref<string | undefined>(undefined);
const pendingReservationCount = ref(0);
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
    const res = await fetch('https://portal-perpus.stahdnj.ac.id/api/reservations/pending-alerts', {
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
    window.location.href = 'https://portal-perpus.stahdnj.ac.id/member/logout';
  }
};

onMounted(async () => {
  try {
    const [resProfile, resSettings] = await Promise.all([
      tokenCookie.value ? getProfile().catch(() => null) : null,
      getSettings().catch(() => null)
    ]);
    
    if (resProfile?.success && resProfile.data) {
      profile.value = resProfile.data as UserProfile;
    }
    if (resSettings?.success && resSettings.data) {
      siteName.value = resSettings.data.app_name || 'Perpustakaan STAH DNJ';
      logoUrl.value = resSettings.data.logo_url;
    }

    if (isAdminUser.value) {
      checkPendingReservations();
      alertTimer = setInterval(checkPendingReservations, 10000); // Poll pending alerts every 10 seconds
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
