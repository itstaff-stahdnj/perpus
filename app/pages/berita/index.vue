<template>
  <div class="min-h-screen bg-surface text-on-surface flex flex-col font-sans">
    <!-- Main Container -->
    <main class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 flex-1 w-full pt-4 md:pt-6">
      <!-- Page Header -->
      <header class="mb-12">
        <h1 class="font-display-lg text-display-lg text-primary mb-2">Berita &amp; Pengumuman</h1>
        <p class="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          Informasi terkini mengenai layanan, kegiatan, dan pembaruan dari Perpustakaan Sekolah Tinggi Agama Hindu Dharma Nusantara Jakarta.
        </p>
      </header>

      <!-- Featured News Section -->
      <section v-if="featuredItem" class="mb-16">
        <div class="floating-card rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[480px]">
          <div class="md:col-span-7 relative">
            <div 
              class="w-full h-full bg-cover bg-center min-h-[300px]" 
              :style="{ backgroundImage: `url('${featuredItem.image_url}')` }"
            ></div>
            <div class="absolute top-6 left-6 flex gap-2">
              <span class="bg-secondary text-on-secondary px-4 py-1 rounded-full font-label-md text-label-md">
                {{ featuredItem.category }}
              </span>
              <span class="bg-primary/80 backdrop-blur-sm text-on-primary px-4 py-1 rounded-full font-label-md text-label-md">
                Utama
              </span>
            </div>
          </div>

          <div class="md:col-span-5 p-10 flex flex-col justify-center">
            <span class="text-on-surface-variant font-label-md text-label-md mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-[18px]">calendar_today</span> {{ featuredItem.published_at }}
            </span>
            <h2 class="font-headline-lg text-headline-lg text-primary mb-6 leading-tight">
              {{ featuredItem.title }}
            </h2>
            <p class="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed line-clamp-4">
              {{ featuredItem.content || featuredItem.summary }}
            </p>
            <NuxtLink :to="getArticleUrl(featuredItem)" class="flex items-center gap-2 text-secondary font-bold font-body-md text-body-md group w-fit">
              <span>Baca Selengkapnya</span>
              <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Filter Bar & Search -->
      <div class="flex flex-wrap items-center justify-between gap-6 mb-10 border-b border-outline-variant pb-6">
        <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <button 
            v-for="cat in filterCategories" 
            :key="cat" 
            class="px-6 py-2 rounded-full font-label-md text-label-md transition-colors whitespace-nowrap"
            :class="activeFilter === cat ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed'"
            @click="activeFilter = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="flex items-center gap-4">
          <div class="relative hidden sm:block">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-full text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 outline-none" 
              placeholder="Cari berita..." 
            />
          </div>

          <span class="font-label-md text-label-md text-on-surface-variant">Urutkan:</span>
          <select v-model="sortBy" class="bg-transparent border-none font-label-md text-label-md text-primary focus:ring-0 cursor-pointer outline-none">
            <option value="terbaru">Terbaru</option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-16 text-center">
        <div class="inline-block w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p class="font-body-md text-on-surface-variant">Memuat data berita dan pengumuman...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredGridItems.length === 0" class="bg-surface-container-low border border-outline-variant p-12 rounded-2xl text-center my-8">
        <span class="material-symbols-outlined text-5xl text-outline mb-3">newspaper</span>
        <h3 class="font-headline-md text-primary mb-2">Berita Tidak Ditemukan</h3>
        <p class="font-body-md text-on-surface-variant max-w-md mx-auto mb-6">
          Tidak ada berita atau pengumuman yang sesuai dengan filter atau pencarian "{{ searchQuery }}".
        </p>
        <button class="bg-primary text-white px-6 py-2.5 rounded-xl font-label-md text-sm" @click="resetFilters">
          Tampilkan Semua Konten
        </button>
      </div>

      <!-- News & Announcements Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article 
          v-for="item in filteredGridItems" 
          :key="item.id" 
          class="floating-card rounded-xl overflow-hidden flex flex-col justify-between"
        >
          <div>
            <NuxtLink :to="getArticleUrl(item)" class="h-56 relative bg-surface-container-high block overflow-hidden group">
              <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" :src="item.image_url" :alt="item.title" />
              <span 
                class="absolute top-4 left-4 text-on-tertiary px-3 py-1 rounded-full font-label-md text-label-md"
                :class="item.type === 'pengumuman' ? 'bg-tertiary' : 'bg-secondary'"
              >
                {{ item.category }}
              </span>
            </NuxtLink>

            <div class="p-6">
              <span class="text-on-surface-variant font-caption text-caption mb-2 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">calendar_today</span> {{ item.published_at }}
              </span>
              <NuxtLink :to="getArticleUrl(item)" class="font-headline-md text-headline-md text-primary mb-3 line-clamp-2 block hover:text-secondary transition-colors">
                {{ item.title }}
              </NuxtLink>
              <p class="font-body-md text-body-md text-on-surface-variant line-clamp-3 leading-relaxed">
                {{ item.summary }}
              </p>
            </div>
          </div>

          <div class="p-6 pt-0 flex justify-between items-center border-t border-outline-variant/30 mt-4">
            <NuxtLink :to="getArticleUrl(item)" class="text-secondary font-bold font-label-md text-label-md hover:underline">
              Baca Selengkapnya
            </NuxtLink>
            <span class="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary" title="Simpan Artikel">
              bookmark_add
            </span>
          </div>
        </article>

        <!-- Bento Card: Call to Action Rubrik Literasi -->
        <div class="bg-primary rounded-xl p-8 flex flex-col justify-between text-on-primary">
          <div>
            <h3 class="font-headline-md text-headline-md mb-4">Ingin Menulis Artikel atau Opini?</h3>
            <p class="font-body-md text-body-md opacity-80 mb-6 leading-relaxed">
              Kami menerima kontribusi tulisan dari mahasiswa dan dosen untuk rubrik Literasi Perpustakaan STAH DNJ.
            </p>
          </div>
          <button class="bg-secondary text-on-secondary px-6 py-3 rounded-lg font-label-md text-label-md w-fit hover:bg-secondary-fixed-dim transition-all">
            Hubungi Redaksi
          </button>
        </div>
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
const sortBy = ref('terbaru');

const newsList = ref<NewsItem[]>([]);
const announcementsList = ref<AnnouncementItem[]>([]);

const filterCategories = ['Semua Konten', 'Berita', 'Pengumuman', 'Kegiatan', 'Inovasi'];

const defaultImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB2UFIBje5z6Zq-kzrRQDWSxo7TBSDI6KEWi2QVt3pnSuIY9FI-oeNN6_x1XdO0WM-2-lrHG7WQFP_wnMTFQoj-vW7waA9D2Utgve1dM4Fqu4FmJFtGjGNXPphk7MZlP-FlXT4Qg2SqL5W8EyeGJ5EIm3qEjf9Kt_t5mllcJlxALZWo2Kf5eoJ5RJpSNnyMQEheKQc5Z-4pVowcyPdEGX380sDZmbYdeJlxsTkLjDcm0XJvQFKfhvCLSA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCFxNTj8X6WSTwKnSMzXcBm3CsMbg9unETi9qtmzmsP-xJcndffLKeJRh1tDBnxPdLlUUMjriFQdTlc0qL7G9Mum0ArpFBjIjsDoyIt1rTUYY2wDm_mxve28YO7Jlvn2eIQcKsnd-eFxiL0F_78u5RofNy5OBJOhLSTowNmtghCIfWPSBG7JyfNWSWCuiyqRld2GVOLt0Pv7MtoLREBmX4aaen2f1qaYH3DFa1T5OYP0-Hc3VIPojUabg',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBfveIbpVIM51KOcdrNPaj3T3QhvNbbzxue2c33WWN-4Bx8w4-IdhTD5g1rjEvBViBER7P7f7ZQearqybJagWSzDcOrJFznKD8-_WnOTlVFmT9u__4qNevDIckOaeNE0gqVdFUQ62oN1JoD4xsXQrWWN1ZGcIQIC7kpvcpusUbC6jx_zwkpuElAHGSjOuaE_NsXKkN8b7wLKuQr_lgVK_FXTCVnQqJ0VtqhCl3QmfX8iohGWBH99qxStQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuB2Ktq9uDYgQY8J-FtYPoH0lf4S_B8z1HI3c9Y7eaTowpj1UHp_Oa8fGSlpSkLGaXHPXoH7iyCgAKO_17BBEJE9VNj6O-Sahg1t3wiuABV27ewbRv7h6Pqa5-lRFM8WafLX8VBoDSK5HP5BDfd8sFh2cI5KotMUE_H5w-pyjdMWB5Bcau2O0dMKiO7JvObSKc7KWKtv5Mow3XMeDvZWPeCIYnmRXwTIgNGo_wCrlhTxvIc_v8JmW3fhEw'
];

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

  newsList.value.forEach((item, idx) => {
    let dateStr = 'Terbaru';
    if (item.published_at || item.created_at) {
      try {
        const d = new Date(item.published_at || item.created_at || '');
        dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      } catch (e) {
        dateStr = item.published_at || 'Terbaru';
      }
    }
    list.push({
      id: 'news-' + item.id,
      rawId: item.id,
      title: item.title,
      content: item.content || item.summary,
      summary: item.content || item.summary || 'Informasi berita resmi perpustakaan STAH DNJ.',
      category: item.category || 'Berita',
      type: 'berita',
      published_at: dateStr,
      author: item.author_name || item.author?.name || 'Administrator Utama',
      image_url: item.thumbnail_url || defaultImages[idx % defaultImages.length]
    });
  });

  announcementsList.value.forEach((ann, idx) => {
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
      rawId: ann.id,
      title: ann.title,
      content: ann.content,
      summary: ann.content || 'Pengumuman resmi dari perpustakaan STAH DNJ.',
      category: 'Pengumuman',
      type: 'pengumuman',
      published_at: dateStr,
      author: ann.author?.name || 'Administrator Utama',
      image_url: ann.thumbnail_url || defaultImages[(idx + 2) % defaultImages.length]
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
      (i.category && i.category.toLowerCase() === targetCat) ||
      (i.type && i.type.toLowerCase() === targetCat)
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

const loadData = async () => {
  loading.value = true;
  try {
    const [resNews, resAnn] = await Promise.all([
      getNews().catch(() => ({ success: false, data: [] })),
      getAnnouncements().catch(() => ({ success: false, data: [] }))
    ]);

    if (resNews?.success) newsList.value = resNews.data || [];
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
