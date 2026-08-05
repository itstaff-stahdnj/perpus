<template>
  <div class="min-h-screen bg-surface-bright text-on-background font-body-md overflow-x-hidden">
    <main class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative w-full bg-primary-container py-12 sm:py-20 md:py-24 overflow-hidden">
        <div class="absolute inset-0 opacity-10">
          <div class="absolute w-full h-full" style="background-image: radial-gradient(#ffffff 1px, transparent 1px); background-size: 32px 32px;"></div>
        </div>
        <div class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
          <div class="inline-flex items-center gap-2 bg-secondary/20 text-secondary-fixed border border-secondary/40 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
            <span class="material-symbols-outlined text-sm">gavel</span>
            <span>Pedoman Akademik Perpustakaan</span>
          </div>
          <h1 class="font-display-lg text-3xl md:text-display-lg text-on-primary mb-6 font-extrabold">Tata Tertib &amp; Etika Pemustaka</h1>
          <p class="font-body-lg text-body-md md:text-body-lg text-primary-fixed max-w-3xl mx-auto opacity-90 leading-relaxed">
            Peraturan resmi Perpustakaan STAH Dharma Nusantara Jakarta untuk menciptakan suasana belajar yang kondusif, tertib, dan beretika tinggi bagi seluruh civitas akademika.
          </p>
        </div>
      </section>

      <!-- Rule Categories Grid -->
      <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop -mt-8 relative z-20 pb-20">
        <!-- Quick Stats Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div class="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-2xl">schedule</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Jam Layanan</p>
              <h4 class="font-bold text-sm text-primary">08.00 - 16.00 WIB</h4>
              <p class="text-[11px] text-on-surface-variant">Senin s.d. Jumat</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Maksimal Pinjam</p>
              <h4 class="font-bold text-sm text-primary">3 Buku (7 Hari)</h4>
              <p class="text-[11px] text-on-surface-variant">Dapat diperpanjang 1x</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-2xl">payments</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Denda Keterlambatan</p>
              <h4 class="font-bold text-sm text-rose-700">Rp 1.000 / Hari</h4>
              <p class="text-[11px] text-on-surface-variant">Per eksemplar buku</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-2xl">qr_code_scanner</span>
            </div>
            <div>
              <p class="text-xs text-on-surface-variant font-medium">Presensi Kiosk</p>
              <h4 class="font-bold text-sm text-emerald-800">Wajib Presensi</h4>
              <p class="text-[11px] text-on-surface-variant">Scan QR / NIM sebelum masuk</p>
            </div>
          </div>
        </div>

        <!-- Detailed Rules Tabs / Sections -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Main Rules List (Left 2 cols) -->
          <div class="lg:col-span-2 flex flex-col gap-6">
            <!-- Section 1: Kewajiban Pemustaka -->
            <div class="bg-white rounded-2xl p-8 border border-outline-variant/60 shadow-sm">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/50">
                <div class="p-2.5 bg-primary/10 rounded-xl text-primary">
                  <span class="material-symbols-outlined text-2xl">check_circle</span>
                </div>
                <h3 class="font-headline-md text-xl text-primary font-bold">1. Kewajiban Pemustaka</h3>
              </div>
              <ul class="space-y-4 text-sm text-on-surface-variant leading-relaxed">
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-emerald-600 text-lg shrink-0 mt-0.5">verified</span>
                  <span><strong>Melakukan Presensi Kedatangan:</strong> Setiap pengunjung wajib melakukan presensi di Terminal Kiosk Perpustakaan menggunakan scan Kartu Anggota (QR Code) atau input manual NIM/NIDN.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-emerald-600 text-lg shrink-0 mt-0.5">verified</span>
                  <span><strong>Menjaga Ketenangan:</strong> Wajib menjaga suasana belajar tetap tenang, bersikap sopan, dan mengondisikan perangkat seluler dalam mode hening (*silent mode*).</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-emerald-600 text-lg shrink-0 mt-0.5">verified</span>
                  <span><strong>Pakaian Rapi &amp; Sopan:</strong> Pemustaka wajib mengenakan pakaian rapi, bersopan santun sesuai dengan etika civitas akademika STAH DNJ.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-emerald-600 text-lg shrink-0 mt-0.5">verified</span>
                  <span><strong>Menjaga Kebersihan &amp; Fasilitas:</strong> Wajib membuang sampah pada tempatnya dan merawat koleksi buku serta meja/kursi perpustakaan dengan baik.</span>
                </li>
              </ul>
            </div>

            <!-- Section 2: Larangan Pemustaka -->
            <div class="bg-white rounded-2xl p-8 border border-outline-variant/60 shadow-sm">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/50">
                <div class="p-2.5 bg-rose-50 rounded-xl text-rose-600">
                  <span class="material-symbols-outlined text-2xl">block</span>
                </div>
                <h3 class="font-headline-md text-xl font-bold text-rose-900">2. Larangan di Lingkungan Perpustakaan</h3>
              </div>
              <ul class="space-y-4 text-sm text-on-surface-variant leading-relaxed">
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-rose-600 text-lg shrink-0 mt-0.5">cancel</span>
                  <span><strong>Membawa Makanan &amp; Minuman Berwarna:</strong> Dilarang membawa makanan berat atau minuman berwarna ke dalam area koleksi buku dan ruang baca.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-rose-600 text-lg shrink-0 mt-0.5">cancel</span>
                  <span><strong>Merusak/Coret Koleksi:</strong> Dilarang merobek, melipat, menggarisbawahi, atau mencoret-coret lembaran buku pustaka.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-rose-600 text-lg shrink-0 mt-0.5">cancel</span>
                  <span><strong>Membawa Keluar Buku Tanpa Izin:</strong> Dilarang membawa koleksi buku keluar ruang perpustakaan tanpa prosedur peminjaman di meja sirkulasi.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="material-symbols-outlined text-rose-600 text-lg shrink-0 mt-0.5">cancel</span>
                  <span><strong>Kegiatan Bising / Gaduh:</strong> Dilarang menerima panggilan telepon di dalam ruang baca atau melakukan diskusi kelompok di area quiet-zone.</span>
                </li>
              </ul>
            </div>

            <!-- Section 3: Ketentuan Sirkulasi & Peminjaman -->
            <div class="bg-white rounded-2xl p-8 border border-outline-variant/60 shadow-sm">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/50">
                <div class="p-2.5 bg-secondary/10 rounded-xl text-secondary">
                  <span class="material-symbols-outlined text-2xl">import_contacts</span>
                </div>
                <h3 class="font-headline-md text-xl text-primary font-bold">3. Ketentuan Peminjaman &amp; Pengembalian</h3>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div class="bg-surface-container-low p-5 rounded-xl border border-outline-variant/50">
                  <h4 class="font-bold text-primary mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-base">person</span>
                    Mahasiswa (D1 - S1)
                  </h4>
                  <p class="text-xs text-on-surface-variant leading-relaxed">
                    Maksimal 3 eksemplar buku dengan jangka waktu 7 hari kerja. Perpanjangan dapat dilakukan 1x secara online atau melalui meja sirkulasi.
                  </p>
                </div>
                <div class="bg-surface-container-low p-5 rounded-xl border border-outline-variant/50">
                  <h4 class="font-bold text-primary mb-2 flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary text-base">badge</span>
                    Dosen &amp; Tenaga Pendidik
                  </h4>
                  <p class="text-xs text-on-surface-variant leading-relaxed">
                    Maksimal 5 eksemplar buku dengan jangka waktu 14 hari kerja untuk mendukung riset &amp; pengajaran akademik.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Sidebar: Sanctions & Kiosk Terminal Notice -->
          <div class="flex flex-col gap-6">
            <!-- Sanctions Card -->
            <div class="bg-white rounded-2xl p-6 border border-outline-variant/60 shadow-sm">
              <h3 class="font-headline-md text-lg text-primary font-bold mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-rose-600">warning</span>
                Sanksi Pelanggaran
              </h3>
              <div class="space-y-4 text-xs text-on-surface-variant">
                <div class="p-4 bg-rose-50/60 border border-rose-200/80 rounded-xl">
                  <p class="font-bold text-rose-900 mb-1">Keterlambatan Peminjaman</p>
                  <p>Dikenakan denda administratif sebesar <strong>Rp 1.000,- per hari per buku</strong> sampai karya dikembalikan.</p>
                </div>
                <div class="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl">
                  <p class="font-bold text-amber-900 mb-1">Buku Hilang atau Rusak</p>
                  <p>Wajib mengganti dengan buku asli judul yang sama atau mengganti biaya sebesar 2x harga buku terbaru.</p>
                </div>
                <div class="p-4 bg-surface-container-low border border-outline-variant/60 rounded-xl">
                  <p class="font-bold text-primary mb-1">Pelanggaran Etika Kunjungan</p>
                  <p>Teguran lisan dari pustakawan dan pembekuan hak pinjam sementara jika melakukan pelanggaran berulang.</p>
                </div>
              </div>
            </div>

            <!-- Help Contact Card -->
            <div class="bg-primary text-white rounded-2xl p-6 shadow-md flex flex-col gap-4">
              <div class="flex items-center gap-3">
                <div class="p-2.5 bg-secondary text-primary rounded-xl font-bold">
                  <span class="material-symbols-outlined text-2xl">support_agent</span>
                </div>
                <div>
                  <h4 class="font-bold text-base text-white">Ada Pertanyaan?</h4>
                  <p class="text-xs text-white/80">Petugas Pustakawan Siap Membantu</p>
                </div>
              </div>
              <p class="text-xs text-white/90 leading-relaxed">
                Jika membutuhkan bantuan penelusuran referensi atau pertanyaan mengenai tata tertib, silakan hubungi Meja Bantuan Perpustakaan.
              </p>
              <NuxtLink to="/bantuan" class="w-full py-3 bg-secondary hover:bg-on-secondary-container text-white text-xs font-bold rounded-xl transition-all text-center flex items-center justify-center gap-2">
                <span>Buka Meja Bantuan</span>
                <span class="material-symbols-outlined text-sm">arrow_forward</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
useHead({
  title: 'Tata Tertib Perpustakaan - STAH Dharma Nusantara Jakarta',
  meta: [
    { name: 'description', content: 'Peraturan resmi dan pedoman tata tertib pengunjung Perpustakaan STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>
