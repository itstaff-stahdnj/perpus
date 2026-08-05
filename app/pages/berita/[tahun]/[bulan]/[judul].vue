<template>
  <div class="min-h-screen bg-background text-on-background font-body-md overflow-x-hidden">
    <main class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8">
      <!-- Breadcrumb Navigation -->
      <nav class="flex items-center gap-2 text-caption font-caption text-on-surface-variant mb-8 flex-wrap">
        <NuxtLink class="hover:text-primary transition-colors" to="/">Beranda</NuxtLink>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        <NuxtLink class="hover:text-primary transition-colors" to="/berita">Berita &amp; Pengumuman</NuxtLink>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        <span class="text-on-surface-variant">{{ monthName }} {{ yearParam }}</span>
        <span class="material-symbols-outlined text-[16px]">chevron_right</span>
        <span class="text-primary font-bold line-clamp-1 max-w-[200px]">{{ article?.title || judulParam }}</span>
      </nav>

      <!-- Loading State -->
      <div v-if="loading" class="py-24 text-center">
        <div class="inline-block w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p class="font-body-md text-on-surface-variant">Memuat berita...</p>
      </div>

      <!-- Error / Not Found State -->
      <div v-else-if="!article" class="bg-surface-container-low border border-outline-variant p-12 rounded-2xl text-center my-8">
        <span class="material-symbols-outlined text-6xl text-outline mb-4">newspaper</span>
        <h3 class="font-headline-md text-primary mb-2">Berita Tidak Ditemukan</h3>
        <p class="font-body-md text-on-surface-variant max-w-md mx-auto mb-6">
          Maaf, artikel berita atau pengumuman dengan URL tersebut tidak ditemukan.
        </p>
        <NuxtLink class="bg-primary text-white px-6 py-2.5 rounded-xl font-label-md text-sm hover:bg-primary-container transition-colors inline-block" to="/berita">
          Kembali ke Daftar Berita
        </NuxtLink>
      </div>

      <!-- Article View -->
      <div v-else class="grid grid-cols-12 gap-gutter">
        <!-- Main Content Area -->
        <article class="col-span-12 lg:col-span-8 bg-white academic-shadow rounded-xl overflow-hidden p-6 md:p-12">
          <!-- Article Header -->
          <header class="mb-10">
            <div class="flex items-center gap-3 mb-4">
              <span class="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-caption font-label-md uppercase tracking-wider">
                {{ article.category || 'Informasi' }}
              </span>
              <span class="text-on-surface-variant text-caption flex items-center gap-1">
                <span class="material-symbols-outlined text-[18px]">calendar_today</span>
                {{ article.published_at }}
              </span>
            </div>

            <h1 class="font-display-lg text-2xl md:text-display-lg text-primary mb-6 leading-tight font-extrabold">
              {{ article.title }}
            </h1>

            <div class="w-full aspect-[21/9] rounded-lg overflow-hidden bg-surface-container mb-8">
              <img class="w-full h-full object-cover" :src="article.image_url" :alt="article.title" />
            </div>
          </header>

          <!-- Content Paragraphs -->
          <div class="prose prose-lg max-w-none text-on-surface font-body-lg leading-relaxed space-y-6">
            <p class="mb-6 leading-relaxed">
              {{ article.content || article.summary }}
            </p>

            <h2 class="font-headline-lg text-headline-lg text-primary mt-10 mb-4 font-bold">
              Inovasi Layanan Digital Perpustakaan STAH DNJ
            </h2>

            <p class="mb-6">
              Dalam upaya meningkatkan layanan akademik dan aksesibilitas literasi bagi seluruh civitas akademika, Perpustakaan STAH Dharma Nusantara Jakarta mengintegrasikan sistem informasi digital modern berbasis respon cepat. Langkah strategis ini merupakan bagian dari visi jangka panjang institusi untuk memfasilitasi riset dan kebudayaan Nusantara.
            </p>

            <ul class="list-disc pl-6 mb-8 space-y-3 marker:text-secondary">
              <li><strong>Pencarian Semantik:</strong> Pengguna dapat mencari buku berdasarkan konsep dan konteks.</li>
              <li><strong>Reservasi Mandiri:</strong> Fitur booking buku secara real-time melalui aplikasi mobile maupun portal desktop.</li>
              <li><strong>Integrasi E-Journal:</strong> Akses langsung ke ribuan jurnal internasional yang telah dilanggan institusi.</li>
            </ul>

            <div class="bg-surface-container-low border-l-4 border-secondary p-6 mb-8 italic text-on-surface-variant rounded-r-lg">
              "Teknologi hanyalah alat, namun dengan alat yang tepat, kita dapat membuka pintu pengetahuan yang lebih luas bagi mahasiswa dan dosen kami." — Kepala Perpustakaan STAH DNJ.
            </div>
          </div>

          <!-- Tags & Engagement -->
          <div class="mt-12 pt-8 border-t border-outline-variant flex flex-wrap justify-between items-center gap-4">
            <div class="flex gap-2 flex-wrap">
              <span class="bg-surface-container-high px-4 py-1 rounded-full text-caption text-on-surface-variant font-label-md">#STAHDNJ</span>
              <span class="bg-surface-container-high px-4 py-1 rounded-full text-caption text-on-surface-variant font-label-md font-semibold">#PerpustakaanDigital</span>
              <span class="bg-surface-container-high px-4 py-1 rounded-full text-caption text-on-surface-variant font-label-md">#Akademik</span>
            </div>
            <div class="flex items-center gap-4">
              <button 
                class="flex items-center gap-2 transition-colors"
                :class="isLiked ? 'text-secondary font-bold' : 'text-on-surface-variant hover:text-primary'"
                @click="toggleLike"
              >
                <span class="material-symbols-outlined" :class="{ 'font-fill': isLiked }">thumb_up</span>
                <span class="text-caption">{{ likeCount }}</span>
              </button>
              <button class="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
                <span class="material-symbols-outlined">chat_bubble</span>
                <span class="text-caption">12</span>
              </button>
            </div>
          </div>
        </article>

        <!-- Side Column -->
        <aside class="col-span-12 lg:col-span-4 space-y-gutter">
          <!-- Search Box -->
          <div class="bg-white academic-shadow rounded-xl p-6 border border-outline-variant">
            <h3 class="font-headline-md text-headline-md text-primary mb-4 font-bold">Cari Berita</h3>
            <div class="relative">
              <input 
                v-model="searchQuery"
                class="w-full px-4 py-3 rounded-lg border border-outline focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none transition-all text-sm" 
                placeholder="Kata kunci berita..." 
                type="text"
                @keyup.enter="searchNews"
              />
              <button class="absolute right-3 top-1/2 -translate-y-1/2 text-primary" @click="searchNews">
                <span class="material-symbols-outlined">search</span>
              </button>
            </div>
          </div>

          <!-- Sharing Options -->
          <div class="bg-white academic-shadow rounded-xl p-6 border border-outline-variant">
            <h3 class="font-headline-md text-headline-md text-primary mb-4 font-bold">Bagikan</h3>
            <div class="flex gap-4">
              <button class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" title="Bagikan Tautan" @click="shareArticle">
                <span class="material-symbols-outlined text-[20px]">share</span>
              </button>
              <button class="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary hover:bg-primary hover:text-on-primary transition-all" title="Salin Link" @click="copyLink">
                <span class="material-symbols-outlined text-[20px]">link</span>
              </button>
            </div>
            <p v-if="copiedNotice" class="text-xs text-emerald-600 font-semibold mt-2">Tautan berhasil disalin!</p>
          </div>

          <!-- Latest News Thumbnails -->
          <div class="bg-white academic-shadow rounded-xl p-6 border border-outline-variant">
            <h3 class="font-headline-md text-headline-md text-primary mb-6 font-bold">Berita Terbaru</h3>
            <div class="space-y-6">
              <NuxtLink 
                v-for="item in latestNews" 
                :key="item.id" 
                :to="getArticleUrl(item)" 
                class="group flex gap-4 block"
              >
                <div class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
                  <img class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" :src="item.image_url" :alt="item.title" />
                </div>
                <div>
                  <h4 class="font-label-md text-on-surface line-clamp-2 group-hover:text-secondary transition-colors font-bold text-sm">
                    {{ item.title }}
                  </h4>
                  <span class="text-caption text-on-surface-variant text-xs mt-1 block">📅 {{ item.published_at }}</span>
                </div>
              </NuxtLink>
            </div>
            <NuxtLink class="w-full mt-6 py-2.5 border border-primary text-primary font-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all text-center block text-sm font-semibold" to="/berita">
              Lihat Semua Berita
            </NuxtLink>
          </div>
        </aside>
      </div>

      <!-- Related News Section -->
      <section v-if="relatedArticles.length > 0" class="mt-16 mb-20">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="font-headline-lg text-headline-lg text-primary font-bold">Berita Terkait</h2>
            <p class="text-on-surface-variant mt-2 text-sm">Mungkin Anda juga tertarik membaca ini</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <NuxtLink 
            v-for="item in relatedArticles" 
            :key="item.id" 
            :to="getArticleUrl(item)"
            class="bg-white academic-shadow academic-shadow-hover rounded-xl overflow-hidden transition-all duration-300 group cursor-pointer border border-outline-variant flex flex-col justify-between block"
          >
            <div>
              <div class="h-48 overflow-hidden bg-surface-container">
                <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" :src="item.image_url" :alt="item.title" />
              </div>
              <div class="p-6">
                <span class="text-caption font-label-md text-secondary uppercase mb-2 block font-bold text-xs">
                  {{ item.category }}
                </span>
                <h3 class="font-headline-md text-on-surface mb-3 line-clamp-2 group-hover:text-primary transition-colors font-bold text-base">
                  {{ item.title }}
                </h3>
                <p class="text-on-surface-variant text-body-md line-clamp-2 mb-4 text-xs">
                  {{ item.summary }}
                </p>
              </div>
            </div>
            <div class="px-6 pb-6 pt-0 flex items-center justify-between text-caption text-on-surface-variant text-xs">
              <span>📅 {{ item.published_at }}</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">visibility</span> 1.2k</span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePustakaApi } from '../../../../composables/usePustakaApi';

const route = useRoute();
const router = useRouter();
const { getNews, getAnnouncements } = usePustakaApi();

const loading = ref(true);
const searchQuery = ref('');
const isLiked = ref(false);
const likeCount = ref(245);
const copiedNotice = ref(false);
const allArticles = ref<any[]>([]);

const defaultImages = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA0pGbPylDCYyLWvQpOxlX3bUM1arpFHAWoa95HYuLxgvrR8SqTUz0JbnB13sInIdl_MTYiKqqvKzQVnU0jz6s8NEV3vDdPLRkX_Em79Y74eDv5ZKUYMSSqMiUm01Fn7t3BOZhAvTABCAt2_OSe279k1mQv7GOxMCgjGKbMIM0wqeQJ7CjmmBY8B6jU7Lsg_gokat6Nv1ehk6-RkChxPmYadUkgWK8lG0VydMeAkFW8aBwBff7HsOh64g',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDzOj59N0KJjsQkcZ9QExEO0mLReyEa3JwlBLKe4IkqE9ph6lRjh1IWWAL0Bgp8ZuQkrt7xrg92I06kHdj7haYcEjbHrn0mTowT4ptfccWLPnVnlFn2_2QurTYrEvhEAIYEjyVXhOrZUpb3QhUvgWGsC7O7r6Jm1RCxG_34EHLXdYhRm_PTgOW0akEOgFRHu_0OB9IaEdPhHxzCS1ZGrnXUXWkyzP3v2cv4TcDafhRTyUU6GArmttn6QA',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAeAZm1D164AmabxpX0yxBt93ZKC31n-2Z2Xto_4nla4pVJWzJf61Bk7a9gVOAlcO0PUmmSR2wh-gSU3hsg-ors0p5C7OplO-hQZrvNg3a2EN-LY0qbMxY-n0brkEKrge16z3_2BV3jdSHHSCQsuj22HZh3biVfKH61u6sfRrj_PzNsdffzMsRJJPL6IC-w7UvZobgeg9vtxi8kH736aG9VXf3NOSZ3kfkadWxrA8h1eelD-qkBJ0VYhA'
];

const monthNamesMap: Record<string, string> = {
  '01': 'Januari', '1': 'Januari',
  '02': 'Februari', '2': 'Februari',
  '03': 'Maret', '3': 'Maret',
  '04': 'April', '4': 'April',
  '05': 'Mei', '5': 'Mei',
  '06': 'Juni', '6': 'Juni',
  '07': 'Juli', '7': 'Juli',
  '08': 'Agustus', '8': 'Agustus',
  '09': 'September', '9': 'September',
  '10': 'Oktober',
  '11': 'November',
  '12': 'Desember'
};

const yearParam = computed(() => (route.params.tahun as string) || '2024');
const monthParam = computed(() => (route.params.bulan as string) || '10');
const judulParam = computed(() => (route.params.judul as string) || 'berita');
const monthName = computed(() => monthNamesMap[monthParam.value] || monthParam.value);

const slugifyTitle = (title: string, maxWords = 5) => {
  if (!title) return 'berita';
  const clean = title.toLowerCase().replace(/[^a-z0-9\s]+/g, '').trim();
  const words = clean.split(/\s+/).slice(0, maxWords).join('-');
  return words || 'berita';
};

const getArticleUrl = (item: any) => {
  let y = '2024';
  let m = '10';
  if (item.published_at_raw || item.created_at) {
    try {
      const d = new Date(item.published_at_raw || item.created_at);
      if (!isNaN(d.getTime())) {
        y = String(d.getFullYear());
        m = String(d.getMonth() + 1).padStart(2, '0');
      }
    } catch (e) {}
  }
  const slug = slugifyTitle(item.title || 'berita');
  return `/berita/${y}/${m}/${slug}`;
};

const article = computed(() => {
  if (allArticles.value.length > 0) {
    const targetSlug = judulParam.value.toLowerCase();
    const match = allArticles.value.find(a => 
      a.year === yearParam.value && 
      a.month === monthParam.value && 
      (a.slug.includes(targetSlug) || targetSlug.includes(a.slug))
    );
    if (match) return match;
    return allArticles.value[0];
  }
  return null;
});

const latestNews = computed(() => {
  return allArticles.value.slice(0, 3);
});

const relatedArticles = computed(() => {
  if (!article.value) return allArticles.value.slice(0, 3);
  return allArticles.value
    .filter(a => a.id !== article.value?.id)
    .slice(0, 3);
});

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};

const copyLink = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href);
    copiedNotice.value = true;
    setTimeout(() => { copiedNotice.value = false; }, 3000);
  }
};

const shareArticle = () => {
  copyLink();
};

const searchNews = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/berita', query: { q: searchQuery.value } });
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const [resNews, resAnn] = await Promise.all([
      getNews().catch(() => ({ success: false, data: [] })),
      getAnnouncements().catch(() => ({ success: false, data: [] }))
    ]);

    const list: any[] = [];
    if (resNews?.success && resNews.data) {
      resNews.data.forEach((n, idx) => {
        let y = '2024';
        let m = '10';
        let dateStr = '15 Oktober 2024';
        if (n.published_at || n.created_at) {
          try {
            const d = new Date(n.published_at || n.created_at || '');
            if (!isNaN(d.getTime())) {
              y = String(d.getFullYear());
              m = String(d.getMonth() + 1).padStart(2, '0');
              dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            }
          } catch (e) {}
        }
        list.push({
          id: n.id,
          title: n.title,
          slug: slugifyTitle(n.title),
          content: n.content || n.summary,
          summary: n.content || n.summary || 'Informasi resmi perpustakaan STAH DNJ.',
          category: n.category || 'Berita',
          published_at: dateStr,
          published_at_raw: n.published_at || n.created_at,
          year: y,
          month: m,
          image_url: n.thumbnail_url || defaultImages[idx % defaultImages.length]
        });
      });
    }

    if (resAnn?.success && resAnn.data) {
      resAnn.data.forEach((ann, idx) => {
        let y = '2024';
        let m = '10';
        let dateStr = '15 Oktober 2024';
        if (ann.created_at) {
          try {
            const d = new Date(ann.created_at);
            if (!isNaN(d.getTime())) {
              y = String(d.getFullYear());
              m = String(d.getMonth() + 1).padStart(2, '0');
              dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            }
          } catch (e) {}
        }
        list.push({
          id: 'ann-' + ann.id,
          title: ann.title,
          slug: slugifyTitle(ann.title),
          content: ann.content,
          summary: ann.content || 'Pengumuman resmi dari perpustakaan STAH DNJ.',
          category: 'Pengumuman',
          published_at: dateStr,
          published_at_raw: ann.created_at,
          year: y,
          month: m,
          image_url: defaultImages[(idx + 1) % defaultImages.length]
        });
      });
    }

    allArticles.value = list;
  } catch (err) {
    console.error('Error loading news article:', err);
  } finally {
    loading.value = false;
  }
};

watch([() => route.params.tahun, () => route.params.bulan, () => route.params.judul], () => {
  loadData();
});

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.academic-shadow {
  box-shadow: 0px 4px 12px rgba(10, 58, 90, 0.05);
}

.academic-shadow-hover:hover {
  box-shadow: 0px 12px 24px rgba(10, 58, 90, 0.08);
}

.font-fill {
  font-variation-settings: 'FILL' 1, 'wght' 400;
}
</style>
