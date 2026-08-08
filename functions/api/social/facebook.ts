interface Env {
  FACEBOOK_PAGE_ID?: string;
  FACEBOOK_PAGE_ACCESS_TOKEN?: string;
  FACEBOOK_API_VERSION?: string;
}

type FacebookPost = {
  id: string;
  message: string | null;
  permalinkUrl: string;
  createdAt: string;
  imageUrl: string | null;
};

type GraphPost = {
  id?: string;
  message?: string;
  permalink_url?: string;
  created_time?: string;
  full_picture?: string;
};

function json(body: unknown, init: ResponseInit = {}): Response {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json; charset=utf-8');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(JSON.stringify(body), { ...init, headers });
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const pageId = context.env.FACEBOOK_PAGE_ID?.trim();
  const accessToken = context.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  const version = context.env.FACEBOOK_API_VERSION?.trim();

  if (!pageId || !accessToken || !version) {
    return json(
      { status: 'unconfigured', posts: [] },
      { status: 200, headers: { 'Cache-Control': 'public, max-age=300' } },
    );
  }

  if (!/^v\d+\.\d+$/.test(version) || !/^\d+$/.test(pageId)) {
    return json({ status: 'invalid-configuration', posts: [] }, { status: 503 });
  }

  const cacheKey = new Request(new URL('/api/social/facebook?normalized=1', context.request.url));
  const cache = (caches as CacheStorage & { default: Cache }).default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const endpoint = new URL(`https://graph.facebook.com/${version}/${pageId}/posts`);
  endpoint.searchParams.set('fields', 'id,message,permalink_url,created_time,full_picture');
  endpoint.searchParams.set('limit', '3');
  endpoint.searchParams.set('access_token', accessToken);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(endpoint, { signal: controller.signal });
    if (!response.ok) throw new Error(`Graph API returned ${response.status}`);
    const payload = (await response.json()) as { data?: GraphPost[] };
    const posts: FacebookPost[] = (payload.data ?? []).flatMap((post) => {
      if (!post.id || !post.permalink_url || !post.created_time) return [];
      return [
        {
          id: post.id,
          message: post.message ?? null,
          permalinkUrl: post.permalink_url,
          createdAt: post.created_time,
          imageUrl: post.full_picture ?? null,
        },
      ];
    });
    const result = json(
      { status: 'ok', posts },
      { headers: { 'Cache-Control': 'public, max-age=1800, stale-if-error=86400' } },
    );
    context.waitUntil(cache.put(cacheKey, result.clone()));
    return result;
  } catch {
    return json(
      { status: 'unavailable', posts: [] },
      { status: 200, headers: { 'Cache-Control': 'public, max-age=300, stale-if-error=86400' } },
    );
  } finally {
    clearTimeout(timeout);
  }
};
