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
            <h1 class="font-headline-md text-xs sm:text-base md:text-lg font-bold text-primary truncate leading-snug group-hover:text-secondary transition-colors">
              {{ siteName }}
            </h1>
            <p class="text-[10px] text-on-surface-variant hidden sm:block truncate leading-none">STAH Dharma Nusantara Jakarta</p>
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
          <a 
            :href="portalDashboardUrl" 
            class="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
            title="Buka Portal Dashboard Perpustakaan"
          >
            <span class="material-symbols-outlined text-base">dashboard</span>
            <span class="hidden sm:inline">Dashboard</span>
          </a>

          <!-- User Avatar & Tag -->
          <a 
            v-if="profile"
            :href="portalDashboardUrl" 
            class="flex items-center gap-2 p-1 hover:bg-surface-container-high rounded-full sm:rounded-xl transition-all border border-outline-variant/60" 
            :title="`Masuk sebagai ${profile.name}`"
          >
            <div class="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold overflow-hidden border border-secondary/30 shrink-0">
              <img v-if="profile?.avatar_url" class="w-full h-full object-cover" :src="profile.avatar_url" :alt="profile.name" />
              <span v-else class="text-[11px]">{{ (profile?.name || 'U').charAt(0) }}</span>
            </div>
            <div class="text-left hidden xl:block pr-2 max-w-[140px]">
              <p class="font-label-md text-xs text-primary font-bold truncate leading-tight">{{ profile?.name }}</p>
            </div>
          </a>

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
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePustakaApi, type UserProfile } from '../composables/usePustakaApi';

const route = useRoute();
const { getProfile, getSettings, logout, tokenCookie } = usePustakaApi();
const profile = ref<UserProfile | null>(null);
const siteName = ref('Perpustakaan STAH DNJ');
const logoUrl = ref<string | undefined>(undefined);

const adminRoles = ['admin', 'kepala_pustaka', 'kepala_perpustakaan', 'pustakawan', 'staf', 'petugas', 'operator', 'super_admin'];

const portalDashboardUrl = computed(() => {
  const roleStr = (profile.value?.role || '').toLowerCase();
  const isAdmin = adminRoles.some(r => roleStr.includes(r));
  return isAdmin ? 'https://portal-perpus.stahdnj.ac.id/admin' : 'https://portal-perpus.stahdnj.ac.id/member';
});

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
    
    if (resProfile?.success) {
      profile.value = ((resProfile as any)?.data?.user || (resProfile as any)?.data || (resProfile as any)?.user) as UserProfile;
    }
    if (resSettings?.success && resSettings.data) {
      siteName.value = resSettings.data.app_name || 'Perpustakaan STAH DNJ';
      logoUrl.value = resSettings.data.logo_url;
    }
  } catch (e) {
    console.error('Header load error:', e);
  }
});
</script>

<style scoped>
.glass-header {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
