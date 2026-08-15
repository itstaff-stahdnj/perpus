<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-slate-100 p-4 sm:p-8">
    <div class="max-w-5xl mx-auto space-y-8">
      
      <!-- Tombol Kembali -->
      <NuxtLink to="/buku" class="inline-flex items-center gap-2 text-xs font-extrabold text-slate-500 hover:text-primary transition-all">
        ← Kembali ke Katalog Buku
      </NuxtLink>

      <!-- Skeleton Loading State -->
      <div v-if="loading" class="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-8 animate-pulse space-y-6">
        <div class="flex flex-col md:flex-row gap-8">
          <div class="w-48 h-72 bg-slate-200 dark:bg-zinc-800 rounded-2xl mx-auto md:mx-0 shrink-0"></div>
          <div class="flex-1 space-y-4">
            <div class="h-6 w-32 bg-slate-200 dark:bg-zinc-800 rounded-full"></div>
            <div class="h-8 w-3/4 bg-slate-200 dark:bg-zinc-800 rounded-xl"></div>
            <div class="h-4 w-1/2 bg-slate-200 dark:bg-zinc-800 rounded-lg"></div>
            <div class="h-24 w-full bg-slate-200 dark:bg-zinc-800 rounded-2xl"></div>
          </div>
        </div>
      </div>

      <!-- CARD UTAMA DETAIL BUKU -->
      <div v-else-if="book" class="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <!-- Sampul Buku dengan Bayangan & Lencana Wishlist -->
          <div class="relative w-48 sm:w-56 h-68 sm:h-80 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-zinc-800 shadow-2xl bg-slate-100 dark:bg-zinc-800 mx-auto md:mx-0 flex items-center justify-center">
            <img 
              :src="getBookCoverUrl(book)" 
              :alt="book?.judul || 'Cover Buku'"
              @error="(e) => handleImageError(e, book)"
              class="w-full h-full object-cover" 
            />
            <button 
              @click="toggleWishlist" 
              :disabled="togglingWishlist"
              class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md flex items-center justify-center text-lg shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
              :title="isWishlisted ? 'Hapus dari favorit' : 'Simpan ke favorit'"
            >
              {{ isWishlisted ? '❤️' : '🤍' }}
            </button>
          </div>

          <!-- Rincian Metadata Buku -->
          <div class="flex-1 space-y-4">
            <div class="space-y-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-3 py-1 rounded-full text-[0.68rem] font-black uppercase tracking-wider bg-blue-100 text-primary dark:bg-blue-950/60 dark:text-blue-400">
                  🏷️ {{ book?.category?.nama_kategori || (book?.category as any)?.nama || 'Koleksi Pustaka' }}
                </span>
                <span 
                  v-if="bookClassification"
                  class="px-3 py-1 rounded-full text-[0.68rem] font-mono font-bold bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  🔢 {{ bookClassification }}
                </span>

                <!-- Quick Action Pills: Sitasi, Peta Rak & Reading Time -->
                <button 
                  @click="showCitationModal = true"
                  class="px-3 py-1 rounded-full text-[0.68rem] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 transition-colors cursor-pointer border border-blue-200 dark:border-blue-800 flex items-center gap-1"
                  title="Generate Format Sitasi (APA, MLA, IEEE, BibTeX)"
                >
                  <span>Format Sitasi</span>
                </button>

                <button 
                  v-if="!isEbook"
                  @click="showShelfModal = true"
                  class="px-3 py-1 rounded-full text-[0.68rem] font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 transition-colors cursor-pointer border border-amber-200 dark:border-amber-800 flex items-center gap-1"
                  title="Lihat Denah Peta Rak Buku 2D"
                >
                  <span>📍 Denah Peta Rak 2D</span>
                </button>

                <span class="px-3 py-1 rounded-full text-[0.68rem] font-bold bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  ⏱️ {{ estimatedReadingTime }} Menit Baca
                </span>
              </div>
              <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight pt-1">
                {{ book?.judul }}
              </h1>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-bold">
                Penulis: <span class="text-slate-800 dark:text-zinc-200">{{ book?.penulis || (book as any)?.pengarang || 'STAH DNJ' }}</span>
                <span v-if="book?.penerbit" class="ml-2 text-slate-400">
                  • Penerbit: <span class="text-slate-700 dark:text-zinc-300">{{ (book as any)?.kota_terbit ? `${(book as any).kota_terbit}: ` : '' }}{{ book.penerbit }}</span>
                </span>
              </p>
            </div>
               <!-- Status Ketersediaan Stok & Pustakawan Aktif -->
            <div class="flex items-center gap-3 flex-wrap pt-1">
              <span 
                v-if="!isEbook"
                class="px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5"
                :class="availableCopiesCount > 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300'"
              >
                <span>{{ availableCopiesCount > 0 ? '🟢' : '🔴' }}</span>
                <span>Stok Tersedia: {{ availableCopiesCount }} Eksemplar</span>
              </span>

              <span 
                v-else
                class="px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
              >
                <span>⚡</span>
                <span>Akses Digital / E-Book Online</span>
              </span>

              <!-- Status Petugas Pustaka Online (Berdasarkan Absensi Kehadiran) -->
              <span 
                v-if="!isEbook"
                class="px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 shadow-2xs transition-colors"
                :class="isStaffOnline ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'"
                :title="isStaffOnline ? 'Petugas Perpustakaan telah hadir dalam absensi hari ini & siap memproses reservasi' : 'Petugas Perpustakaan belum tercatat absensi hari ini.'"
              >
                <span class="w-2 h-2 rounded-full" :class="isStaffOnline ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'"></span>
                <span>{{ isStaffOnline ? '🟢 Petugas Pustaka Online (Absensi Hadir)' : '🔴 Petugas Pustaka Offline (Belum Absensi Hari Ini)' }}</span>
              </span>
            </div>

            <!-- Jika E-Book Digital: Info Akses Langsung Online -->
            <div v-if="isEbook" class="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl space-y-2 text-xs">
              <div class="flex items-center gap-2 text-blue-900 dark:text-blue-200 font-extrabold text-sm">
                <span>⚡</span>
                <span>Koleksi E-Book Digital (Bisa Langsung Dibaca)</span>
              </div>
              <p class="text-blue-700 dark:text-blue-300 text-xs leading-relaxed">
                Buku ini merupakan koleksi digital. Tidak memerlukan peminjaman fisik maupun reservasi stok. Anda dapat membaca secara online kapan saja.
              </p>
            </div>

            <!-- Pemantauan Stok Sesuai Database (Buku Fisik) -->
            <div v-else class="p-3.5 bg-slate-50 dark:bg-zinc-800/50 border border-slate-200 dark:border-zinc-800 rounded-2xl space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <p class="font-bold text-slate-700 dark:text-zinc-200 flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-primary text-base">inventory_2</span>
                  <span>Pemantauan Stok &amp; Eksemplar</span>
                </p>
                <span class="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold" :class="availableCopiesCount > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'">
                  {{ availableCopiesCount > 0 ? 'STATUS: TERSEDIA' : 'STATUS: DIPINJAM' }}
                </span>
              </div>

              <div class="p-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700/60 rounded-xl space-y-1.5 text-[11px]">
                <div class="flex items-center justify-between font-bold">
                  <span>🏢 Perpustakaan STAH DNJ</span>
                  <span :class="availableCopiesCount > 0 ? 'text-emerald-600 font-extrabold' : 'text-rose-600 font-extrabold'">
                    {{ availableCopiesCount > 0 ? `${availableCopiesCount} Eksemplar Tersedia` : 'Sedang Dipinjam' }}
                  </span>
                </div>

                <div class="grid grid-cols-3 gap-1 py-1 px-2 bg-slate-50 dark:bg-zinc-800/60 rounded-lg text-center text-[10px]">
                  <div>
                    <span class="block text-slate-400">Total Stok</span>
                    <strong class="font-bold text-slate-800 dark:text-zinc-200">{{ totalCopiesCount }}</strong>
                  </div>
                  <div>
                    <span class="block text-slate-400">Tersedia</span>
                    <strong class="font-bold text-emerald-600">{{ availableCopiesCount }}</strong>
                  </div>
                  <div>
                    <span class="block text-slate-400">Dipinjam</span>
                    <strong class="font-bold text-rose-500">{{ borrowedCopiesCount }}</strong>
                  </div>
                </div>

                <p class="text-slate-500 dark:text-zinc-400 text-[11px] pt-0.5">
                  📍 Lokasi Rak: <strong class="text-slate-700 dark:text-zinc-200 font-semibold">{{ book?.lokasi_rak || (book as any)?.lokasi || 'Koleksi Perpustakaan STAH DNJ' }}</strong>
                </p>
              </div>
            </div>

            <!-- Ringkasan / Sinopsis Buku (Otomatis Hidden Jika Kosong / Opsional) -->
            <div 
              v-if="book?.deskripsi && book.deskripsi.trim() !== ''" 
              class="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-3"
            >
              <div class="flex items-center justify-between">
                <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider">Sinopsis / Ringkasan</h3>
                <button 
                  @click="showAudioSynopsis = !showAudioSynopsis"
                  class="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>🎙️ {{ showAudioSynopsis ? 'Sembunyikan Audio' : 'Dengarkan Narasi Suara' }}</span>
                </button>
              </div>

              <!-- Audio Narrator Widget for Synopsis -->
              <BookAudioPlayer 
                v-if="showAudioSynopsis" 
                :title="`Narasi ${book?.judul}`" 
                :textToRead="`${book?.judul}. Karya ${book?.penulis || 'STAH DNJ'}. Ringkasan: ${book?.deskripsi}`" 
              />

              <p class="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                {{ book?.deskripsi }}
              </p>
            </div>

            <!-- JIKA BUKU DIGITAL (E-BOOK): HANYA DAPAT DIBACA JIKA SUDAH LOGIN -->
            <div v-if="isEbook" class="pt-4 border-t border-slate-100 dark:border-zinc-800">
              <button 
                v-if="tokenCookie"
                @click="showPdfModal = true"
                class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/25 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📖</span>
                <span>Baca E-Book Digital (IndexedDB Offline)</span>
                <span class="material-symbols-outlined text-base">chrome_reader_mode</span>
              </button>

              <NuxtLink 
                v-else
                to="/login"
                class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔑</span>
                <span>Login untuk Membaca E-Book Digital</span>
                <span class="material-symbols-outlined text-base">arrow_forward</span>
              </NuxtLink>
            </div>

            <!-- TOMBOL AKSI BUKU FISIK: PINJAM BUKU FISIK & RESERVASI (JIKA USER LOGIN) -->
            <div v-else-if="tokenCookie" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
              
              <!-- Tombol Pinjam Buku Fisik (Aktif untuk semua koleksi buku fisik) -->
              <button 
                @click="openBorrowModal"
                :disabled="availableCopiesCount === 0"
                class="py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-extrabold text-xs shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Proses Peminjaman Buku Fisik STAH DNJ"
              >
                <span>📖</span>
                <span>{{ availableCopiesCount === 0 ? 'Stok Habis / Dipinjam' : 'Pinjam Buku Fisik' }}</span>
              </button>

              <!-- Tombol Reservasi Buku -->
              <button 
                @click="handleReservation"
                :disabled="submittingReservation || !isStaffOnline"
                class="py-3 px-4 rounded-2xl font-extrabold text-xs shadow-lg active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                :class="isStaffOnline ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20' : 'bg-slate-200 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed shadow-none'"
                :title="isStaffOnline ? 'Ajukan reservasi ke Petugas Pustaka' : 'Petugas offline. Reservasi ditiadakan sementara.'"
              >
                <span>{{ isStaffOnline ? '⏳' : '🚫' }}</span>
                <span>
                  {{ submittingReservation ? 'Memproses...' : (isStaffOnline ? 'Ajukan Reservasi' : 'Reservasi Ditiadakan') }}
                </span>
              </button>

              <!-- Tombol Tampung ke Keranjang (Multi-Buku) -->
              <button 
                @click="handleToggleTampung"
                class="py-3 px-4 rounded-2xl border transition-all font-extrabold text-xs shadow-sm cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                :class="inCart ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-800 dark:text-amber-300' : 'bg-slate-100 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 text-slate-800 dark:text-zinc-200'"
              >
                <span>🛒</span>
                <span>{{ inCart ? 'Batal Tampung' : '📌 Tampung (Multi)' }}</span>
              </button>
            </div>

            <!-- JIKA USER BELUM LOGIN (BUKU FISIK): TAMPILKAN TOMBOL LOGIN SSO -->
            <div v-else class="pt-4 border-t border-slate-100 dark:border-zinc-800">
              <NuxtLink 
                to="/login"
                class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔑</span>
                <span>Login untuk Meminjam &amp; Reservasi Buku</span>
                <span class="material-symbols-outlined text-base">arrow_forward</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- SEKSI ULASAN & RATING ⭐ -->
        <div class="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>⭐ Ulasan & Rating Pemustaka</span>
              <span class="text-xs font-normal text-slate-500 dark:text-zinc-400">({{ reviewsList?.length || 0 }} Ulasan)</span>
            </h3>
            <button @click="showReviewForm = !showReviewForm" class="text-xs font-extrabold text-primary hover:underline cursor-pointer">
              {{ showReviewForm ? 'Batal' : '+ Beri Ulasan Buku' }}
            </button>
          </div>

          <!-- Form Input Ulasan Baru -->
          <div v-if="showReviewForm" class="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 space-y-3">
            <div>
              <label class="block text-xs font-bold mb-1">Pilih Rating Bintang</label>
              <div class="flex items-center gap-1 text-2xl cursor-pointer">
                <span v-for="star in 5" :key="star" @click="newRating = star" class="hover:scale-115 transition-transform">
                  {{ star <= newRating ? '⭐' : '☆' }}
                </span>
              </div>
            </div>

            <div>
              <textarea 
                v-model="newReviewText" 
                rows="3" 
                placeholder="Tulis ulasan Anda setelah membaca buku ini..."
                class="w-full p-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs outline-none focus:border-primary"
              ></textarea>
            </div>

            <button 
              @click="handleReviewSubmit"
              :disabled="submittingReview || !newReviewText"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              {{ submittingReview ? 'Mengirim...' : 'Kirim Ulasan Saya' }}
            </button>
          </div>

          <!-- Daftar Ulasan Pemustaka -->
          <div v-if="reviewsList && reviewsList.length > 0" class="space-y-3">
            <div v-for="rev in reviewsList" :key="rev.id" class="p-3.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 space-y-1">
              <div class="flex items-center justify-between">
                <span class="text-xs font-black text-slate-800 dark:text-zinc-200">{{ rev.user?.name || rev.user_name || 'Pemustaka' }}</span>
                <span class="text-xs text-amber-500 font-bold">{{ '⭐'.repeat(rev.rating || 5) }}</span>
              </div>
              <p class="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed">{{ rev.ulasan || rev.comment }}</p>
            </div>
          </div>
          <div v-else class="text-xs text-slate-400 italic">Belum ada ulasan untuk buku ini. Jadilah yang pertama memberikan ulasan!</div>
        </div>

        <!-- SEKSI REKOMENDASI BUKU SERUPA -->
        <div v-if="recommendedBooksList.length > 0" class="pt-6 border-t border-slate-100 dark:border-zinc-800 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span>📚 Buku Serupa yang Mungkin Anda Sukai</span>
            </h3>
            <NuxtLink to="/buku" class="text-xs font-bold text-primary hover:underline">Lihat Semua &rarr;</NuxtLink>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <NuxtLink 
              v-for="recBook in recommendedBooksList" 
              :key="recBook.id"
              :to="`/buku/${slugifyTitle(recBook.judul)}-${recBook.id}`"
              class="bg-slate-50 dark:bg-zinc-800/60 p-3 rounded-2xl border border-slate-200 dark:border-zinc-700/80 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div class="aspect-[3/4] bg-slate-200 dark:bg-zinc-700 rounded-xl overflow-hidden mb-2">
                <img :src="getBookCoverUrl(recBook)" :alt="recBook.judul" class="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <p class="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-primary transition-colors">{{ recBook.judul }}</p>
                <p class="text-[10px] text-slate-500 truncate mt-1">{{ recBook.penulis || 'STAH DNJ' }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- Modals -->
      <CitationGeneratorModal v-model="showCitationModal" :book="book" />
      <ShelfLocationModal v-model="showShelfModal" :book="book" />

      <!-- Single Borrow & Pickup Schedule Modal for Physical Books -->
      <Teleport to="body">
        <div v-if="showBorrowModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showBorrowModal = false">
          <div class="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left border border-slate-200 dark:border-zinc-800 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <span>📖 Pinjam Buku Fisik Perpustakaan</span>
              </h3>
              <button @click="showBorrowModal = false" class="text-slate-400 hover:text-slate-600 p-1">✕</button>
            </div>
            
            <div class="p-3 bg-slate-50 dark:bg-zinc-800/80 rounded-2xl border border-slate-200 dark:border-zinc-700/60 text-xs space-y-1">
              <span class="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-extrabold text-[10px] uppercase">Buku Fisik</span>
              <p class="font-bold text-slate-900 dark:text-white pt-1">{{ book?.judul }}</p>
              <p class="text-slate-500 dark:text-zinc-400">Penulis: {{ book?.penulis || 'STAH DNJ' }}</p>
              <p class="text-[11px] text-amber-600 dark:text-amber-400 font-semibold pt-0.5">📍 Lokasi Rak: {{ book?.lokasi_rak || 'Koleksi Utama Perpustakaan STAH DNJ' }}</p>
            </div>

            <!-- Indikator Status Verifikasi Geo-Lokasi GPS Area Kampus STAH DNJ -->
            <div 
              class="p-3.5 rounded-2xl border text-xs transition-all space-y-1.5"
              :class="isInsideCampus 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' 
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300'"
            >
              <div class="flex items-center justify-between font-bold">
                <div class="flex items-center gap-1.5">
                  <span class="material-symbols-outlined text-base" :class="isInsideCampus ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
                    {{ isInsideCampus ? 'verified' : 'location_searching' }}
                  </span>
                  <span>{{ isInsideCampus ? 'Area Kampus STAH DNJ Terverifikasi' : 'Verifikasi Geo-Lokasi GPS Kampus' }}</span>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black" :class="isInsideCampus ? 'bg-emerald-200 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-100' : 'bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-100'">
                  {{ isInsideCampus ? '🟢 GPS Kampus Aktif' : '🟡 Perlu GPS Kampus' }}
                </span>
              </div>

              <p class="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-300">
                <template v-if="isInsideCampus">
                  Lokasi Anda terverifikasi di area kampus. Layanan <strong>Pinjam Mandiri Langsung</strong> aktif!
                </template>
                <template v-else-if="userDistanceKm !== null">
                  Terdeteksi <strong>{{ userDistanceKm }} km</strong> dari kampus STAH DNJ. Pengambilan buku dikonfirmasi berdasarkan jadwal kedatangan yang Anda tentukan di bawah.
                </template>
                <template v-else>
                  Lokasi GPS diperlukan untuk memverifikasi area kampus STAH DNJ.
                </template>
              </p>

              <button 
                v-if="!isInsideCampus" 
                @click="checkGeolocation" 
                class="w-full mt-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 transition-all"
              >
                <span class="material-symbols-outlined text-sm">my_location</span>
                <span>Cek &amp; Verifikasi Geo-Lokasi GPS Saya</span>
              </button>
            </div>

            <!-- Schedule Pickup Input -->
            <div class="p-3.5 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl space-y-3 text-xs">
              <div class="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-black">
                <span class="material-symbols-outlined text-base">event_available</span>
                <span>Jadwal Pengambilan Buku Fisik</span>
              </div>
              <p class="text-slate-600 dark:text-zinc-300 text-[11px]">
                Tentukan rencana tanggal & jam kedatangan Anda. Petugas Pustaka akan menyiapkan buku fisik ini di meja sirkulasi.
              </p>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">Tanggal Ambil:</label>
                  <input 
                    v-model="pickupDate" 
                    type="date" 
                    class="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label class="block text-[11px] font-bold text-slate-700 dark:text-zinc-300 mb-1">Jam Ambil:</label>
                  <select 
                    v-model="pickupTime" 
                    class="w-full px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value="09:00">09.00 WIB (Pagi)</option>
                    <option value="10:30">10.30 WIB (Pagi)</option>
                    <option value="13:00">13.00 WIB (Siang)</option>
                    <option value="15:00">15.00 WIB (Sore)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Duration Select -->
            <div class="space-y-1.5 text-xs">
              <label class="block font-bold text-slate-800 dark:text-zinc-200">Durasi Peminjaman Fisik:</label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="d in [3, 5, 7]" 
                  :key="d"
                  @click="borrowDuration = d"
                  class="py-2 rounded-xl font-bold border transition-colors cursor-pointer text-xs"
                  :class="borrowDuration === d ? 'bg-blue-600 text-white border-blue-600 shadow-xs' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-300 dark:border-zinc-700'"
                >
                  {{ d }} Hari
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2">
              <button 
                @click="showShelfModal = true" 
                class="text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                title="Buka Denah Rak untuk Baca Langsung di Tempat"
              >
                <span>📍 Lihat Denah Rak (Baca di Tempat)</span>
              </button>
              <div class="flex items-center gap-2">
                <button @click="showBorrowModal = false" class="px-3.5 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold cursor-pointer">Batal</button>
                <button @click="handleSelfBorrow" :disabled="submittingBorrow" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold cursor-pointer shadow-md">
                  {{ submittingBorrow ? 'Memproses...' : 'Konfirmasi Pinjam' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Multi-Book Cart Borrowing Modal -->
      <CartBorrowModal v-model="showCartModal" @borrowed-success="loadBookDetail" />



      <!-- Mandatory GPS Permission Activation Modal -->
      <GpsPermissionModal 
        :is-open="showGpsModal" 
        @close="closeGpsModal" 
        @granted="checkGeolocation" 
      />

      <!-- PDF Reader Modal dengan IndexedDB -->
      <PdfReaderModal 
        v-model="showPdfModal" 
        :pdf-url="currentPdfUrl" 
        :title="book?.judul" 
        :book-id="book?.id" 
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePustakaApi, type Book } from '../../composables/usePustakaApi';
import { usePustakaCart } from '../../composables/usePustakaCart';
import { useCampusNetwork } from '../../composables/useCampusNetwork';
import { useBookRecommendations } from '../../composables/useBookRecommendations';
import CitationGeneratorModal from '../../components/CitationGeneratorModal.vue';
import ShelfLocationModal from '../../components/ShelfLocationModal.vue';
import BookAudioPlayer from '../../components/BookAudioPlayer.vue';

const { getRecommendedBooks } = useBookRecommendations();

const showCitationModal = ref(false);
const showShelfModal = ref(false);
const showAudioSynopsis = ref(false);
const allBooksCache = ref<Book[]>([]);

const estimatedReadingTime = computed(() => {
  if (!book.value) return 30;
  const pages = Number((book.value as any).jumlah_halaman || (book.value as any).halaman || 120);
  return Math.max(15, Math.ceil(pages * 1.2));
});

const recommendedBooksList = computed(() => {
  return getRecommendedBooks(book.value, allBooksCache.value, 4);
});

const route = useRoute();
const router = useRouter();
const { 
  isCampusNetwork, 
  isInsideCampus, 
  isOutsideCampus, 
  userDistanceKm, 
  currentSelfBorrowText,
  showGpsModal,
  openGpsModal,
  closeGpsModal,
  checkGeolocation
} = useCampusNetwork();
const { fallbackCover, getBookCoverUrl, handleImageError, extractPdfUrl, isEbookBook } = useBookCover();
const { 
  getBookById, 
  getBooks, 
  selfBorrow, 
  createReservation, 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  createReview, 
  getReviews, 
  getStaffStatus,
  tokenCookie 
} = usePustakaApi();

const { cart, cartCount, isInCart, toggleCart, loadCartFromStorage } = usePustakaCart();
const { saveCatalogCache, getCatalogCache } = useIndexedDB();

const loading = ref(true);
const book = ref<Book | null>(null);
const isWishlisted = ref(false);
const isStaffOnline = ref(true);
const togglingWishlist = ref(false);

const isEbook = computed(() => {
  return isEbookBook(book.value);
});

const currentPdfUrl = computed(() => {
  return extractPdfUrl(book.value);
});

const bookClassification = computed(() => {
  const b = book.value as any;
  if (!b) return null;
  const val = b.klasifikasi || b.no_panggil || b.ddc || b.kode_klasifikasi;
  if (!val || typeof val !== 'string' || val.trim() === '' || val.trim() === '-' || val.trim() === '0') {
    return null;
  }
  return val.trim();
});

const showBorrowModal = ref(false);
const showPdfModal = ref(false);
const borrowDuration = ref(7);
const pickupDate = ref(new Date(Date.now() + 86400000).toISOString().split('T')[0]);
const pickupTime = ref('10:00');
const submittingBorrow = ref(false);
const submittingReservation = ref(false);
const showCartModal = ref(false);

const showReviewForm = ref(false);
const newRating = ref(5);
const newReviewText = ref('');
const submittingReview = ref(false);
const reviewsList = ref<any[]>([]);

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
  return `/buku/${titleSlug}-${b.id}`;
};

const parseBookIdFromParam = (param: string): string => {
  if (!param) return '1';
  const match = param.match(/(?:^|-)(\d+)$/);
  if (match) return match[1];
  return param;
};

const bookId = parseBookIdFromParam(route.params.id as string);

useHead({
  title: computed(() => book.value ? `${book.value.judul} - Perpustakaan STAH DNJ` : 'Detail Buku - Perpustakaan STAH DNJ'),
  meta: [
    { 
      name: 'description', 
      content: computed(() => book.value ? `Detail dan ketersediaan buku "${book.value.judul}" karya ${book.value.penulis || 'STAH DNJ'}.` : 'Detail koleksi buku perpustakaan.') 
    }
  ]
});

const availableCopiesCount = computed(() => {
  if (!book.value) return 0;
  if (typeof book.value.stok === 'number') {
    return book.value.stok;
  }
  const rawCopies = (book.value as any).copies || (book.value as any).book_copies || (book.value as any).eksemplar;
  if (Array.isArray(rawCopies) && rawCopies.length > 0) {
    return rawCopies.filter((c: any) => String(c.status || '').toLowerCase() === 'tersedia').length;
  }
  return 0;
});

const totalCopiesCount = computed(() => {
  if (!book.value) return 0;
  const b = book.value as any;
  if (typeof b.total_stok === 'number') return b.total_stok;
  if (typeof b.jumlah_buku === 'number') return b.jumlah_buku;
  if (typeof b.jumlah_eksemplar === 'number') return b.jumlah_eksemplar;
  const rawCopies = b.copies || b.book_copies || b.eksemplar;
  if (Array.isArray(rawCopies) && rawCopies.length > 0) {
    return rawCopies.length;
  }
  return typeof book.value.stok === 'number' ? book.value.stok : 0;
});

const borrowedCopiesCount = computed(() => {
  const diff = totalCopiesCount.value - availableCopiesCount.value;
  return diff > 0 ? diff : 0;
});

const inCart = computed(() => {
  return book.value ? isInCart(book.value.id) : false;
});

const checkStaffOnline = async () => {
  try {
    const res = await getStaffStatus();
    isStaffOnline.value = res.is_online;
  } catch (e) {
    isStaffOnline.value = true;
  }
};

const loadBookDetail = async () => {
  loading.value = true;

  // STEP 1: Restore from IndexedDB cache for instant display
  try {
    const cachedBook = await getCatalogCache<Book>(`book_detail_${bookId}`);
    if (cachedBook) {
      book.value = cachedBook;
      loading.value = false;
    }
    const cachedReviews = await getCatalogCache<any[]>(`book_reviews_${bookId}`);
    if (cachedReviews && cachedReviews.length > 0) {
      reviewsList.value = cachedReviews;
    }
  } catch (e) {}

  // STEP 2: Fetch fresh data from API
  try {
    checkStaffOnline();
    const resBook = await getBookById(bookId).catch(() => ({ success: false, data: null }));
    if (resBook?.success && resBook.data) {
      book.value = resBook.data;
      const resAll = await getBooks().catch(() => ({ success: false, data: [] }));
      if (resAll?.success && resAll.data?.length > 0) {
        allBooksCache.value = resAll.data;
        if (!book.value) {
          book.value = resAll.data.find(b => String(b.id) === String(bookId)) || resAll.data[0];
        }
      }
    } else {
      const resAll = await getBooks().catch(() => ({ success: false, data: [] }));
      if (resAll?.success && resAll.data?.length > 0) {
        allBooksCache.value = resAll.data;
        book.value = resAll.data.find(b => String(b.id) === String(bookId)) || resAll.data[0];
      }
    }

    if (book.value) {
      // STEP 3: Save to IndexedDB cache
      saveCatalogCache(`book_detail_${bookId}`, book.value);
      loadReviews(book.value.id);
      if (process.client) {
        const canonicalUrl = getBookUrl(book.value);
        if (route.path !== canonicalUrl) {
          window.history.replaceState(null, '', canonicalUrl);
        }
      }
    }

    if (process.client) {
      try {
        const saved = localStorage.getItem('pustaka_wishlist');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            isWishlisted.value = parsed.map(id => String(id)).includes(String(bookId));
          }
        }
      } catch (e) {}
    }

    if (tokenCookie.value) {
      const wishRes = await getWishlist().catch(() => null);
      if (wishRes?.data && Array.isArray(wishRes.data)) {
        isWishlisted.value = wishRes.data.some((wb: any) => String(wb.book_id || wb.id) === String(bookId));
      }
    }
  } finally {
    loading.value = false;
  }
};

const openBorrowModal = () => {
  if (!tokenCookie.value) {
    router.push('/login');
    return;
  }
  checkGeolocation();
  showBorrowModal.value = true;
};

// 1. Handling Peminjaman Mandiri & Schedule Ambil Buku Fisik (Terkoneksi Geo-Lokasi Kampus)
const handleSelfBorrow = async () => {
  if (!tokenCookie.value) {
    router.push('/login');
    return;
  }
  if (!book.value) return;

  submittingBorrow.value = true;
  try {
    const res = await selfBorrow(book.value.id, borrowDuration.value);
    showBorrowModal.value = false;
    const isDirect = isInsideCampus.value === true;
    const modeStatus = isDirect 
      ? '🚀 Pinjam Mandiri Langsung (Area Kampus STAH DNJ Terverifikasi)' 
      : '📅 Pengambilan Berjadual (Dalam Antrean Sirkulasi)';
    alert(`🎉 Peminjaman Buku Fisik Berhasil!\n\nStatus: ${modeStatus}\n📅 Rencana Pengambilan: ${pickupDate.value} Pukul ${pickupTime.value} WIB\n🏢 Petugas Pustaka akan menyiapkan buku fisik ini di Meja Sirkulasi Perpustakaan STAH DNJ.`);
    if (res.success) {
      loadBookDetail();
    }
  } catch (err: any) {
    alert(err?.message || 'Gagal meminjam buku.');
  } finally {
    submittingBorrow.value = false;
  }
};

// 2. Handling Reservasi Buku (Diawasi Pustakawan / Kepala Pustaka Aktif)
const handleReservation = async () => {
  if (!tokenCookie.value) {
    router.push('/login');
    return;
  }
  if (!book.value) return;

  submittingReservation.value = true;
  try {
    const res = await createReservation(book.value.id);
    const msg = res.message || '🎉 Reservasi berhasil diajukan! Menunggu pengolahan Pustakawan / Kepala Pustaka.';
    alert(msg);
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/admin/reservations';
    }
    if (res.success) {
      loadBookDetail();
    }
  } catch (err: any) {
    const errorMsg = err?.data?.message || err?.message || 'Reservasi gagal. Pastikan ada Pustakawan / Kepala Pustaka yang aktif di sistem.';
    alert(errorMsg);
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/admin/reservations';
    }
  } finally {
    submittingReservation.value = false;
  }
};

// 3. Handling Wishlist
const toggleWishlist = async () => {
  if (!tokenCookie.value) {
    router.push('/login');
    return;
  }
  if (!book.value || togglingWishlist.value) return;

  togglingWishlist.value = true;
  try {
    if (isWishlisted.value) {
      await removeFromWishlist(book.value.id);
      isWishlisted.value = false;
    } else {
      await addToWishlist(book.value.id);
      isWishlisted.value = true;
    }
  } finally {
    togglingWishlist.value = false;
  }
};

const handleToggleTampung = () => {
  if (!book.value) return;
  const added = toggleCart(book.value);
  if (added) {
    alert(`Buku "${book.value.judul}" berhasil ditambahkan ke Keranjang Tampungan!`);
  } else {
    alert(`Buku "${book.value.judul}" dihapus dari Keranjang Tampungan.`);
  }
};

// 4. Handling Ulasan & Rating
const loadReviews = async (id: number | string) => {
  try {
    const res = await getReviews(id).catch(() => null);
    if (res?.data && Array.isArray(res.data)) {
      reviewsList.value = res.data;
      // Save reviews to IndexedDB cache
      saveCatalogCache(`book_reviews_${id}`, res.data);
      return;
    }
    if ((book.value as any)?.reviews && Array.isArray((book.value as any).reviews)) {
      reviewsList.value = (book.value as any).reviews;
      return;
    }
  } catch (e) {}
  reviewsList.value = [];
};

const handleReviewSubmit = async () => {
  if (!tokenCookie.value) {
    router.push('/login');
    return;
  }
  if (!book.value || !newReviewText.value.trim()) return;

  submittingReview.value = true;
  try {
    const res = await createReview(book.value.id, newRating.value, newReviewText.value);
    alert(res.message || 'Terima kasih! Ulasan Anda telah berhasil dikirim.');
    if (res.success) {
      newReviewText.value = '';
      showReviewForm.value = false;
      loadReviews(book.value.id);
    }
  } catch (err: any) {
    alert(err?.message || 'Gagal mengirim ulasan.');
  } finally {
    submittingReview.value = false;
  }
};

onMounted(() => {
  loadCartFromStorage();
  loadBookDetail();
  checkGeolocation();
});
</script>
