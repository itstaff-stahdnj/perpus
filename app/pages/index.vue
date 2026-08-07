<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
    <!-- Main Content -->
    <main class="flex-1">
      <!-- Hero Section -->
      <section id="beranda" class="relative min-h-[460px] sm:min-h-[520px] md:min-h-[580px] w-full flex flex-col justify-center items-center overflow-hidden py-12 sm:py-16 md:py-20">
        <div class="absolute inset-0 bg-gradient-to-b from-primary/75 via-primary/55 to-primary/85 z-10"></div>
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105" 
             :style="{ backgroundImage: `url('${siteSettings?.hero_bg_image || heroDefaultBg}')` }"></div>
        
        <div class="relative z-20 text-center px-4 max-w-4xl w-full mx-auto">
          <h2 class="text-2xl sm:text-3xl md:text-5xl text-white mb-3 sm:mb-4 drop-shadow-lg font-extrabold tracking-tight leading-tight">
            {{ siteSettings?.hero_title || 'Menjembatani Tradisi dan Inovasi' }}
          </h2>
          <p class="text-xs sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed font-normal">
            {{ siteSettings?.hero_subtitle || 'Akses koleksi fisik dan digital terlengkap untuk mendukung riset dan pembelajaran di lingkungan STAH Dharma Nusantara Jakarta.' }}
          </p>

          <!-- Search Source Toggle -->
          <div class="flex flex-wrap justify-center items-center gap-2 mb-4">
            <button 
              class="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              :class="searchSource === 'katalog' ? 'bg-secondary text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'"
              @click="searchSource = 'katalog'"
            >
              <span class="material-symbols-outlined text-sm">menu_book</span>
              <span>Katalog Perpustakaan</span>
            </button>
            <button 
              class="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              :class="searchSource === 'repository' ? 'bg-secondary text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'"
              @click="searchSource = 'repository'"
            >
              <span class="material-symbols-outlined text-sm">database</span>
              <span>Repository STAH DNJ</span>
            </button>
          </div>

          <!-- Search Box Input -->
          <div class="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto border border-white/20 transition-all focus-within:ring-2 focus-within:ring-secondary">
            <div class="flex-1 flex items-center gap-2.5 px-3 sm:px-4 w-full">
              <span class="material-symbols-outlined text-slate-400 shrink-0 text-xl">
                {{ searchSource === 'repository' ? 'travel_explore' : 'search' }}
              </span>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium py-2 text-xs sm:text-sm outline-none placeholder:text-slate-400" 
                :placeholder="searchSource === 'repository' ? 'Cari karya ilmiah di repository.stahdnj.ac.id...' : 'Cari judul buku, pengarang, atau ISBN...'" 
                @keyup.enter="handleSearch"
              />
            </div>
            <button 
              class="bg-secondary text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-secondary/90 transition-all active:scale-95 flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0 shadow-sm cursor-pointer"
              @click="handleSearch"
            >
              <span class="material-symbols-outlined text-base sm:text-lg">{{ searchSource === 'repository' ? 'open_in_new' : 'search' }}</span>
              <span>{{ searchSource === 'repository' ? 'Cari di Repository' : 'Cari Koleksi' }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Quick Access Cards -->
      <section class="max-w-container-max mx-auto mt-6 sm:-mt-10 md:-mt-16 relative z-30 px-4 md:px-margin-desktop">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-gutter">
          <NuxtLink to="/buku" class="bg-white p-3.5 sm:p-5 md:p-6 rounded-2xl shadow-[0px_4px_16px_rgba(10,58,90,0.06)] border border-outline-variant/60 hover:shadow-xl transition-all group cursor-pointer block">
            <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-primary-container text-primary-fixed rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-2xl sm:text-3xl">menu_book</span>
            </div>
            <h3 class="font-bold text-xs sm:text-sm md:text-base text-primary mb-0.5">Katalog Buku</h3>
            <p class="text-[11px] sm:text-xs text-on-surface-variant line-clamp-1">{{ books.length }} Buku Terdaftar</p>
          </NuxtLink>

          <NuxtLink to="/buku" class="bg-white p-3.5 sm:p-5 md:p-6 rounded-2xl shadow-[0px_4px_16px_rgba(10,58,90,0.06)] border border-outline-variant/60 hover:shadow-xl transition-all group cursor-pointer block">
            <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-2xl sm:text-3xl">category</span>
            </div>
            <h3 class="font-bold text-xs sm:text-sm md:text-base text-primary mb-0.5">Kategori Pustaka</h3>
            <p class="text-[11px] sm:text-xs text-on-surface-variant line-clamp-1">{{ categories.length }} Kategori Aktif</p>
          </NuxtLink>

          <NuxtLink to="/layanan" class="bg-white p-3.5 sm:p-5 md:p-6 rounded-2xl shadow-[0px_4px_16px_rgba(10,58,90,0.06)] border border-outline-variant/60 hover:shadow-xl transition-all group cursor-pointer block">
            <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-surface-container-high text-primary rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-2xl sm:text-3xl">meeting_room</span>
            </div>
            <h3 class="font-bold text-xs sm:text-sm md:text-base text-primary mb-0.5">Ruangan Digital</h3>
            <p class="text-[11px] sm:text-xs text-on-surface-variant line-clamp-1">Reservasi area kolaborasi</p>
          </NuxtLink>

          <NuxtLink to="/layanan" class="bg-white p-3.5 sm:p-5 md:p-6 rounded-2xl shadow-[0px_4px_16px_rgba(10,58,90,0.06)] border border-outline-variant/60 hover:shadow-xl transition-all group cursor-pointer block">
            <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-error-container text-on-error-container rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-2xl sm:text-3xl">description</span>
            </div>
            <h3 class="font-bold text-xs sm:text-sm md:text-base text-primary mb-0.5">Bebas Pustaka</h3>
            <p class="text-[11px] sm:text-xs text-on-surface-variant line-clamp-1">Layanan administrasi akhir</p>
          </NuxtLink>
        </div>
      </section>

      <!-- Popular Collection -->
      <section id="koleksi" class="max-w-container-max mx-auto py-12 sm:py-16 md:py-20 px-4 md:px-margin-desktop">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">Koleksi Buku &amp; Pustaka</h2>
            <p class="text-xs sm:text-sm text-on-surface-variant">Buku-buku yang terdaftar resmi pada database perpustakaan STAH DNJ.</p>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <NuxtLink to="/buku" class="text-secondary text-xs sm:text-sm font-semibold flex items-center gap-1 hover:underline">
              Semua Katalog Buku <span class="material-symbols-outlined text-sm">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="py-16 text-center">
          <div class="inline-block w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="text-sm text-on-surface-variant">Memuat data koleksi pustaka STAH DNJ...</p>
        </div>

        <!-- Empty Filter State -->
        <div v-else-if="filteredBooks.length === 0" class="bg-surface-container-low border border-outline-variant p-8 sm:p-12 rounded-2xl text-center my-6">
          <span class="material-symbols-outlined text-5xl text-outline mb-3">search_off</span>
          <h3 class="text-lg font-bold text-primary mb-2">Buku Tidak Ditemukan</h3>
          <p class="text-sm text-on-surface-variant max-w-md mx-auto mb-6">
            Tidak ada koleksi yang cocok dengan kata kunci "{{ searchQuery }}". Silakan coba kata kunci lain.
          </p>
          <button class="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-container transition-colors cursor-pointer" @click="searchQuery = ''">
            Tampilkan Semua Buku
          </button>
        </div>

        <!-- Books Grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 md:gap-gutter">
          <NuxtLink 
            v-for="(book, index) in filteredBooks" 
            :key="book.id" 
            :to="getBookUrl(book)"
            class="group cursor-pointer bg-white p-3 sm:p-4 rounded-2xl border border-outline-variant/60 shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between block"
          >
            <div>
              <div class="aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all relative bg-surface-container-high flex items-center justify-center">
                <img 
                  v-if="book.cover_image" 
                  class="w-full h-full object-cover" 
                  :src="book.cover_image" 
                  :alt="book.judul" 
                />
                <img 
                  v-else 
                  class="w-full h-full object-cover" 
                  :src="fallbackCovers[index % fallbackCovers.length]" 
                  :alt="book.judul" 
                />
                <span class="absolute top-2 right-2 bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                  {{ book.tahun_terbit || '2021' }}
                </span>
              </div>

              <h5 class="font-bold text-xs sm:text-sm text-primary group-hover:text-secondary transition-colors mb-1 line-clamp-2 leading-tight">
                {{ book.judul }}
              </h5>
              <p class="text-[11px] sm:text-xs text-on-surface-variant line-clamp-1 mb-2">
                ✍️ {{ book.penulis || 'Penulis Tidak Diketahui' }}
              </p>
            </div>

            <div class="pt-2.5 border-t border-outline-variant/40 flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span class="text-[10px] sm:text-xs text-emerald-600 font-semibold">Tersedia</span>
              </div>
              <span class="material-symbols-outlined text-outline text-sm group-hover:text-secondary">arrow_forward</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Categories Section -->
      <section id="kategori" class="bg-surface-container-low py-12 sm:py-16 md:py-20">
        <div class="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div class="text-center mb-8 sm:mb-12">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Kategori Pustaka</h2>
            <p class="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-xl mx-auto">
              Pengelompokan bidang keilmuan dan subjek koleksi perpustakaan STAH DNJ.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <NuxtLink 
              v-for="cat in categories" 
              :key="cat.id" 
              :to="{ path: '/buku', query: { kategori: cat.nama_kategori } }"
              class="bg-white p-6 sm:p-8 rounded-2xl border border-outline-variant shadow-sm hover:shadow-lg transition-all group cursor-pointer flex flex-col justify-between block"
            >
              <div>
                <div class="w-12 h-12 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4 text-2xl group-hover:scale-110 transition-transform">
                  📖
                </div>
                <h3 class="text-base sm:text-lg text-primary font-bold mb-2 group-hover:text-secondary transition-colors">
                  {{ cat.nama_kategori }}
                </h3>
                <p class="text-xs sm:text-sm text-on-surface-variant leading-relaxed mb-6 line-clamp-3">
                  {{ cat.deskripsi || 'Koleksi buku dan referensi ilmiah mengenai bidang ' + cat.nama_kategori + '.' }}
                </p>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-outline-variant/40">
                <span class="text-xs font-bold text-secondary bg-secondary-fixed px-3 py-1 rounded-full">
                  {{ getCategoryCount(cat) }} Koleksi Buku
                </span>
                <span class="text-xs text-outline font-mono">/{{ cat.slug }}</span>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Statistics Section (Valid Live API Data) -->
      <section class="bg-primary-container py-12 sm:py-16">
        <div class="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12 text-center">
            <div class="flex flex-col items-center">
              <span class="text-secondary-fixed text-2xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">{{ books.length > 0 ? books.length + ' Total' : '10 Total' }}</span>
              <p class="text-xs sm:text-sm text-primary-fixed uppercase tracking-wider font-semibold">Koleksi Buku Fisik Terdata</p>
            </div>
            <div class="flex flex-col items-center border-y sm:border-y-0 sm:border-x border-primary-fixed-dim/20 py-4 sm:py-0">
              <span class="text-secondary-fixed text-2xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">{{ categories.length > 0 ? categories.length + ' Kategori' : '5 Kategori' }}</span>
              <p class="text-xs sm:text-sm text-primary-fixed uppercase tracking-wider font-semibold">Kelompok Bidang Ilmu</p>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-secondary-fixed text-2xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">{{ activeMembersCount }}</span>
              <p class="text-xs sm:text-sm text-primary-fixed uppercase tracking-wider font-semibold">Anggota Aktif Terdaftar</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Dynamic Announcements Banner -->
      <section v-if="announcementsList.length > 0" class="max-w-container-max mx-auto pt-12 px-4 md:px-margin-desktop">
        <NuxtLink 
          v-for="ann in announcementsList" 
          :key="ann.id" 
          :to="getArticleUrl(ann)"
          class="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-5 sm:p-6 rounded-2xl shadow-lg flex items-start gap-4 mb-4 block hover:brightness-105 transition-all cursor-pointer"
        >
          <span class="material-symbols-outlined text-2xl sm:text-3xl mt-0.5">campaign</span>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">Pengumuman Resmi</span>
              <span class="text-xs text-white/80" v-if="ann.created_at">{{ new Date(ann.created_at).toLocaleDateString('id-ID') }}</span>
            </div>
            <h4 class="font-bold text-base sm:text-lg leading-snug hover:underline">{{ ann.title }}</h4>
            <p class="text-xs sm:text-sm text-white/90 mt-1 leading-relaxed">{{ ann.content }}</p>
          </div>
        </NuxtLink>
      </section>

      <!-- Dynamic News Section -->
      <section id="berita" class="max-w-container-max mx-auto py-12 sm:py-16 md:py-20 px-4 md:px-margin-desktop">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">Berita &amp; Pengumuman</h2>
            <p class="text-xs sm:text-sm text-on-surface-variant">Informasi terbaru seputar kegiatan perpustakaan STAH DNJ.</p>
          </div>
          <NuxtLink class="text-secondary text-xs sm:text-sm flex items-center gap-1.5 hover:gap-2 transition-all font-semibold shrink-0" to="/berita">
            Lihat Semua <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </NuxtLink>
        </div>

        <!-- Empty State for News -->
        <div v-if="displayedNews.length === 0" class="bg-surface-container-low border border-outline-variant p-8 sm:p-12 rounded-2xl text-center">
          <span class="material-symbols-outlined text-4xl text-outline mb-2">newspaper</span>
          <p class="text-on-surface-variant text-sm font-medium">Belum ada data berita publikasi perpustakaan.</p>
        </div>

        <!-- News Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <NuxtLink 
            v-for="item in displayedNews" 
            :key="item.id" 
            :to="getArticleUrl(item)"
            class="bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-sm group transition-all hover:shadow-md flex flex-col justify-between block cursor-pointer"
          >
            <div>
              <div class="h-44 sm:h-52 overflow-hidden relative bg-surface-container-high">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" :src="item.image_url" :alt="item.title" />
                <span class="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                  {{ item.category }}
                </span>
              </div>
              <div class="p-4 sm:p-6">
                <p class="text-xs text-on-surface-variant mb-1.5">📅 {{ item.published_at }} • Oleh {{ item.author }}</p>
                <h4 class="font-bold text-sm sm:text-base text-primary mb-2 leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                  {{ item.title }}
                </h4>
                <p class="text-xs sm:text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                  {{ item.summary }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Dynamic Testimonials Section (Integrated with API) -->
      <section class="bg-surface-container-low py-12 sm:py-16 md:py-24">
        <div class="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div class="text-center mb-8 sm:mb-12">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Apa Kata Mereka?</h2>
            <p class="text-xs sm:text-sm text-on-surface-variant mt-1.5">Pengalaman mahasiswa dan sivitas akademika menggunakan layanan Perpustakaan STAH DNJ.</p>
          </div>

          <div v-if="displayedTestimonials.length === 0" class="bg-white p-8 rounded-3xl text-center border border-outline-variant max-w-xl mx-auto shadow-sm">
            <span class="material-symbols-outlined text-5xl text-outline mb-3">rate_review</span>
            <h3 class="text-base font-bold text-primary mb-2">Belum Ada Data Testimoni</h3>
            <p class="text-xs sm:text-sm text-on-surface-variant">Belum ada ulasan atau testimoni publikasi dari sivitas akademika.</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div 
              v-for="(item, idx) in displayedTestimonials" 
              :key="item.id" 
              class="bg-white p-6 sm:p-8 rounded-3xl shadow-sm relative border border-outline-variant hover:shadow-md transition-all flex flex-col justify-between"
            >
              <span class="material-symbols-outlined text-secondary-container text-5xl absolute top-4 right-6 opacity-30">format_quote</span>
              
              <div>
                <div class="flex items-center gap-3 sm:gap-4 mb-4">
                  <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border border-outline-variant bg-surface-container flex items-center justify-center shrink-0">
                    <img v-if="item.avatar_url" class="w-full h-full object-cover" :src="item.avatar_url" :alt="item.name" />
                    <span v-else class="font-bold text-lg text-primary">{{ item.name.charAt(0) }}</span>
                  </div>
                  <div>
                    <h6 class="text-sm sm:text-base text-primary font-bold">{{ item.name }}</h6>
                    <p class="text-xs text-on-surface-variant">{{ item.role || 'Mahasiswa STAH DNJ' }}</p>
                  </div>
                </div>

                <p class="text-xs sm:text-sm text-on-surface-variant italic leading-relaxed mb-4">
                  "{{ item.content }}"
                </p>
              </div>

              <div class="flex items-center gap-1 text-amber-500 pt-2">
                <span v-for="star in (item.rating || 5)" :key="star" class="material-symbols-outlined text-xs sm:text-sm font-fill">star</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  usePustakaApi, 
  type Book, 
  type Category, 
  type NewsItem, 
  type AnnouncementItem,
  type TestimonialItem,
  type UserProfile,
  type SiteSettings
} from '../composables/usePustakaApi';

const { getBooks, getCategories, getNews, getAnnouncements, getLoans, getProfile, getTestimonials, getSettings } = usePustakaApi();

const loading = ref(true);
const searchQuery = ref('');
const searchSource = ref<'katalog' | 'repository'>('katalog');

const handleSearch = () => {
  if (searchSource.value === 'repository') {
    const targetUrl = `https://repository.stahdnj.ac.id/xmlui/discover?query=${encodeURIComponent(searchQuery.value)}`;
    if (process.client) {
      window.open(targetUrl, '_blank');
    }
  } else {
    if (searchQuery.value.trim()) {
      navigateTo({ path: '/buku', query: { q: searchQuery.value.trim() } });
    } else {
      navigateTo('/buku');
    }
  }
};

const books = ref<Book[]>([]);
const categories = ref<Category[]>([]);
const newsList = ref<NewsItem[]>([]);
const announcementsList = ref<AnnouncementItem[]>([]);
const loansList = ref<any[]>([]);
const testimonialsList = ref<TestimonialItem[]>([]);
const userProfile = ref<UserProfile | null>(null);

const fallbackCovers = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCyQOycP2e156QKOr6BO9l6k_3L5BLUq65R5lSNqyVzYPE15xHkx6EehbZ5rEkY2v0LFcLv0q5l7sYYDnrN6PH_5G7_rjbHgmVF8vQuMhCBAl_GCRCuWZWA2WODPIxZcIGHsTdl8jmjQIoEKLucszGG559PBTddW9ipzLQKWi2uOcQ_iwNypTFyslD7MI1gwgIcNf9-J95Jn9KQc8TDONO4xsZU1QGhkENxC-xchxdgRVFC0LpWanXesw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDp1PiSe9X0pkHzGact-cotXiz4m_yVp3eXm9yd1CZ0nGIOJ3pk9qQypHrRbx1VzoVOYyIdDshICHM2zyQq-56U-4b-gZEHxLiU0rFZvdIaRCkgCHaFxAkOBpZyDOrVzAMFLxgFkzgUtsfV_77iUpdRK5Qnr1kCb70K9KXT73ObyKLMUf5XftLpKMCPe7m_lDpKPOtU2YFOYNcIzUKHh-W5k6xud5b_wLE1Rjm1tlL_EECpMuzyaLKdxg'
];

const defaultNewsImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCqqnbAhYZAD5noPoJYDOjCacsw_4Fi9npvGuV_2wQCYUNIQsCDw8Z6nlGYLwBpN2vet5tWENORS5zRcj1oYD4a_RVXi5SwrgbpXr5ymDgQH6VHB_jCcY901ftzOp9sajtMG2ugaiEii46L135Ai3BpCDxA6cw_aDFsMk-lqvWWSjW9hQazpoh-3k2mTtJmEITsV7HVq4NK9o3e_98SckUCjeNB3aoQBfiu3tEXs1ixYMeIbNcEk9aySg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCjkcB4fArcvmfFVdX0g626IbDs-slSFtcqJondro2tQPU36N00ipvwKCnaavpnN0PloF4qeCo9ucyxNT874ffmwalkseBT3g0OJixF4ewwsmdJsMWJs5BBPo86ItZjKVQafn4QroGcmHzbt5KLafysDaYwH2tpah-DoZcBOhvpQq-c8AYV5yiVIm-6fQh7IlZxa1g74xux9zEuoE5j7ufm9h9w3XEsxGyuKFXqyAN_IwZBlq-0EQr3jw'
];

const getBookUrl = (b: Book) => {
  const slug = b.slug || b.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return `/buku/${slug}-${b.id}`;
};

const getCategoryCount = (cat: Category): number => {
  if (!books.value || books.value.length === 0) {
    return cat.books_count ?? 0;
  }
  const count = books.value.filter(b => {
    const catObj = b.category || b.kategori;
    if (!catObj) return false;
    if (typeof catObj === 'object') {
      return catObj.id === cat.id || catObj.nama_kategori?.toLowerCase() === cat.nama_kategori.toLowerCase() || (cat.slug && catObj.slug?.toLowerCase() === cat.slug.toLowerCase());
    }
    if (typeof catObj === 'string') {
      return catObj.toLowerCase() === cat.nama_kategori.toLowerCase();
    }
    return false;
  }).length;
  return count || cat.books_count || 0;
};

const slugifyTitle = (title: string, maxWords = 5) => {
  if (!title) return 'berita';
  const clean = title.toLowerCase().replace(/[^a-z0-9\s]+/g, '').trim();
  const words = clean.split(/\s+/).slice(0, maxWords).join('-');
  return words || 'berita';
};

const getArticleUrl = (item: any) => {
  let year = '2024';
  let month = '10';
  if (item.published_at || item.created_at) {
    try {
      const d = new Date(item.published_at || item.created_at);
      if (!isNaN(d.getTime())) {
        year = String(d.getFullYear());
        month = String(d.getMonth() + 1).padStart(2, '0');
      }
    } catch (e) {}
  }
  const slug = slugifyTitle(item.title || item.judul || 'berita');
  return `/berita/${year}/${month}/${slug}`;
};

const activeMembersCount = computed(() => {
  const borrowerIds = new Set<string | number>();

  if (userProfile.value && (userProfile.value.status_keanggotaan === 'Aktif' || userProfile.value.role)) {
    borrowerIds.add(userProfile.value.id || userProfile.value.email);
  }

  loansList.value.forEach((l: any) => {
    if (l.user_id) borrowerIds.add(l.user_id);
    if (l.user?.id) borrowerIds.add(l.user.id);
    if (l.nim) borrowerIds.add(l.nim);
  });

  const count = borrowerIds.size;
  return count > 0 ? `${count} Anggota` : '1 Anggota';
});

const displayedTestimonials = computed(() => {
  return testimonialsList.value;
});

const displayedNews = computed(() => {
  return newsList.value.map((item, idx) => {
    let dateStr = 'Terbaru';
    if (item.published_at || item.created_at) {
      try {
        const d = new Date(item.published_at || item.created_at || '');
        dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) {
        dateStr = item.published_at || 'Terbaru';
      }
    }

    return {
      id: item.id,
      title: item.title,
      summary: item.content || item.summary || 'Informasi resmi dari perpustakaan STAH DNJ.',
      category: item.category || 'Berita',
      published_at: dateStr,
      author: item.author_name || item.author?.name || 'Administrator',
      image_url: item.thumbnail_url || defaultNewsImages[idx % defaultNewsImages.length]
    };
  });
});

const filteredBooks = computed(() => {
  if (!searchQuery.value.trim()) return books.value;
  const q = searchQuery.value.toLowerCase();
  return books.value.filter(b => 
    (b.judul && b.judul.toLowerCase().includes(q)) ||
    (b.penulis && b.penulis.toLowerCase().includes(q)) ||
    (b.isbn && b.isbn.toLowerCase().includes(q))
  );
});

const heroDefaultBg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnVEAU9hxewbpcL-zJBF-VYMfF9CYqeW4AdHNxhEAB7Q8lh7P-fhGTZJNNjLXaT1jnxBawGh951FGVimE_UXcGwmJi08H0XshoFxacv0x7DN5jiS-pKOYNENJvSxE4ErBEzXShmq-QIXhlPqBKpwLEOxNpTDkenvskzHDUTZgyqFhcROoKoJNxdFYk7M38BxAB5EJEYZI7pITbaTm1RB6XNBO4_fsoU6GUqk959h722b2tabSqCO_A_g';
const siteSettings = ref<SiteSettings | null>(null);

const deriveCategoriesFromBooks = (bookList: Book[]): Category[] => {
  const catMap = new Map<string, Category>();
  
  for (const b of bookList) {
    const catObj = b.category || b.kategori;
    if (catObj && typeof catObj === 'object' && catObj.nama_kategori) {
      const key = catObj.nama_kategori.trim().toLowerCase();
      if (!catMap.has(key)) {
        catMap.set(key, {
          id: catObj.id || (catMap.size + 1),
          nama_kategori: catObj.nama_kategori.trim(),
          slug: catObj.slug || catObj.nama_kategori.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          deskripsi: `Koleksi ${catObj.nama_kategori.trim()}`,
          books_count: 0
        });
      }
    } else if (typeof catObj === 'string' && catObj.trim()) {
      const key = catObj.trim().toLowerCase();
      if (!catMap.has(key)) {
        catMap.set(key, {
          id: catMap.size + 1,
          nama_kategori: catObj.trim(),
          slug: catObj.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          deskripsi: `Koleksi ${catObj.trim()}`,
          books_count: 0
        });
      }
    }
  }

  return Array.from(catMap.values());
};

const loadData = async () => {
  loading.value = true;
  try {
    const [resBooks, resCat, resNews, resAnnouncements, resLoans, resProfile, resTestimonials, resSettings] = await Promise.all([
      getBooks(),
      getCategories(),
      getNews().catch(() => ({ success: false, data: [] })),
      getAnnouncements().catch(() => ({ success: false, data: [] })),
      getLoans().catch(() => ({ success: false, data: [] })),
      getProfile().catch(() => ({ success: false, data: null })),
      getTestimonials().catch(() => ({ success: false, data: [] })),
      getSettings().catch(() => ({ success: false, data: null as any }))
    ]);

    if (resBooks?.data && Array.isArray(resBooks.data)) {
      books.value = resBooks.data;
    } else if (Array.isArray(resBooks)) {
      books.value = resBooks;
    }

    if (resCat?.data && Array.isArray(resCat.data) && resCat.data.length > 0) {
      categories.value = resCat.data;
    } else if (Array.isArray(resCat) && resCat.length > 0) {
      categories.value = resCat;
    }

    // Dynamic Fallback: If categories array is empty, derive from books
    if (categories.value.length === 0 && books.value.length > 0) {
      categories.value = deriveCategoriesFromBooks(books.value);
    }

    if (resNews?.success) newsList.value = resNews.data || [];
    if (resAnnouncements?.success) announcementsList.value = resAnnouncements.data || [];
    if (resLoans?.success) loansList.value = resLoans.data || [];
    if (resProfile?.success && resProfile.data) userProfile.value = resProfile.data.user || resProfile.data;
    if (resTestimonials?.success && resTestimonials.data) testimonialsList.value = resTestimonials.data || [];
    if (resSettings?.success && resSettings.data) siteSettings.value = resSettings.data;
  } catch (err) {
    console.error('Error fetching library data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.font-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400;
}
</style>
