<template>
  <footer id="tentang" class="bg-primary text-secondary-fixed w-full mt-auto pt-12 sm:pt-16 pb-24 md:pb-16 px-margin-mobile md:px-margin-desktop border-t border-primary-container">
    <div class="max-w-container-max mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-gutter">
      <!-- Brand & Summary -->
      <div class="sm:col-span-2 lg:col-span-1">
        <h3 class="font-headline-md text-lg sm:text-headline-md text-secondary-fixed font-bold mb-4 sm:mb-6 leading-tight">
          {{ settings.app_name || 'Perpustakaan STAH DNJ' }}
        </h3>
        <p class="font-body-md text-xs sm:text-sm text-on-primary-fixed-variant mb-6 leading-relaxed">
          Pusat sumber belajar dan riset unggulan berbasis nilai-nilai Dharma Nusantara di Jakarta.
        </p>
        <div class="flex gap-3">
          <a 
            class="w-10 h-10 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container transition-colors" 
            :href="'mailto:' + (settings.contact_email || 'perpustakaan@stahdnj.ac.id')"
            title="Email Resmi"
          >
            <span class="material-symbols-outlined text-sm">mail</span>
          </a>
          <a 
            class="w-10 h-10 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container transition-colors" 
            :href="'https://wa.me/' + (settings.contact_whatsapp || '+6281234567890').replace(/[^0-9]/g, '')" 
            target="_blank"
            title="WhatsApp Service"
          >
            <span class="material-symbols-outlined text-sm">call</span>
          </a>
        </div>
      </div>

      <!-- Campus Address -->
      <div>
        <h4 class="font-label-md text-sm sm:text-label-md text-secondary-fixed font-bold mb-4 sm:mb-6">Alamat Kampus</h4>
        <p class="font-body-md text-xs sm:text-sm text-on-primary-fixed-variant leading-relaxed">
          {{ settings.address || 'Jl. Daksinapati Raya No. 10, Rawamangun, Pulo Gadung, Jakarta Timur, DKI Jakarta 13220' }}
        </p>
      </div>

      <!-- Operating Hours -->
      <div>
        <h4 class="font-label-md text-sm sm:text-label-md text-secondary-fixed font-bold mb-4 sm:mb-6">Jam Operasional</h4>
        <ul class="space-y-2.5 font-body-md text-xs sm:text-sm text-on-primary-fixed-variant">
          <li class="flex justify-between gap-2">
            <span>Senin - Kamis</span>
            <span class="font-mono">{{ settings.operating_hours?.weekday || '08:00 - 16:00' }}</span>
          </li>
          <li class="flex justify-between gap-2">
            <span>Jumat</span>
            <span class="font-mono">{{ settings.operating_hours?.friday || '08:00 - 16:30' }}</span>
          </li>
          <li class="flex justify-between gap-2">
            <span>Sabtu - Minggu</span>
            <span class="text-secondary-fixed font-semibold">{{ settings.operating_hours?.weekend || 'Tutup' }}</span>
          </li>
        </ul>
      </div>

      <!-- Quick Navigation Links -->
      <div>
        <h4 class="font-label-md text-sm sm:text-label-md text-secondary-fixed font-bold mb-4 sm:mb-6">Tautan Cepat</h4>
        <ul class="space-y-2.5 font-body-md text-xs sm:text-sm text-on-primary-fixed-variant">
          <li><NuxtLink class="hover:text-secondary-container transition-colors" to="/buku">Katalog Buku</NuxtLink></li>
          <li><NuxtLink class="hover:text-secondary-container transition-colors" to="/layanan">Layanan Perpustakaan</NuxtLink></li>
          <li><NuxtLink class="hover:text-secondary-container transition-colors" to="/absensi">Presensi Kiosk</NuxtLink></li>
          <li><NuxtLink class="hover:text-secondary-container transition-colors" to="/berita">Berita &amp; Pengumuman</NuxtLink></li>
          <li><NuxtLink class="hover:text-secondary-container transition-colors" to="/tentang">Tentang Kami</NuxtLink></li>
        </ul>
      </div>

      <!-- Copyright Bottom Bar -->
      <div class="col-span-1 sm:col-span-2 lg:col-span-4 pt-8 sm:pt-12 border-t border-primary-fixed-dim/10 mt-4 sm:mt-8 text-center">
        <p class="font-caption text-[11px] sm:text-caption text-on-primary-fixed-variant opacity-80 leading-relaxed">
          © 2026 {{ settings.app_name || 'Perpustakaan STAH Dharma Nusantara Jakarta' }}. All Rights Reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePustakaApi, type SiteSettings } from '../composables/usePustakaApi';

const { getSettings } = usePustakaApi();
const settings = ref<SiteSettings>({});

onMounted(async () => {
  try {
    const res = await getSettings();
    if (res?.data) {
      settings.value = res.data;
    }
  } catch (e) {
    console.error('Footer settings load error:', e);
  }
});
</script>
