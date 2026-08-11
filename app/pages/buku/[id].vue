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

              <!-- Status Pustakawan / Kepala Pustaka Online (Facebook-Style) -->
              <span 
                v-if="!isEbook"
                class="px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 shadow-2xs transition-colors"
                :class="isStaffOnline ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'"
                :title="isStaffOnline ? 'Pustakawan / Kepala Pustaka sedang Online & siap memproses reservasi' : 'Pustakawan sedang Offline / Logout. Gunakan Pinjam Mandiri.'"
              >
                <span class="w-2 h-2 rounded-full" :class="isStaffOnline ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'"></span>
                <span>{{ isStaffOnline ? '🟢 Petugas Pustaka Online (Siap Olah Reservasi)' : '🔴 Petugas Pustaka Offline (Gunakan Pinjam Mandiri)' }}</span>
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
              class="pt-3 border-t border-slate-100 dark:border-zinc-800"
            >
              <h3 class="text-xs font-black uppercase text-slate-400 tracking-wider mb-1">Sinopsis / Ringkasan</h3>
              <p class="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                {{ book?.deskripsi }}
              </p>
            </div>

            <!-- JIKA BUKU DIGITAL (E-BOOK): HANYA DAPAT DIBACA JIKA SUDAH LOGIN -->
            <div v-if="isEbook" class="pt-4 border-t border-slate-100 dark:border-zinc-800">
              <button 
                v-if="tokenCookie"
                @click="openPdfReader"
                class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-600/25 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>📖</span>
                <span>Baca Buku Online</span>
                <span class="material-symbols-outlined text-base">chrome_reader_mode</span>
              </button>
              <a 
                v-else
                href="https://portal-perpus.stahdnj.ac.id/sso/perpus"
                class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔑</span>
                <span>Login untuk Membaca E-Book Digital</span>
                <span class="material-symbols-outlined text-base">arrow_forward</span>
              </a>
            </div>

            <!-- TOMBOL AKSI BUKU FISIK: PINJAM MANDIRI, RESERVASI, & TAMPUNG MULTI-BUKU (JIKA USER LOGIN) -->
            <div v-else-if="tokenCookie" class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-zinc-800">
              
              <!-- Tombol Pinjam Mandiri (Kondisional: Aktif hanya jika user berada DI DALAM KAMPUS via GPS / Wi-Fi) -->
              <button 
                v-if="isInsideCampus"
                @click="openBorrowModal"
                :disabled="availableCopiesCount === 0"
                class="py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-extrabold text-xs shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                title="Peminjaman Mandiri fisik langsung di rak perpustakaan STAH DNJ"
              >
                <span>📖</span>
                <span>Pinjam Mandiri (Di Kampus)</span>
              </button>

              <!-- JIKA DI LUAR KAMPUS: PINJAM MANDIRI DISABLED (Klik untuk buka Pop-up GPS) -->
              <button 
                v-else
                @click="openGpsModal"
                class="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 font-extrabold text-[11px] border border-slate-300 dark:border-zinc-700 cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
                :title="`Anda berada ${userDistanceKm ? userDistanceKm + ' km ' : ''}di luar area kampus STAH DNJ. Klik untuk perbarui lokasi GPS.`"
              >
                <span class="material-symbols-outlined text-sm text-rose-500 shrink-0">location_off</span>
                <span class="transition-all duration-300 truncate">🚫 Di Luar Kampus (Cek GPS)</span>
              </button>

              <!-- Tombol Reservasi Buku (Tersedia dari luar kampus / dalam kampus) -->
              <button 
                @click="handleReservation"
                :disabled="submittingReservation || !isStaffOnline"
                class="py-3 px-4 rounded-2xl font-extrabold text-xs shadow-lg active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                :class="isStaffOnline ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20' : 'bg-slate-200 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed shadow-none'"
                :title="isStaffOnline ? (isOutsideCampus ? 'Ajukan reservasi dari rumah/luar kampus agar ditarikkan petugas' : 'Ajukan reservasi ke Petugas Pustaka') : 'Petugas offline. Reservasi ditiadakan sementara.'"
              >
                <span>{{ isStaffOnline ? '⏳' : '🚫' }}</span>
                <span>
                  {{ submittingReservation ? 'Memproses...' : (isStaffOnline ? (isOutsideCampus ? 'Ajukan Reservasi (Luar Kampus)' : 'Ajukan Reservasi') : 'Reservasi Ditiadakan') }}
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
              <a 
                href="https://portal-perpus.stahdnj.ac.id/sso/perpus"
                class="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>🔑</span>
                <span>Login untuk Meminjam &amp; Reservasi Buku</span>
                <span class="material-symbols-outlined text-base">arrow_forward</span>
              </a>
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

      </div>

      <!-- Single Borrow Modal -->
      <Teleport to="body">
        <div v-if="showBorrowModal" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4" @click.self="showBorrowModal = false">
          <div class="bg-white dark:bg-zinc-900 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-left border border-slate-200 dark:border-zinc-800 space-y-4">
            <h3 class="font-extrabold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span>📖 Konfirmasi Pinjam Mandiri</span>
            </h3>
            
            <div class="p-3 bg-slate-50 dark:bg-zinc-800 rounded-xl text-xs space-y-1">
              <p class="font-bold text-slate-900 dark:text-white">{{ book?.judul }}</p>
              <p class="text-slate-500 dark:text-zinc-400">{{ book?.penulis }}</p>
            </div>

            <div class="space-y-2 text-xs">
              <label class="block font-bold">Pilih Durasi Peminjaman:</label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="d in [3, 5, 7]" 
                  :key="d"
                  @click="borrowDuration = d"
                  class="py-2 rounded-xl font-bold border transition-colors cursor-pointer"
                  :class="borrowDuration === d ? 'bg-primary text-white border-primary' : 'bg-slate-50 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-300 dark:border-zinc-700'"
                >
                  {{ d }} Hari
                </button>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <button @click="showBorrowModal = false" class="px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl text-xs font-bold cursor-pointer">Batal</button>
              <button @click="handleSelfBorrow" :disabled="submittingBorrow" class="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold cursor-pointer">
                {{ submittingBorrow ? 'Memproses...' : 'Konfirmasi Pinjam' }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

      <!-- Multi-Book Cart Borrowing Modal -->
      <CartBorrowModal v-model="showCartModal" @borrowed-success="loadBookDetail" />

      <!-- PDF Reader Modal for E-Book Digital -->
      <PdfReaderModal 
        v-model="showPdfReader" 
        :pdf-url="currentPdfUrl" 
        :title="book?.judul" 
      />

      <!-- Mandatory GPS Permission Activation Modal -->
      <GpsPermissionModal 
        :is-open="showGpsModal" 
        @close="closeGpsModal" 
        @granted="checkGeolocation" 
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePustakaApi, type Book } from '../../composables/usePustakaApi';
import { usePustakaCart } from '../../composables/usePustakaCart';
import { useCampusNetwork } from '../../composables/useCampusNetwork';
import CartBorrowModal from '../../components/CartBorrowModal.vue';
import PdfReaderModal from '../../components/PdfReaderModal.vue';
import GpsPermissionModal from '../../components/GpsPermissionModal.vue';

import { useBookCover } from '../../composables/useBookCover';

const route = useRoute();
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

const loading = ref(true);
const book = ref<Book | null>(null);
const isWishlisted = ref(false);
const isStaffOnline = ref(true);
const togglingWishlist = ref(false);
const showPdfReader = ref(false);

const openPdfReader = () => {
  if (!tokenCookie.value) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
    return;
  }
  showPdfReader.value = true;
};

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
const borrowDuration = ref(7);
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
  try {
    checkStaffOnline();
    const resBook = await getBookById(bookId).catch(() => ({ success: false, data: null }));
    if (resBook?.success && resBook.data) {
      book.value = resBook.data;
    } else {
      const resAll = await getBooks().catch(() => ({ success: false, data: [] }));
      if (resAll?.success && resAll.data?.length > 0) {
        book.value = resAll.data.find(b => String(b.id) === String(bookId)) || resAll.data[0];
      }
    }

    if (book.value) {
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
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
    return;
  }
  showBorrowModal.value = true;
};

// 1. Handling Peminjaman Mandiri
const handleSelfBorrow = async () => {
  if (!tokenCookie.value) {
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
    return;
  }
  if (!book.value) return;

  submittingBorrow.value = true;
  try {
    const res = await selfBorrow(book.value.id, borrowDuration.value);
    showBorrowModal.value = false;
    alert(res.message || '🎉 Peminjaman mandiri berhasil! Silakan periksa di menu Profil.');
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
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
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
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
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
    if (process.client) {
      window.location.href = 'https://portal-perpus.stahdnj.ac.id/sso/perpus';
    }
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
});
</script>
