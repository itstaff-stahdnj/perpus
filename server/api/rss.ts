export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=300, s-maxage=600'
  });

  const defaultBanner = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqqnbAhYZAD5noPoJYDOjCacsw_4Fi9npvGuV_2wQCYUNIQsCDw8Z6nlGYLwBpN2vet5tWENORS5zRcj1oYD4a_RVXi5SwrgbpXr5ymDgQH6VHB_jCcY901ftzOp9sajtMG2ugaiEii46L135Ai3BpCDxA6cw_aDFsMk-lqvWWSjW9hQazpoh-3k2mTtJmEITsV7HVq4NK9o3e_98SckUCjeNB3aoQBfiu3tEXs1ixYMeIbNcEk9aySg';

  // Method 1: Fetch directly from stahdnj.ac.id/feed/
  try {
    const xml = await $fetch<string>('https://stahdnj.ac.id/feed/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const items: Array<{
      id: string;
      title: string;
      link: string;
      summary: string;
      category: string;
      published_at: string;
      author: string;
      image_url: string;
      is_rss: boolean;
    }> = [];

    const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/gi) || [];

    for (let i = 0; i < itemMatches.length; i++) {
      const rawItem = itemMatches[i];

      const getTagValue = (tagName: string): string => {
        const regex = new RegExp(`<${tagName}[^>]*>(?:<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>|([\\s\\S]*?))<\\/${tagName}>`, 'i');
        const match = rawItem.match(regex);
        if (!match) return '';
        const val = match[1] !== undefined ? match[1] : match[2];
        return val.replace(/<[^>]+>/g, '').trim();
      };

      const title = getTagValue('title');
      const link = getTagValue('link');
      const pubDate = getTagValue('pubDate');
      const rawDesc = getTagValue('description');
      const category = getTagValue('category') || 'Berita STAH';
      const author = getTagValue('dc:creator') || 'Humas STAH DNJ';

      let cleanDesc = rawDesc
        .replace(/&#8220;/g, '“')
        .replace(/&#8221;/g, '”')
        .replace(/&#8217;/g, '’')
        .replace(/&#8211;/g, '–')
        .replace(/\[&#8230;\]|\[\.\.\.\]/g, '...');

      const imgMatch = rawItem.match(/src=["']([^"']+\.(?:jpg|jpeg|png|webp|gif))["']/i);
      const imageUrl = imgMatch ? imgMatch[1] : defaultBanner;

      let formattedDate = pubDate;
      try {
        const d = new Date(pubDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        }
      } catch (e) {}

      if (title) {
        items.push({
          id: `rss-${i+1}`,
          title,
          link,
          summary: cleanDesc,
          category,
          published_at: formattedDate,
          author,
          image_url: imageUrl,
          is_rss: true
        });
      }
    }

    if (items.length > 0) {
      return { success: true, data: items };
    }
  } catch (e) {
    console.warn('Direct RSS XML fetch failed, trying rss2json fallback:', e);
  }

  // Method 2: Fallback via rss2json API
  try {
    const res = await $fetch<any>('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fstahdnj.ac.id%2Ffeed%2F');
    if (res?.status === 'ok' && Array.isArray(res.items)) {
      const items = res.items.map((item: any, i: number) => {
        let formattedDate = item.pubDate;
        try {
          const d = new Date(item.pubDate);
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          }
        } catch (e) {}

        const cleanSummary = (item.description || item.content || '')
          .replace(/<[^>]+>/g, '')
          .replace(/&#8220;/g, '“')
          .replace(/&#8221;/g, '”')
          .replace(/&#8217;/g, '’')
          .replace(/\[&#8230;\]|\[\.\.\.\]/g, '...')
          .trim();

        return {
          id: `rss-${i+1}`,
          title: item.title,
          link: item.link,
          summary: cleanSummary,
          category: (item.categories && item.categories[0]) || 'Berita STAH',
          published_at: formattedDate,
          author: item.author || 'Humas STAH DNJ',
          image_url: item.thumbnail || defaultBanner,
          is_rss: true
        };
      });

      return { success: true, data: items };
    }
  } catch (err: any) {
    console.error('RSS fallback failed:', err);
  }

  return { success: false, data: [] };
});
