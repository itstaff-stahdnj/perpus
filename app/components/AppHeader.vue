<template>
  <header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 shadow-[0px_4px_12px_rgba(10,58,90,0.05)] bg-surface/90 glass-header border-b border-outline-variant/30">
    <div class="flex items-center gap-4">
      <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-1 text-secondary hover:bg-surface-container-high rounded-lg transition-colors" title="Menu">
        <span class="material-symbols-outlined text-2xl">menu</span>
      </button>
      <NuxtLink to="/" class="flex items-center gap-2">
        <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="h-8 w-auto object-contain" />
        <h1 class="font-headline-md text-headline-md font-bold text-primary text-base sm:text-lg md:text-xl">{{ siteName }}</h1>
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

    <div class="flex items-center gap-4">
      <!-- If Logged In: Profile & Dashboard Button -->
      <div v-if="tokenCookie && profile" class="flex items-center gap-3 pl-3 border-l border-outline-variant">
        <a href="https://portal-perpus.stahdnj.ac.id" class="flex items-center gap-2.5 p-1.5 hover:bg-surface-container-high rounded-full sm:rounded-xl transition-all border border-outline-variant/60" title="Buka Dashboard Panel">
          <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold overflow-hidden border border-secondary/30 shrink-0">
            <img v-if="profile?.avatar_url" class="w-full h-full object-cover" :src="profile.avatar_url" :alt="profile.name" />
            <span v-else class="text-xs">{{ (profile?.name || 'U').charAt(0) }}</span>
          </div>
          <div class="text-left hidden sm:block pr-2">
            <p class="font-label-md text-xs text-primary font-bold line-clamp-1 leading-tight">{{ profile?.name || 'User' }}</p>
            <p class="font-caption text-[10px] text-secondary font-bold uppercase leading-none mt-0.5">{{ userRoleLabel }}</p>
          </div>
        </a>

        <button @click="handleLogout" class="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer" title="Keluar (Logout)">
          <span class="material-symbols-outlined text-xl">logout</span>
        </button>
      </div>

      <!-- If Logged Out: Show External Login Button -->
      <div v-else class="flex items-center gap-2 pl-3 border-l border-outline-variant">
        <a href="https://portal-perpus.stahdnj.ac.id/login" class="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-container text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95">
          <span class="material-symbols-outlined text-base">login</span>
          <span>Masuk</span>
        </a>
      </div>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden" @click.self="mobileMenuOpen = false">
      <div class="bg-white w-72 h-full shadow-2xl p-6 flex flex-col justify-between animate-in slide-in-from-left duration-200">
        <div>
          <div class="flex items-center justify-between pb-4 mb-6 border-b border-outline-variant">
            <div class="flex items-center gap-2">
              <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="h-7 w-auto" />
              <span class="font-bold text-primary text-sm">{{ siteName }}</span>
            </div>
            <button @click="mobileMenuOpen = false" class="p-1 hover:bg-surface-container-high rounded-full">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <nav class="flex flex-col gap-2">
            <NuxtLink 
              to="/" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
              :class="route.path === '/' ? 'bg-secondary-fixed text-primary font-bold' : 'text-on-surface hover:bg-surface-container'"
            >
              <span class="material-symbols-outlined">home</span> Beranda
            </NuxtLink>
            <NuxtLink 
              to="/buku" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
              :class="route.path.startsWith('/buku') ? 'bg-secondary-fixed text-primary font-bold' : 'text-on-surface hover:bg-surface-container'"
            >
              <span class="material-symbols-outlined">menu_book</span> Katalog Buku
            </NuxtLink>
            <NuxtLink 
              to="/layanan" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
              :class="route.path.startsWith('/layanan') ? 'bg-secondary-fixed text-primary font-bold' : 'text-on-surface hover:bg-surface-container'"
            >
              <span class="material-symbols-outlined">room_service</span> Layanan
            </NuxtLink>
            <NuxtLink 
              to="/tata-tertib" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
              :class="route.path.startsWith('/tata-tertib') ? 'bg-secondary-fixed text-primary font-bold' : 'text-on-surface hover:bg-surface-container'"
            >
              <span class="material-symbols-outlined">gavel</span> Tata Tertib
            </NuxtLink>
            <NuxtLink 
              to="/bantuan" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
              :class="route.path.startsWith('/bantuan') ? 'bg-secondary-fixed text-primary font-bold' : 'text-on-surface hover:bg-surface-container'"
            >
              <span class="material-symbols-outlined">support_agent</span> Meja Bantuan
            </NuxtLink>

            <a 
              v-if="tokenCookie"
              href="https://portal-perpus.stahdnj.ac.id" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm bg-primary text-white mt-2"
            >
              <span class="material-symbols-outlined">dashboard</span> Buka Portal Dashboard
            </a>
            <a 
              v-else
              href="https://portal-perpus.stahdnj.ac.id/login" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm bg-primary text-white mt-2"
            >
              <span class="material-symbols-outlined">login</span> Masuk Ke Pustaka
            </a>
          </nav>
        </div>

        <div class="pt-4 border-t border-outline-variant text-center">
          <p class="text-xs text-on-surface-variant font-medium">PWA Ready • STAH DNJ</p>
        </div>
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
const mobileMenuOpen = ref(false);

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
