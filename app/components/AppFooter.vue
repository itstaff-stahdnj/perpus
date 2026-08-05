<template>
  <footer id="tentang" class="bg-primary dark:bg-primary-container text-secondary-fixed w-full mt-auto py-16 px-margin-mobile md:px-margin-desktop border-t border-primary-container">
    <div class="max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
      <div>
        <h3 class="font-headline-md text-headline-md text-secondary-fixed font-bold mb-6">{{ settings.app_name || 'Perpustakaan STAH DNJ' }}</h3>
        <p class="font-body-md text-body-md text-on-primary-fixed-variant mb-6">
          Pusat sumber belajar dan riset unggulan berbasis nilai-nilai Dharma Nusantara di Jakarta.
        </p>
        <div class="flex gap-4">
          <a class="w-10 h-10 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container transition-colors" :href="'mailto:' + (settings.contact_email || 'perpustakaan@stahdnj.ac.id')">
            <span class="material-symbols-outlined text-sm">mail</span>
          </a>
          <a class="w-10 h-10 rounded-full border border-primary-fixed-dim/30 flex items-center justify-center hover:bg-secondary-container hover:text-on-secondary-container transition-colors" :href="'https://wa.me/' + (settings.contact_whatsapp || '+6281234567890').replace(/[^0-9]/g, '')" target="_blank">
            <span class="material-symbols-outlined text-sm">call</span>
          </a>
        </div>
      </div>

      <div>
        <h4 class="font-label-md text-label-md text-secondary-fixed font-bold mb-6">Alamat Kampus</h4>
        <p class="font-body-md text-body-md text-on-primary-fixed-variant leading-relaxed">
          {{ settings.address || 'Jl. Daksinapati Raya No. 10, Rawamangun, Pulo Gadung, Jakarta Timur, DKI Jakarta 13220' }}
        </p>
      </div>

      <div>
        <h4 class="font-label-md text-label-md text-secondary-fixed font-bold mb-6">Jam Operasional</h4>
        <ul class="space-y-3 font-body-md text-body-md text-on-primary-fixed-variant">
          <li class="flex justify-between"><span>Senin - Kamis</span> <span>{{ settings.operating_hours?.weekday || '08:00 - 16:00' }}</span></li>
          <li class="flex justify-between"><span>Jumat</span> <span>{{ settings.operating_hours?.friday || '08:00 - 16:30' }}</span></li>
          <li class="flex justify-between"><span>Sabtu - Minggu</span> <span class="text-secondary-fixed">{{ settings.operating_hours?.weekend || 'Tutup' }}</span></li>
        </ul>
      </div>

      <div>
        <h4 class="font-label-md text-label-md text-secondary-fixed font-bold mb-6">Tautan Cepat</h4>
        <ul class="space-y-3 font-body-md text-body-md text-on-primary-fixed-variant">
          <li><NuxtLink class="hover:text-secondary-container transition-colors" to="/buku">Katalog Buku</NuxtLink></li>
          <li><NuxtLink class="hover:text-secondary-container transition-colors" to="/berita">Berita &amp; Pengumuman</NuxtLink></li>
          <li><NuxtLink class="hover:text-secondary-container transition-colors" to="/layanan">Layanan Perpustakaan</NuxtLink></li>
          <li><NuxtLink class="hover:text-secondary-container transition-colors" to="/tentang">Tentang Kami</NuxtLink></li>
        </ul>
      </div>

      <div class="col-span-1 md:col-span-4 pt-12 border-t border-primary-fixed-dim/10 mt-8 text-center">
        <p class="font-caption text-caption text-on-primary-fixed-variant opacity-80">© 2026 {{ settings.app_name || 'Perpustakaan STAH Dharma Nusantara Jakarta' }}. All Rights Reserved.</p>
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
