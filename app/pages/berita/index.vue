<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
    <!-- Main Container -->
    <main class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex-1 w-full pt-4 md:pt-6">
      <!-- Page Header -->
      <header class="mb-10 sm:mb-12">
        <div class="flex items-center gap-2 mb-2">
          <h1 class="font-display-lg text-2xl sm:text-3xl md:text-display-lg text-primary font-bold">Berita &amp; Pengumuman</h1>
          <span class="bg-secondary/10 text-secondary text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 border border-secondary/20">
            <span class="material-symbols-outlined text-sm">rss_feed</span>
            <span>Live RSS STAH DNJ</span>
          </span>
        </div>
        <p class="font-body-lg text-xs sm:text-sm md:text-body-lg text-on-surface-variant max-w-2xl">
          Informasi terkini mengenai layanan, kegiatan, dan pembaruan dari Sekolah Tinggi Agama Hindu Dharma Nusantara Jakarta &amp; Perpustakaan.
        </p>
      </header>

      <!-- Featured News Section -->
      <section v-if="featuredItem" class="mb-10 md:mb-16">
        <div class="floating-card rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0 md:min-h-[440px]">
          <div class="md:col-span-7 relative">
            <div 
              class="w-full h-full bg-cover bg-center min-h-[220px] sm:min-h-[300px]" 
              :style="{ backgroundImage: `url('${featuredItem.image_url || noImagePlaceholder}')` }"
            ></div>
            <div class="absolute top-4 left-4 sm:top-6 sm:left-6 flex gap-2">
              <span class="bg-secondary text-white px-3 sm:px-4 py-1 rounded-full font-bold text-xs shadow-sm flex items-center gap-1">
                <span v-if="featuredItem.is_rss" class="material-symbols-outlined text-xs">rss_feed</span>
                <span>{{ featuredItem.category }}</span>
              </span>
              <span class="bg-primary/90 backdrop-blur-sm text-white px-3 sm:px-4 py-1 rounded-full font-bold text-xs shadow-sm">
                Berita Utama
              </span>
            </div>
          </div>

          <div class="md:col-span-5 p-6 sm:p-10 flex flex-col justify-center">
            <span class="text-on-surface-variant text-xs mb-3 flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px]">calendar_today</span> {{ featuredItem.published_at }}
            </span>
            <h2 class="text-xl sm:text-2xl font-bold text-primary mb-4 leading-tight">
              {{ featuredItem.title }}
            </h2>
            <p class="text-xs sm:text-sm text-on-surface-variant mb-6 sm:mb-8 leading-relaxed line-clamp-3 sm:line-clamp-4">
              {{ featuredItem.content || featuredItem.summary }}
            </p>
            
            <a 
              v-if="featuredItem.is_rss" 
              :href="featuredItem.link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="flex items-center gap-2 text-secondary font-bold text-xs sm:text-sm group w-fit hover:underline"
            >
              <span>Baca Selengkapnya di Website Utama STAH</span>
              <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">open_in_new</span>
            </a>
            <NuxtLink 
              v-else 
              :to="getArticleUrl(featuredItem)" 
              class="flex items-center gap-2 text-secondary font-bold text-xs sm:text-sm group w-fit hover:underline"
            >
              <span>Baca Selengkapnya</span>
              <span class="material-symbols-outlined text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Filter Bar & Search -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8 border-b border-outline-variant pb-6">
        <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 max-w-full">
          <button 
            v-for="cat in filterCategories" 
            :key="cat" 
            class="px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
            :class="activeFilter === cat ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed'"
            @click="activeFilter = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div class="relative flex-1 sm:flex-initial">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-60 outline-none" 
              placeholder="Cari berita..." 
            />
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-16 text-center">
        <div class="inline-block w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p class="text-sm text-on-surface-variant">Memuat data berita dari https://stahdnj.ac.id/...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredGridItems.length === 0" class="bg-surface-container-low border border-outline-variant p-8 sm:p-12 rounded-2xl text-center my-6">
        <span class="material-symbols-outlined text-5xl text-outline mb-3">newspaper</span>
        <h3 class="text-lg font-bold text-primary mb-2">Berita Tidak Ditemukan</h3>
        <p class="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto mb-6">
          Tidak ada berita atau pengumuman yang sesuai dengan filter atau pencarian "{{ searchQuery }}".
        </p>
        <button class="bg-primary text-white px-6 py-2.5 rounded-xl text-xs font-semibold cursor-pointer" @click="resetFilters">
          Tampilkan Semua Konten
        </button>
      </div>

      <!-- News & Announcements Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <article 
          v-for="item in filteredGridItems" 
          :key="item.id" 
          class="floating-card rounded-2xl overflow-hidden flex flex-col justify-between"
        >
          <div>
            <component 
              :is="item.is_rss ? 'a' : 'NuxtLink'"
              :href="item.is_rss ? item.link : undefined"
              :to="!item.is_rss ? getArticleUrl(item) : undefined"
              :target="item.is_rss ? '_blank' : undefined"
              rel="noopener noreferrer"
              class="h-48 sm:h-52 relative bg-surface-container-high block overflow-hidden group cursor-pointer flex items-center justify-center"
            >
              <img 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                :src="item.image_url || noImagePlaceholder" 
                :alt="item.title" 
                @error="handleImgError"
              />
              <span 
                class="absolute top-3 left-3 text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-sm"
                :class="item.type === 'pengumuman' ? 'bg-amber-600' : 'bg-secondary'"
              >
                <span v-if="item.is_rss" class="material-symbols-outlined text-xs">rss_feed</span>
                <span>{{ item.category }}</span>
              </span>
            </component>

            <div class="p-5 sm:p-6">
              <span class="text-on-surface-variant text-xs mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">calendar_today</span> {{ item.published_at }} • {{ item.author }}
              </span>
              <component 
                :is="item.is_rss ? 'a' : 'NuxtLink'"
                :href="item.is_rss ? item.link : undefined"
                :to="!item.is_rss ? getArticleUrl(item) : undefined"
                :target="item.is_rss ? '_blank' : undefined"
                rel="noopener noreferrer"
                class="font-bold text-sm sm:text-base text-primary mb-2 line-clamp-2 block hover:text-secondary transition-colors leading-snug"
              >
                {{ item.title }}
              </component>
              <p class="text-xs sm:text-sm text-on-surface-variant line-clamp-3 leading-relaxed">
                {{ item.summary }}
              </p>
            </div>
          </div>

          <div class="p-5 sm:p-6 pt-0 flex justify-between items-center border-t border-outline-variant/30 mt-4">
            <a 
              v-if="item.is_rss" 
              :href="item.link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-secondary font-bold text-xs hover:underline flex items-center gap-1"
            >
              <span>Baca di stahdnj.ac.id</span>
              <span class="material-symbols-outlined text-xs">open_in_new</span>
            </a>
            <NuxtLink 
              v-else 
              :to="getArticleUrl(item)" 
              class="text-secondary font-bold text-xs hover:underline"
            >
              Baca Selengkapnya
            </NuxtLink>

            <a :href="item.link || '#'" target="_blank" class="text-on-surface-variant hover:text-primary" title="Buka Sumber">
              <span class="material-symbols-outlined text-base">share</span>
            </a>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  usePustakaApi, 
  type NewsItem, 
  type AnnouncementItem 
} from '../../composables/usePustakaApi';

const { getNews, getAnnouncements } = usePustakaApi();

const loading = ref(true);
const searchQuery = ref('');
const activeFilter = ref('Semua Konten');

const newsList = ref<NewsItem[]>([]);
const rssNewsList = ref<any[]>([]);
const announcementsList = ref<AnnouncementItem[]>([]);

const filterCategories = ['Semua Konten', 'Berita STAH', 'Pengumuman', 'Perpustakaan'];

const noImagePlaceholder = 'https://placehold.co/600x400/f1f5f9/475569?text=Tidak+Ada+Gambar';

const handleImgError = (e: Event) => {
  const target = e.target as HTMLImageElement;
  if (target && target.src !== noImagePlaceholder) {
    target.src = noImagePlaceholder;
  }
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
  const slug = slugifyTitle(item.title || 'berita');
  return `/berita/${year}/${month}/${slug}`;
};

const allFormattedItems = computed(() => {
  const list: any[] = [];

  // 1. Add RSS Items from https://stahdnj.ac.id/feed/
  rssNewsList.value.forEach((rss) => {
    list.push({
      id: rss.id,
      title: rss.title,
      content: rss.summary,
      summary: rss.summary,
      category: rss.category || 'Berita STAH',
      type: 'berita',
      published_at: rss.published_at,
      author: rss.author || 'STAH DNJ',
      image_url: rss.image_url || noImagePlaceholder,
      link: rss.link,
      is_rss: true
    });
  });

  // 2. Add local News Items (Uses item's own thumbnail if available, or noImagePlaceholder)
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

    list.push({
      id: 'news-' + item.id,
      title: item.title,
      content: item.content || item.summary,
      summary: item.content || item.summary || 'Informasi berita resmi perpustakaan STAH DNJ.',
      category: item.category || 'Perpustakaan',
      type: 'berita',
      published_at: dateStr,
      author: item.author_name || item.author?.name || 'Administrator',
      image_url: localImage || noImagePlaceholder,
      is_rss: false
    });
  });

  // 3. Add Announcement Items
  announcementsList.value.forEach((ann) => {
    let dateStr = 'Terbaru';
    if (ann.published_at || ann.created_at) {
      try {
        const d = new Date(ann.published_at || ann.created_at || '');
        dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) {
        dateStr = ann.published_at || 'Terbaru';
      }
    }
    list.push({
      id: 'ann-' + ann.id,
      title: ann.title,
      content: ann.content,
      summary: ann.content || 'Pengumuman resmi dari perpustakaan STAH DNJ.',
      category: 'Pengumuman',
      type: 'pengumuman',
      published_at: dateStr,
      author: 'Pengumuman Resmi',
      image_url: noImagePlaceholder,
      is_rss: false
    });
  });

  return list;
});

const featuredItem = computed(() => {
  return allFormattedItems.value.length > 0 ? allFormattedItems.value[0] : null;
});

const filteredGridItems = computed(() => {
  let items = allFormattedItems.value;

  if (activeFilter.value !== 'Semua Konten') {
    const targetCat = activeFilter.value.toLowerCase();
    items = items.filter(i => 
      (i.category && i.category.toLowerCase().includes(targetCat)) ||
      (i.type && i.type.toLowerCase().includes(targetCat))
    );
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    items = items.filter(i => 
      (i.title && i.title.toLowerCase().includes(q)) ||
      (i.summary && i.summary.toLowerCase().includes(q))
    );
  }

  return items;
});

const resetFilters = () => {
  activeFilter.value = 'Semua Konten';
  searchQuery.value = '';
};

const fetchRssFeed = async (): Promise<any[]> => {
  // 1. Internal server route
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
    const [resNews, rssItems, resAnn] = await Promise.all([
      getNews().catch(() => ({ success: false, data: [] })),
      fetchRssFeed(),
      getAnnouncements().catch(() => ({ success: false, data: [] }))
    ]);

    if (resNews?.success) newsList.value = resNews.data || [];
    if (Array.isArray(rssItems)) rssNewsList.value = rssItems;
    if (resAnn?.success) announcementsList.value = resAnn.data || [];
  } catch (err) {
    console.error('Error fetching Berita & Pengumuman data:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.floating-card {
  background-color: white;
  border: 1px solid #E2E8F0;
  box-shadow: 0px 4px 12px rgba(10, 58, 90, 0.05);
  transition: all 0.3s ease;
}

.floating-card:hover {
  box-shadow: 0px 12px 24px rgba(10, 58, 90, 0.08);
  transform: translateY(-4px);
}
</style>
