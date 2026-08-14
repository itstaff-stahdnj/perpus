import type { Book } from './usePustakaApi';

export function useBookRecommendations() {
  const getRecommendedBooks = (currentBook: Book | null, allBooks: Book[], limit: number = 4): Book[] => {
    if (!currentBook || !Array.isArray(allBooks) || allBooks.length === 0) {
      return [];
    }

    const currentId = currentBook.id;
    const currentCatId = currentBook.kategori_id;
    const currentCatName = typeof currentBook.category === 'object' ? currentBook.category?.nama_kategori : currentBook.category;
    const currentAuthor = (currentBook.penulis || '').toLowerCase();
    const currentDdc = String((currentBook as any).ddc || (currentBook as any).kode_ddc || '').substring(0, 1);

    const scored = allBooks
      .filter(b => b.id !== currentId)
      .map(book => {
        let score = 0;

        // Category match
        if (book.kategori_id && currentCatId && book.kategori_id === currentCatId) {
          score += 50;
        }

        const bCatName = typeof book.category === 'object' ? book.category?.nama_kategori : book.category;
        if (bCatName && currentCatName && bCatName.toLowerCase() === String(currentCatName).toLowerCase()) {
          score += 40;
        }

        // Author match
        if (book.penulis && currentAuthor && book.penulis.toLowerCase().includes(currentAuthor)) {
          score += 30;
        }

        // DDC prefix match
        const bDdc = String((book as any).ddc || (book as any).kode_ddc || '').substring(0, 1);
        if (bDdc && currentDdc && bDdc === currentDdc) {
          score += 20;
        }

        return { book, score };
      })
      .sort((a, b) => b.score - a.score);

    return scored.map(item => item.book).slice(0, limit);
  };

  return {
    getRecommendedBooks
  };
}
