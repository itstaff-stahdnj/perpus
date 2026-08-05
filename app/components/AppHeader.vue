<template>
  <header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 shadow-[0px_4px_12px_rgba(10,58,90,0.05)] bg-surface/90 glass-header border-b border-outline-variant/30">
    <div class="flex items-center gap-4">
      <span class="material-symbols-outlined text-secondary cursor-pointer scale-95 active:duration-150">menu</span>
      <NuxtLink to="/" class="flex items-center gap-2">
        <img v-if="logoUrl" :src="logoUrl" alt="Logo" class="h-8 w-auto object-contain" />
        <h1 class="font-headline-md text-headline-md font-bold text-primary">{{ siteName }}</h1>
      </NuxtLink>
    </div>

    <nav class="hidden md:flex items-center gap-6">
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
