<template>
  <nav class="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(10,37,64,0.08)]" style="padding-bottom: env(safe-area-inset-bottom);">
    <div class="flex items-center justify-around px-2 h-16 max-w-md mx-auto">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-1 w-16 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95"
        :class="isActive(item.to) 
          ? 'text-primary font-black' 
          : 'text-slate-500 hover:text-primary font-medium'"
      >
        <div 
          class="flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300"
          :class="isActive(item.to) ? 'bg-primary/10 text-primary scale-110 shadow-xs' : ''"
        >
          <Icon 
            :name="isActive(item.to) ? item.activeIcon : item.icon"
            class="text-[22px] transition-all"
          />
        </div>
        <span class="text-[10px] leading-none tracking-tight text-center">{{ item.label }}</span>
      </NuxtLink>

      <!-- Member Profile / Dashboard Quick Access -->
      <NuxtLink 
        to="/dashboard"
        class="flex flex-col items-center justify-center gap-1 w-16 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95"
        :class="isActive('/dashboard') || isActive('/profil')
          ? 'text-primary font-black' 
          : 'text-slate-500 hover:text-primary font-medium'"
      >
        <div 
          class="flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300"
          :class="isActive('/dashboard') || isActive('/profil') ? 'bg-primary/10 text-primary scale-110 shadow-xs' : ''"
        >
          <Icon 
            :name="isActive('/dashboard') || isActive('/profil') ? 'material-symbols:account-circle' : 'material-symbols:account-circle-outline'"
            class="text-[22px] transition-all"
          />
        </div>
        <span class="text-[10px] leading-none tracking-tight text-center">Dashboard</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();

const navItems = [
  { to: '/', icon: 'material-symbols:home-outline', activeIcon: 'material-symbols:home', label: 'Beranda' },
  { to: '/buku', icon: 'material-symbols:menu-book-outline', activeIcon: 'material-symbols:menu-book', label: 'Katalog' },
  { to: '/layanan', icon: 'material-symbols:room-service-outline', activeIcon: 'material-symbols:room-service', label: 'Layanan' },
  { to: '/berita', icon: 'material-symbols:newspaper-outline', activeIcon: 'material-symbols:newspaper', label: 'Berita' },
];

const isActive = (to: string) => {
  if (to === '/') return route.path === '/';
  return route.path.startsWith(to);
};
</script>

<style scoped>
.mobile-bottom-nav {
  -webkit-tap-highlight-color: transparent;
}
</style>

