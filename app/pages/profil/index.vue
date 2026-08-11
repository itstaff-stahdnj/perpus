<template>
  <div class="min-h-screen bg-[#F8F9FD] text-on-surface font-sans pt-20 pb-24 md:pb-16">
    <div class="max-w-container-max mx-auto px-4 md:px-margin-desktop">
      
      <!-- Top Banner Header -->
      <div class="bg-gradient-to-r from-[#0A2540] via-[#0D2E4E] to-[#163E66] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <!-- Background Accents -->
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <!-- Avatar & Badge -->
          <div class="relative shrink-0">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 overflow-hidden shadow-md flex items-center justify-center text-white text-3xl font-extrabold">
              <img v-if="user?.avatar_url" :src="user.avatar_url" :alt="user.name" class="w-full h-full object-cover" />
              <span v-else>{{ (user?.name || 'U').charAt(0) }}</span>
            </div>
            <span class="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500 text-white shadow-xs border border-white/40">
              {{ user?.status_keanggotaan || 'Aktif' }}
            </span>
          </div>

          <!-- User Info Summary -->
          <div class="flex-1 text-center md:text-left space-y-2">
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <h1 class="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">{{ user?.name || 'Pemustaka STAH DNJ' }}</h1>
              <span v-if="user?.bebas_pustaka" class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                <span class="material-symbols-outlined text-xs">verified</span>
                <span>Bebas Pustaka</span>
              </span>
            </div>

            <p class="text-xs sm:text-sm text-slate-300 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span>NIM / Identitas: <strong class="text-amber-300 font-mono">{{ user?.nim || user?.nidn || '2024001' }}</strong></span>
              <span>•</span>
              <span>Role: <strong class="text-white capitalize">{{ user?.role || 'Mahasiswa' }}</strong></span>
              <span v-if="user?.prodi">•</span>
              <span v-if="user?.prodi">Prodi: <strong class="text-white">{{ user.prodi }}</strong></span>
            </p>

            <!-- Quick Action Badges -->
            <div class="pt-3 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button 
                @click="activeTab = 'card'" 
                class="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span class="material-symbols-outlined text-base">badge</span>
                <span>Kartu Anggota &amp; QR Absensi</span>
              </button>

              <button 
                @click="activeTab = 'profile_bio'" 
                class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span class="material-symbols-outlined text-base">person</span>
                <span>Data Diri</span>
              </button>

              <button 
                @click="activeTab = 'security'" 
                class="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span class="material-symbols-outlined text-base">lock</span>
                <span>Sekuriti &amp; Password</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Navigation Tabs -->
      <div class="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-slate-200">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer"
          :class="activeTab === tab.id 
            ? 'bg-primary text-white shadow-md' 
            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'"
        >
          <span class="material-symbols-outlined text-base">{{ tab.icon }}</span>
          <span>{{ tab.label }}</span>
          <span v-if="tab.badgeCount" class="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-950">
            {{ tab.badgeCount }}
          </span>
        </button>
      </div>

      <!-- TAB 1: KARTU ANGGOTA DIGITAL & QR TOKEN ABSENSI -->
      <div v-if="activeTab === 'card'" class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in">
        <!-- Digital Member Card -->
        <div class="bg-gradient-to-br from-[#0A2540] to-[#123962] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/30 flex flex-col justify-between min-h-[260px]">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-lg">
                📚
              </div>
              <div>
                <h3 class="font-bold text-sm sm:text-base text-white">Kartu Anggota Digital</h3>
                <p class="text-[11px] text-amber-300 font-semibold">STAH Dharma Nusantara Jakarta</p>
              </div>
            </div>
            <span class="material-symbols-outlined text-4xl text-white/20">contactless</span>
          </div>

          <div class="my-6 flex items-center gap-4">
            <div class="w-16 h-16 rounded-xl bg-white/10 overflow-hidden border border-white/20 shrink-0 flex items-center justify-center text-2xl font-bold">
              <img v-if="user?.avatar_url" :src="user.avatar_url" alt="Avatar" class="w-full h-full object-cover" />
              <span v-else>{{ (user?.name || 'U').charAt(0) }}</span>
            </div>
            <div class="min-w-0">
              <p class="text-base sm:text-lg font-bold text-white truncate">{{ user?.name || 'Pemustaka' }}</p>
              <p class="text-xs text-slate-300 font-mono">NIM: {{ user?.nim || '2024001' }}</p>
              <p class="text-[11px] text-amber-300 uppercase font-semibold mt-0.5">{{ user?.role || 'Mahasiswa' }}</p>
            </div>
          </div>

          <div class="pt-4 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-300">
            <span>Status: <strong class="text-emerald-400 font-bold">AKTIF</strong></span>
            <span>Perpustakaan STAH DNJ</span>
          </div>
        </div>

        <!-- QR Code Attendance Kiosk Token -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold mb-4">
            <span class="material-symbols-outlined text-sm">qr_code_scanner</span>
            <span>QR Token Presensi Kiosk</span>
          </div>
          
          <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-inner mb-4 inline-block">
            <img 
              :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(user?.qr_token || user?.nim || '2024001')}`" 
              alt="QR Code Presensi" 
              class="w-44 h-44 object-contain mx-auto rounded-lg"
            />
          </div>

          <p class="text-xs text-slate-600 max-w-xs leading-relaxed mb-3">
            Tunjukkan kode QR ini ke kamera scan kiosk di pintu masuk perpustakaan STAH DNJ untuk mencatat kehadiran Anda.
          </p>
          
          <p class="text-[11px] font-mono text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
            Token: {{ user?.qr_token || user?.nim || '2024001' }}
          </p>
        </div>
      </div>

      <!-- TAB 2: PINJAMAN AKTIF -->
      <div v-else-if="activeTab === 'loans'" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 animate-in fade-in">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-xl">pending_actions</span>
            <span>Daftar Pinjaman Aktif &amp; Terlambat</span>
          </h3>
          <div class="flex items-center gap-2">
            <button @click="loadData" class="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors" title="Muat Ulang Data Real-time">
              <span class="material-symbols-outlined text-base">refresh</span>
            </button>
            <span class="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">
              {{ loans.length }} Transaksi
            </span>
          </div>
        </div>

        <div v-if="loadingLoans" class="py-12 text-center text-slate-500 text-xs">
          <div class="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-2"></div>
          <p>Memuat data peminjaman real-time dari server...</p>
        </div>

        <div v-else-if="loans.length === 0" class="py-16 text-center text-slate-500 space-y-3">
          <span class="material-symbols-outlined text-5xl text-slate-300">menu_book</span>
          <p class="font-bold text-sm text-slate-700">Belum Ada Pinjaman Aktif</p>
          <p class="text-xs text-slate-500">Anda tidak sedang meminjam buku saat ini.</p>
          <NuxtLink to="/buku" class="inline-block px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-container transition-colors">
            Cari &amp; Pinjam Buku
          </NuxtLink>
        </div>

        <div v-else v-auto-animate class="divide-y divide-slate-100">
          <div v-for="loan in loans" :key="loan.id" class="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-start gap-4">
              <!-- Book Cover -->
              <div class="w-14 h-20 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 shadow-xs">
                <img 
                  v-if="loan.book?.cover_image_url || loan.buku?.cover_image || loan.book?.cover_image" 
                  :src="loan.book?.cover_image_url || loan.buku?.cover_image || loan.book?.cover_image" 
                  alt="Cover" 
                  class="w-full h-full object-cover" 
                />
                <span v-else class="material-symbols-outlined text-3xl text-slate-400 flex items-center justify-center h-full">book</span>
              </div>

              <!-- Loan Information Details -->
              <div class="space-y-1.5 text-xs">
                <div class="flex items-center gap-2 flex-wrap">
                  <!-- Real-time Loan Status Badge -->
                  <span 
                    v-if="loan.denda && Number(loan.denda) > 0" 
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-900 border border-rose-300 animate-pulse"
                  >
                    🔴 Terlambat {{ loan.hari_terlambat || 1 }} Hari (Denda: Rp {{ Number(loan.denda).toLocaleString('id-ID') }})
                  </span>
                  <span 
                    v-else-if="String(loan.status).toLowerCase() === 'selesai'" 
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-300"
                  >
                    ✅ Sudah Dikembalikan
                  </span>
                  <span 
                    v-else 
                    class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300"
                  >
                    🟢 Aktif Dipinjam
                  </span>

                  <span class="text-[10px] font-mono text-slate-700 bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 px-2 py-0.5 rounded-md border border-slate-300 dark:border-zinc-700 font-bold">
                    📖 Kode Buku: {{ loan.barcode_qr_buku || (loan.book?.id ? `BK-${String(loan.book.id).padStart(3, '0')}` : 'BK-001') }}
                  </span>
                </div>

                <h4 class="font-bold text-slate-900 text-sm leading-snug">
                  {{ loan.book?.judul || loan.buku?.judul || loan.judul || 'Buku Perpustakaan' }}
                </h4>

                <p class="text-slate-500">
                  ✍️ Pengarang: <strong class="text-slate-700">{{ loan.book?.penulis || loan.buku?.penulis || 'STAH DNJ' }}</strong>
                </p>

                <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                  <span v-if="loan.tanggal_pinjam">📅 Pinjam: <strong class="text-slate-700 font-mono">{{ formatDate(loan.tanggal_pinjam) }}</strong></span>
                  <span>⏳ Tenggat Kembali: <strong class="text-rose-600 font-mono">{{ formatDate(loan.tanggal_kembali_seharusnya || loan.tanggal_kembali || loan.due_date) }}</strong></span>
                </div>
              </div>
            </div>

            <!-- Action Controls: Perpanjang & Return -->
            <div v-if="String(loan.status).toLowerCase() !== 'selesai'" class="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button 
                @click="handleExtendLoan(loan.id)"
                class="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                title="Perpanjang masa peminjaman selama 7 hari kerja"
              >
                <span class="material-symbols-outlined text-sm">update</span>
                <span>Perpanjang (+7 Hari)</span>
              </button>

              <button 
                v-if="isCampusNetwork"
                @click="handleReturnLoan(loan.id)"
                class="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                title="Proses pengembalian buku"
              >
                <span class="material-symbols-outlined text-sm text-emerald-600">assignment_return</span>
                <span>Kembalikan</span>
              </button>

              <button 
                v-else
                disabled
                class="px-3 py-2 bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-300 dark:border-zinc-700 text-xs font-bold rounded-xl cursor-not-allowed flex items-center gap-1 opacity-70 transition-all duration-300"
                title="Pengembalian buku mandiri hanya dapat dilakukan saat terhubung ke Wi-Fi Kampus STAH DNJ"
              >
                <span class="material-symbols-outlined text-sm text-rose-500 animate-pulse">wifi_off</span>
                <span>Gunakan Wi-Fi Kampus untuk Mengembalikan</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: RESERVASI ANTREAN -->
      <div v-else-if="activeTab === 'reservations'" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 animate-in fade-in">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-blue-600 text-xl">schedule</span>
            <span>Daftar Reservasi &amp; Antrean Buku</span>
          </h3>
          <span class="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-800 rounded-full">
            {{ reservations.length }} Antrean Active
          </span>
        </div>

        <div v-if="reservations.length === 0" class="py-16 text-center text-slate-500 space-y-3">
          <span class="material-symbols-outlined text-5xl text-slate-300">bookmark</span>
          <p class="font-bold text-sm text-slate-700">Belum Ada Reservasi Buku</p>
          <p class="text-xs text-slate-500">Anda tidak sedang mengantre reservasi buku saat ini.</p>
        </div>

        <div v-else class="divide-y divide-slate-100">
          <div v-for="res in reservations" :key="res.id" class="py-4 flex flex-col items-start gap-4">
            <div class="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="space-y-1 text-xs">
                <h4 class="font-bold text-slate-900 text-sm">{{ res.buku?.judul || res.book?.judul || 'Buku Reservasi' }}</h4>
                <p class="text-slate-500">Pemustaka: <strong class="text-slate-800">{{ res.user?.name || user?.name }}</strong> ({{ res.user?.nim || user?.nim || 'NIM' }})</p>
                <p class="text-slate-500">Tanggal Pengajuan: {{ formatDate(res.created_at) }}</p>
                
                <div class="pt-1 flex flex-wrap items-center gap-2">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold" :class="getReservationStatusBadge(res.status).class">
                    <span>{{ getReservationStatusBadge(res.status).label }}</span>
                  </span>
                </div>
              </div>

              <!-- Action Controls for Staff & Pemustaka -->
              <div class="flex flex-wrap items-center gap-2 self-stretch sm:self-center">
                <!-- Staff Controls -->
                <template v-if="isStaffUser">
                  <button 
                    @click="handleChangeReservationStatus(res.id, 'proses_pengambilan')"
                    class="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Tandai pustakawan sedang mengambil buku dari rak"
                  >
                    <span class="material-symbols-outlined text-sm">directions_walk</span>
                    <span>1. Ambil Buku</span>
                  </button>

                  <button 
                    @click="handleChangeReservationStatus(res.id, 'siap_diambil')"
                    class="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    title="Tandai buku sudah ditaruh di meja reservasi & siap diambil"
                  >
                    <span class="material-symbols-outlined text-sm">task_alt</span>
                    <span>2. Buku Siap di Meja</span>
                  </button>

                  <a 
                    :href="getUserWhatsAppUrl(res)"
                    target="_blank"
                    class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    title="Kirim notifikasi WhatsApp ke pemustaka"
                  >
                    <span class="material-symbols-outlined text-sm">chat</span>
                    <span>WA Pemustaka</span>
                  </a>

                  <button 
                    v-if="String(res.status).toLowerCase() === 'siap_diambil'"
                    @click="handleChangeReservationStatus(res.id, 'selesai')"
                    class="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-extrabold rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md"
                  >
                    <span class="material-symbols-outlined text-sm">check_circle</span>
                    <span>Serahkan Buku (Selesai)</span>
                  </button>
                </template>

                <!-- Pemustaka Controls -->
                <template v-else>
                  <a 
                    :href="getStaffWhatsAppUrl(res)"
                    target="_blank"
                    class="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    title="Tanya status reservasi ke Petugas Pustakawan via WhatsApp"
                  >
                    <span class="material-symbols-outlined text-sm">chat</span>
                    <span>Chat Pustakawan WA</span>
                  </a>

                  <button 
                    v-if="String(res.status).toLowerCase() === 'siap_diambil'"
                    @click="handleChangeReservationStatus(res.id, 'selesai')"
                    class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <span class="material-symbols-outlined text-base">check_circle</span>
                    <span>Konfirmasi Terima Buku</span>
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 4: BUKU FAVORIT / WISHLIST -->
      <div v-else-if="activeTab === 'wishlist'" class="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4 animate-in fade-in">
        <div class="flex items-center justify-between border-b border-slate-200 pb-4">
          <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-600 text-xl">favorite</span>
            <span>Daftar Buku Favorit &amp; Wishlist</span>
          </h3>
        </div>

        <div v-if="wishlistBooks.length === 0" class="py-12 text-center text-slate-500 space-y-3">
          <span class="material-symbols-outlined text-4xl text-rose-300">favorite_border</span>
          <p class="text-xs">Belum ada buku di daftar favorit Anda. Silakan jelajahi katalog dan tekan tombol <strong>"Simpan ke Favorit"</strong> pada halaman buku!</p>
          <NuxtLink to="/buku" class="inline-block px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-xs hover:bg-primary-container transition-colors">
            Jelajahi Katalog Buku
          </NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink 
            v-for="book in wishlistBooks" 
            :key="book.id" 
            :to="getBookUrl(book)"
            class="p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 transition-all flex gap-3 group"
          >
            <div class="w-14 h-20 bg-slate-200 rounded-lg overflow-hidden shrink-0 border border-slate-300">
              <img v-if="book.cover_image || book.sampul" :src="book.cover_image || book.sampul" alt="Cover" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <span v-else class="material-symbols-outlined text-3xl text-slate-400 flex items-center justify-center h-full">book</span>
            </div>
            <div class="min-w-0 flex flex-col justify-center text-xs">
              <h4 class="font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{{ book.judul }}</h4>
              <p class="text-slate-500 mt-0.5 truncate">{{ book.penulis || book.pengarang || 'STAH DNJ' }}</p>
              <span class="mt-2 text-[10px] font-bold text-primary flex items-center gap-1">
                <span>Lihat Detail Katalog</span>
                <span class="material-symbols-outlined text-xs">arrow_forward</span>
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- TAB 5: TESTIMONI PEMUSTAKA (DIBATASI 1 KALI) -->
      <div v-else-if="activeTab === 'testimonial'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-2xl mx-auto space-y-6 animate-in fade-in">
        <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-amber-500 text-xl">rate_review</span>
            <span>Testimoni Pemustaka STAH DNJ</span>
          </h3>
          <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
            Dibatasi 1x Pengisian
          </span>
        </div>

        <!-- Case 1: User Has Already Submitted a Testimonial -->
        <div v-if="myTestimonial" class="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
              <span class="font-bold text-slate-900 text-sm">Testimoni Anda Telah Diterbitkan</span>
            </div>
            <span class="px-2.5 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-extrabold rounded-full border border-emerald-300">
              🟢 Aktif di Beranda
            </span>
          </div>

          <!-- Star Rating -->
          <div class="flex items-center gap-1 text-amber-400 text-lg">
            <span v-for="star in 5" :key="star" class="material-symbols-outlined">
              {{ star <= (myTestimonial.rating || 5) ? 'star' : 'star_outline' }}
            </span>
            <span class="text-slate-500 text-xs font-bold ml-2">({{ myTestimonial.rating || 5 }}/5 Bintang)</span>
          </div>

          <!-- Testimonial Quote Box -->
          <div class="p-4 bg-white rounded-xl border border-slate-200 italic text-slate-700 leading-relaxed shadow-inner relative">
            <span class="text-3xl font-serif text-slate-300 absolute -top-2 left-2 pointer-events-none">“</span>
            <p class="relative z-10 pl-4">
              {{ myTestimonial.content || myTestimonial.isi }}
            </p>
          </div>

          <div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
            <span class="material-symbols-outlined text-base shrink-0">info</span>
            <p>
              Setiap akun pemustaka hanya diperkenankan mengirimkan testimoni sebanyak <strong>1 kali</strong>. Kesan &amp; pesan Anda telah tampil di halaman utama portal perpustakaan STAH Dharma Nusantara Jakarta.
            </p>
          </div>
        </div>

        <!-- Case 2: User Has NOT Submitted Testimonial Yet -->
        <form v-else @submit.prevent="handleSubmitTestimonial" class="space-y-4 text-xs sm:text-sm">
          <div class="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-blue-900 space-y-1">
            <p class="font-extrabold text-xs flex items-center gap-1.5">
              <span class="material-symbols-outlined text-primary text-base">campaign</span>
              <span>Bagikan Pengalaman Layanan Perpustakaan</span>
            </p>
            <p class="text-[11px] text-blue-800 leading-relaxed">
              Kesan, pesan, dan saran yang Anda sampaikan akan ditampilkan pada halaman beranda utama perpustakaan STAH DNJ. Pengisian testimoni dibatasi <strong>1 kali per akun</strong>.
            </p>
          </div>

          <!-- Rating Picker -->
          <div>
            <label class="block font-bold text-slate-700 mb-1.5">Beri Rating Layanan Perpustakaan</label>
            <div class="flex items-center gap-2">
              <button 
                v-for="star in 5" 
                :key="star"
                type="button"
                @click="testimonialForm.rating = star"
                class="text-2xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                :class="star <= testimonialForm.rating ? 'text-amber-400' : 'text-slate-300'"
              >
                ★
              </button>
              <span class="text-xs font-extrabold text-slate-600 ml-2">({{ testimonialForm.rating }} / 5 Bintang)</span>
            </div>
          </div>

          <!-- Content Textarea -->
          <div>
            <label class="block font-bold text-slate-700 mb-1">Pesan &amp; Kesan Testimoni Anda</label>
            <textarea 
              v-model="testimonialForm.content" 
              rows="4" 
              required
              maxlength="2000"
              placeholder="Tuliskan pengalaman Anda menggunakan layanan perpustakaan, keramahan pustakawan, fasilitas ruang baca, atau ketersediaan buku di STAH DNJ..."
              class="w-full p-4 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:outline-none focus:border-primary transition-colors text-xs leading-relaxed"
            ></textarea>
            <div class="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Testimoni akan terbit atas nama {{ user?.name || 'Pemustaka' }}</span>
              <span>{{ testimonialForm.content.length }}/2000 karakter</span>
            </div>
          </div>

          <div class="pt-3 flex items-center justify-end">
            <button 
              type="submit" 
              :disabled="submittingTestimonial"
              class="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span v-if="submittingTestimonial" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span class="material-symbols-outlined text-base" v-else>send</span>
              <span>{{ submittingTestimonial ? 'Mengirim...' : 'Kirim Testimoni (1x Pengisian)' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- TAB 6: EDIT DATA DIRI (BIO & KONTAK) -->
      <div v-else-if="activeTab === 'profile_bio'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-2xl mx-auto space-y-6 animate-in fade-in">
        <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-primary text-xl">person</span>
            <span>Informasi Data Diri &amp; Kontak</span>
          </h3>
          <span class="text-[11px] text-slate-400">Data Pemustaka STAH DNJ</span>
        </div>

        <form @submit.prevent="handleUpdateBio" class="space-y-4 text-xs sm:text-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1">NIM / Identitas Resmi</label>
              <input 
                :value="user?.nim || user?.nidn || '2024001'" 
                disabled
                type="text" 
                class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono cursor-not-allowed"
              />
              <span class="text-[10px] text-slate-400 mt-0.5 block">Identitas dikunci oleh sistem akademik.</span>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Email Resmi STAH</label>
              <input 
                :value="user?.email || 'user@stahdnj.ac.id'" 
                disabled
                type="email" 
                class="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
              />
              <span class="text-[10px] text-slate-400 mt-0.5 block">Alamat email terdaftar di portal kampus.</span>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
            <input 
              v-model="bioForm.name" 
              type="text" 
              required
              placeholder="Masukkan nama lengkap Anda"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Nomor WhatsApp / HP Layanan Notifikasi</label>
            <input 
              v-model="bioForm.whatsapp" 
              type="text" 
              placeholder="+6281234567890"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1">Program Studi (Prodi)</label>
              <input 
                v-model="bioForm.prodi" 
                type="text" 
                placeholder="Pendidikan Agama Hindu"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1">Instansi / Fakultas</label>
              <input 
                v-model="bioForm.instansi" 
                type="text" 
                placeholder="STAH Dharma Nusantara Jakarta"
                class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div class="pt-4 flex items-center justify-end">
            <button 
              type="submit" 
              :disabled="savingBio"
              class="px-6 py-3 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span v-if="savingBio" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>{{ savingBio ? 'Menyimpan...' : 'Simpan Data Diri' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- TAB 6: SEKURITI & KATA SANDI (PASSWORD) -->
      <div v-else-if="activeTab === 'security'" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-xl mx-auto space-y-6 animate-in fade-in">
        <div class="border-b border-slate-200 pb-3 flex items-center justify-between">
          <h3 class="font-bold text-base text-slate-900 flex items-center gap-2">
            <span class="material-symbols-outlined text-rose-600 text-xl">lock</span>
            <span>Pengaturan Sekuriti &amp; Kata Sandi</span>
          </h3>
          <span class="text-[11px] text-slate-400">Keamanan Akun</span>
        </div>

        <form @submit.prevent="handleUpdatePassword" class="space-y-4 text-xs sm:text-sm">
          <div class="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-start gap-2">
            <span class="material-symbols-outlined text-base shrink-0 mt-0.5">info</span>
            <p>
              Kata sandi baru minimal 6 karakter. Setelah kata sandi diperbarui, Anda dapat masuk menggunakan kata sandi baru pada sesi berikutnya.
            </p>
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Kata Sandi Baru</label>
            <input 
              v-model="securityForm.password" 
              type="password" 
              required
              minlength="6"
              placeholder="Masukkan kata sandi baru"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-700 mb-1">Konfirmasi Kata Sandi Baru</label>
            <input 
              v-model="securityForm.passwordConfirmation" 
              type="password" 
              required
              minlength="6"
              placeholder="Ketik ulang kata sandi baru"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div class="pt-4 flex items-center justify-end">
            <button 
              type="submit" 
              :disabled="savingSecurity"
              class="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span v-if="savingSecurity" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>{{ savingSecurity ? 'Memperbarui...' : 'Perbarui Kata Sandi' }}</span>
            </button>
          </div>
        </form>
      </div>

    </div>

    <!-- MODAL 1: Pemustaka QR Konfirmasi Pengambilan -->
    <div v-if="selectedReservationForUserQr" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4" @click.self="selectedReservationForUserQr = null">
      <div class="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative text-center border border-slate-200 animate-in fade-in zoom-in duration-200 text-slate-800">
        <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors" @click="selectedReservationForUserQr = null">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>

        <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3 font-bold">
          <span class="material-symbols-outlined text-2xl">qr_code_2</span>
        </div>

        <h3 class="font-extrabold text-slate-900 text-base mb-1">QR Konfirmasi Pengambilan Buku</h3>
        <p class="text-xs text-emerald-700 font-semibold mb-4">🟢 Buku Siap Diambil di Meja Reservasi</p>

        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-4 inline-block shadow-inner">
          <img 
            :src="`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedReservationForUserQr.user?.qr_token || user?.qr_token || user?.nim || '2024001')}`" 
            alt="QR Code Konfirmasi"
            class="w-44 h-44 object-contain mx-auto rounded-lg"
          />
        </div>

        <div class="text-left text-xs bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 mb-4">
          <p class="font-bold text-slate-900 truncate">{{ selectedReservationForUserQr.buku?.judul || selectedReservationForUserQr.book?.judul }}</p>
          <p class="text-slate-500">Peminjam: <strong class="text-slate-800">{{ user?.name }}</strong> ({{ user?.nim }})</p>
        </div>

        <p class="text-[11px] text-slate-500 leading-relaxed mb-4">
          Tunjukkan Kode QR ini ke scanner Pustakawan di Meja Reservasi untuk memverifikasi serah terima fisik buku secara sah.
        </p>

        <button 
          @click="selectedReservationForUserQr = null"
          class="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>

    <!-- MODAL 2: Staff Verify QR & Handover -->
    <div v-if="selectedReservationForStaffVerify" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4" @click.self="selectedReservationForStaffVerify = null">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left border border-slate-200 animate-in fade-in zoom-in duration-200 text-slate-800">
        <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors" @click="selectedReservationForStaffVerify = null">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-xl">verified_user</span>
          </div>
          <div>
            <h3 class="font-extrabold text-slate-900 text-base">Verifikasi QR Serah Terima Buku</h3>
            <p class="text-[11px] text-slate-500">Konfirmasi ulang identitas peminjam</p>
          </div>
        </div>

        <div class="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-900 text-xs space-y-1 mb-4">
          <p class="font-bold">{{ selectedReservationForStaffVerify.buku?.judul || selectedReservationForStaffVerify.book?.judul }}</p>
          <p>Pemustaka: <strong>{{ selectedReservationForStaffVerify.user?.name }}</strong> (NIM: {{ selectedReservationForStaffVerify.user?.nim }})</p>
        </div>

        <div class="space-y-3 text-xs mb-6">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Input NIM / ID Pemustaka</label>
            <input 
              v-model="scannedTokenInput" 
              type="text" 
              placeholder="Ketik NIM / ID pemustaka"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-primary"
            />
            <span class="text-[10px] text-slate-400 mt-0.5 block">NIM Peminjam: {{ selectedReservationForStaffVerify.user?.nim || user?.nim }}</span>
          </div>
        </div>

        <div class="flex justify-end gap-2.5">
          <button 
            @click="selectedReservationForStaffVerify = null"
            class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button 
            @click="confirmStaffHandover"
            class="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span class="material-symbols-outlined text-sm">check_circle</span>
            <span>Konfirmasi Serah Terima Buku</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { usePustakaApi, type UserProfile, type Book } from '../../composables/usePustakaApi';
import { useCampusNetwork } from '../../composables/useCampusNetwork';

const { getProfile, updateProfile, getLoans, extendLoan, returnLoan, getReservations, updateReservationStatus, getWishlist, getBooks, getTestimonials, createTestimonial, tokenCookie } = usePustakaApi();
const { isCampusNetwork } = useCampusNetwork();

const slugifyTitle = (text: string): string => {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const getBookUrl = (b: any): string => {
  if (!b) return '/buku';
  const titleSlug = slugifyTitle(b.judul || b.title || 'buku');
  const id = b.book_id || b.id || '1';
  return `/buku/${titleSlug}-${id}`;
};

const activeTab = ref<'card' | 'loans' | 'reservations' | 'wishlist' | 'testimonial' | 'profile_bio' | 'security'>('card');
const user = ref<UserProfile | null>(null);
const loans = ref<any[]>([]);
const reservations = ref<any[]>([]);
const wishlistBooks = ref<Book[]>([]);
const myTestimonial = ref<any>(null);
const loadingLoans = ref(false);
const savingBio = ref(false);
const savingSecurity = ref(false);

const testimonialForm = ref({
  rating: 5,
  content: ''
});
const submittingTestimonial = ref(false);

// QR Scan Verification Modal States
const selectedReservationForUserQr = ref<any>(null);
const selectedReservationForStaffVerify = ref<any>(null);
const scannedTokenInput = ref('');

const openUserQrModal = (res: any) => {
  selectedReservationForUserQr.value = res;
};

const openStaffVerifyQrModal = (res: any) => {
  selectedReservationForStaffVerify.value = res;
  scannedTokenInput.value = res.user?.nim || user.value?.nim || '';
};

const confirmStaffHandover = async () => {
  if (!selectedReservationForStaffVerify.value) return;
  const resId = selectedReservationForStaffVerify.value.id;
  const apiRes = await updateReservationStatus(resId, 'selesai');
  alert(apiRes.message || 'Buku berhasil diserahterimakan! Status reservasi Selesai.');
  selectedReservationForStaffVerify.value = null;
  loadData();
};

const bioForm = ref({
  name: '',
  whatsapp: '',
  prodi: '',
  instansi: ''
});

const securityForm = ref({
  password: '',
  passwordConfirmation: ''
});

const tabs = computed(() => [
  { id: 'card', label: 'Kartu Anggota & QR', icon: 'badge' },
  { id: 'loans', label: 'Pinjaman Aktif', icon: 'pending_actions', badgeCount: loans.value.length },
  { id: 'reservations', label: 'Reservasi Antrean', icon: 'schedule', badgeCount: reservations.value.length },
  { id: 'wishlist', label: 'Wishlist Favorit', icon: 'favorite' },
  { id: 'testimonial', label: 'Testimoni Saya (1x)', icon: 'rate_review' },
  { id: 'profile_bio', label: 'Data Diri', icon: 'person' },
  { id: 'security', label: 'Sekuriti & Password', icon: 'lock' }
]);

const isStaffUser = computed(() => {
  const roleStr = String(user.value?.role || '').trim().toLowerCase();
  return ['admin', 'pustakawan', 'kepala_pustaka', 'super_admin', 'staf', 'petugas', 'operator'].some(r => roleStr.includes(r));
});

const getReservationStatusBadge = (status?: string) => {
  const s = String(status || '').toLowerCase();
  if (s === 'siap_diambil') {
    return {
      label: '🟢 Buku Siap Diambil di Meja Reservasi',
      class: 'bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse'
    };
  }
  if (s === 'proses_pengambilan' || s === 'mengambil_buku') {
    return {
      label: '🔵 Pustakawan Sedang Mengambil Buku dari Rak',
      class: 'bg-blue-100 text-blue-900 border border-blue-300'
    };
  }
  if (s === 'selesai') {
    return {
      label: '✅ Buku Sudah Diambil Pemustaka',
      class: 'bg-slate-100 text-slate-700 border border-slate-300'
    };
  }
  if (s === 'dibatalkan') {
    return {
      label: '❌ Reservasi Dibatalkan',
      class: 'bg-rose-100 text-rose-800 border border-rose-200'
    };
  }
  return {
    label: '🟡 Menunggu Persetujuan & Pengambilan Pustakawan',
    class: 'bg-amber-100 text-amber-900 border border-amber-300'
  };
};

const handleChangeReservationStatus = async (reservationId: number | string, newStatus: string) => {
  const res = await updateReservationStatus(reservationId, newStatus);
  alert(res.message);
  loadData();
};

const getStaffWhatsAppUrl = (res: any) => {
  const staffPhone = '6281234567890';
  const bookTitle = res.buku?.judul || res.book?.judul || 'Buku';
  const userName = user.value?.name || 'Pemustaka';
  const userNim = user.value?.nim || '-';
  const text = `Halo Pustakawan STAH DNJ, saya ${userName} (NIM: ${userNim}). Saya ingin bertanya/mengonfirmasi status reservasi buku: "${bookTitle}" (ID Reservasi: #${res.id}). Terima kasih!`;
  return `https://wa.me/${staffPhone}?text=${encodeURIComponent(text)}`;
};

const getUserWhatsAppUrl = (res: any) => {
  let userPhone = res.user?.whatsapp || user.value?.whatsapp || '';
  userPhone = userPhone.replace(/[^0-9]/g, '');
  if (userPhone.startsWith('0')) {
    userPhone = '62' + userPhone.slice(1);
  }
  const bookTitle = res.buku?.judul || res.book?.judul || 'Buku';
  const userName = res.user?.name || user.value?.name || 'Pemustaka';
  const text = `Halo ${userName}, kabar baik dari Perpustakaan STAH DNJ! Buku reservasi Anda: "${bookTitle}" telah disiapkan dan SIAP DIAMBIL di Meja Reservasi. Silakan datang dengan membawa QR Presensi Anda. Terima kasih!`;
  return `https://wa.me/${userPhone || '6281234567890'}?text=${encodeURIComponent(text)}`;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '7 Hari Kerja';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
};

const handleExtendLoan = async (loanId: number | string) => {
  const res = await extendLoan(loanId);
  alert(res.message);
  loadData();
};

const handleReturnLoan = async (loanId: number | string) => {
  if (!isCampusNetwork.value) {
    alert('Fitur Pengembalian Buku Mandiri hanya dapat diakses saat Anda terhubung ke Wi-Fi Kampus STAH DNJ.');
    return;
  }
  if (!confirm('Apakah Anda yakin ingin mengembalikan buku ini?')) return;
  const res = await returnLoan(loanId);
  alert(res.message);
  loadData();
};

const handleUpdateBio = async () => {
  savingBio.value = true;
  try {
    const res = await updateProfile({
      name: bioForm.value.name,
      whatsapp: bioForm.value.whatsapp,
      prodi: bioForm.value.prodi,
      instansi: bioForm.value.instansi
    });
    alert(res.message);
    if (res.success) {
      loadData();
    }
  } finally {
    savingBio.value = false;
  }
};

const handleUpdatePassword = async () => {
  if (securityForm.value.password !== securityForm.value.passwordConfirmation) {
    alert('Konfirmasi kata sandi tidak cocok. Harap periksa kembali.');
    return;
  }

  savingSecurity.value = true;
  try {
    const res = await updateProfile({
      password: securityForm.value.password
    });
    alert(res.message);
    if (res.success) {
      securityForm.value.password = '';
      securityForm.value.passwordConfirmation = '';
    }
  } finally {
    savingSecurity.value = false;
  }
};

const handleSubmitTestimonial = async () => {
  if (!testimonialForm.value.content.trim()) {
    alert('Harap tuliskan pesan/kesan testimoni Anda terlebih dahulu.');
    return;
  }

  submittingTestimonial.value = true;
  try {
    const res = await createTestimonial(
      testimonialForm.value.content.trim(),
      testimonialForm.value.rating,
      user.value?.name,
      user.value?.prodi || user.value?.role || 'Pemustaka'
    );

    alert(res.message);
    if (res.success) {
      if (res.data) {
        myTestimonial.value = res.data;
      }
      loadData();
    }
  } finally {
    submittingTestimonial.value = false;
  }
};

const loadData = async () => {
  try {
    const profileRes = await getProfile().catch(() => null);
    if (profileRes?.data || (profileRes as any)?.user) {
      const uData = profileRes.data || (profileRes as any).user;
      user.value = uData;
      bioForm.value.name = uData.name || '';
      bioForm.value.whatsapp = uData.whatsapp || '';
      bioForm.value.prodi = uData.prodi || '';
      bioForm.value.instansi = uData.instansi || 'STAH Dharma Nusantara Jakarta';
    }

    loadingLoans.value = true;
    const loansRes = await getLoans('aktif').catch(() => null);
    if (loansRes?.data && Array.isArray(loansRes.data)) {
      const currentUserId = user.value?.id;
      if (currentUserId) {
        loans.value = loansRes.data.filter((l: any) => 
          String(l.user_id) === String(currentUserId) && 
          String(l.status).toLowerCase() !== 'selesai'
        );
      } else {
        loans.value = loansRes.data;
      }
    } else {
      loans.value = [];
    }

    const resRes = await getReservations(true).catch(() => null);
    if (resRes?.data && Array.isArray(resRes.data)) {
      const currentUserId = user.value?.id;
      if (currentUserId) {
        reservations.value = resRes.data.filter((r: any) => 
          (r.user_id && String(r.user_id) === String(currentUserId)) ||
          (r.user?.id && String(r.user.id) === String(currentUserId))
        );
      } else {
        reservations.value = resRes.data;
      }
    } else {
      reservations.value = [];
    }

    const wishlistRes = await getWishlist().catch(() => null);
    if (wishlistRes?.data && Array.isArray(wishlistRes.data)) {
      wishlistBooks.value = wishlistRes.data;
    } else {
      wishlistBooks.value = [];
    }

    const testRes = await getTestimonials().catch(() => null);
    if (testRes?.data && Array.isArray(testRes.data) && user.value) {
      const found = testRes.data.find((t: any) => 
        (t.user_id && String(t.user_id) === String(user.value?.id)) ||
        (t.name && user.value?.name && t.name.toLowerCase() === user.value.name.toLowerCase())
      );
      if (found) {
        myTestimonial.value = found;
      }
    }
  } catch (e) {
    console.error('Failed to load profile data:', e);
  } finally {
    loadingLoans.value = false;
  }
};

onMounted(() => {
  if (!tokenCookie.value) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
  } else {
    loadData();
  }
});

useHead({
  title: 'Profil Pemustaka & Kartu Anggota - STAH Dharma Nusantara Jakarta',
  meta: [
    { name: 'description', content: 'Halaman profil resmi pemustaka, kartu anggota digital, QR presensi kiosk, pinjaman aktif, dan reservasi buku.' }
  ]
});
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
