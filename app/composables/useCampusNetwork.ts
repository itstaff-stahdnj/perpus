import { ref, computed, onMounted, onUnmounted } from 'vue';

export const useCampusNetwork = () => {
  const isCampusNetwork = ref<boolean>(false);
  const selfBorrowTextIndex = ref<number>(0);
  
  const selfBorrowTexts = [
    'Tidak dapat diakses pinjam mandiri',
    'Gunakan Wi-Fi kampus untuk akses'
  ];

  let timer: any = null;

  const getLocalIpAddress = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!process.client || typeof window === 'undefined' || !(window as any).RTCPeerConnection) {
        return resolve(null);
      }
      try {
        const rtc = new (window as any).RTCPeerConnection({ iceServers: [] });
        rtc.createDataChannel('');
        rtc.createOffer().then((offer: any) => rtc.setLocalDescription(offer)).catch(() => {});
        
        let resolved = false;
        rtc.onicecandidate = (event: any) => {
          if (!event || !event.candidate || !event.candidate.candidate) {
            if (!resolved) resolve(null);
            return;
          }
          const candidate = event.candidate.candidate;
          const ipMatch = candidate.match(/([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})/);
          if (ipMatch) {
            const ip = ipMatch[1];
            if (/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(ip)) {
              resolved = true;
              try { rtc.close(); } catch (e) {}
              resolve(ip);
            }
          }
        };

        setTimeout(() => {
          if (!resolved) {
            try { rtc.close(); } catch (e) {}
            resolve(null);
          }
        }, 800);
      } catch (e) {
        resolve(null);
      }
    });
  };

  const checkNetworkStatus = async () => {
    if (process.client) {
      const localIp = await getLocalIpAddress();
      if (localIp && (localIp.startsWith('192.168.110.') || localIp.startsWith('192.168.'))) {
        isCampusNetwork.value = true;
        return;
      }
    }

    try {
      let res = await $fetch<any>('/api/pustaka/network/check').catch(() => null);
      if (!res || res.is_campus_network === undefined) {
        const config = useRuntimeConfig();
        const baseUrl = config.public.apiBaseUrl || 'https://portal-perpus.stahdnj.ac.id/api';
        res = await $fetch<any>(`${baseUrl}/network/check`).catch(() => null);
      }
      if (res && res.is_campus_network !== undefined) {
        isCampusNetwork.value = Boolean(res.is_campus_network);
      } else {
        if (process.client) {
          const host = window.location.hostname;
          if (host.includes('192.168.') || host.includes('stahdnj') || host === 'localhost') {
            isCampusNetwork.value = true;
          }
        }
      }
    } catch (e) {
      if (process.client) {
        const host = window.location.hostname;
        if (host.includes('192.168.') || host.includes('stahdnj') || host === 'localhost') {
          isCampusNetwork.value = true;
        }
      }
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
