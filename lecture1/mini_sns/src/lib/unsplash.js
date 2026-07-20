const ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

if (!ACCESS_KEY) {
  console.warn(
    '[Unsplash] VITE_UNSPLASH_ACCESS_KEY 환경변수가 설정되지 않았습니다. ' +
      '.env 파일을 확인하세요 (.env.example 참고).'
  );
}

// 게시물 작성 시 보여줄 랜덤 패션 이미지 후보를 가져옵니다.
export async function fetchRandomFashionPhotos(count = 6) {
  const url = new URL('https://api.unsplash.com/photos/random');
  url.searchParams.set('query', 'fashion,outfit,street style');
  url.searchParams.set('count', String(count));
  url.searchParams.set('orientation', 'portrait');

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
  });

  if (!res.ok) {
    throw new Error(`Unsplash API 오류 (${res.status})`);
  }

  const data = await res.json();
  return data.map((photo) => ({
    id: photo.id,
    url: photo.urls.regular,
    thumb: photo.urls.small,
    alt: photo.alt_description ?? 'fashion photo',
    credit: photo.user?.name ?? 'Unsplash',
  }));
}
