<template>
  <header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-margin-desktop h-16 shadow-[0px_4px_12px_rgba(10,58,90,0.05)] bg-surface/90 glass-header border-b border-outline-variant/30">
    <div class="flex items-center gap-3">
      <NuxtLink to="/" class="flex items-center gap-2 max-w-[220px] sm:max-w-none">
        <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="h-8 w-auto object-contain shrink-0" />
        <h1 class="font-headline-md text-headline-md font-bold text-primary text-sm sm:text-lg md:text-xl truncate leading-tight">{{ siteName }}</h1>
      </NuxtLink>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-5">
      <NuxtLink 
        to="/" 
        class="font-label-md text-label-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg"
        :class="route.path === '/' ? 'text-secondary font-bold' : 'text-on-surface-variant'"
      >
        Beranda
      </NuxtLink>
      <NuxtLink 
        to="/buku" 
        class="font-label-md text-label-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg"
        :class="route.path.startsWith('/buku') ? 'text-secondary font-bold' : 'text-on-surface-variant'"
      >
        Katalog Buku
      </NuxtLink>
      <NuxtLink 
        to="/layanan" 
        class="font-label-md text-label-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg"
        :class="route.path.startsWith('/layanan') ? 'text-secondary font-bold' : 'text-on-surface-variant'"
      >
        Layanan
      </NuxtLink>

      <NuxtLink 
        to="/berita" 
        class="font-label-md text-label-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg"
        :class="route.path.startsWith('/berita') ? 'text-secondary font-bold' : 'text-on-surface-variant'"
      >
        Berita
      </NuxtLink>
      <NuxtLink 
        to="/tentang" 
        class="font-label-md text-label-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg"
        :class="route.path.startsWith('/tentang') ? 'text-secondary font-bold' : 'text-on-surface-variant'"
      >
        Tentang Kami
      </NuxtLink>
    </nav>

    <div class="flex items-center gap-3">
      <!-- If Logged In: Show Dashboard Button & Profile -->
      <div v-if="tokenCookie" class="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-outline-variant">
        <a 
          href="https://portal-perpus.stahdnj.ac.id" 
          class="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 shrink-0"
          title="Buka Portal Dashboard"
        >
          <span class="material-symbols-outlined text-base">dashboard</span>
          <span class="hidden sm:inline">Dashboard</span>
        </a>

        <!-- User Avatar & Profile Tag -->
        <a 
          v-if="profile"
          href="https://portal-perpus.stahdnj.ac.id" 
          class="flex items-center gap-2 p-1 hover:bg-surface-container-high rounded-full sm:rounded-xl transition-all border border-outline-variant/60" 
          :title="`Masuk sebagai ${profile.name}`"
        >
          <div class="w-7 h-7 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold overflow-hidden border border-secondary/30 shrink-0">
            <img v-if="profile?.avatar_url" class="w-full h-full object-cover" :src="profile.avatar_url" :alt="profile.name" />
            <span v-else class="text-[10px]">{{ (profile?.name || 'U').charAt(0) }}</span>
          </div>
          <div class="text-left hidden lg:block pr-2">
            <p class="font-label-md text-xs text-primary font-bold line-clamp-1 leading-tight">{{ profile?.name }}</p>
          </div>
        </a>

        <button @click="handleLogout" class="p-1.5 text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer shrink-0" title="Keluar (Logout)">
          <span class="material-symbols-outlined text-lg">logout</span>
        </button>
      </div>

      <!-- If Logged Out: Show External Login Button -->
      <div v-else class="flex items-center gap-2 pl-2 sm:pl-3 border-l border-outline-variant">
        <a href="https://portal-perpus.stahdnj.ac.id/login" class="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95">
          <span class="material-symbols-outlined text-base">login</span>
          <span>Masuk</span>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePustakaApi, type UserProfile } from '../composables/usePustakaApi';

const route = useRoute();
const router = useRouter();
const { getProfile, getSettings, logout, tokenCookie } = usePustakaApi();
const profile = ref<UserProfile | null>(null);
const siteName = ref('Perpustakaan STAH DNJ');
const logoUrl = ref<string | undefined>(undefined);

const adminRoles = ['admin', 'kepala_pustaka', 'kepala_perpustakaan', 'pustakawan', 'staf', 'petugas', 'operator'];

const userDashboardRoute = computed(() => {
  const roleStr = (profile.value?.role || '').toLowerCase();
  const isAdmin = adminRoles.some(r => roleStr.includes(r));
  return isAdmin ? '/admin' : '/dashboard';
});

const userRoleLabel = computed(() => {
  return profile.value?.role || 'Pemustaka';
});

const handleLogout = async () => {
  await logout();
  profile.value = null;
  router.push('/login');
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
