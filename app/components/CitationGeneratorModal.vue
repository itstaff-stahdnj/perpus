<template>
  <Teleport to="body">
    <Transition name="citation-fade">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
        @click.self="close"
      >
        <div class="w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">
                Format
              </div>
              <div>
                <h3 class="font-extrabold text-base text-slate-900 dark:text-zinc-100">Generator Sitasi & Bibliografi</h3>
                <p class="text-xs text-slate-500 dark:text-zinc-400">Kutipkan buku ini untuk tugas akhir & karya ilmiah</p>
              </div>
            </div>
            <button @click="close" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 cursor-pointer">
              ✕
            </button>
          </div>

          <!-- Format Selector Tabs -->
          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button 
              v-for="style in styleOptions" 
              :key="style.id"
              @click="activeStyle = style.id"
              class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
              :class="activeStyle === style.id ? 'bg-primary text-white dark:bg-blue-600 shadow-md' : 'bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300'"
            >
              {{ style.name }}
            </button>
          </div>

          <!-- Citation Output Box -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-zinc-300 px-1">
              <span>Hasil Format Kutipan ({{ getStyleName(activeStyle) }}):</span>
              <span v-if="copied" class="text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] flex items-center gap-1">
                ✓ Berhasil Disalin!
              </span>
            </div>

            <div class="p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl font-mono text-xs text-slate-800 dark:text-zinc-200 leading-relaxed select-all break-words relative">
              {{ generatedCitation }}
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-between gap-3 pt-2">
            <button 
              @click="copyCitation" 
              class="flex-1 py-2.5 bg-primary hover:bg-primary-container dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span class="material-symbols-outlined text-base">content_copy</span>
              <span>Salin Kutipan (1-Click Copy)</span>
            </button>

            <button 
              @click="copyBibtex" 
              class="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              title="Salin Format BibTeX untuk LaTeX / Mendeley / Zotero"
            >
              <span class="material-symbols-outlined text-base">code</span>
              <span>BibTeX</span>
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  book: any;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const activeStyle = ref('apa');
const copied = ref(false);

const styleOptions = [
  { id: 'apa', name: 'APA 7th Edition' },
  { id: 'mla', name: 'MLA 9th Edition' },
  { id: 'chicago', name: 'Chicago 17th' },
  { id: 'ieee', name: 'IEEE' },
  { id: 'harvard', name: 'Harvard' }
];

const getStyleName = (id: string) => styleOptions.find(s => s.id === id)?.name || id.toUpperCase();

const bookTitle = computed(() => props.book?.judul || props.book?.title || 'Judul Buku');
const bookAuthor = computed(() => props.book?.penulis || props.book?.author || 'Penulis');
const bookPublisher = computed(() => props.book?.penerbit || props.book?.publisher || 'STAH DNJ Press');
const bookYear = computed(() => props.book?.tahun_terbit || props.book?.tahun || new Date().getFullYear());
const bookCity = computed(() => props.book?.kota_terbit || 'Jakarta');
const bookIsbn = computed(() => props.book?.isbn || '-');
const currentUrl = computed(() => process.client ? window.location.href : 'https://perpus.stahdnj.ac.id');

const generatedCitation = computed(() => {
  const author = bookAuthor.value;
  const year = bookYear.value;
  const title = bookTitle.value;
  const publisher = bookPublisher.value;
  const city = bookCity.value;

  switch (activeStyle.value) {
    case 'apa':
      return `${author}. (${year}). ${title}. ${city}: ${publisher}.`;
    case 'mla':
      return `${author}. ${title}. ${publisher}, ${year}.`;
    case 'chicago':
      return `${author}. ${year}. ${title}. ${city}: ${publisher}.`;
    case 'ieee':
      return `[1] ${author}, "${title}," ${city}: ${publisher}, ${year}.`;
    case 'harvard':
      return `${author}, ${year}. ${title}. ${city}: ${publisher}.`;
    default:
      return `${author} (${year}). ${title}. ${publisher}.`;
  }
});

const generateBibtex = () => {
  const citeKey = (bookAuthor.value.split(' ')[0] || 'book') + bookYear.value;
  return `@book{${citeKey.toLowerCase()},\n  author = {${bookAuthor.value}},\n  title = {${bookTitle.value}},\n  publisher = {${bookPublisher.value}},\n  year = {${bookYear.value}},\n  isbn = {${bookIsbn.value}}\n}`;
};

const copyToClipboardFallback = (text: string) => {
  if (!process.client) return;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      copied.value = true;
      setTimeout(() => copied.value = false, 2000);
    }).catch(() => fallbackExecCopy(text));
  } else {
    fallbackExecCopy(text);
  }
};

const fallbackExecCopy = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.select();
  try {
    document.execCommand('copy');
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Copy fallback failed:', err);
  }
  document.body.removeChild(textArea);
};

const copyCitation = () => {
  copyToClipboardFallback(generatedCitation.value);
};

const copyBibtex = () => {
  copyToClipboardFallback(generateBibtex());
};

const close = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
.citation-fade-enter-active,
.citation-fade-leave-active {
  transition: opacity 0.2s ease;
}
.citation-fade-enter-from,
.citation-fade-leave-to {
  opacity: 0;
}
</style>
