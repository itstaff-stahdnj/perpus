import { ref, computed, onMounted, onUnmounted } from 'vue';

export const useCampusNetwork = () => {
  const isCampusNetwork = ref<boolean>(false);
  const selfBorrowTextIndex = ref<number>(0);
  
  const selfBorrowTexts = [
    'Tidak dapat diakses pinjam mandiri',
    'Gunakan Wi-Fi kampus untuk akses'
  ];

  let timer: any = null;

  const checkNetworkStatus = async () => {
    try {
      const config = useRuntimeConfig();
      const baseUrl = config.public.apiBaseUrl || 'https://portal-perpus.stahdnj.ac.id/api';
      const res = await $fetch<any>(`${baseUrl}/network/check`).catch(() => null);
      if (res && res.is_campus_network !== undefined) {
        isCampusNetwork.value = Boolean(res.is_campus_network);
      }
    } catch (e) {
      isCampusNetwork.value = false;
    }
  };

  onMounted(() => {
    if (process.client) {
      checkNetworkStatus();
      timer = setInterval(() => {
        selfBorrowTextIndex.value = (selfBorrowTextIndex.value + 1) % selfBorrowTexts.length;
      }, 2500);
    }
  });

  onUnmounted(() => {
    if (timer) {
      clearInterval(timer);
    }
  });

  const currentSelfBorrowText = computed(() => {
    return selfBorrowTexts[selfBorrowTextIndex.value];
  });

  return {
    isCampusNetwork,
    checkNetworkStatus,
    currentSelfBorrowText,
    selfBorrowTexts,
    selfBorrowTextIndex
  };
};
