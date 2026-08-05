<template>
  <div class="min-h-screen bg-surface text-on-surface font-body-md overflow-x-hidden">
    <main>
      <!-- Hero Section -->
      <section class="relative overflow-hidden pt-20 pb-28 md:pb-32">
        <div class="absolute inset-0 z-0">
          <div class="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-95"></div>
          <div 
            class="w-full h-full bg-cover bg-center mix-blend-overlay" 
            style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuB9Sa7yc-_BKvqQQgmPRgAUIca-KT4_mWfnlAXs-3iU1S5N6cdiVJzKI_wjuWmx_bCRdLWE933MNUPsz0vsSqdzHN9O1NpZMVvuHjAw0aXwhKtlva1g5L-EYpPLrw6ZcbZPEhvv4ZYLuY_-Tj_yOYP0jhR_dzKGCxbJhpVeP9FBg5Fwb5yOMoPDhQC2RftDgbFY4l1-uu-hatIT6bmV5QlHloSSPjv-XmBV8X3AD0u1vRis5XNrs9_4w')"
          ></div>
        </div>

        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
          <div class="max-w-3xl">
            <span class="inline-block py-1.5 px-4 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-caption md:text-label-md mb-6 uppercase tracking-wider font-bold">
              Pusat Keunggulan Akademik
            </span>
            <h1 class="font-display-lg text-3xl md:text-display-lg text-white mb-8 leading-tight font-extrabold">
              Membangun Jembatan Antara Tradisi dan Teknologi
            </h1>
            <p class="font-body-lg text-body-md md:text-body-lg text-white/90 leading-relaxed mb-10">
              Perpustakaan STAH Dharma Nusantara Jakarta hadir sebagai episentrum pengetahuan yang mengintegrasikan kekayaan manuskrip keagamaan tradisional dengan sistem manajemen informasi digital mutakhir. Kami berkomitmen mendukung sivitas akademika dalam mencapai standar riset kelas dunia tanpa meninggalkan akar budaya Nusantara.
            </p>
            <div class="flex flex-wrap gap-4">
              <NuxtLink to="/buku" class="bg-secondary hover:bg-on-secondary-container text-white px-8 py-4 rounded-xl font-label-md text-label-md shadow-lg hover:shadow-xl transition-all font-semibold block">
                Jelajahi Koleksi Buku
              </NuxtLink>
              <button class="border-2 border-white text-white px-8 py-4 rounded-xl font-label-md text-label-md hover:bg-white/10 transition-all font-semibold" @click="scrollToVisiMisi">
                Profil Lembaga
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Vision & Mission Section -->
      <section id="visi-misi" class="py-24 bg-surface">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
            <!-- Visi Card -->
            <div class="floating-card p-8 md:p-12 rounded-2xl border-l-4 border-l-secondary relative overflow-hidden bg-white border border-outline-variant/60 shadow-sm">
              <div class="absolute top-0 right-0 p-8 opacity-5">
                <span class="material-symbols-outlined text-[120px]">visibility</span>
              </div>
              <h2 class="font-headline-lg text-headline-lg text-primary mb-6 flex items-center gap-3 font-bold">
                <span class="material-symbols-outlined text-secondary text-4xl">visibility</span>
                Visi Kami
              </h2>
              <p class="font-body-lg text-body-md md:text-body-lg text-on-surface-variant leading-relaxed">
                Menjadi perpustakaan riset terkemuka yang melestarikan kearifan lokal Nusantara sekaligus menjadi pionir dalam aksesibilitas informasi digital di tingkat nasional.
              </p>
            </div>

            <!-- Misi Card -->
            <div class="floating-card p-8 md:p-12 rounded-2xl border-l-4 border-l-primary relative overflow-hidden bg-white border border-outline-variant/60 shadow-sm">
              <div class="absolute top-0 right-0 p-8 opacity-5">
                <span class="material-symbols-outlined text-[120px]">flag</span>
              </div>
              <h2 class="font-headline-lg text-headline-lg text-primary mb-6 flex items-center gap-3 font-bold">
                <span class="material-symbols-outlined text-primary text-4xl">flag</span>
                Misi Kami
              </h2>
              <p class="font-body-lg text-body-md md:text-body-lg text-on-surface-variant leading-relaxed">
                Menyediakan koleksi referensi keagamaan yang komprehensif, mengembangkan platform digital yang ramah pengguna, dan memberikan layanan prima berbasis kemanusiaan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Core Values Section -->
      <section class="py-24 bg-surface-container-low">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop text-center mb-16">
          <h2 class="font-headline-lg text-headline-lg text-primary mb-4 font-bold">Nilai Utama Kami</h2>
          <div class="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
        </div>

        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Integrity -->
          <div class="group">
            <div class="floating-card p-8 rounded-2xl h-full flex flex-col items-center text-center bg-white border border-outline-variant/60 group-hover:bg-primary transition-all duration-500 shadow-sm">
              <div class="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                <span class="material-symbols-outlined text-primary group-hover:text-white text-3xl">verified_user</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-3 group-hover:text-white font-bold">Integritas</h3>
              <p class="font-body-md text-body-md text-on-surface-variant group-hover:text-white/80 leading-relaxed">
                Menjunjung tinggi kejujuran intelektual dan akurasi data dalam setiap layanan informasi.
              </p>
            </div>
          </div>

          <!-- Service -->
          <div class="group">
            <div class="floating-card p-8 rounded-2xl h-full flex flex-col items-center text-center bg-white border border-outline-variant/60 group-hover:bg-primary transition-all duration-500 shadow-sm">
              <div class="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                <span class="material-symbols-outlined text-primary group-hover:text-white text-3xl">volunteer_activism</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-3 group-hover:text-white font-bold">Pelayanan</h3>
              <p class="font-body-md text-body-md text-on-surface-variant group-hover:text-white/80 leading-relaxed">
                Memberikan pendampingan riset yang personal dan ramah untuk seluruh pemustaka.
              </p>
            </div>
          </div>

          <!-- Innovation -->
          <div class="group">
            <div class="floating-card p-8 rounded-2xl h-full flex flex-col items-center text-center bg-white border border-outline-variant/60 group-hover:bg-primary transition-all duration-500 shadow-sm">
              <div class="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                <span class="material-symbols-outlined text-primary group-hover:text-white text-3xl">lightbulb</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-3 group-hover:text-white font-bold">Inovasi</h3>
              <p class="font-body-md text-body-md text-on-surface-variant group-hover:text-white/80 leading-relaxed">
                Terus mengadopsi teknologi terbaru guna mempermudah akses literasi global.
              </p>
            </div>
          </div>

          <!-- Heritage -->
          <div class="group">
            <div class="floating-card p-8 rounded-2xl h-full flex flex-col items-center text-center bg-white border border-outline-variant/60 group-hover:bg-primary transition-all duration-500 shadow-sm">
              <div class="w-16 h-16 rounded-full bg-primary-fixed flex items-center justify-center mb-6 group-hover:bg-secondary transition-colors">
                <span class="material-symbols-outlined text-primary group-hover:text-white text-3xl">history_edu</span>
              </div>
              <h3 class="font-headline-md text-headline-md text-primary mb-3 group-hover:text-white font-bold">Warisan</h3>
              <p class="font-body-md text-body-md text-on-surface-variant group-hover:text-white/80 leading-relaxed">
                Melindungi dan mendigitalisasi khazanah budaya Nusantara bagi generasi mendatang.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- History Section -->
      <section class="py-24 bg-white">
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div class="flex flex-col lg:flex-row items-center gap-16">
            <div class="lg:w-1/2 relative w-full">
              <div class="absolute -top-4 -left-4 w-24 h-24 bg-secondary-fixed opacity-30 rounded-full z-0"></div>
              <div class="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-outline-variant">
                <img 
                  class="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyR4ZSniWLOTMbREgv3BqZE2ZQlgOfbqAgM7u37-7hUwXH2ncORTDYkWG-29RYiAfE43BxNOkNQshTP1SnmLIxseSsLSqHQUjx3OOevRZXnFJn9H-aWDs5MnM0R5IHIk5gKitbdCUIL8mDSdW4ZO91mWc5V-Zyh5NU5Rum9ghkvBV1hzbLndb-YbnIICFYrYjERoiQnfZkbQOCRfQ5snVpaCtS8S5sYZEzC2ba_t65ML7jJE5pkk9v9w" 
                  alt="Sejarah Perpustakaan STAH DNJ" 
                />
              </div>
              <div class="absolute -bottom-6 -right-6 p-6 bg-primary text-white rounded-2xl shadow-xl hidden sm:block">
                <div class="text-display-lg font-bold leading-none">20+</div>
                <div class="text-body-md opacity-80 mt-1">Tahun Mengabdi</div>
              </div>
            </div>

            <div class="lg:w-1/2">
              <h2 class="font-headline-lg text-headline-lg text-primary mb-6 font-bold">Sejarah Singkat</h2>
              <div class="space-y-6 text-on-surface-variant font-body-md leading-relaxed">
                <p>
                  Berawal dari sebuah ruang koleksi terbatas di sudut kampus STAH Dharma Nusantara Jakarta, perpustakaan ini telah menempuh perjalanan transformatif yang panjang. Awalnya didirikan untuk mendukung studi keagamaan dasar, seiring berjalannya waktu, kebutuhan akan referensi riset yang mendalam mendorong perluasan signifikan baik dari sisi kuantitas koleksi maupun infrastruktur.
                </p>
                <p>
                  Transformasi besar terjadi ketika lembaga memutuskan untuk melakukan digitalisasi total terhadap aset-aset langka. Kami berevolusi dari sekadar tempat penyimpanan buku menjadi sebuah "Modern Learning Resource Center". Perubahan ini bukan sekadar fisik, melainkan perubahan paradigma dalam menyajikan informasi yang lebih inklusif dan dinamis.
                </p>
                <p>
                  Hari ini, Perpustakaan STAH Dharma Nusantara Jakarta berdiri sebagai pusat riset yang disegani, menggabungkan kenyamanan ruang fisik yang meditatif dengan kecepatan akses digital yang tak terbatas, melayani ribuan pencari ilmu dari berbagai penjuru tanah air.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Location / Visit Us Section -->
      <section class="py-24 bg-primary-container relative overflow-hidden text-on-primary">
        <div class="absolute inset-0 opacity-10 pointer-events-none">
          <div class="grid grid-cols-12 h-full w-full">
            <div class="border-r border-white/20 h-full"></div>
            <div class="border-r border-white/20 h-full"></div>
            <div class="border-r border-white/20 h-full"></div>
            <div class="border-r border-white/20 h-full"></div>
          </div>
        </div>

        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div class="text-white max-w-xl">
            <h2 class="font-headline-lg text-headline-lg mb-6 font-bold">Kunjungi Kami</h2>
            <p class="font-body-lg text-body-lg opacity-90 mb-8 leading-relaxed">
              Kami mengundang Anda untuk merasakan ketenangan dalam belajar dan riset di lingkungan perpustakaan STAH DNJ yang kondusif.
            </p>

            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <span class="material-symbols-outlined text-secondary-fixed text-2xl mt-1">location_on</span>
                <div>
                  <h4 class="font-label-md text-label-md text-white font-bold">Alamat Utama Kampus</h4>
                  <p class="text-body-md opacity-80 leading-relaxed">Jl. Daksinapati Raya No. 10, Rawamangun, Pulo Gadung, Jakarta Timur, DKI Jakarta 13220</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <span class="material-symbols-outlined text-secondary-fixed text-2xl mt-1">mail</span>
                <div>
                  <h4 class="font-label-md text-label-md text-white font-bold">Hubungi Kami</h4>
                  <p class="text-body-md opacity-80">perpustakaan@stahdnj.ac.id</p>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full md:w-[500px] h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center text-center p-8">
            <span class="material-symbols-outlined text-secondary-fixed text-6xl mb-4">map</span>
            <p class="font-headline-md text-headline-md text-white font-bold mb-1">STAH Dharma Nusantara Jakarta</p>
            <p class="font-body-md text-white/80 text-sm">Rawamangun, Jakarta Timur, DKI Jakarta</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const scrollToVisiMisi = () => {
  const el = document.getElementById('visi-misi');
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
.floating-card {
  transition: all 0.3s ease;
}
.floating-card:hover {
  box-shadow: 0px 12px 24px rgba(10, 58, 90, 0.08);
  transform: translateY(-4px);
}
</style>
