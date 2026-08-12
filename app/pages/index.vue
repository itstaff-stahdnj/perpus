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
          <!-- Search Category Switcher -->
          <div class="flex flex-wrap justify-center items-center gap-2 mb-4">
            <button 
              class="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              :class="searchSource === 'katalog' ? 'bg-secondary text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'"
              @click="searchSource = 'katalog'"
            >
              <span class="material-symbols-outlined text-sm">menu_book</span>
              <span>Katalog Buku</span>
            </button>
            <button 
              class="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              :class="searchSource === 'pasupati' ? 'bg-amber-500 text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'"
              @click="searchSource = 'pasupati'"
            >
              <span class="material-symbols-outlined text-sm">article</span>
              <span>📜 OJS Jurnal Pasupati</span>
            </button>
            <button 
              class="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              :class="searchSource === 'repository' ? 'bg-secondary text-white shadow-md' : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-xs'"
              @click="searchSource = 'repository'"
            >
              <span class="material-symbols-outlined text-sm">database</span>
              <span>Repository STAH</span>
            </button>
          </div>

          <!-- Search Box Input -->
          <div class="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto border border-white/20 transition-all focus-within:ring-2 focus-within:ring-secondary">
            <div class="flex-1 flex items-center gap-2.5 px-3 sm:px-4 w-full">
              <span class="material-symbols-outlined text-slate-400 shrink-0 text-xl">
                {{ searchSource === 'katalog' ? 'search' : 'travel_explore' }}
              </span>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="w-full bg-transparent border-none focus:ring-0 text-on-surface font-medium py-2 text-xs sm:text-sm outline-none placeholder:text-slate-400" 
                :placeholder="
                  searchSource === 'pasupati' ? 'Cari artikel di OJS Jurnal Pasupati STAH DNJ...' :
                  searchSource === 'repository' ? 'Cari karya ilmiah di repository.stahdnj.ac.id...' :
                  'Cari judul buku, pengarang, atau ISBN...'
                " 
                @keyup.enter="handleSearch"
              />
            </div>
            <button 
              class="bg-secondary text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-secondary/90 transition-all active:scale-95 flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0 shadow-sm cursor-pointer"
              @click="handleSearch"
            >
              <span class="material-symbols-outlined text-base sm:text-lg">
                {{ searchSource === 'katalog' ? 'search' : 'open_in_new' }}
              </span>
              <span>
                {{ 
                  searchSource === 'pasupati' ? 'Cari di OJS Pasupati' :
                  searchSource === 'repository' ? 'Cari di Repository' :
                  'Cari Koleksi' 
                }}
              </span>
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
            <p class="text-[11px] sm:text-xs text-on-surface-variant line-clamp-1">{{ books?.length || 0 }} Buku Terdaftar</p>
          </NuxtLink>

          <NuxtLink to="/buku" class="bg-white p-3.5 sm:p-5 md:p-6 rounded-2xl shadow-[0px_4px_16px_rgba(10,58,90,0.06)] border border-outline-variant/60 hover:shadow-xl transition-all group cursor-pointer block">
            <div class="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <span class="material-symbols-outlined text-2xl sm:text-3xl">category</span>
            </div>
            <h3 class="font-bold text-xs sm:text-sm md:text-base text-primary mb-0.5">Kategori Pustaka</h3>
            <p class="text-[11px] sm:text-xs text-on-surface-variant line-clamp-1">{{ categories?.length || 0 }} Kategori Aktif</p>
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
              Semua Katalog Buku <Icon name="material-symbols:arrow-forward" class="text-sm" />
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
                  @error="handleImgError" 
                />
                <img 
                  v-else 
                  class="w-full h-full object-cover" 
                  :src="fallbackCovers[index % fallbackCovers.length]" 
                  :alt="book.judul" 
                  @error="handleImgError"
                />
                <span class="absolute top-2 left-2 bg-primary/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
                  {{ book.tahun_terbit || '2021' }}
                </span>

                <!-- Tombol Favorit / Wishlist Animasi (HANYA DITAMPILKAN JIKA USER SUDAH LOGIN) -->
                <button 
                  v-if="tokenCookie"
                  @click.stop.prevent="toggleWishlist(book)"
                  class="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md flex items-center justify-center text-sm shadow-md hover:scale-125 active:scale-95 transition-all duration-300 cursor-pointer z-10"
                  :title="isWishlisted(book.id) ? 'Hapus dari favorit' : 'Tambah ke favorit'"
                >
                  <span 
                    class="transition-transform duration-300"
                    :class="isWishlisted(book.id) ? 'scale-110 animate-bounce' : 'scale-100 opacity-60 hover:opacity-100'"
                  >
                    {{ isWishlisted(book.id) ? '❤️' : '🤍' }}
                  </span>
                </button>
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
              <span class="text-secondary-fixed text-2xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">{{ realTotalBooks }}</span>
              <p class="text-xs sm:text-sm text-primary-fixed uppercase tracking-wider font-semibold">Koleksi Buku Fisik Terdata</p>
            </div>
            <div class="flex flex-col items-center border-y sm:border-y-0 sm:border-x border-primary-fixed-dim/20 py-4 sm:py-0">
              <span class="text-secondary-fixed text-2xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">{{ realTotalCategories }}</span>
              <p class="text-xs sm:text-sm text-primary-fixed uppercase tracking-wider font-semibold">Kelompok Bidang Ilmu</p>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-secondary-fixed text-2xl sm:text-4xl md:text-5xl font-extrabold mb-1 sm:mb-2">{{ realTotalMembers }}</span>
              <p class="text-xs sm:text-sm text-primary-fixed uppercase tracking-wider font-semibold">Anggota Aktif Terdaftar</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Dynamic Announcements Banner -->
      <section v-if="announcementsList && announcementsList.length > 0" class="max-w-container-max mx-auto pt-12 px-4 md:px-margin-desktop">
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

      <!-- Dynamic News Section with RSS Integration -->
      <section id="berita" class="max-w-container-max mx-auto py-12 sm:py-16 md:py-20 px-4 md:px-margin-desktop">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Berita &amp; Pengumuman</h2>
              <span class="bg-secondary/10 text-secondary text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-secondary/20">
                <span class="material-symbols-outlined text-sm">rss_feed</span>
                <span>Live Feed STAH DNJ</span>
              </span>
            </div>
            <p class="text-xs sm:text-sm text-on-surface-variant">Informasi terbaru dari Kampus STAH Dharma Nusantara Jakarta &amp; Perpustakaan.</p>
          </div>
          <NuxtLink class="text-secondary text-xs sm:text-sm flex items-center gap-1.5 hover:gap-2 transition-all font-semibold shrink-0" to="/berita">
            Lihat Semua <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </NuxtLink>
        </div>

        <!-- Empty State for News -->
        <div v-if="!displayedNews || displayedNews.length === 0" class="bg-surface-container-low border border-outline-variant p-8 sm:p-12 rounded-2xl text-center">
          <span class="material-symbols-outlined text-4xl text-outline mb-2">newspaper</span>
          <p class="text-on-surface-variant text-sm font-medium">Belum ada data berita publikasi perpustakaan.</p>
        </div>

        <!-- News Grid (Limit 6 Items max on Home Page) -->
        <div v-else>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <component 
              :is="item.is_rss ? 'a' : 'NuxtLink'"
              v-for="item in displayedNews" 
              :key="item.id" 
              :href="item.is_rss ? item.link : undefined"
              :to="!item.is_rss ? getArticleUrl(item) : undefined"
              :target="item.is_rss ? '_blank' : undefined"
              rel="noopener noreferrer"
              class="bg-white rounded-2xl overflow-hidden border border-outline-variant shadow-sm group transition-all hover:shadow-md flex flex-col justify-between block cursor-pointer"
            >
              <div>
                <div class="h-44 sm:h-52 overflow-hidden relative bg-surface-container-high flex items-center justify-center">
                  <img 
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    :src="item.image_url || noImagePlaceholder" 
                    :alt="item.title" 
                    @error="handleImgError"
                  />
                  <span class="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <span v-if="item.is_rss" class="material-symbols-outlined text-[12px]">rss_feed</span>
                    <span>{{ item.category }}</span>
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
            </component>
          </div>

          <!-- Bottom CTA Button for See All News -->
          <div class="mt-8 sm:mt-10 text-center">
            <NuxtLink to="/berita" class="inline-flex items-center gap-2 bg-primary/5 hover:bg-primary/10 text-primary border border-primary/20 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-xs hover:shadow-sm cursor-pointer">
              <span>Lihat Semua Berita &amp; Pengumuman</span>
              <span class="material-symbols-outlined text-base">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Dynamic Testimonials Section (Integrated with API) -->
      <section class="bg-surface-container-low py-12 sm:py-16 md:py-24">
        <div class="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <div class="text-center mb-8 sm:mb-12">
            <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-primary">Apa Kata Mereka?</h2>
            <p class="text-xs sm:text-sm text-on-surface-variant mt-1.5">Pengalaman mahasiswa dan sivitas akademika menggunakan layanan Perpustakaan STAH DNJ.</p>
          </div>

          <div v-if="!displayedTestimonials || displayedTestimonials.length === 0" class="bg-white p-8 rounded-3xl text-center border border-outline-variant max-w-xl mx-auto shadow-sm">
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
                    <img v-if="item.avatar_url" class="w-full h-full object-cover" :src="item.avatar_url" :alt="item.name" @error="handleImgError" />
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

const { getBooks, getCategories, getNews, getAnnouncements, getLoans, getProfile, getTestimonials, getSettings, tokenCookie, getWishlist, addToWishlist, removeFromWishlist, getUsers, getPublicStats } = usePustakaApi();

const books = ref<Book[]>([]);
const categories = ref<Category[]>([]);
const newsList = ref<NewsItem[]>([]);
const rssNewsList = ref<any[]>([]);
const announcementsList = ref<AnnouncementItem[]>([]);
const loansList = ref<any[]>([]);
const userProfile = ref<UserProfile | null>(null);
const testimonialsList = ref<TestimonialItem[]>([]);
const wishlistedIds = ref<Set<number>>(new Set());

const totalBooksCount = ref<number>(0);
const totalCategoriesCount = ref<number>(0);
const totalMembersCount = ref<number>(0);

const isWishlisted = (id: number | string): boolean => {
  return wishlistedIds.value.has(Number(id));
};

const toggleWishlist = async (b: Book) => {
  if (!tokenCookie.value) return;

  const bookId = Number(b.id);
  if (wishlistedIds.value.has(bookId)) {
    wishlistedIds.value.delete(bookId);
    if (process.client) {
      localStorage.setItem('pustaka_wishlist', JSON.stringify(Array.from(wishlistedIds.value)));
    }
    const res = await removeFromWishlist(bookId).catch(() => null);
    if (res && !res.success) {
      wishlistedIds.value.add(bookId);
      if (process.client) {
        localStorage.setItem('pustaka_wishlist', JSON.stringify(Array.from(wishlistedIds.value)));
      }
    }
  } else {
    wishlistedIds.value.add(bookId);
    if (process.client) {
      localStorage.setItem('pustaka_wishlist', JSON.stringify(Array.from(wishlistedIds.value)));
    }
    const res = await addToWishlist(bookId).catch(() => null);
    if (res && !res.success) {
      wishlistedIds.value.delete(bookId);
      if (process.client) {
        localStorage.setItem('pustaka_wishlist', JSON.stringify(Array.from(wishlistedIds.value)));
      }
    }
  }
};

const loadWishlistData = async () => {
  // 1. Instant local restore
  if (process.client) {
    try {
      const saved = localStorage.getItem('pustaka_wishlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          wishlistedIds.value = new Set(parsed.map((id: any) => Number(id)));
        }
      }
    } catch (e) {}
  }

  // 2. Fetch from backend API
  if (!tokenCookie.value) return;
  try {
    const res = await getWishlist();
    if (res?.data && Array.isArray(res.data)) {
      const ids = res.data.map((w: any) => Number(w.book_id || w.id)).filter(Boolean);
      if (ids.length > 0) {
        wishlistedIds.value = new Set(ids);
        if (process.client) {
          localStorage.setItem('pustaka_wishlist', JSON.stringify(ids));
        }
      }
    }
  } catch (e) {}
};

const loading = ref(true);
const searchQuery = ref('');
const searchSource = ref<'katalog' | 'pasupati' | 'repository'>('katalog');

const noImagePlaceholder = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400" fill="none"><rect width="300" height="400" fill="#0f172a"/><rect x="15" y="15" width="270" height="370" rx="12" fill="#1e293b" stroke="#334155" stroke-width="2"/><path d="M150 140 C130 130 90 130 70 140 V240 C90 230 130 230 150 240 C170 230 210 230 230 240 V140 C210 130 170 130 150 140 Z" fill="#475569"/><path d="M150 140 V240" stroke="#1e293b" stroke-width="3"/><text x="150" y="285" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94a3b8" text-anchor="middle">Tidak Ada Cover</text></svg>')}`;

const fallbackCovers = [
  noImagePlaceholder
];

const slugifyBookTitle = (text: string): string => {
  return (text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const getBookUrl = (b: Book) => {
  const titleSlug = slugifyBookTitle(b.judul);
  return `/buku/${titleSlug}-${b.id}`;
};

const getCategoryCount = (cat: Category): number => {
  if (!cat || !books.value || !Array.isArray(books.value) || books.value.length === 0) {
    return cat?.books_count ?? 0;
  }
  const count = books.value.filter(b => {
    if (!b) return false;
    const catObj = b.category || b.kategori;
    if (!catObj) return false;
    if (typeof catObj === 'object') {
      const catName = cat.nama_kategori || (cat as any).nama || '';
      const catObjName = catObj.nama_kategori || (catObj as any).nama || '';
      return (catObj.id && cat.id && catObj.id === cat.id) ||
        (catName && catObjName && catObjName.toLowerCase() === catName.toLowerCase()) ||
        (cat.slug && catObj.slug && catObj.slug.toLowerCase() === cat.slug.toLowerCase());
    }
    if (typeof catObj === 'string' && cat.nama_kategori) {
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

const realTotalBooks = computed(() => {
  const count = totalBooksCount.value || books.value?.length || 0;
  return count > 0 ? `${count} Total` : '0 Total';
});

const realTotalCategories = computed(() => {
  const count = totalCategoriesCount.value || categories.value?.length || 0;
  return count > 0 ? `${count} Kategori` : '0 Kategori';
});

const realTotalMembers = computed(() => {
  if (totalMembersCount.value > 0) {
    return `${totalMembersCount.value} Anggota`;
  }
  
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
  const combined: any[] = [];

  // 1. Add RSS feed items from https://stahdnj.ac.id/feed/ or WP-JSON
  if (rssNewsList.value && rssNewsList.value.length > 0) {
    rssNewsList.value.forEach((rss) => {
      combined.push({
        id: rss.id,
        title: rss.title,
        summary: rss.summary || 'Berita resmi dari kampus STAH Dharma Nusantara Jakarta.',
        category: rss.category || 'Berita STAH',
        published_at: rss.published_at,
        author: rss.author || 'STAH DNJ',
        image_url: rss.image_url || noImagePlaceholder,
        link: rss.link,
        is_rss: true
      });
    });
  }

  // 2. Add local library news (Uses item's own thumbnail, or noImagePlaceholder if unavailable)
  newsList.value.forEach((item) => {
    let dateStr = 'Terbaru';
    if (item.published_at || item.created_at) {
      try {
        const d = new Date(item.published_at || item.created_at || '');
        dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) {
        dateStr = item.published_at || 'Terbaru';
      }
    }

    const localImage = item.thumbnail_url || (item as any).image_url || (item as any).thumbnail || (item as any).cover || null;

    combined.push({
      id: item.id,
      title: item.title,
      summary: item.content || item.summary || 'Informasi resmi dari perpustakaan STAH DNJ.',
      category: item.category || 'Perpustakaan',
      published_at: dateStr,
      author: item.author_name || item.author?.name || 'Administrator',
      image_url: localImage || noImagePlaceholder,
      is_rss: false
    });
  });

  // Limit to maximum 6 items on home page
  return combined.slice(0, 6);
});

const filteredBooks = computed(() => {
  const list = Array.isArray(books.value) ? books.value : [];
  if (!searchQuery.value.trim()) return list.slice(0, 6);
  const q = searchQuery.value.toLowerCase();
  return list.filter(b => 
    (b?.judul && b.judul.toLowerCase().includes(q)) ||
    (b?.penulis && b.penulis.toLowerCase().includes(q)) ||
    (b?.isbn && b.isbn.toLowerCase().includes(q))
  ).slice(0, 6);
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

const fetchRssFeed = async (): Promise<any[]> => {
  // 1. Internal server route (uses WP-JSON with _embed for full image URLs!)
  try {
    const res: any = await $fetch('/api/rss');
    if (res?.success && Array.isArray(res.data) && res.data.length > 0) {
      return res.data;
    }
  } catch (e) {}

  // 2. Direct WP-JSON fetch for featured image thumbnails
  try {
    const posts: any[] = await $fetch('https://stahdnj.ac.id/wp-json/wp/v2/posts?_embed&per_page=10');
    if (Array.isArray(posts) && posts.length > 0) {
      return posts.map((p, i) => {
        const title = (p.title?.rendered || '')
          .replace(/&#8220;/g, '“')
          .replace(/&#8221;/g, '”')
          .replace(/&#8217;/g, '’')
          .replace(/&#8211;/g, '–');

        let rawExcerpt = p.excerpt?.rendered || p.content?.rendered || '';
        let cleanSummary = rawExcerpt
          .replace(/<[^>]+>/g, '')
          .replace(/&#8220;/g, '“')
          .replace(/&#8221;/g, '”')
          .replace(/&#8217;/g, '’')
          .replace(/&#8211;/g, '–')
          .replace(/\[&#8230;\]|\[\.\.\.\]/g, '...')
          .trim();

        const featMedia = p._embedded?.['wp:featuredmedia']?.[0];
        const imageUrl = featMedia?.source_url || 
                         featMedia?.media_details?.sizes?.medium_large?.source_url ||
                         featMedia?.media_details?.sizes?.medium?.source_url ||
                         noImagePlaceholder;

        const categoryObj = p._embedded?.['wp:term']?.[0]?.[0];
        const category = categoryObj?.name || 'Berita STAH';

        let formattedDate = p.date;
        try {
          const d = new Date(p.date);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          }
        } catch (e) {}

        return {
          id: `wp-${p.id || i+1}`,
          title,
          link: p.link,
          summary: cleanSummary,
          category,
          published_at: formattedDate,
          author: 'Humas STAH DNJ',
          image_url: imageUrl,
          is_rss: true
        };
      });
    }
  } catch (e) {}

  // 3. Fallback to rss2json
  try {
    const res: any = await $fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fstahdnj.ac.id%2Ffeed%2F');
    if (res?.status === 'ok' && Array.isArray(res.items)) {
      return res.items.map((item: any, i: number) => {
        let formattedDate = item.pubDate;
        try {
          const d = new Date(item.pubDate);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          }
        } catch (e) {}

        const cleanSummary = (item.description || item.content || '')
          .replace(/<[^>]+>/g, '')
          .replace(/&#8220;/g, '“')
          .replace(/&#8221;/g, '”')
          .replace(/&#8217;/g, '’')
          .replace(/\[&#8230;\]|\[\.\.\.\]/g, '...')
          .trim();

        return {
          id: `rss-${i+1}`,
          title: item.title,
          link: item.link,
          summary: cleanSummary,
          category: (item.categories && item.categories[0]) || 'Berita STAH',
          published_at: formattedDate,
          author: item.author || 'STAH DNJ',
          image_url: item.thumbnail || noImagePlaceholder,
          is_rss: true
        };
      });
    }
  } catch (e) {}

  return [];
};

const loadData = async () => {
  loading.value = true;
  try {
    const [resBooks, resCat, resNews, rssItems, resAnnouncements, resLoans, resProfile, resTestimonials, resSettings, resUsers, resPublicStats] = await Promise.all([
      getBooks({ per_page: 1000 }),
      getCategories(),
      getNews().catch(() => ({ success: false, data: [] })),
      fetchRssFeed(),
      getAnnouncements().catch(() => ({ success: false, data: [] })),
      getLoans().catch(() => ({ success: false, data: [] })),
      getProfile().catch(() => ({ success: false, data: null })),
      getTestimonials().catch(() => ({ success: false, data: [] })),
      getSettings().catch(() => ({ success: false, data: null as any })),
      getUsers({ per_page: 1000 }).catch(() => ({ success: false, data: [] })),
      getPublicStats().catch(() => ({ success: false, data: {} }))
    ]);

    if (resPublicStats?.data) {
      if (resPublicStats.data.total_books) totalBooksCount.value = Number(resPublicStats.data.total_books);
      if (resPublicStats.data.total_categories) totalCategoriesCount.value = Number(resPublicStats.data.total_categories);
      if (resPublicStats.data.total_members) totalMembersCount.value = Number(resPublicStats.data.total_members);
    }

    if (resBooks?.meta?.total) {
      totalBooksCount.value = Number(resBooks.meta.total);
    } else if (resBooks?.data && Array.isArray(resBooks.data)) {
      totalBooksCount.value = resBooks.data.length;
    }

    if (resCat?.meta?.total) {
      totalCategoriesCount.value = Number(resCat.meta.total);
    } else if (resCat?.data && Array.isArray(resCat.data) && resCat.data.length > 0) {
      totalCategoriesCount.value = resCat.data.length;
    }

    if (resUsers?.meta?.total) {
      totalMembersCount.value = Number(resUsers.meta.total);
    } else if (resUsers?.data && Array.isArray(resUsers.data) && resUsers.data.length > 0) {
      totalMembersCount.value = resUsers.data.length;
    }

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

    if ((categories.value?.length || 0) === 0 && (books.value?.length || 0) > 0) {
      categories.value = deriveCategoriesFromBooks(books.value);
    }

    if (resNews?.success) newsList.value = resNews.data || [];
    if (Array.isArray(rssItems)) rssNewsList.value = rssItems;
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
  loadWishlistData();
});
</script>

<style scoped>
.font-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400;
}
</style>
