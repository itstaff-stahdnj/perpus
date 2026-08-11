import type { Book } from './usePustakaApi';

export const useBookCover = () => {
  const fallbackCover = `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400" fill="none"><rect width="300" height="400" fill="#0f172a"/><rect x="15" y="15" width="270" height="370" rx="12" fill="#1e293b" stroke="#334155" stroke-width="2"/><path d="M150 140 C130 130 90 130 70 140 V240 C90 230 130 230 150 240 C170 230 210 230 230 240 V140 C210 130 170 130 150 140 Z" fill="#475569"/><path d="M150 140 V240" stroke="#1e293b" stroke-width="3"/><text x="150" y="285" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94a3b8" text-anchor="middle">E-Book Digital</text></svg>')}`;

  const isEbookBook = (b: Book | any): boolean => {
    if (!b) return false;
    if (b.is_ebook || b.is_digital || b.tipe_koleksi === 'digital') return true;
    const catObj = b.category || b.kategori;
    let catName = '';
    if (catObj && typeof catObj === 'object') {
      catName = catObj.nama_kategori || catObj.name || '';
    } else if (typeof catObj === 'string') {
      catName = catObj;
    }
    return /e-?book|digital|elektronik/i.test(catName);
  };

  const getBookCoverUrl = (b: Book | any): string => {
    if (!b) return fallbackCover;

    const cover = b.cover_image || b.cover_image_url || b.cover;
    if (cover && typeof cover === 'string' && cover.trim() !== '') {
      if (cover.startsWith('http://') || cover.startsWith('https://') || cover.startsWith('data:')) {
        return cover;
      }
      const cleanPath = cover.replace(/^\/?(storage\/)?/, '');
      return `https://portal-perpus.stahdnj.ac.id/storage/${cleanPath}`;
    }

    // If PDF file exists (E-Book Digital), fallback to Google Docs viewer pagenumber 1 cover image
    const pdfUrl = b.pdf_file || b.file_pdf || b.pdf_url || b.ebook_url || b.link_baca;
    if (pdfUrl && typeof pdfUrl === 'string' && pdfUrl.trim() !== '') {
      let fullPdfUrl = pdfUrl;
      if (!pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
        const cleanPdfPath = pdfUrl.replace(/^\/?(storage\/)?/, '');
        fullPdfUrl = `https://portal-perpus.stahdnj.ac.id/storage/${cleanPdfPath}`;
      }
      return `https://docs.google.com/viewer?url=${encodeURIComponent(fullPdfUrl)}&a=bi&pagenumber=1&w=600`;
    }

    return fallbackCover;
  };

  const handleImageError = (event: Event, book?: Book | any) => {
    const img = event.target as HTMLImageElement;
    if (!img) return;

    if (book) {
      const pdfUrl = book.pdf_file || book.file_pdf || book.pdf_url || book.ebook_url || book.link_baca;
      if (pdfUrl && !img.dataset.pdfTried) {
        img.dataset.pdfTried = 'true';
        let fullPdfUrl = pdfUrl;
        if (typeof pdfUrl === 'string' && !pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://')) {
          const cleanPdfPath = pdfUrl.replace(/^\/?(storage\/)?/, '');
          fullPdfUrl = `https://portal-perpus.stahdnj.ac.id/storage/${cleanPdfPath}`;
        }
        img.src = `https://docs.google.com/viewer?url=${encodeURIComponent(fullPdfUrl)}&a=bi&pagenumber=1&w=600`;
        return;
      }
    }

    img.src = fallbackCover;
  };

  return {
    fallbackCover,
    isEbookBook,
    getBookCoverUrl,
    handleImageError
  };
};
