export default defineNuxtPlugin(() => {
  const route = useRoute();
  const router = useRouter();
  const tokenCookie = useCookie<string | null>('pustaka_token', { 
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });

  // Tangkap token jika pengguna dialihkan dari portal dengan query param ?token=... atau ?pustaka_token=...
  const queryToken = (route.query.token || route.query.pustaka_token || route.query.access_token) as string | undefined;

  if (queryToken && typeof queryToken === 'string' && queryToken.trim().length > 0) {
    tokenCookie.value = queryToken.trim();

    // Bersihkan parameter token dari URL agar tampilan URL tetap bersih
    const newQuery = { ...route.query };
    delete newQuery.token;
    delete newQuery.pustaka_token;
    delete newQuery.access_token;

    router.replace({ path: route.path, query: newQuery });
  }
});
