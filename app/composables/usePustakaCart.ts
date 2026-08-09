import { ref, computed } from 'vue';
import type { Book } from './usePustakaApi';

const cart = ref<Book[]>([]);

export const usePustakaCart = () => {
  const isInCart = (bookId: number | string) => {
    return cart.value.some(b => String(b.id) === String(bookId));
  };

  const addToCart = (book: Book) => {
    if (!isInCart(book.id)) {
      cart.value.push(book);
      if (process.client) {
        localStorage.setItem('perpus_cart_books', JSON.stringify(cart.value));
      }
    }
  };

  const removeFromCart = (bookId: number | string) => {
    cart.value = cart.value.filter(b => String(b.id) !== String(bookId));
    if (process.client) {
      localStorage.setItem('perpus_cart_books', JSON.stringify(cart.value));
    }
  };

  const toggleCart = (book: Book) => {
    if (isInCart(book.id)) {
      removeFromCart(book.id);
      return false;
    } else {
      addToCart(book);
      return true;
    }
  };

  const clearCart = () => {
    cart.value = [];
    if (process.client) {
      localStorage.removeItem('perpus_cart_books');
    }
  };

  const loadCartFromStorage = () => {
    if (process.client) {
      try {
        const saved = localStorage.getItem('perpus_cart_books');
        if (saved) {
          cart.value = JSON.parse(saved);
        }
      } catch (e) {}
    }
  };

  const cartCount = computed(() => cart.value.length);

  return {
    cart,
    cartCount,
    isInCart,
    addToCart,
    removeFromCart,
    toggleCart,
    clearCart,
    loadCartFromStorage
  };
};
