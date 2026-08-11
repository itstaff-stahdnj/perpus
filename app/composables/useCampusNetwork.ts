import { ref, computed, onMounted, onUnmounted } from 'vue';

// STAH Dharma Nusantara Jakarta Coordinates (Halim Perdanakusuma, Jakarta Timur)
const STAH_DNJ_COORDS = {
  lat: -6.2625,
  lng: 106.8833,
  radiusKm: 0.35 // 350 meters radius allowance for campus area
};

// Haversine formula to calculate distance between two coordinates in km
const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const useCampusNetwork = () => {
  const isCampusNetwork = ref<boolean>(true);
  const isInsideCampusGeo = ref<boolean | null>(null);
  const userDistanceKm = ref<number | null>(null);
  const geoError = ref<string | null>(null);
  const selfBorrowTextIndex = ref<number>(0);
  
  const selfBorrowTexts = [
    'Pinjam Mandiri Khusus di Area Kampus',
    'Gunakan Wi-Fi Kampus / Lokasi STAH DNJ'
  ];

  let timer: any = null;

  // Check Geolocation GPS
  const checkGeolocation = () => {
    if (!process.client || !navigator.geolocation) {
      isInsideCampusGeo.value = true; // Fallback
      return;
    }

    const config = useRuntimeConfig();
    const targetLat = parseFloat(config.public.campusLat as string || '-6.255432');
    const targetLng = parseFloat(config.public.campusLng as string || '106.90898');
    const radiusKm = parseFloat(config.public.campusRadiusKm as string || '0.35');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const dist = calculateDistanceKm(userLat, userLng, targetLat, targetLng);
        userDistanceKm.value = parseFloat(dist.toFixed(2));

        if (dist <= radiusKm) {
          isInsideCampusGeo.value = true;
          isCampusNetwork.value = true;
          geoError.value = null;
        } else {
          isInsideCampusGeo.value = false;
          geoError.value = `Anda berada ${userDistanceKm.value} km di luar area kampus STAH DNJ.`;
        }
      },
      (err) => {
        console.warn('Geolocation access warning:', err.message);
        geoError.value = 'Akses lokasi tidak diizinkan. Menggunakan verifikasi jaringan Wi-Fi.';
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  };

  const checkNetworkStatus = async () => {
    try {
      let res = await $fetch<any>('/api/pustaka/network/check').catch(() => null);
      if (!res || res.is_campus_network === undefined) {
        const config = useRuntimeConfig();
        const baseUrl = config.public.apiBaseUrl || 'https://portal-perpus.stahdnj.ac.id/api';
        res = await $fetch<any>(`${baseUrl}/network/check`).catch(() => null);
      }
      if (res && res.is_campus_network !== undefined) {
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

  // Final check: User is inside campus if either Wi-Fi or GPS confirms it
  const isInsideCampus = computed(() => {
    if (isInsideCampusGeo.value === true) return true;
    if (isInsideCampusGeo.value === false && !isCampusNetwork.value) return false;
    return isCampusNetwork.value;
  });

  const isOutsideCampus = computed(() => {
    return !isInsideCampus.value;
  });

  onMounted(() => {
    if (process.client) {
      checkNetworkStatus();
      checkGeolocation();
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
    if (isOutsideCampus.value) {
      return '🚫 Di Luar Kampus (Gunakan Reservasi)';
    }
    return selfBorrowTexts[selfBorrowTextIndex.value];
  });

  return {
    isCampusNetwork,
    isInsideCampusGeo,
    isInsideCampus,
    isOutsideCampus,
    userDistanceKm,
    geoError,
    checkGeolocation,
    checkNetworkStatus,
    currentSelfBorrowText,
    selfBorrowTexts,
    selfBorrowTextIndex
  };
};
