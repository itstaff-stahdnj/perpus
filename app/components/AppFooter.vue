<template>
  <footer id="tentang" class="bg-gradient-to-b from-[#0A2540] via-[#0D2E4E] to-[#07192C] text-slate-200 w-full mt-auto pt-14 sm:pt-20 pb-24 md:pb-12 px-4 md:px-margin-desktop border-t border-amber-500/20 relative overflow-hidden">
    <!-- Subtle Background Glow -->
    <div class="absolute -top-32 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

    <div class="max-w-container-max mx-auto relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-700/60">
        
        <!-- Brand & Vision (4 Cols) -->
        <div class="lg:col-span-4 space-y-4">
          <div class="flex items-center gap-3">
            <img v-if="settings?.logo_url" :src="settings.logo_url" alt="Logo STAH DNJ" class="h-10 w-auto object-contain bg-white/90 p-1 rounded-lg" />
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md shrink-0" v-else>
              📚
            </div>
            <div>
              <h3 class="font-bold text-base sm:text-lg text-white leading-tight">
                {{ settings?.app_name || 'Perpustakaan STAH DNJ' }}
              </h3>
              <p class="text-[11px] text-amber-400 font-semibold tracking-wide">STAH Dharma Nusantara Jakarta</p>
            </div>
          </div>

          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Pusat keunggulan literasi, riset akademik, dan repositori digital berbasis nilai-nilai Dharma Nusantara di Jakarta.
          </p>

          <!-- System Badges -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <span class="bg-white/10 text-amber-300 text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
              <span class="material-symbols-outlined text-xs">verified</span>
              <span>Terintegrasi OPAC &amp; SSO</span>
            </span>
            <span class="bg-white/10 text-slate-300 text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
              <span class="material-symbols-outlined text-xs">menu_book</span>
              <span>Repository Akreditasi</span>
            </span>
          </div>

          <!-- Social / Contact Icons -->
          <div class="flex items-center gap-2.5 pt-2">
            <a 
              :href="'mailto:' + (settings?.contact_email || 'perpustakaan@stahdnj.ac.id')"
              class="w-9 h-9 rounded-xl bg-white/10 hover:bg-amber-500 hover:text-slate-950 text-slate-200 transition-all flex items-center justify-center border border-white/10 active:scale-95" 
              title="Email Resmi"
            >
              <span class="material-symbols-outlined text-sm">mail</span>
            </a>
            <a 
              :href="'https://wa.me/' + (settings?.contact_whatsapp || '+6281234567890').replace(/[^0-9]/g, '')" 
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-xl bg-white/10 hover:bg-emerald-500 hover:text-white text-slate-200 transition-all flex items-center justify-center border border-white/10 active:scale-95" 
              title="WhatsApp Layanan"
            >
              <span class="material-symbols-outlined text-sm">call</span>
            </a>
            <a 
              href="https://stahdnj.ac.id" 
              target="_blank"
              rel="noopener noreferrer"
              class="w-9 h-9 rounded-xl bg-white/10 hover:bg-secondary hover:text-white text-slate-200 transition-all flex items-center justify-center border border-white/10 active:scale-95" 
              title="Website Resmi STAH DNJ"
            >
              <span class="material-symbols-outlined text-sm">language</span>
            </a>
          </div>
        </div>

        <!-- Tautan Cepat & Akses Portal (3 Cols) -->
        <div class="lg:col-span-3 space-y-3">
          <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">Navigasi Utama</h4>
          <ul class="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li>
              <NuxtLink to="/" class="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                <span>Beranda Utama</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/buku" class="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                <span>Katalog Buku (OPAC)</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/layanan" class="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                <span>Layanan &amp; Bebas Pustaka</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/berita" class="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                <span>Berita &amp; Pengumuman</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/tata-tertib" class="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs text-slate-400">chevron_right</span>
                <span>Tata Tertib Perpustakaan</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Portal & Repository Link (2 Cols) -->
        <div class="lg:col-span-2 space-y-3">
          <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">Layanan Terkait</h4>
          <ul class="space-y-2.5 text-xs sm:text-sm text-slate-300">
            <li>
              <NuxtLink to="/login" class="hover:text-amber-300 transition-colors flex items-center gap-1.5 font-semibold">
                <span class="material-symbols-outlined text-xs text-amber-400">vpn_key</span>
                <span>Masuk Pemustaka</span>
              </NuxtLink>
            </li>
            <li>
              <a href="https://repository.stahdnj.ac.id" target="_blank" class="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs text-slate-400">travel_explore</span>
                <span>Repository STAH DNJ</span>
                <span class="material-symbols-outlined text-[10px] text-slate-400">open_in_new</span>
              </a>
            </li>
            <li>
              <a href="https://stahdnj.ac.id" target="_blank" class="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs text-slate-400">domain</span>
                <span>Web STAH DNJ</span>
                <span class="material-symbols-outlined text-[10px] text-slate-400">open_in_new</span>
              </a>
            </li>
            <li>
              <NuxtLink to="/bantuan" class="hover:text-amber-300 transition-colors flex items-center gap-1.5">
                <span class="material-symbols-outlined text-xs text-slate-400">support_agent</span>
                <span>Pusat Bantuan</span>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Jam Operasional & Alamat (3 Cols) -->
        <div class="lg:col-span-3 space-y-4">
          <h4 class="text-xs font-bold text-amber-400 uppercase tracking-wider mb-4">Jam Operasional</h4>
          <ul class="space-y-2 text-xs text-slate-300 border-b border-slate-700/60 pb-3">
            <li class="flex justify-between items-center">
              <span>Senin – Kamis</span>
              <span class="font-mono text-amber-300 font-bold">{{ settings?.operating_hours?.weekday || '08:00 - 16:00' }}</span>
            </li>
            <li class="flex justify-between items-center">
              <span>Jumat</span>
              <span class="font-mono text-amber-300 font-bold">{{ settings?.operating_hours?.friday || '08:00 - 16:30' }}</span>
            </li>
            <li class="flex justify-between items-center">
              <span>Sabtu – Minggu</span>
              <span class="text-rose-400 font-bold">{{ settings?.operating_hours?.weekend || 'Tutup' }}</span>
            </li>
          </ul>

          <div class="text-xs text-slate-300 leading-relaxed">
            <p class="font-bold text-white mb-1 flex items-center gap-1">
              <span class="material-symbols-outlined text-xs text-amber-400">location_on</span>
              <span>Lokasi Kampus</span>
            </p>
            <p class="text-slate-400 text-[11px] leading-normal">
              {{ settings?.address || 'Jl. Daksinapati Raya No. 10, Rawamangun, Pulo Gadung, Jakarta Timur, DKI Jakarta 13220' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Copyright Bottom Bar -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p class="text-center sm:text-left leading-relaxed text-[11px] sm:text-xs">
          © 2026 <strong>{{ settings?.app_name || 'Perpustakaan STAH Dharma Nusantara Jakarta' }}</strong>. All Rights Reserved.
        </p>

        <div class="flex items-center gap-4 text-[11px]">
          <NuxtLink to="/tata-tertib" class="hover:text-amber-300 transition-colors">Tata Tertib</NuxtLink>
          <span class="text-slate-600">•</span>
          <NuxtLink to="/bantuan" class="hover:text-amber-300 transition-colors">Bantuan</NuxtLink>
          <span class="text-slate-600">•</span>
          <button @click="scrollToTop" class="hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            <span>Ke Atas</span>
            <span class="material-symbols-outlined text-xs">arrow_upward</span>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePustakaApi, type SiteSettings } from '../composables/usePustakaApi';
import { useIndexedDB } from '../composables/useIndexedDB';

const { getSettings } = usePustakaApi();
const { saveCatalogCache, getCatalogCache } = useIndexedDB();
const settings = ref<SiteSettings | null>(null);

const scrollToTop = () => {
  if (process.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(async () => {
  // STEP 1: Restore from IndexedDB cache for instant footer
  try {
    const cachedSettings = await getCatalogCache<SiteSettings>('footer_settings');
    if (cachedSettings) settings.value = cachedSettings;
  } catch (e) {}

  // STEP 2: Fetch fresh data from API
  try {
    const res = await getSettings();
    if (res?.data) {
      settings.value = res.data;
      saveCatalogCache('footer_settings', res.data);
    }
  } catch (e) {
    console.error('Footer settings load error:', e);
  }
});
</script>
