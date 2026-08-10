import { ref, computed, onMounted, onUnmounted } from 'vue';

export const useCampusNetwork = () => {
  const isCampusNetwork = ref<boolean>(true);
  const selfBorrowTextIndex = ref<number>(0);
  
  const selfBorrowTexts = [
    'Tidak dapat diakses pinjam mandiri',
    'Gunakan Wi-Fi kampus untuk akses'
  ];

  let timer: any = null;

  const checkNetworkStatus = async () => {
    try {
      let res = await $fetch<any>('/api/pustaka/network/check').catch(() => null);
      if (!res || res.is_campus_network === undefined) {
        const config = useRuntimeConfig();
        const baseUrl = config.public.apiBaseUrl || 'https://portal-perpus.stahdnj.ac.id/api';
        res = await $fetch<any>(`${baseUrl}/network/check`).catch(() => null);
      }
      if (res && res.is_campus_network !== undefined) {
        // If explicit response from API, use it, but keep fallback true for campus domains
        if (Boolean(res.is_campus_network) === true) {
          isCampusNetwork.value = true;
        } else if (process.client) {
          const host = window.location.hostname;
          if (host.includes('stahdnj') || host.includes('192.168.') || host === 'localhost') {
            isCampusNetwork.value = true;
          } else {
            isCampusNetwork.value = false;
          }
        }
      } else {
        isCampusNetwork.value = true;
      }
    } catch (e) {
      isCampusNetwork.value = true;
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
