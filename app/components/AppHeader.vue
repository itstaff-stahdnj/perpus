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
        to="/absensi" 
        class="font-label-md text-label-md hover:bg-surface-container-high transition-colors px-3 py-2 rounded-lg"
        :class="route.path.startsWith('/absensi') ? 'text-secondary font-bold' : 'text-on-surface-variant'"
      >
        Absensi
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
      <button class="relative p-2 hover:bg-surface-container-high rounded-full transition-colors" title="Notifikasi">
        <span class="material-symbols-outlined text-on-surface-variant">notifications</span>
        <span class="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>
      </button>

      <!-- Dynamic User Profile -->
      <div class="flex items-center gap-3 pl-4 border-l border-outline-variant">
        <div class="text-right hidden sm:block">
          <p class="font-label-md text-label-md text-primary font-bold line-clamp-1">{{ profile?.name || 'Administrator' }}</p>
          <p class="font-caption text-caption text-on-surface-variant capitalize">{{ profile?.role || 'Anggota' }} STAH</p>
        </div>
        <div class="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold overflow-hidden border border-secondary/30">
          <img v-if="profile?.avatar_url" class="w-full h-full object-cover" :src="profile.avatar_url" :alt="profile.name" />
          <span v-else class="text-sm">{{ (profile?.name || 'A').charAt(0) }}</span>
        </div>
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
              to="/absensi" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
              :class="route.path.startsWith('/absensi') ? 'bg-secondary-fixed text-primary font-bold' : 'text-on-surface hover:bg-surface-container'"
            >
              <span class="material-symbols-outlined">badge</span> Presensi Kiosk
            </NuxtLink>
            <NuxtLink 
              to="/berita" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
              :class="route.path.startsWith('/berita') ? 'bg-secondary-fixed text-primary font-bold' : 'text-on-surface hover:bg-surface-container'"
            >
              <span class="material-symbols-outlined">newspaper</span> Berita
            </NuxtLink>
            <NuxtLink 
              to="/tentang" 
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors"
              :class="route.path.startsWith('/tentang') ? 'bg-secondary-fixed text-primary font-bold' : 'text-on-surface hover:bg-surface-container'"
            >
              <span class="material-symbols-outlined">info</span> Tentang Kami
            </NuxtLink>
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
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePustakaApi, type UserProfile, type SiteSettings } from '../composables/usePustakaApi';

const route = useRoute();
const { getProfile, getSettings } = usePustakaApi();
const profile = ref<UserProfile | null>(null);
const siteName = ref('Perpustakaan STAH DNJ');
const logoUrl = ref<string | undefined>(undefined);
const mobileMenuOpen = ref(false);

onMounted(async () => {
  try {
    const [resProfile, resSettings] = await Promise.all([
      getProfile().catch(() => null),
      getSettings().catch(() => null)
    ]);
    
    if (resProfile?.success) {
      profile.value = resProfile.data?.user || null;
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
