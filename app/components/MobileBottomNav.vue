<template>
  <nav class="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-zinc-800 shadow-lg" style="padding-bottom: env(safe-area-inset-bottom);">
    <div class="flex items-center justify-around px-2 h-16 max-w-md mx-auto">
      <NuxtLink 
        v-for="item in navItems" 
        :key="item.to"
        :to="item.to"
        class="flex flex-col items-center justify-center gap-1 w-16 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95"
        :class="isActive(item.to) 
          ? 'text-blue-600 dark:text-blue-400 font-black' 
          : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-medium'"
      >
        <div 
          class="flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300"
          :class="isActive(item.to) ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 scale-105 shadow-xs' : ''"
        >
          <Icon 
            :name="isActive(item.to) ? item.activeIcon : item.icon"
            class="text-[22px] transition-all"
          />
        </div>
        <span class="text-[10px] leading-none tracking-tight text-center">{{ item.label }}</span>
      </NuxtLink>

      <!-- Role-Based Quick Access (Panel Admin for Admin Staff, Dashboard for Members) -->
      <NuxtLink 
        v-if="isAdminStaff"
        to="/admin"
        class="flex flex-col items-center justify-center gap-1 w-16 py-1 rounded-2xl transition-all duration-200 cursor-pointer active:scale-95 text-amber-700 font-bold"
        :class="isActive('/admin') ? 'text-amber-900 font-black' : 'text-amber-700 hover:text-amber-900'"
      >
        <div 
          class="flex items-center justify-center w-12 h-7 rounded-full transition-all duration-300"
          :class="isActive('/admin') ? 'bg-amber-100 text-amber-900 scale-110 shadow-xs' : ''"
        >
          <Icon 
            name="material-symbols:admin-panel-settings"
            class="text-[22px] transition-all"
          />
        </div>
        <span class="text-[10px] leading-none tracking-tight text-center">Panel Admin</span>
      </NuxtLink>

      <NuxtLink 
        v-else
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
            :name="isActive('/dashboard') || isActive('/profil') ? 'material-symbols:dashboard' : 'material-symbols:dashboard-outline'"
            class="text-[22px] transition-all"
          />
        </div>
        <span class="text-[10px] leading-none tracking-tight text-center">Dashboard</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePustakaApi } from '~/composables/usePustakaApi';

const route = useRoute();
const { getProfile, tokenCookie } = usePustakaApi();
const userRole = ref<string>('');

const navItems = [
  { to: '/', icon: 'material-symbols:home-outline', activeIcon: 'material-symbols:home', label: 'Beranda' },
  { to: '/buku', icon: 'material-symbols:menu-book-outline', activeIcon: 'material-symbols:menu-book', label: 'Katalog' },
  { to: '/layanan', icon: 'material-symbols:room-service-outline', activeIcon: 'material-symbols:room-service', label: 'Layanan' },
  { to: '/berita', icon: 'material-symbols:newspaper-outline', activeIcon: 'material-symbols:newspaper', label: 'Berita' },
];

const adminRoles = ['admin', 'administrator', 'kepala_pustaka', 'kepala_perpustakaan', 'pustakawan', 'staf', 'petugas', 'operator', 'super_admin'];

const isAdminStaff = computed(() => {
  const roleStr = userRole.value.trim().toLowerCase();
  return adminRoles.includes(roleStr);
});

const isActive = (to: string) => {
  if (to === '/') return route.path === '/';
  return route.path.startsWith(to);
};

onMounted(async () => {
  if (process.client) {
    try {
      const storedUser = localStorage.getItem('pustaka_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        userRole.value = parsed.role || '';
      }
    } catch (e) {}

    if (tokenCookie.value) {
      const prof = await getProfile().catch(() => null);
      if (prof?.data?.role || prof?.user?.role) {
        userRole.value = prof.data?.role || prof.user?.role || '';
      }
    }
  }
});
</script>

<style scoped>
.mobile-bottom-nav {
  -webkit-tap-highlight-color: transparent;
}
</style>
