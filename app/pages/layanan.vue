<template>
  <div class="min-h-screen bg-surface-bright text-on-background font-body-md overflow-x-hidden">
    <main class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative w-full bg-primary-container py-12 sm:py-20 md:py-24 overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute w-full h-full" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 32px 32px;"></div>
        </div>
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
          <h1 class="font-display-lg text-3xl md:text-display-lg text-on-primary mb-6 font-extrabold">Layanan Perpustakaan</h1>
          <p class="font-body-lg text-body-md md:text-body-lg text-primary-fixed max-w-3xl mx-auto opacity-90 leading-relaxed">
            Menyediakan akses komprehensif ke sumber daya intelektual dan fasilitas modern untuk mendukung civitas akademika dalam pencapaian unggul di bidang Dharma dan Ilmu Pengetahuan.
          </p>
        </div>
      </section>

      <!-- Services Grid -->
      <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-10 sm:-mt-16 relative z-20 pb-16 sm:pb-24">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <!-- Peminjaman Buku -->
          <div class="academic-card p-6 sm:p-8 rounded-xl flex flex-col justify-between h-full bg-white border border-outline-variant/60 shadow-sm">
            <div>
              <div class="flex justify-between items-start mb-6">
                <div class="w-14 h-14 rounded-lg bg-secondary-container flex items-center justify-center">
                  <span class="material-symbols-outlined text-on-secondary-container text-3xl">auto_stories</span>
                </div>
                <span class="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-full font-label-md text-caption font-bold">Populer</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-3 font-bold">Peminjaman Buku</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
                Akses koleksi fisik yang mencakup naskah suci, literatur filsafat, hingga buku teks akademik terbaru dengan sistem sirkulasi yang mudah.
              </p>
            </div>
            <NuxtLink to="/buku" class="w-full py-3 border-2 border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 font-semibold">
              Lihat Detail <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </NuxtLink>
          </div>

          <!-- Akses E-Resources -->
          <div class="academic-card p-6 sm:p-8 rounded-xl flex flex-col justify-between h-full bg-white border border-outline-variant/60 shadow-sm">
            <div>
              <div class="w-14 h-14 rounded-lg bg-primary-fixed flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-on-primary-fixed-variant text-3xl">terminal</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-3 font-bold">Akses E-Resources</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
                Gerbang digital menuju ribuan jurnal internasional, e-book, dan basis data riset global yang dapat diakses kapan saja dan di mana saja.
              </p>
            </div>
            <button @click="openModal('Akses E-Resources', 'Portal E-Journal dan E-Book digital perpustakaan STAH DNJ dapat diakses oleh civitas akademika terdaftar. Gunakan NIM/NIDN Anda untuk masuk ke sistem pustaka digital.')" class="w-full py-3 bg-secondary text-on-primary rounded-lg font-label-md text-label-md hover:bg-on-secondary-container transition-all flex items-center justify-center gap-2 shadow-sm font-semibold">
              Masuk Digital <span class="material-symbols-outlined text-[18px]">open_in_new</span>
            </button>
          </div>

          <!-- Bantuan Riset -->
          <div class="academic-card p-6 sm:p-8 rounded-xl flex flex-col justify-between h-full bg-white border border-outline-variant/60 shadow-sm">
            <div>
              <div class="w-14 h-14 rounded-lg bg-tertiary-fixed flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-on-tertiary-fixed-variant text-3xl">psychology</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-3 font-bold">Bantuan Riset</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
                Konsultasi personal dengan pustakawan ahli untuk membantu penelusuran referensi, manajemen sitasi, dan publikasi ilmiah.
              </p>
            </div>
            <button @click="openModal('Bantuan Riset &amp; Konsultasi', 'Layanan bimbingan penelusuran referensi skripsi, manajemen referensi Mendeley/Zotero, serta asistensi pengecekan plagiarisme Turnitin.')" class="w-full py-3 border-2 border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 font-semibold">
              Jadwalkan Konsultasi <span class="material-symbols-outlined text-[18px]">event</span>
            </button>
          </div>

          <!-- Fasilitas & Ruang Baca -->
          <div class="academic-card p-6 sm:p-8 rounded-xl flex flex-col justify-between h-full bg-white border border-outline-variant/60 shadow-sm">
            <div>
              <div class="w-14 h-14 rounded-lg bg-surface-container-highest flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-primary text-3xl">meeting_room</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-3 font-bold">Fasilitas &amp; Ruang Baca</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
                Nikmati lingkungan belajar yang tenang, ruang diskusi kelompok dengan peralatan multimedia, serta area membaca komunal yang nyaman.
              </p>
            </div>
            <button @click="openModal('Reservasi Ruang Baca &amp; Diskusi', 'Fasilitas area belajar mandiri dan 4 ruangan diskusi kelompok dengan projector & Wi-Fi kecepatan tinggi. Silakan hubungi bagian sirkulasi untuk booking jam operasional.')" class="w-full py-3 border-2 border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 font-semibold">
              Pesan Ruangan <span class="material-symbols-outlined text-[18px]">grid_view</span>
            </button>
          </div>

          <!-- Pelatihan Literasi -->
          <div class="academic-card p-6 sm:p-8 rounded-xl flex flex-col justify-between h-full bg-white border border-outline-variant/60 shadow-sm">
            <div>
              <div class="w-14 h-14 rounded-lg bg-secondary-fixed flex items-center justify-center mb-6">
                <span class="material-symbols-outlined text-on-secondary-fixed text-3xl">school</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-3 font-bold">Pelatihan Literasi</h3>
              <p class="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
                Tingkatkan kemampuan pencarian informasi dan integritas akademik melalui workshop rutin penggunaan Mendeley, Zotero, dan Turnitin.
              </p>
            </div>
            <button @click="openModal('Workshop &amp; Pelatihan Literasi Informasi', 'Jadwal workshop literasi dilaksanakan setiap bulan untuk mahasiswa STAH DNJ. Materi mencakup strategi penelusuran karya ilmiah, teknik sitasi otomatis, dan etika penulisan karya ilmiah.')" class="w-full py-3 border-2 border-primary text-primary rounded-lg font-label-md text-label-md hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2 font-semibold">
              Daftar Pelatihan <span class="material-symbols-outlined text-[18px]">assignment_turned_in</span>
            </button>
          </div>

          <!-- Feature Image Card -->
          <div class="relative overflow-hidden rounded-xl h-full min-h-[320px] shadow-md border border-outline-variant/60">
            <div 
              class="absolute inset-0 z-0 bg-cover bg-center" 
              style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuApYkcjV93Qse6wSrjoFpTjQo2-U08XWI_Wz3wx4wJkJt3NVQb6RoMRX9KmOpeTw_Gq2iWzAxWYdZQXDflENLztRxfJz4nx-NLtaUzCF7HjOn0kbg18jOWtPFiE6-GUFJp0D42CMHOEHq2eWsopdTUGeoQmLD53h1xk9Hhiuv9wykzL2GCtgp7gLUCGNKgtqwD5gQmBmE8qszWkVnAsZfWMN0AZHYcQDABjbwQsnE95oNugpP_7cEKccA')"
            ></div>
            <div class="absolute inset-0 bg-primary/50 flex items-end p-8">
              <div class="text-on-primary">
                <p class="font-headline-md text-headline-md mb-2 font-bold">Heritage Meets Innovation</p>
                <p class="font-body-md text-body-md opacity-90 leading-relaxed">Transformasi digital untuk pelestarian tradisi nusantara dan pengembangan ilmu pengetahuan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Help Section -->
      <section class="bg-surface-container-low py-20">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div class="bg-white rounded-2xl p-6 sm:p-8 md:p-12 border border-outline-variant shadow-lg flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div class="flex-1">
              <h2 class="font-headline-lg text-headline-lg text-primary mb-4 font-bold">Butuh Bantuan Lain?</h2>
              <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
                Pustakawan kami siap membantu Anda menavigasi seluruh sumber daya yang tersedia. Hubungi kami melalui kanal komunikasi resmi perpustakaan.
              </p>
              <div class="flex flex-wrap gap-4">
                <a href="mailto:perpustakaan@stahdnj.ac.id" class="flex items-center gap-3 bg-surface-bright px-6 py-4 rounded-xl border border-outline-variant hover:border-secondary transition-colors">
                  <span class="material-symbols-outlined text-secondary">mail</span>
                  <div>
                    <p class="text-caption text-on-surface-variant font-bold uppercase tracking-wider">Email Layanan</p>
                    <p class="text-body-md font-bold text-primary break-all">perpustakaan@stahdnj.ac.id</p>
                  </div>
                </a>
                <a href="https://wa.me/6281234567890" target="_blank" class="flex items-center gap-3 bg-surface-bright px-6 py-4 rounded-xl border border-outline-variant hover:border-secondary transition-colors">
                  <span class="material-symbols-outlined text-secondary">chat</span>
                  <div>
                    <p class="text-caption text-on-surface-variant font-bold uppercase tracking-wider">WhatsApp Chat</p>
                    <p class="text-body-md font-bold text-primary">+62 812-3456-7890</p>
                  </div>
                </a>
              </div>
            </div>

            <div class="w-full md:w-1/3">
              <div class="aspect-square rounded-2xl overflow-hidden shadow-inner border-4 border-white">
                <div 
                  class="w-full h-full bg-cover bg-center" 
                  style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuD6iMFot95goWNW2YaXRu5m-3R_kecGEmOr5tznybwjsrjs0VBwKLWktaxTasarYITgznMwTonj3RQGxWqXzjNtlgmC4-o0gMVOb5y7ShPX9JZkKxRji4bwNb_U8p6C1fNMnYEkcad91XFEz7otINchIKfneNcUzaAza6AtSAPDgJ4zHeDXYn4L67aWfZi3fR5JNcfIbRtC42vbtoJhdBqa7cA1uVaA-GSgNb0jeMx9I66b2QZdbBHDnQ')"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Interactive Info Modal -->
    <div v-if="activeModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm" @click.self="activeModal = null">
      <div class="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-outline-variant relative">
        <button class="absolute top-4 right-4 text-on-surface-variant hover:text-primary" @click="activeModal = null">
          <span class="material-symbols-outlined">close</span>
        </button>
        <h3 class="font-headline-md text-headline-md text-primary mb-4 font-bold">{{ modalTitle }}</h3>
        <p class="font-body-md text-on-surface-variant mb-6 leading-relaxed">{{ modalDesc }}</p>
        <div class="flex justify-end gap-3">
          <button class="bg-primary text-white px-6 py-2.5 rounded-xl font-label-md text-sm hover:bg-primary-container transition-colors" @click="activeModal = null">
            Tutup
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const activeModal = ref<boolean | null>(null);
const modalTitle = ref('');
const modalDesc = ref('');

const openModal = (title: string, desc: string) => {
  modalTitle.value = title;
  modalDesc.value = desc;
  activeModal.value = true;
};
</script>

<style scoped>
.academic-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.academic-card:hover {
  transform: translateY(-4px);
  box-shadow: 0px 12px 24px rgba(10, 58, 90, 0.08);
}
</style>
