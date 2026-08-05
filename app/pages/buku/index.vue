<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
    <div class="flex-1 flex max-w-container-max w-full mx-auto pt-16 md:pt-20">
      <!-- SideNavBar Filter -->
      <aside class="w-64 h-[calc(100vh-110px)] sticky top-24 bg-surface-container-low dark:bg-surface-container border-r border-outline-variant flex flex-col p-gutter gap-4 shrink-0 overflow-y-auto rounded-r-2xl hidden md:flex">
        <div>
          <h2 class="text-primary dark:text-primary-fixed-dim font-bold font-label-md text-label-md mb-1">Filter Katalog Buku</h2>
          <p class="text-on-surface-variant text-caption font-caption mb-4">Sesuaikan pencarian koleksi</p>
        </div>

        <!-- Search Input in Sidebar -->
        <div class="relative mb-2">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="w-full pl-9 pr-3 py-2 bg-white dark:bg-surface-container-high border border-outline-variant rounded-lg text-xs font-body-md focus:ring-2 focus:ring-primary outline-none" 
            placeholder="Cari judul/penulis/ISBN..." 
          />
        </div>

        <!-- Category Filters -->
        <div class="space-y-1">
          <p class="font-caption text-[11px] uppercase tracking-wider text-outline font-bold mb-2">Kategori Pustaka</p>
          
          <button 
            class="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-label-md transition-all"
            :class="selectedCategory === 'all' ? 'bg-secondary-fixed text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'"
            @click="selectedCategory = 'all'"
          >
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-lg">library_books</span>
              <span>Semua Buku</span>
            </div>
            <span class="text-[10px] bg-white/60 px-2 py-0.5 rounded-full font-mono">{{ books.length }}</span>
          </button>

          <button 
            v-for="cat in categories" 
            :key="cat.id" 
            class="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-label-md transition-all"
            :class="selectedCategory === cat.nama_kategori ? 'bg-secondary-fixed text-primary font-bold shadow-sm' : 'text-on-surface-variant hover:bg-surface-container-high'"
            @click="selectedCategory = cat.nama_kategori"
          >
            <div class="flex items-center gap-2.5 truncate">
              <span class="material-symbols-outlined text-lg">menu_book</span>
              <span class="truncate">{{ cat.nama_kategori }}</span>
            </div>
            <span class="text-[10px] bg-black/5 px-2 py-0.5 rounded-full font-mono">{{ cat.books_count ?? 0 }}</span>
          </button>
        </div>

        <!-- Availability Filter -->
        <div class="mt-4 pt-4 border-t border-outline-variant">
          <p class="font-caption text-[11px] uppercase tracking-wider text-outline font-bold mb-2">Status Ketersediaan</p>
          <div class="space-y-1">
            <button 
              class="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-label-md transition-all"
              :class="statusFilter === 'all' ? 'bg-primary-fixed text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'"
              @click="statusFilter = 'all'"
            >
              <span class="material-symbols-outlined text-lg">apps</span>
              <span>Semua Status</span>
            </button>
            <button 
              class="w-full flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-label-md transition-all"
              :class="statusFilter === 'available' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'"
              @click="statusFilter = 'available'"
            >
              <span class="material-symbols-outlined text-lg text-emerald-600">check_circle</span>
              <span>Buku Tersedia</span>
            </button>
          </div>
        </div>

        <!-- External E-Repository Link -->
        <div class="mt-4 pt-4 border-t border-outline-variant">
          <p class="font-caption text-[11px] uppercase tracking-wider text-outline font-bold mb-2">Repository STAH DNJ</p>
          <a 
            :href="repositorySearchUrl" 
            target="_blank" 
            class="w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-label-md bg-secondary-container/60 hover:bg-secondary-container text-on-secondary-container font-semibold transition-all group"
          >
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-lg">database</span>
              <span>Cari di Repository STAH</span>
            </div>
            <span class="material-symbols-outlined text-sm group-hover:translate-x-0.5 transition-transform">open_in_new</span>
          </a>
        </div>

        <button class="mt-auto bg-primary text-on-primary py-2.5 px-4 rounded-lg font-label-md text-xs hover:bg-primary-container transition-all active:scale-95" @click="resetFilters">
          Reset Filter
        </button>
      </aside>

      <!-- Main Content Canvas -->
      <main class="flex-1 p-4 md:p-margin-desktop overflow-y-auto">
        <header class="mb-8">
          <!-- E-Repository Info Alert -->
          <div class="mb-6 p-4 rounded-xl bg-primary-container text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm border border-primary-fixed-dim/30">
            <div class="flex items-center gap-3">
              <span class="material-symbols-outlined text-secondary-fixed text-2xl shrink-0">database</span>
              <div>
                <p class="font-label-md text-xs sm:text-sm font-bold text-white">Mencari Skripsi, Tugas Akhir, atau Jurnal Digital?</p>
                <p class="text-caption text-[11px] sm:text-caption opacity-80">Akses langsung koleksi repositori akademik digital kampus di repository.stahdnj.ac.id</p>
              </div>
            </div>
            <a 
              :href="repositorySearchUrl" 
              target="_blank" 
              class="bg-secondary text-white px-4 py-2 rounded-lg font-label-md text-xs hover:bg-on-secondary-container transition-all flex items-center gap-1.5 shrink-0 font-bold"
            >
              <span>Cari di Repository STAH DNJ</span>
              <span class="material-symbols-outlined text-sm">open_in_new</span>
            </a>
          </div>
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 class="font-headline-lg text-headline-lg text-primary mb-2">Katalog Buku Koleksi</h1>
              <p class="text-on-surface-variant text-body-md font-body-md">
                Menampilkan <strong class="text-primary">{{ filteredBooks.length }}</strong> judul buku akademik dan pustaka keagamaan.
              </p>
            </div>

            <!-- Mobile Search & View Mode Toggle -->
            <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div class="relative sm:hidden flex-1">
                <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
                <input v-model="searchQuery" type="text" class="w-full pl-9 pr-3 py-2 bg-surface-container rounded-full text-xs outline-none" placeholder="Cari buku..." />
              </div>

              <div class="flex items-center gap-1 bg-white p-1 rounded-lg border border-outline-variant shadow-sm">
                <button 
                  class="p-1.5 rounded transition-colors"
                  :class="viewMode === 'grid' ? 'bg-primary-fixed text-primary' : 'text-on-surface-variant hover:bg-surface-container'"
                  title="Tampilan Grid"
                  @click="viewMode = 'grid'"
                >
                  <span class="material-symbols-outlined text-xl">grid_view</span>
                </button>
                <button 
                  class="p-1.5 rounded transition-colors"
                  :class="viewMode === 'list' ? 'bg-primary-fixed text-primary' : 'text-on-surface-variant hover:bg-surface-container'"
                  title="Tampilan Daftar"
                  @click="viewMode = 'list'"
                >
                  <span class="material-symbols-outlined text-xl">list</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Active Filter Pills -->
          <div v-if="selectedCategory !== 'all' || searchQuery || statusFilter !== 'all'" class="flex items-center gap-2 mt-4 flex-wrap">
            <span class="text-xs text-on-surface-variant font-medium">Filter Aktif:</span>
            <span v-if="selectedCategory !== 'all'" class="bg-secondary-fixed text-on-secondary-fixed text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              Kategori: {{ selectedCategory }}
              <button class="hover:text-error" @click="selectedCategory = 'all'">×</button>
            </span>
            <span v-if="searchQuery" class="bg-primary-fixed text-on-primary-fixed text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              Cari: "{{ searchQuery }}"
              <button class="hover:text-error" @click="searchQuery = ''">×</button>
            </span>
            <span v-if="statusFilter !== 'all'" class="bg-emerald-100 text-emerald-800 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
              Status: Tersedia
              <button class="hover:text-error" @click="statusFilter = 'all'">×</button>
            </span>
            <button class="text-xs text-error font-bold hover:underline ml-2" @click="resetFilters">Reset Semua</button>
          </div>
        </header>

        <!-- Mobile Filter Quick Chips & Modal Trigger (Visible on md:hidden) -->
        <div class="md:hidden mb-6 space-y-3">
          <div class="flex items-center justify-between gap-2">
            <span class="font-label-md text-xs font-bold text-primary">Kategori Pustaka</span>
            <button 
              @click="showMobileFilterModal = true" 
              class="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-outline-variant rounded-full text-xs font-bold text-primary shadow-xs active:scale-95 cursor-pointer"
            >
              <span class="material-symbols-outlined text-sm">tune</span>
              <span>Filter & Status</span>
              <span v-if="selectedCategory !== 'all' || statusFilter !== 'all'" class="w-2 h-2 bg-secondary rounded-full"></span>
            </button>
          </div>

          <!-- Horizontal Scrollable Category Pills -->
          <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button 
              class="px-3.5 py-1.5 rounded-full text-xs font-label-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
              :class="selectedCategory === 'all' ? 'bg-primary text-white font-bold' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'"
              @click="selectedCategory = 'all'"
            >
              Semua ({{ books.length }})
            </button>
            <button 
              v-for="cat in categories" 
              :key="cat.id" 
              class="px-3.5 py-1.5 rounded-full text-xs font-label-md transition-all whitespace-nowrap shrink-0 cursor-pointer"
              :class="selectedCategory === cat.nama_kategori ? 'bg-primary text-white font-bold' : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'"
              @click="selectedCategory = cat.nama_kategori"
            >
              {{ cat.nama_kategori }} ({{ cat.books_count ?? 0 }})
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="py-20 text-center">
          <div class="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
          <p class="font-body-md text-on-surface-variant">Memuat katalog koleksi dari database perpustakaan...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredBooks.length === 0" class="bg-surface-container-low border border-outline-variant p-12 rounded-2xl text-center my-8">
          <span class="material-symbols-outlined text-6xl text-outline mb-4">search_off</span>
          <h3 class="font-headline-md text-primary mb-2">Koleksi Tidak Ditemukan</h3>
          <p class="font-body-md text-on-surface-variant max-w-md mx-auto mb-6">
            Tidak ada buku yang sesuai dengan pencarian atau filter yang dipilih. Silakan atur ulang kata kunci.
          </p>
          <button class="bg-primary text-white px-6 py-2.5 rounded-xl font-label-md text-sm hover:bg-primary-container transition-colors" @click="resetFilters">
            Tampilkan Semua Buku
          </button>
        </div>

        <!-- Book Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter mb-12">
          <div 
            v-for="(book, index) in paginatedBooks" 
            :key="book.id" 
            class="bg-white rounded-xl card-elevation overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <NuxtLink :to="getBookUrl(book)" class="block relative aspect-[3/4] overflow-hidden bg-surface-container-high">
                <img 
                  v-if="book.cover_image"
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  :src="book.cover_image" 
                  :alt="book.judul"
                />
                <img 
                  v-else
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  :src="fallbackCovers[index % fallbackCovers.length]" 
                  :alt="book.judul"
                />
                <div class="absolute top-3 left-3">
                  <span class="bg-primary-container/90 text-on-primary-container px-3 py-1 rounded-full text-caption font-label-md backdrop-blur-sm shadow-sm">
                    {{ book.tahun_terbit || 'STAH DNJ' }}
                  </span>
                </div>
              </NuxtLink>

              <div class="p-5">
                <div class="flex justify-between items-start mb-2 gap-2">
                  <NuxtLink :to="getBookUrl(book)" class="font-label-md text-label-md text-primary group-hover:text-secondary transition-colors line-clamp-2 leading-snug font-bold">
                    {{ book.judul }}
                  </NuxtLink>
                  <button 
                    class="material-symbols-outlined text-on-surface-variant hover:text-secondary transition-colors text-xl"
                    :class="{ 'text-secondary font-fill': bookmarkedIds.has(book.id) }"
                    title="Simpan Buku"
                    @click.stop="toggleBookmark(book.id)"
                  >
                    bookmark
                  </button>
                </div>
                <p class="text-on-surface-variant text-caption font-caption mb-4 line-clamp-1">
                  ✍️ {{ book.penulis || 'Penulis Tidak Diketahui' }}
                </p>
              </div>
            </div>

            <div class="p-5 pt-0">
              <div class="flex items-center gap-1.5 mb-4">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="text-emerald-700 text-caption font-label-md font-semibold">Tersedia</span>
              </div>
              <div class="flex gap-2">
                <NuxtLink 
                  :to="getBookUrl(book)" 
                  class="flex-1 py-2 rounded-lg border border-primary text-primary font-label-md text-xs hover:bg-primary-fixed transition-colors font-semibold text-center"
                >
                  Detail
                </NuxtLink>
                <NuxtLink 
                  :to="getBookUrl(book)" 
                  class="bg-secondary text-white px-4 py-2 rounded-lg font-label-md text-xs hover:opacity-90 transition-opacity font-semibold text-center"
                >
                  Pinjam
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Book List View -->
        <div v-else class="space-y-4 mb-12">
          <div 
            v-for="(book, index) in paginatedBooks" 
            :key="book.id" 
            class="bg-white p-4 rounded-xl border border-outline-variant shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div class="flex items-center gap-4">
              <NuxtLink :to="getBookUrl(book)" class="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high block">
                <img 
                  v-if="book.cover_image"
                  :src="book.cover_image" 
                  :alt="book.judul" 
                  class="w-full h-full object-cover"
                />
                <img 
                  v-else
                  :src="fallbackCovers[index % fallbackCovers.length]" 
                  :alt="book.judul" 
                  class="w-full h-full object-cover"
                />
              </NuxtLink>
              <div>
                <span class="text-[10px] font-bold uppercase text-secondary bg-secondary-fixed px-2 py-0.5 rounded mb-1 inline-block">
                  Buku Fisik • {{ book.tahun_terbit || '2021' }}
                </span>
                <NuxtLink :to="getBookUrl(book)" class="font-headline-md text-base text-primary font-bold leading-tight mb-1 hover:text-secondary block">
                  {{ book.judul }}
                </NuxtLink>
                <p class="text-xs text-on-surface-variant">✍️ {{ book.penulis || 'Penulis Tidak Diketahui' }} • Penerbit: {{ book.penerbit || 'Pustaka STAH' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="text-emerald-700 text-xs font-semibold">Tersedia</span>
              </div>
              <div class="flex items-center gap-2">
                <NuxtLink :to="getBookUrl(book)" class="px-4 py-2 border border-primary text-primary rounded-lg text-xs font-semibold hover:bg-primary-fixed">
                  Detail
                </NuxtLink>
                <NuxtLink :to="getBookUrl(book)" class="px-4 py-2 bg-secondary text-white rounded-lg text-xs font-semibold hover:opacity-90">
                  Pinjam
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More / Pagination -->
        <div v-if="filteredBooks.length > itemsPerPage" class="flex flex-col items-center gap-4 py-8 border-t border-outline-variant">
          <p class="text-on-surface-variant text-caption font-caption italic">
            Menampilkan {{ Math.min(displayedCount, filteredBooks.length) }} dari {{ filteredBooks.length }} buku
          </p>
          <button 
            v-if="displayedCount < filteredBooks.length"
            class="bg-white border-2 border-primary text-primary px-8 py-3 rounded-full font-label-md text-label-md hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm cursor-pointer"
            @click="loadMore"
          >
            <span class="material-symbols-outlined">expand_more</span>
            <span>Muat Lebih Banyak</span>
          </button>
        </div>

        <!-- Mobile Filter Sheet / Modal -->
        <div v-if="showMobileFilterModal" class="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 md:hidden" @click.self="showMobileFilterModal = false">
          <div class="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-outline-variant max-h-[85vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4 pb-3 border-b border-outline-variant">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-xl">tune</span>
                <h3 class="font-bold text-base text-primary">Filter Katalog Buku</h3>
              </div>
              <button @click="showMobileFilterModal = false" class="p-1 text-on-surface-variant hover:text-primary">
                <span class="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <!-- Filter options inside modal -->
            <div class="space-y-6 text-xs">
              <!-- Categories -->
              <div>
                <p class="font-bold text-primary mb-2 uppercase text-[11px] tracking-wider text-outline">Kategori Pustaka</p>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    class="p-2.5 rounded-xl text-left border text-xs transition-all flex justify-between items-center"
                    :class="selectedCategory === 'all' ? 'bg-primary text-white border-primary font-bold' : 'border-outline-variant text-on-surface hover:bg-surface-container-low'"
                    @click="selectedCategory = 'all'"
                  >
                    <span>Semua Buku</span>
                    <span class="text-[10px] opacity-80">{{ books.length }}</span>
                  </button>
                  <button 
                    v-for="cat in categories" 
                    :key="cat.id" 
                    class="p-2.5 rounded-xl text-left border text-xs transition-all flex justify-between items-center truncate"
                    :class="selectedCategory === cat.nama_kategori ? 'bg-primary text-white border-primary font-bold' : 'border-outline-variant text-on-surface hover:bg-surface-container-low'"
                    @click="selectedCategory = cat.nama_kategori"
                  >
                    <span class="truncate pr-1">{{ cat.nama_kategori }}</span>
                    <span class="text-[10px] opacity-80 shrink-0">{{ cat.books_count ?? 0 }}</span>
                  </button>
                </div>
              </div>

              <!-- Status Availability -->
              <div>
                <p class="font-bold text-primary mb-2 uppercase text-[11px] tracking-wider text-outline">Status Ketersediaan</p>
                <div class="grid grid-cols-2 gap-2">
                  <button 
                    class="p-2.5 rounded-xl text-left border text-xs transition-all flex items-center gap-2"
                    :class="statusFilter === 'all' ? 'bg-primary-fixed text-primary border-primary font-bold' : 'border-outline-variant text-on-surface hover:bg-surface-container-low'"
                    @click="statusFilter = 'all'"
                  >
                    <span class="material-symbols-outlined text-base">apps</span>
                    <span>Semua Status</span>
                  </button>
                  <button 
                    class="p-2.5 rounded-xl text-left border text-xs transition-all flex items-center gap-2"
                    :class="statusFilter === 'available' ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold' : 'border-outline-variant text-on-surface hover:bg-surface-container-low'"
                    @click="statusFilter = 'available'"
                  >
                    <span class="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                    <span>Tersedia</span>
                  </button>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center gap-3 pt-6 mt-6 border-t border-outline-variant">
              <button @click="resetFilters" class="px-4 py-2.5 border border-outline-variant text-on-surface-variant rounded-xl font-bold hover:bg-surface-container transition-colors">
                Reset
              </button>
              <button @click="showMobileFilterModal = false" class="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-container transition-colors">
                Terapkan Filter
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  usePustakaApi, 
  type Book, 
  type Category 
} from '../../composables/usePustakaApi';

const { getBooks, getCategories } = usePustakaApi();

const loading = ref(true);
const searchQuery = ref('');
const selectedCategory = ref('all');
const statusFilter = ref('all');
const viewMode = ref<'grid' | 'list'>('grid');
const showMobileFilterModal = ref(false);

const books = ref<Book[]>([]);
const categories = ref<Category[]>([]);
const bookmarkedIds = ref<Set<number>>(new Set());

const itemsPerPage = 8;
const displayedCount = ref(8);

const fallbackCovers = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBjq6J4ANKae7qsrtkuWYh2IKfolYdhdRZM2TNI8F_xfMmUy3GBNd_0lext2akY1DDQ-kI-MJSyq4i31ZLyKVJI5XFSESV6cHMr_388ebfR_LGzALybl-8R9nX2Nv2lVRN0jH5rOB6rB4RxN64zomhvv-ZvrVC3vpOOOKYyj_SposBs3k-n2AQqrjNdR8dMAqTChCdVpQ060FAavRTfCkWDIIgpXq02Vdd8ne-WzV9CGwL6DLoUheaybw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAElf4lHvPyHKSARy1FI7JoX9nUlPGcOS2dNvbSdwMaxPWRcWryz8T3KKJpzuyMG6jrTyAZ-y-SmkYHYyihTBnpiXp0S8wyZVFfYqDpT_L90rKfO7g6IXtk2VZf8SMkaHsPCcUrlvyFPiOzP3FtnygFchRAhojFKZe83RwiQYFj51Ev5V519G57hqPy31CU18xmPrlbxkcX5ezwau29gy9mBkPlaqGHV16PUX3-JX6TcO4JAvDDp97N5g',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCcT8QugJ0fdCpEvQJ_O7fef3ejlWyO3QKD18BrYf_tTxChyP-HaPX9qIdyMsNxjPUcoWvAWRMPcflN-ZE3l6MlYpxSHM6lY148obzhfOD5Z0dEayFicVHw4R_A0w00MolYHCjZFHtONz8CEUF-Imv7OY5gKCT3QQsj2zjuVm2AocdoX_tD2pvxx8c_icEAXEGWKjJhdESVU-psGL9QzdouJsYJ0ItkdMfktdm8Hqa6XuL86NbWyQnXKw',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAtxh2Tjw2Jcky-k9qbAni-am-iauV-krkGreT9NGiDa84AIQi4Y1tTI08mH4mNQc8yT0qt6z2xCCJxZnQZ88W5v6bW5jrClYo8zIDMZl-UWmh9w0ZC_xbUa3gfTHE05SDMD_mh0lNyGtPTJ9KLLQ1puJHuGcwaDMTezYU1a_DwVqV03FoLTZ2BuCFZpZS5DuhVIVEpViNlrVe4W3ilf4vkvMIyr4SUny72SV-eyYPtWzt01jD2YmZMdg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCMHvivOiQ2f9XBmkY2ZKGa2D_TFfvv2m-iIIh3LxSVGPEVcvaC43svmN7LI1BKol5vzmDjqqUAKEvOwGH19G26TT59SitmrAO5ofeFKsbr9gj-vDdcvAbD7Zt6hUjsj3wzIxDEkUNNGwcL5jL4qPwkiS4udh_wipHZCoKX1tK5sEeiEqnO8mm4DuB8ev14yj4xeZAy1sKdQXNh5cWRq-z9ram0SdQUxuNJixCH0XzHpCtkf-dW7_2LwA'
];

const getBookUrl = (b: Book) => {
  const slug = b.slug || b.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  return `/buku/${slug}-${b.id}`;
};

const repositorySearchUrl = computed(() => {
  if (searchQuery.value.trim()) {
    return `https://repository.stahdnj.ac.id/xmlui/discover?query=${encodeURIComponent(searchQuery.value)}`;
  }
  return 'https://repository.stahdnj.ac.id/xmlui/';
});

const filteredBooks = computed(() => {
  let list = books.value;

  if (selectedCategory.value !== 'all') {
    const targetCat = selectedCategory.value.toLowerCase();
    list = list.filter(b => 
      (b.kategori && typeof b.kategori === 'object' && b.kategori.nama_kategori?.toLowerCase() === targetCat) ||
      (typeof b.kategori === 'string' && (b.kategori as string).toLowerCase() === targetCat)
    );
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(b => 
      (b.judul && b.judul.toLowerCase().includes(q)) ||
      (b.penulis && b.penulis.toLowerCase().includes(q)) ||
      (b.isbn && b.isbn.toLowerCase().includes(q))
    );
  }

  return list;
});

const paginatedBooks = computed(() => {
  return filteredBooks.value.slice(0, displayedCount.value);
});

const toggleBookmark = (id: number) => {
  if (bookmarkedIds.value.has(id)) {
    bookmarkedIds.value.delete(id);
  } else {
    bookmarkedIds.value.add(id);
  }
};

const loadMore = () => {
  displayedCount.value += 8;
};

const resetFilters = () => {
  selectedCategory.value = 'all';
  searchQuery.value = '';
  statusFilter.value = 'all';
  displayedCount.value = 8;
};

const loadData = async () => {
  loading.value = true;
  try {
    const [resBooks, resCat] = await Promise.all([
      getBooks(),
      getCategories()
    ]);

    if (resBooks?.success) books.value = resBooks.data || [];
    if (resCat?.success) categories.value = resCat.data || [];
  } catch (err) {
    console.error('Error fetching catalog data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.card-elevation {
  box-shadow: 0px 4px 12px rgba(10, 58, 90, 0.05);
  border: 1px solid #E2E8F0;
  transition: all 0.3s ease;
}

.card-elevation:hover {
  box-shadow: 0px 12px 24px rgba(10, 58, 90, 0.08);
  transform: translateY(-4px);
}

.font-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400;
}
</style>
