<template>
  <Teleport to="body">
    <Transition name="notes-fade">
      <div 
        v-if="modelValue" 
        class="fixed inset-0 z-[999999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 select-none"
        @click.self="close"
      >
        <div class="w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl space-y-5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-zinc-100">
          
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xl">
                📝
              </div>
              <div>
                <h3 class="font-extrabold text-base text-slate-900 dark:text-zinc-100">Catatan & Kutipan Pustaka Saya</h3>
                <p class="text-xs text-slate-500 dark:text-zinc-400">Simpan ringkasan & kutipan materi penting dari buku</p>
              </div>
            </div>
            <button @click="close" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 flex items-center justify-center text-slate-500 dark:text-zinc-400 cursor-pointer">
              ✕
            </button>
          </div>

          <!-- Add New Note Form -->
          <div class="space-y-3 p-4 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-2xl">
            <input 
              v-model="newNoteTitle" 
              type="text" 
              placeholder="Judul Catatan / Halaman (Contoh: Bab 2 - Veda & Filsafat)"
              class="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs outline-none focus:border-primary font-bold"
            />
            <textarea 
              v-model="newNoteContent" 
              rows="3" 
              placeholder="Tuliskan kutipan atau rangkuman materi di sini..."
              class="w-full p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs outline-none focus:border-primary"
            ></textarea>
            <button 
              @click="addNote" 
              :disabled="!newNoteTitle.trim() || !newNoteContent.trim()"
              class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              + Simpan Catatan Baru
            </button>
          </div>

          <!-- Saved Notes List -->
          <div class="max-h-60 overflow-y-auto space-y-2 pr-1">
            <p class="text-[10px] font-extrabold uppercase text-slate-400">Daftar Catatan Tersimpan ({{ notesList.length }})</p>

            <div v-if="notesList.length === 0" class="p-4 text-center text-xs text-slate-400 italic">
              Belum ada catatan tersimpan. Tambahkan catatan bacaan Anda di atas!
            </div>

            <div 
              v-for="item in notesList" 
              :key="item.id"
              class="p-3 bg-slate-50/80 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/80 rounded-2xl flex items-start justify-between gap-3 text-xs"
            >
              <div class="space-y-1 min-w-0">
                <h5 class="font-extrabold text-slate-900 dark:text-zinc-100 truncate">{{ item.title }}</h5>
                <p class="text-slate-600 dark:text-zinc-300 leading-relaxed break-words whitespace-pre-line">{{ item.content }}</p>
                <span class="text-[9px] text-slate-400 block pt-1">{{ item.date }}</span>
              </div>

              <button @click="deleteNote(item.id)" class="text-rose-500 hover:text-rose-700 p-1 cursor-pointer shrink-0" title="Hapus Catatan">
                🗑️
              </button>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex justify-end pt-1">
            <button @click="close" class="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer">
              Tutup Catatan
            </button>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
}>();

const newNoteTitle = ref('');
const newNoteContent = ref('');
const notesList = ref<any[]>([]);

const close = () => emit('update:modelValue', false);

const addNote = () => {
  if (!newNoteTitle.value.trim() || !newNoteContent.value.trim()) return;

  const note = {
    id: Date.now(),
    title: newNoteTitle.value.trim(),
    content: newNoteContent.value.trim(),
    date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  notesList.value.unshift(note);
  newNoteTitle.value = '';
  newNoteContent.value = '';
  saveToStorage();
};

const deleteNote = (id: number) => {
  notesList.value = notesList.value.filter(n => n.id !== id);
  saveToStorage();
};

const saveToStorage = () => {
  if (process.client) {
    localStorage.setItem('pustaka_reading_notes', JSON.stringify(notesList.value));
  }
};

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('pustaka_reading_notes');
    if (saved) {
      try { notesList.value = JSON.parse(saved); } catch (e) {}
    }
  }
});
</script>

<style scoped>
.notes-fade-enter-active,
.notes-fade-leave-active {
  transition: opacity 0.2s ease;
}
.notes-fade-enter-from,
.notes-fade-leave-to {
  opacity: 0;
}
</style>
