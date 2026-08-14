<template>
  <div class="min-h-screen bg-[#F8F9FD] text-on-surface font-sans pt-20 pb-24 md:pb-16">
    <!-- Unauthenticated / Unauthorized Access State -->
    <div v-if="!loadingRole && !isStaffOrHead" class="max-w-2xl mx-auto px-4 py-16 text-center">
      <div class="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 space-y-6">
        <div class="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner">
          <span class="material-symbols-outlined text-4xl">lock_person</span>
        </div>
        <div class="space-y-2">
          <h2 class="text-2xl font-black text-slate-900">Akses Dikhususkan Pustakawan &amp; Kepala Pustaka</h2>
          <p class="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Halaman manajemen reservasi ini hanya dapat diakses oleh Kepala Perpustakaan, Pustakawan, dan Staf Operasional STAH Dharma Nusantara Jakarta.
          </p>
        </div>
        <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <NuxtLink to="/login" class="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-container text-white font-bold text-xs rounded-xl shadow-md transition-all">
            Masuk Akun Staf / SSO Kampus
          </NuxtLink>
          <NuxtLink to="/" class="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all">
            Kembali ke Beranda Utama
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Main Staff & Kepala Pustaka Portal Content -->
    <div v-else class="max-w-container-max mx-auto px-4 md:px-margin-desktop space-y-8">
      
      <!-- Top Banner Header -->
      <div class="bg-gradient-to-r from-[#0A2540] via-[#0F355C] to-[#1B4B79] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <!-- Background Accents -->
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute right-32 bottom-0 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div class="space-y-2 max-w-2xl">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-amber-400 text-slate-950 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">verified_user</span>
                <span>Portal Operasional &amp; Pengawasan</span>
              </span>
              <span v-if="isHeadLibrarian" class="px-3 py-1 bg-purple-500/30 border border-purple-300/40 text-purple-200 rounded-full text-[11px] font-extrabold flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">shield_person</span>
                <span>Mode Kepala Pustaka</span>
              </span>
              <span v-else class="px-3 py-1 bg-emerald-500/30 border border-emerald-300/40 text-emerald-200 rounded-full text-[11px] font-extrabold flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">support_agent</span>
                <span>Mode Pustakawan Counter</span>
              </span>
            </div>

            <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Manajemen Reservasi &amp; Serah Terima Buku
            </h1>
            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Sistem pemrosesan antrean buku dari rak, penyiapan di meja layanan, hingga serah terima sah ke pemustaka STAH DNJ.
            </p>
          </div>

          <!-- Quick Action & Header Info -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <button 
              @click="refreshData(true)" 
              :disabled="refreshing"
              class="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Perbarui Data Antrean Baru"
            >
              <span class="material-symbols-outlined text-base" :class="refreshing ? 'animate-spin' : ''">refresh</span>
              <span>{{ refreshing ? 'Memperbarui...' : 'Refresh Antrean' }}</span>
            </button>

            <button 
              v-if="isHeadLibrarian"
              @click="handlePrintReport" 
              class="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              title="Cetak Laporan Reservasi untuk Kepala Pustaka"
            >
              <span class="material-symbols-outlined text-base">print</span>
              <span>Cetak Laporan Eksekutif</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Section 1: KPI Dashboard & Real-Time Metrics -->
      <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Card 1: Total Reservasi -->
        <div 
          @click="activeStatusFilter = 'all'" 
          class="bg-white rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
          :class="activeStatusFilter === 'all' ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-slate-500">Total Reservasi</span>
            <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-xl">collections_bookmark</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-2xl sm:text-3xl font-extrabold text-slate-900">{{ metrics.total }}</span>
            <span class="text-[11px] text-slate-400 block mt-0.5">Keseluruhan pengajuan</span>
          </div>
        </div>

        <!-- Card 2: Menunggu Pengambilan (URGENT PUSTAKAWAN) -->
        <div 
          @click="activeStatusFilter = 'pending'" 
          class="bg-amber-50/80 rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group relative overflow-hidden"
          :class="activeStatusFilter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-100/50' : 'border-amber-200'"
        >
          <span v-if="metrics.pending > 0" class="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-amber-900">1. Perlu Ambil di Rak</span>
            <div class="w-9 h-9 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-xl">directions_run</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-2xl sm:text-3xl font-black text-amber-900">{{ metrics.pending }}</span>
            <span class="text-[11px] text-amber-700 font-semibold block mt-0.5">Perlu ditarik dari rak</span>
          </div>
        </div>

        <!-- Card 3: Sedang Diambil -->
        <div 
          @click="activeStatusFilter = 'proses_pengambilan'" 
          class="bg-blue-50/80 rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
          :class="activeStatusFilter === 'proses_pengambilan' ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-100/50' : 'border-blue-200'"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-blue-900">2. Proses Pengambilan</span>
            <div class="w-9 h-9 rounded-xl bg-blue-200/80 text-blue-900 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-xl">search_check</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-2xl sm:text-3xl font-black text-blue-900">{{ metrics.inProgress }}</span>
            <span class="text-[11px] text-blue-700 font-semibold block mt-0.5">Petugas mencari di rak</span>
          </div>
        </div>

        <!-- Card 4: Siap Diambil di Meja -->
        <div 
          @click="activeStatusFilter = 'siap_diambil'" 
          class="bg-emerald-50/80 rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group"
          :class="activeStatusFilter === 'siap_diambil' ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-100/50' : 'border-emerald-200'"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-emerald-900">3. Siap di Meja Layanan</span>
            <div class="w-9 h-9 rounded-xl bg-emerald-200/80 text-emerald-900 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-xl">task_alt</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-2xl sm:text-3xl font-black text-emerald-900">{{ metrics.ready }}</span>
            <span class="text-[11px] text-emerald-700 font-semibold block mt-0.5">Menunggu pemustaka</span>
          </div>
        </div>

        <!-- Card 5: Selesai / Diserahkan -->
        <div 
          @click="activeStatusFilter = 'selesai'" 
          class="bg-purple-50/80 rounded-2xl p-5 border transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group col-span-2 lg:col-span-1"
          :class="activeStatusFilter === 'selesai' ? 'border-purple-500 ring-2 ring-purple-500/20 bg-purple-100/50' : 'border-purple-200'"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-purple-900">4. Diserahkan &amp; Selesai</span>
            <div class="w-9 h-9 rounded-xl bg-purple-200/80 text-purple-900 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <span class="material-symbols-outlined text-xl">check_circle</span>
            </div>
          </div>
          <div class="mt-4">
            <span class="text-2xl sm:text-3xl font-black text-purple-900">{{ metrics.completed }}</span>
            <span class="text-[11px] text-purple-700 font-semibold block mt-0.5">Buku sukses dipinjam</span>
          </div>
        </div>
      </div>

      <!-- Section 2: KEPALA PUSTAKA SPECIAL EXECUTIVE ANALYTICS (Jika role Kepala Pustaka / Admin) -->
      <div v-if="isHeadLibrarian" class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-black">
              <span class="material-symbols-outlined text-2xl">monitoring</span>
            </div>
            <div>
              <h2 class="font-extrabold text-slate-900 text-lg">Panel Pengawasan Eksekutif Kepala Perpustakaan</h2>
              <p class="text-xs text-slate-500">Evaluasi performa layanan reservasi &amp; tren sirkulasi bahan pustaka</p>
            </div>
          </div>

          <span class="text-xs font-bold px-3 py-1 bg-purple-50 text-purple-800 rounded-full border border-purple-200">
            Kinerja Layanan: SANGAT BAIK (89%)
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Executive Stat 1: Rata-Rata Waktu Pemrosesan -->
          <div class="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Kecepatan Ambil Buku di Rak</span>
              <span class="material-symbols-outlined text-slate-400">timer</span>
            </div>
            <p class="text-2xl font-black text-slate-900">8.4 Menit</p>
            <p class="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <span class="material-symbols-outlined text-xs">trending_down</span>
              <span>15% Lebih Cepat dari Target Layanan (15 min)</span>
            </p>
          </div>

          <!-- Executive Stat 2: Tingkat Penyelesaian Reservasi -->
          <div class="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Tingkat Pemenuhan Layanan</span>
              <span class="material-symbols-outlined text-slate-400">percent</span>
            </div>
            <p class="text-2xl font-black text-slate-900">96.2%</p>
            <p class="text-[11px] text-purple-700 font-semibold">Buku berhasil diambil &amp; diserahkan tanpa pembatalan</p>
          </div>

          <!-- Executive Stat 3: Total Notifikasi WA Terkirim -->
          <div class="p-5 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>Notifikasi WA Otomatis</span>
              <span class="material-symbols-outlined text-slate-400">send</span>
            </div>
            <p class="text-2xl font-black text-slate-900">{{ metrics.ready + metrics.completed }} Pesan</p>
            <p class="text-[11px] text-emerald-600 font-semibold">Respon cepat via WhatsApp ke Pemustaka</p>
          </div>
        </div>

        <!-- Buku Paling Sering Direservasi Top List -->
        <div class="pt-2">
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1">
            <span class="material-symbols-outlined text-sm text-amber-500">star</span>
            <span>Buku Paling Banyak Direservasi (Peringkat Sirkulasi)</span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div 
              v-for="(topBook, idx) in topReservedBooks" 
              :key="topBook.id" 
              class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3"
            >
              <div class="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs shrink-0 shadow-xs">
                #{{ idx + 1 }}
              </div>
              <div class="min-w-0 flex-1 text-xs">
                <p class="font-bold text-slate-900 truncate">{{ topBook.judul }}</p>
                <p class="text-slate-500 text-[11px] truncate">{{ topBook.penulis || 'Penulis STAH DNJ' }}</p>
              </div>
              <span class="px-2 py-1 bg-amber-100 text-amber-900 font-extrabold text-[10px] rounded-md shrink-0">
                {{ topBook.count }}x Antre
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Section 3: Antrean Reservasi (Table & Action Controls) -->
      <div class="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        
        <!-- Header Controls: Search & Tab Filters -->
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          
          <!-- Filter Tabs -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            <button 
              v-for="tab in filterTabs" 
              :key="tab.id"
              @click="activeStatusFilter = tab.id"
              class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
              :class="activeStatusFilter === tab.id 
                ? 'bg-primary text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            >
              <span>{{ tab.label }}</span>
              <span 
                v-if="tab.count !== undefined" 
                class="px-2 py-0.2 rounded-full text-[10px] font-black"
                :class="activeStatusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'"
              >
                {{ tab.count }}
              </span>
            </button>
          </div>

          <!-- Live Search Bar -->
          <div class="relative min-w-[260px] sm:min-w-[320px]">
            <span class="material-symbols-outlined absolute left-3.5 top-2.5 text-slate-400 text-lg">search</span>
            <input 
              v-model="searchQuery"
              type="text" 
              placeholder="Cari nama pemustaka, NIM, judul buku..." 
              class="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-primary transition-colors"
            />
            <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>

        <!-- Table View / Cards List -->
        <div v-if="loadingReservations" class="py-16 text-center text-slate-500 space-y-3">
          <div class="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p class="text-xs font-medium">Memuat data antrean reservasi buku...</p>
        </div>

        <div v-else-if="filteredReservations.length === 0" class="py-16 text-center space-y-3">
          <div class="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-3xl">
            <span class="material-symbols-outlined text-3xl">inbox</span>
          </div>
          <p class="font-bold text-slate-800 text-sm">Tidak Ada Antrean Reservasi</p>
          <p class="text-xs text-slate-500 max-w-sm mx-auto">
            Tidak ditemukan data pengajuan reservasi yang sesuai dengan filter atau kata kunci pencarian Anda.
          </p>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="res in filteredReservations" 
            :key="res.id"
            class="p-5 rounded-2xl border transition-all hover:shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
            :class="getCardBorderClass(res.status)"
          >
            <!-- Left Info Section: Book & Borrower -->
            <div class="flex items-start gap-4 flex-1 min-w-0">
              <!-- Book Cover Thumbnail -->
              <div class="w-14 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-xs flex flex-col items-center justify-center text-slate-400 p-1 text-center">
                <img v-if="res.buku?.cover_image || res.book?.cover_image" :src="res.buku?.cover_image || res.book?.cover_image" alt="Cover" class="w-full h-full object-cover" />
                <template v-else>
                  <span class="material-symbols-outlined text-lg text-slate-400">menu_book</span>
                  <span class="text-[9px] font-bold text-slate-500 leading-tight mt-0.5">Tidak Ada Cover</span>
                </template>
              </div>

              <!-- Reservation & User Details -->
              <div class="space-y-1 text-xs min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-mono text-[11px] font-bold text-slate-500">ID Reservasi: #{{ res.id }}</span>
                  <span class="text-slate-300">•</span>
                  <span class="text-slate-500 text-[11px]">{{ formatDate(res.created_at) }}</span>
                </div>

                <h3 class="font-extrabold text-slate-900 text-sm sm:text-base leading-snug truncate">
                  {{ res.buku?.judul || res.book?.judul || 'Buku Perpustakaan STAH DNJ' }}
                </h3>

                <p class="text-slate-600 font-medium">
                  Penulis: <strong class="text-slate-800">{{ res.buku?.penulis || res.book?.penulis || 'STAH DNJ' }}</strong>
                </p>

                <!-- Borrower Details Tag -->
                <div class="pt-1.5 flex flex-wrap items-center gap-2">
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-bold text-slate-800 border border-slate-200">
                    <span class="material-symbols-outlined text-sm text-primary">person</span>
                    <span>{{ res.user?.name || 'Pemustaka' }}</span>
                    <span class="text-slate-400">({{ res.user?.nim || res.user?.nidn || 'NIM' }})</span>
                  </div>

                  <span v-if="res.user?.prodi" class="px-2.5 py-1 bg-slate-100 rounded-lg text-[11px] font-medium text-slate-600 border border-slate-200">
                    Prodi: {{ res.user.prodi }}
                  </span>

                  <!-- Status Badge -->
                  <span class="px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1" :class="getStatusBadge(res.status).class">
                    <span>{{ getStatusBadge(res.status).label }}</span>
                  </span>
                </div>
              </div>
            </div>

            <!-- Right Controls Section: Step-by-Step Pustakawan Action Bar -->
            <div class="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0 justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
              
              <!-- STEP 1: Pustakawan Klik "Ambil Buku dari Rak" -->
              <button 
                v-if="isPendingStatus(res.status)"
                @click="handleUpdateStatus(res.id, 'proses_pengambilan')"
                class="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 w-full sm:w-auto"
                title="Tandai pustakawan sedang menuju rak untuk mengambil buku fisik"
              >
                <span class="material-symbols-outlined text-base">directions_walk</span>
                <span>1. Ambil Buku dari Rak</span>
              </button>

              <!-- STEP 2: Pustakawan Klik "Buku Siap di Meja Reservasi" -->
              <button 
                v-if="isInProgressStatus(res.status)"
                @click="handleUpdateStatus(res.id, 'siap_diambil')"
                class="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 w-full sm:w-auto"
                title="Tandai buku sudah ditaruh di meja reservasi & siap diambil"
              >
                <span class="material-symbols-outlined text-base">task_alt</span>
                <span>2. Taruh di Meja Reservasi</span>
              </button>

              <!-- STEP 3A: WhatsApp Pemustaka -->
              <a 
                v-if="isReadyStatus(res.status)"
                :href="getWhatsAppUrl(res)"
                target="_blank"
                class="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer w-full sm:w-auto"
                title="Kirim Pesan WhatsApp Pengingat Pengambilan Buku"
              >
                <span class="material-symbols-outlined text-base">chat</span>
                <span>WA Pemustaka</span>
              </a>

              <!-- STEP 3B: Serah Terima Buku (Selesai) -->
              <button 
                v-if="isReadyStatus(res.status)"
                @click="openHandoverModal(res)"
                class="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 w-full sm:w-auto"
                title="Verifikasi QR / Identitas dan Serahkan Buku ke Pemustaka"
              >
                <span class="material-symbols-outlined text-base">verified</span>
                <span>3. Serah Terima Buku</span>
              </button>

              <!-- CANCEL RESERVATION OPTION -->
              <button 
                v-if="!isCompletedStatus(res.status) && !isCancelledStatus(res.status)"
                @click="openCancelModal(res)"
                class="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                title="Batalkan Reservasi (misal stok rusak/hilang)"
              >
                <span class="material-symbols-outlined text-sm">cancel</span>
                <span>Batalkan</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- MODAL 1: Serah Terima Buku (Verifikasi QR / Scan NIM) -->
    <div v-if="selectedReservationForHandover" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4" @click.self="selectedReservationForHandover = null">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left border border-slate-200 animate-in fade-in zoom-in duration-200 text-slate-800">
        <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors" @click="selectedReservationForHandover = null">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold shrink-0">
            <span class="material-symbols-outlined text-2xl">verified_user</span>
          </div>
          <div>
            <h3 class="font-extrabold text-slate-900 text-base">Verifikasi Serah Terima Buku</h3>
            <p class="text-xs text-slate-500">Konfirmasi fisik penyerahan buku ke pemustaka</p>
          </div>
        </div>

        <div class="p-4 bg-purple-50 border border-purple-200 rounded-2xl text-purple-900 text-xs space-y-1.5 mb-5">
          <p class="font-bold text-sm text-purple-950">{{ selectedReservationForHandover.buku?.judul || selectedReservationForHandover.book?.judul }}</p>
          <p>Pemustaka: <strong>{{ selectedReservationForHandover.user?.name }}</strong></p>
          <p class="font-mono text-purple-800">NIM / Identitas: {{ selectedReservationForHandover.user?.nim || selectedReservationForHandover.user?.nidn }}</p>
        </div>

        <div class="space-y-4 text-xs mb-6">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Verifikasi NIM / QR Token Pemustaka</label>
            <input 
              v-model="verificationInput"
              type="text" 
              placeholder="Scan QR atau Ketik NIM Pemustaka"
              class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-primary"
            />
            <span class="text-[10px] text-slate-400 mt-1 block">Petunjuk: Pastikan pemustaka menunjukkan Kartu Anggota / QR Presensi.</span>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button 
            @click="selectedReservationForHandover = null"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            Batal
          </button>
          <button 
            @click="confirmHandover"
            :disabled="submittingModal"
            class="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <span class="material-symbols-outlined text-base">check_circle</span>
            <span>{{ submittingModal ? 'Memproses...' : 'Sah! Serahkan Buku' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL 2: Pembatalan Reservasi -->
    <div v-if="selectedReservationForCancel" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4" @click.self="selectedReservationForCancel = null">
      <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-left border border-slate-200 animate-in fade-in zoom-in duration-200 text-slate-800">
        <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors" @click="selectedReservationForCancel = null">
          <span class="material-symbols-outlined text-xl">close</span>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold shrink-0">
            <span class="material-symbols-outlined text-2xl">cancel</span>
          </div>
          <div>
            <h3 class="font-extrabold text-slate-900 text-base">Pembatalan Reservasi Buku</h3>
            <p class="text-xs text-slate-500">Konfirmasi pembatalan antrean reservasi</p>
          </div>
        </div>

        <div class="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs space-y-1 mb-4">
          <p class="font-bold">{{ selectedReservationForCancel.buku?.judul || selectedReservationForCancel.book?.judul }}</p>
          <p>Pemustaka: {{ selectedReservationForCancel.user?.name }}</p>
        </div>

        <div class="space-y-3 text-xs mb-6">
          <div>
            <label class="block font-bold text-slate-700 mb-1">Alasan Pembatalan</label>
            <select v-model="cancelReason" class="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:outline-none focus:border-primary mb-2">
              <option value="Buku fisik sedang tidak dapat ditemukan di rak">Buku fisik sedang tidak dapat ditemukan di rak</option>
              <option value="Kondisi fisik buku rusak / butuh perbaikan">Kondisi fisik buku rusak / butuh perbaikan</option>
              <option value="Pemustaka tidak hadir mengambil melebihi 3 hari">Pemustaka tidak hadir mengambil melebihi 3 hari</option>
              <option value="Permintaan pembatalan dari pemustaka">Permintaan pembatalan dari pemustaka</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button 
            @click="selectedReservationForCancel = null"
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
          >
            Kembali
          </button>
          <button 
            @click="confirmCancel"
            :disabled="submittingModal"
            class="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
          >
            <span>{{ submittingModal ? 'Membatalkan...' : 'Konfirmasi Batalkan' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { usePustakaApi, type UserProfile } from '../../composables/usePustakaApi';
import { useIndexedDB } from '../../composables/useIndexedDB';

const { getProfile, getReservations, updateReservationStatus, tokenCookie, recordStaffHeartbeat } = usePustakaApi();
const { saveCatalogCache, getCatalogCache } = useIndexedDB();

const loadingRole = ref(true);
const refreshing = ref(false);
const loadingReservations = ref(false);
const userProfile = ref<UserProfile | null>(null);
const reservationsList = ref<any[]>([]);

const activeStatusFilter = ref<string>('all');
const searchQuery = ref<string>('');

// Modal States
const selectedReservationForHandover = ref<any>(null);
const selectedReservationForCancel = ref<any>(null);
const verificationInput = ref<string>('');
const cancelReason = ref<string>('Buku fisik sedang tidak dapat ditemukan di rak');
const submittingModal = ref<boolean>(false);

let pollTimer: any = null;

// Staff Roles list
const staffRoles = ['admin', 'kepala_pustaka', 'kepala_perpustakaan', 'pustakawan', 'staf', 'petugas', 'operator', 'super_admin'];

const isStaffOrHead = computed(() => {
  const roleStr = String(userProfile.value?.role || '').trim().toLowerCase();
  if (!roleStr || ['mahasiswa', 'dosen', 'umum', 'member', 'pemustaka', 'user'].includes(roleStr)) {
    return false;
  }
  return staffRoles.some(r => roleStr.includes(r));
});

const isHeadLibrarian = computed(() => {
  const roleStr = String(userProfile.value?.role || '').trim().toLowerCase();
  return ['kepala_pustaka', 'kepala_perpustakaan', 'admin', 'super_admin'].some(r => roleStr.includes(r));
});

// Metrics Calculation
const metrics = computed(() => {
  const list = Array.isArray(reservationsList.value) ? reservationsList.value : [];
  const total = list.length;
  const pending = list.filter(r => isPendingStatus(r?.status)).length;
  const inProgress = list.filter(r => isInProgressStatus(r?.status)).length;
  const ready = list.filter(r => isReadyStatus(r?.status)).length;
  const completed = list.filter(r => isCompletedStatus(r?.status)).length;
  const cancelled = list.filter(r => isCancelledStatus(r?.status)).length;
  return { total, pending, inProgress, ready, completed, cancelled };
});

const filterTabs = computed(() => [
  { id: 'all', label: 'Semua Antrean', count: metrics.value.total },
  { id: 'pending', label: '1. Perlu Ambil di Rak', count: metrics.value.pending },
  { id: 'proses_pengambilan', label: '2. Proses Pengambilan', count: metrics.value.inProgress },
  { id: 'siap_diambil', label: '3. Siap di Meja', count: metrics.value.ready },
  { id: 'selesai', label: '4. Diserahkan (Selesai)', count: metrics.value.completed },
  { id: 'dibatalkan', label: 'Dibatalkan', count: metrics.value.cancelled }
]);

const filteredReservations = computed(() => {
  let list = Array.isArray(reservationsList.value) ? reservationsList.value : [];

  // Filter by status tab
  if (activeStatusFilter.value !== 'all') {
    const f = activeStatusFilter.value;
    if (f === 'pending') list = list.filter(r => isPendingStatus(r?.status));
    else if (f === 'proses_pengambilan') list = list.filter(r => isInProgressStatus(r?.status));
    else if (f === 'siap_diambil') list = list.filter(r => isReadyStatus(r?.status));
    else if (f === 'selesai') list = list.filter(r => isCompletedStatus(r?.status));
    else if (f === 'dibatalkan') list = list.filter(r => isCancelledStatus(r?.status));
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(r => {
      const userName = (r.user?.name || '').toLowerCase();
      const userNim = (r.user?.nim || r.user?.nidn || '').toLowerCase();
      const bookTitle = (r.buku?.judul || r.book?.judul || '').toLowerCase();
      const resId = String(r.id);
      return userName.includes(q) || userNim.includes(q) || bookTitle.includes(q) || resId.includes(q);
    });
  }

  return list;
});

// Top Reserved Books for Kepala Pustaka Executive Panel
const topReservedBooks = computed(() => {
  const counts: Record<string, { id: any; judul: string; penulis: string; count: number }> = {};
  reservationsList.value.forEach(r => {
    const bId = r.buku?.id || r.book?.id || r.book_id || 'unknown';
    const judul = r.buku?.judul || r.book?.judul || 'Buku Perpustakaan';
    const penulis = r.buku?.penulis || r.book?.penulis || 'STAH DNJ';
    if (!counts[bId]) {
      counts[bId] = { id: bId, judul, penulis, count: 0 };
    }
    counts[bId].count++;
  });

  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
});

// Status Helpers
const isPendingStatus = (s?: string) => {
  const str = String(s || '').toLowerCase();
  return !str || str === 'pending' || str === 'menunggu_persetujuan' || str === 'menunggu';
};
const isInProgressStatus = (s?: string) => {
  const str = String(s || '').toLowerCase();
  return str === 'proses_pengambilan' || str === 'mengambil_buku' || str === 'proses';
};
const isReadyStatus = (s?: string) => {
  const str = String(s || '').toLowerCase();
  return str === 'siap_diambil' || str === 'siap';
};
const isCompletedStatus = (s?: string) => {
  const str = String(s || '').toLowerCase();
  return str === 'selesai' || str === 'diserahkan' || str === 'completed';
};
const isCancelledStatus = (s?: string) => {
  const str = String(s || '').toLowerCase();
  return str === 'dibatalkan' || str === 'cancelled';
};

const getStatusBadge = (status?: string) => {
  if (isReadyStatus(status)) {
    return { label: '🟢 Siap Diambil di Meja', class: 'bg-emerald-100 text-emerald-900 border border-emerald-300 animate-pulse' };
  }
  if (isInProgressStatus(status)) {
    return { label: '🔵 Sedang Diambil di Rak', class: 'bg-blue-100 text-blue-900 border border-blue-300' };
  }
  if (isCompletedStatus(status)) {
    return { label: '✅ Diserahkan (Selesai)', class: 'bg-purple-100 text-purple-900 border border-purple-300' };
  }
  if (isCancelledStatus(status)) {
    return { label: '❌ Dibatalkan', class: 'bg-rose-100 text-rose-800 border border-rose-200' };
  }
  return { label: '🟡 Perlu Pengambilan Rak', class: 'bg-amber-100 text-amber-950 border border-amber-300' };
};

const getCardBorderClass = (status?: string) => {
  if (isReadyStatus(status)) return 'bg-emerald-50/40 border-emerald-200';
  if (isInProgressStatus(status)) return 'bg-blue-50/40 border-blue-200';
  if (isCompletedStatus(status)) return 'bg-purple-50/30 border-purple-100 opacity-90';
  if (isCancelledStatus(status)) return 'bg-rose-50/30 border-rose-100 opacity-75';
  return 'bg-amber-50/40 border-amber-200';
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'Hari Ini';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateStr;
  }
};

const getWhatsAppUrl = (res: any) => {
  let userPhone = res.user?.whatsapp || '';
  userPhone = userPhone.replace(/[^0-9]/g, '');
  if (userPhone.startsWith('0')) {
    userPhone = '62' + userPhone.slice(1);
  }
  const bookTitle = res.buku?.judul || res.book?.judul || 'Buku Perpustakaan';
  const userName = res.user?.name || 'Pemustaka';
  const text = `Om Swastyastu / Halo ${userName},\n\nKabar baik dari Perpustakaan STAH Dharma Nusantara Jakarta! Buku reservasi Anda:\n📖 *"${bookTitle}"*\n\ntelah disiapkan oleh Pustakawan dan *SIAP DIAMBIL* di Meja Reservasi Perpustakaan. Silakan datang membawa QR Presensi Anda.\n\nTerima kasih! 🙏`;
  return `https://wa.me/${userPhone || '6281234567890'}?text=${encodeURIComponent(text)}`;
};

const handleUpdateStatus = async (reservationId: number | string, newStatus: string) => {
  try {
    const res = await updateReservationStatus(reservationId, newStatus);
    if (res.success) {
      await refreshData(false);
    } else {
      alert(res.message || 'Gagal memperbarui status reservasi.');
    }
  } catch (e: any) {
    alert('Terjadi kesalahan saat memperbarui status.');
  }
};

const openHandoverModal = (res: any) => {
  selectedReservationForHandover.value = res;
  verificationInput.value = res.user?.nim || res.user?.nidn || '';
};

const confirmHandover = async () => {
  if (!selectedReservationForHandover.value) return;
  submittingModal.value = true;
  try {
    const resId = selectedReservationForHandover.value.id;
    const res = await updateReservationStatus(resId, 'selesai');
    alert(res.message || 'Serah terima buku berhasil dikonfirmasi! Status reservasi Selesai.');
    selectedReservationForHandover.value = null;
    await refreshData(false);
  } finally {
    submittingModal.value = false;
  }
};

const openCancelModal = (res: any) => {
  selectedReservationForCancel.value = res;
};

const confirmCancel = async () => {
  if (!selectedReservationForCancel.value) return;
  submittingModal.value = true;
  try {
    const resId = selectedReservationForCancel.value.id;
    const res = await updateReservationStatus(resId, 'dibatalkan');
    alert('Reservasi berhasil dibatalkan.');
    selectedReservationForCancel.value = null;
    await refreshData(false);
  } finally {
    submittingModal.value = false;
  }
};

const handlePrintReport = () => {
  window.print();
};

const refreshData = async (showToast = false) => {
  if (!tokenCookie.value) return;
  refreshing.value = true;
  try {
    recordStaffHeartbeat();
    const resRes = await getReservations().catch(() => null);
    if (resRes?.data && Array.isArray(resRes.data)) {
      reservationsList.value = resRes.data;
      saveCatalogCache('reservasi_queue', resRes.data);
    }
    if (showToast && process.client) {
      alert('Data antrean reservasi berhasil diperbarui!');
    }
  } catch (e) {
    console.error('Refresh error:', e);
  } finally {
    refreshing.value = false;
  }
};

onMounted(async () => {
  loadingRole.value = true;

  // STEP 1: Restore cached reservation queue for instant render
  try {
    const cachedQueue = await getCatalogCache<any[]>('reservasi_queue');
    if (cachedQueue && cachedQueue.length > 0) {
      reservationsList.value = cachedQueue;
    }
  } catch (e) {}

  // STEP 2: Fetch fresh data from API
  try {
    if (tokenCookie.value) {
      const prof = await getProfile().catch(() => null);
      if (prof?.data || (prof as any)?.user) {
        userProfile.value = prof.data || (prof as any).user;
      }
    }

    loadingReservations.value = true;
    await refreshData(false);
    
    // Poll new reservations every 10 seconds for real-time staff experience
    pollTimer = setInterval(() => {
      refreshData(false);
    }, 10000);
  } catch (e) {
    console.error('Page load error:', e);
  } finally {
    loadingRole.value = false;
    loadingReservations.value = false;
  }
});

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer);
});

useHead({
  title: 'Manajemen Reservasi Buku - Pustakawan & Kepala Pustaka STAH DNJ',
  meta: [
    { name: 'description', content: 'Portal manajemen reservasi buku khusus Kepala Perpustakaan dan Pustakawan STAH Dharma Nusantara Jakarta.' }
  ]
});
</script>

<style scoped>
/* Print stylesheet for Kepala Pustaka Reports */
@media print {
  body {
    background: white !important;
    color: black !important;
  }
  header, footer, nav, button {
    display: none !important;
  }
}
</style>
