<template>
  <div class="min-h-screen bg-background text-on-surface font-body-md">
    <main class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      <!-- Breadcrumb -->
      <nav class="mb-8 flex items-center gap-2 text-on-surface-variant font-label-md text-sm">
        <NuxtLink class="hover:text-primary transition-colors" to="/">Beranda</NuxtLink>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        <NuxtLink class="hover:text-primary transition-colors" to="/buku">Katalog Buku</NuxtLink>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        <span class="text-primary font-bold">Detail Buku</span>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="py-24 text-center">
        <div class="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p class="font-body-md text-on-surface-variant">Memuat detail pustaka dari database STAH DNJ...</p>
      </div>

      <!-- Error / Not Found State -->
      <div v-else-if="!book" class="bg-surface-container-low border border-outline-variant p-12 rounded-2xl text-center my-8">
        <span class="material-symbols-outlined text-6xl text-outline mb-4">menu_book</span>
        <h3 class="font-headline-md text-primary mb-2">Buku Tidak Ditemukan</h3>
        <p class="font-body-md text-on-surface-variant max-w-md mx-auto mb-6">
          Maaf, data koleksi buku dengan parameter tersebut tidak ditemukan pada database perpustakaan.
        </p>
        <NuxtLink class="bg-primary text-white px-6 py-2.5 rounded-xl font-label-md text-sm hover:bg-primary-container transition-colors inline-block" to="/buku">
          Kembali ke Katalog Buku
        </NuxtLink>
      </div>

      <!-- Book Detail View -->
      <div v-else class="flex flex-col lg:flex-row gap-12">
        <!-- Left Column: Media & Actions -->
        <aside class="w-full lg:w-1/3 flex flex-col gap-8">
          <!-- Book Cover Card -->
          <div class="bg-white rounded-xl card-shadow p-4 border border-outline-variant overflow-hidden group">
            <div class="relative aspect-[3/4] rounded-lg overflow-hidden shadow-md bg-surface-container-high">
              <img 
                v-if="book.cover_image" 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                :src="book.cover_image" 
                :alt="book.judul"
              />
              <img 
                v-else 
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                :src="fallbackCovers[0]" 
                :alt="book.judul"
              />
            </div>

            <!-- Quick Stats -->
            <div class="mt-6 grid grid-cols-2 gap-4 border-t border-outline-variant pt-6">
              <div class="text-center">
                <span class="block font-caption text-on-surface-variant uppercase tracking-wider mb-1">Halaman</span>
                <span class="font-headline-md text-primary font-bold">342</span>
              </div>
              <div class="text-center border-l border-outline-variant">
                <span class="block font-caption text-on-surface-variant uppercase tracking-wider mb-1">Bahasa</span>
                <span class="font-headline-md text-primary font-bold">Indonesia</span>
              </div>
            </div>
          </div>

          <!-- Primary Actions -->
          <div class="flex flex-col gap-3">
            <button 
              class="w-full bg-[#C89B3C] text-white py-4 rounded-lg font-label-md flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-md active:scale-[0.98] font-bold"
              @click="showReservationModal = true"
            >
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">bookmark_add</span>
              <span>Reservasi Buku</span>
            </button>

            <button 
              class="w-full bg-white border-2 border-[#0A3A5A] text-[#0A3A5A] py-4 rounded-lg font-label-md flex items-center justify-center gap-2 hover:bg-surface-container-low transition-all active:scale-[0.98] font-bold"
              @click="isFavorite = !isFavorite"
            >
              <span class="material-symbols-outlined" :class="{ 'text-error font-fill': isFavorite }">
                {{ isFavorite ? 'favorite' : 'favorite_border' }}
              </span>
              <span>{{ isFavorite ? 'Tersimpan di Favorit' : 'Simpan ke Favorit' }}</span>
            </button>

            <button 
              class="w-full flex items-center justify-center gap-2 py-3 text-on-surface-variant hover:text-primary transition-colors font-label-md text-sm"
              @click="shareUrl"
            >
              <span class="material-symbols-outlined text-lg">share</span>
              <span>{{ sharedNotice ? 'Tautan Tersalin!' : 'Bagikan Koleksi' }}</span>
            </button>
          </div>
        </aside>

        <!-- Right Column: Details -->
        <section class="w-full lg:w-2/3 flex flex-col gap-8">
          <!-- Header Info -->
          <div class="flex flex-col gap-4">
            <div class="flex flex-wrap items-center gap-3">
              <span class="px-3 py-1 bg-primary-fixed text-on-primary-fixed-variant rounded-full text-caption font-bold">
                {{ getCategoryName(book) }}
              </span>
              <span class="px-3 py-1 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-full text-caption font-bold">
                Koleksi Fisik
              </span>
              <span class="ml-auto flex items-center gap-1.5 px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-caption font-bold">
                <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                <span>Tersedia di Rak</span>
              </span>
            </div>

            <h1 class="font-display-lg text-display-lg text-primary leading-tight font-extrabold">
              {{ book.judul }}
            </h1>

            <div class="flex items-center gap-4 text-on-surface-variant flex-wrap">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">person</span>
                <span class="font-body-lg text-body-lg font-semibold">{{ book.penulis || 'Penulis Tidak Diketahui' }}</span>
              </div>
              <div class="h-4 w-[1px] bg-outline-variant hidden sm:block"></div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary">calendar_today</span>
                <span class="font-body-lg text-body-lg">Terbit: {{ book.tahun_terbit || '2021' }}</span>
              </div>
            </div>
          </div>

          <!-- Synopsis -->
          <div class="bg-white rounded-xl card-shadow p-8 border border-outline-variant">
            <h3 class="font-headline-md text-headline-md text-primary mb-4 flex items-center gap-2 font-bold">
              <span class="material-symbols-outlined text-secondary">description</span>
              <span>Sinopsis Buku</span>
            </h3>
            <div class="prose prose-slate max-w-none text-on-surface-variant leading-relaxed font-body-md space-y-4">
              <p>
                {{ book.deskripsi || 'Buku ini merupakan referensi akademik terkemuka yang membahas landasan filosofis dan keilmuan mendalam di lingkungan STAH Dharma Nusantara Jakarta. Penulis menyajikan kajian ilmiah yang relevan untuk mendukung riset mahasiswa dan sivitas akademika.' }}
              </p>
              <p>
                Koleksi ini memberikan pemahaman komprehensif mengenai etika, sejarah, dan nilai-nilai luhur yang terkandung dalam pustaka keagamaan Hindu dan ilmu sosial budaya Nusantara.
              </p>
            </div>
          </div>

          <!-- Bibliographic Info -->
          <div class="bg-surface-container-low rounded-xl p-8 border border-outline-variant">
            <h3 class="font-headline-md text-headline-md text-primary mb-6 flex items-center gap-2 font-bold">
              <span class="material-symbols-outlined text-secondary">menu_book</span>
              <span>Informasi Bibliografi</span>
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              <div class="flex flex-col gap-1 border-b border-outline-variant pb-3">
                <span class="font-caption text-on-surface-variant uppercase tracking-wider">ISBN / ISSN</span>
                <span class="font-body-lg text-primary font-bold font-mono">{{ book.isbn || '978-602-1234-56-7' }}</span>
              </div>
              <div class="flex flex-col gap-1 border-b border-outline-variant pb-3">
                <span class="font-caption text-on-surface-variant uppercase tracking-wider">Penerbit</span>
                <span class="font-body-lg text-primary font-bold">{{ book.penerbit || 'Pustaka STAH DNJ' }}</span>
              </div>
              <div class="flex flex-col gap-1 border-b border-outline-variant pb-3">
                <span class="font-caption text-on-surface-variant uppercase tracking-wider">Tahun Terbit</span>
                <span class="font-body-lg text-primary font-bold">Edisi {{ book.tahun_terbit || '2021' }}</span>
              </div>
              <div class="flex flex-col gap-1 border-b border-outline-variant pb-3">
                <span class="font-caption text-on-surface-variant uppercase tracking-wider">Lokasi Rak</span>
                <span class="font-body-lg text-secondary font-bold flex items-center gap-2">
                  <span class="material-symbols-outlined text-[18px]">location_on</span>
                  <span>L-02 / Sayap Timur / Rak 04A</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Additional Features: Bento Layout -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-white p-6 rounded-xl border border-outline-variant card-shadow flex flex-col gap-3">
              <span class="material-symbols-outlined text-secondary text-3xl">star</span>
              <h4 class="font-label-md text-primary font-bold">Rating Pengguna</h4>
              <div class="flex items-end gap-2">
                <span class="text-3xl font-bold text-primary">4.8</span>
                <span class="text-on-surface-variant mb-1 text-sm">/ 5.0</span>
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl border border-outline-variant card-shadow flex flex-col gap-3">
              <span class="material-symbols-outlined text-secondary text-3xl">visibility</span>
              <h4 class="font-label-md text-primary font-bold">Total Akses</h4>
              <div class="flex items-end gap-2">
                <span class="text-3xl font-bold text-primary">1,248</span>
                <span class="text-on-surface-variant mb-1 text-sm">kali</span>
              </div>
            </div>
            <div class="bg-white p-6 rounded-xl border border-outline-variant card-shadow flex flex-col gap-3">
              <span class="material-symbols-outlined text-secondary text-3xl">history</span>
              <h4 class="font-label-md text-primary font-bold">Terakhir Dipinjam</h4>
              <div class="flex items-end gap-2">
                <span class="text-xl font-bold text-primary">12 Jan 2026</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- Similar Books Section -->
      <section v-if="relatedBooks.length > 0" class="mt-20">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="font-headline-lg text-headline-lg text-primary font-bold">Rekomendasi Koleksi Terkait</h2>
            <p class="text-on-surface-variant">Buku dengan topik dan kategori serupa</p>
          </div>
          <NuxtLink class="text-primary font-bold flex items-center gap-1 hover:underline text-sm" to="/buku">
            <span>Lihat Semua Katalog Buku</span>
            <span class="material-symbols-outlined text-lg">arrow_forward</span>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <NuxtLink 
            v-for="(item, index) in relatedBooks" 
            :key="item.id" 
            :to="getBookUrl(item)"
            class="bg-white p-4 rounded-xl card-shadow hover:shadow-lg transition-all cursor-pointer border border-outline-variant group flex flex-col justify-between"
          >
            <div>
              <div class="aspect-[3/4] rounded-lg overflow-hidden mb-4 shadow-sm bg-surface-container-high">
                <img 
                  v-if="item.cover_image" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  :src="item.cover_image" 
                  :alt="item.judul"
                />
                <img 
                  v-else 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  :src="fallbackCovers[(index + 1) % fallbackCovers.length]" 
                  :alt="item.judul"
                />
              </div>
              <h4 class="font-label-md text-primary font-bold line-clamp-2 group-hover:text-secondary transition-colors leading-tight mb-1">
                {{ item.judul }}
              </h4>
            </div>
            <p class="text-caption text-on-surface-variant mt-2">✍️ {{ item.penulis || 'Penulis Tidak Diketahui' }}</p>
          </NuxtLink>
        </div>
      </section>
    </main>

    <!-- Reservation Confirmation Modal -->
    <div v-if="showReservationModal" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="showReservationModal = false">
      <div class="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl relative border border-outline-variant animate-in fade-in zoom-in duration-200">
        <button class="absolute top-6 right-6 text-on-surface-variant hover:text-primary transition-colors" @click="showReservationModal = false">
          <span class="material-symbols-outlined text-2xl">close</span>
        </button>

        <div class="text-center mb-6">
          <div class="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto mb-4 text-3xl">
            <span class="material-symbols-outlined text-3xl">bookmark_add</span>
          </div>
          <h3 class="font-headline-md text-xl text-primary font-bold mb-2">Konfirmasi Reservasi Buku</h3>
          <p class="font-body-md text-sm text-on-surface-variant">
            Apakah Anda ingin me-reservasi buku <strong class="text-primary">"{{ book?.judul }}"</strong> untuk diambil langsung di perpustakaan STAH DNJ?
          </p>
        </div>

        <div class="flex gap-3">
          <button class="flex-1 py-2.5 rounded-xl border border-outline-variant font-label-md text-sm hover:bg-surface-container" @click="showReservationModal = false">
            Batal
          </button>
          <button class="flex-1 bg-secondary text-white font-label-md text-sm py-2.5 rounded-xl hover:opacity-90 transition-colors font-bold shadow-md" @click="confirmReservation">
            Ya, Reservasi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { usePustakaApi, type Book } from '../../composables/usePustakaApi';

const route = useRoute();
const { getBookById, getBooks } = usePustakaApi();

const loading = ref(true);
const book = ref<Book | null>(null);
const allBooks = ref<Book[]>([]);
const isFavorite = ref(false);
const showReservationModal = ref(false);
const sharedNotice = ref(false);

const fallbackCovers = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCI61U0Gb0GCI3csX5g_Tws6K5775TufoAItfBr2ZGCANRNu0NlxeseUAuBqzB1HzuvrIrNV4NL21OSkV2q370ak_bZc5ebYvc7EokgVQMknIbqYuCSawR1NSfEuUD6E5AQrhSg6ZUkbaPs4t2BL3nAkKNCggbNKDXGvVa66mTDLxbv5FTt8BL1NUy1G07xpcgZGOlGMxPMbFyoCq3umgCSOwvRXmcGF_BSqvr7ev8nerw29xv8txFLMQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC1YfO7YLmXXp1CRYDMz210Tyuwd68rKMatE2ryLuF8vfVRxR7zVB6SXgZIzjlw9VSiuCGJjSU893VGLyTjsur27hlueSY-dAl92BwnoIZKuLK-Qjok9iq73KpiWFyvJbcJ1XPjUKCMIYBQB9Ls2wwHRyxQANPoxja-VGRbgQOI3KTX7PPSIGOxM7GSIHtNu1KeTnuBnK4-aeIUXyPRMZP_6Gy_xBxB0gNqvpbNZY49O4YNYZihCxMczQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCzdSyRV5DnLyvNwGDh3fhn0s690hgMErmMVG7jo4angx59EYWvbO53iXe0RChQCdhrtcDiNOW2KsNzIHU5mt0BgG7o_s0Afc8ZmX2KfXPtCNw3nquDsYQD57v_LVmvJ7fVrxjwSIred5diaM_Gayb_VT_Zp1ujzfY2V3xJWZIdDagA2ruUyWtqmVOSdbpQLaQTYPxXo6SbRS-vcA9XXN3yfbzv7jKy7qGsvI43WQ8D3WEhuG5jW_fBAg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDxJwAQdP37MVZ1RjOGSxv2P9G1UUMYgxh_4EyVF75JAOIClidsH8x6Ge1DD1zLAPBjKErV1rrZbVCpF-8UUuXaBH7jXZnwot0Zh5XNGYJ2UvAtqahYzlv18MGJI-rJj0hlj7CxJKnuoE8-Zsx2Pzs0Oe_8LpV9Iea4mi2XDVrgT5VVUq8YzzPpFrkJDPvpSAAIGsZOiQqahfPaflZoBb9JkmI0bcrCDcl-uHo-Dqm6jBzlOyJgJqSWZw'
];

const parseBookIdFromParam = (param: string): string => {
  if (!param) return '1';
  // Matches pattern like "veda-pengantar-filsafat-1" -> extracts 1
  const match = param.match(/-(\d+)$/);
  if (match) return match[1];
  if (/^\d+$/.test(param)) return param;
  return param;
};

const getCategoryName = (b: Book): string => {
  if (!b) return 'Filsafat';
  if (typeof b.kategori === 'object' && b.kategori?.nama_kategori) {
    return b.kategori.nama_kategori;
  }
  if (typeof b.kategori === 'string') {
    return b.kategori;
  }
  return 'Filsafat & Agama';
};

const getBookUrl = (b: Book) => {
  const slug = b.slug || b.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return `/buku/${slug}-${b.id}`;
};

const relatedBooks = computed(() => {
  if (!book.value) return [];
  return allBooks.value
    .filter(b => b.id !== book.value?.id)
    .slice(0, 4);
});

const loadBookDetail = async () => {
  loading.value = true;
  const rawParam = route.params.id as string;
  const bookId = parseBookIdFromParam(rawParam);

  try {
    const [resBook, resAll] = await Promise.all([
      getBookById(bookId).catch(() => ({ success: false, data: null })),
      getBooks().catch(() => ({ success: false, data: [] }))
    ]);

    if (resBook?.success && resBook.data) {
      book.value = resBook.data;
    } else if (resAll?.success && resAll.data?.length > 0) {
      book.value = resAll.data.find(b => String(b.id) === String(bookId)) || resAll.data[0];
    }

    if (resAll?.success) {
      allBooks.value = resAll.data || [];
    }
  } catch (err) {
    console.error('Error loading book detail:', err);
  } finally {
    loading.value = false;
  }
};

const confirmReservation = () => {
  showReservationModal.value = false;
  alert(`Reservasi buku "${book.value?.judul}" berhasil! Silakan tunjukkan Kartu Anggota di meja sirkulasi.`);
};

const shareUrl = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href);
    sharedNotice.value = true;
    setTimeout(() => { sharedNotice.value = false; }, 3000);
  }
};

watch(() => route.params.id, () => {
  loadBookDetail();
});

onMounted(() => {
  loadBookDetail();
});
</script>

<style scoped>
.card-shadow {
  box-shadow: 0px 4px 12px rgba(10, 58, 90, 0.05);
}

.font-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400;
}
</style>
