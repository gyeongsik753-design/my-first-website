// '브랜드' 카테고리 안에서 보여줄 브랜드 공식 홈페이지 바로가기 목록.
// logoSlug는 simple-icons(cdn.simpleicons.org)에 등록된 브랜드만 있어서
// 없는 브랜드는 생략하면 이니셜 원형 로고로 자동 대체됩니다.
export const BRANDS = [
  { name: '나이키', url: 'https://www.nike.com/kr/', logoSlug: 'nike' },
  { name: '아디다스', url: 'https://www.adidas.co.kr/', logoSlug: 'adidas' },
  { name: '뉴발란스', url: 'https://www.newbalance.com/', logoSlug: 'newbalance' },
  { name: '유니클로', url: 'https://www.uniqlo.com/kr/ko/', logoSlug: 'uniqlo' },
  { name: '자라', url: 'https://www.zara.com/kr/', logoSlug: 'zara' },
  { name: '푸마', url: 'https://kr.puma.com/kr/ko/home', logoSlug: 'puma' },
  { name: '언더아머', url: 'https://www.underarmour.co.kr/', logoSlug: 'underarmour' },
  { name: '리복', url: 'https://www.reebok.co.kr/', logoSlug: 'reebok' },
  { name: '휠라', url: 'https://www.fila.co.kr/', logoSlug: 'fila' },
  { name: '더노스페이스', url: 'https://www.thenorthfacekorea.co.kr/', logoSlug: 'thenorthface' },
  { name: '헬리한센', url: 'https://www.hellyhansen.com/', logoSlug: 'hellyhansen' },
];

// 게시물 작성/수정 시 착장을 부위별로 나눠 브랜드를 입력받기 위한 슬롯 정의.
// key는 posts 테이블의 컬럼명과 1:1로 대응됩니다.
export const BRAND_SLOTS = [
  { key: 'brand_hat', label: '모자' },
  { key: 'brand_top', label: '상의' },
  { key: 'brand_bottom', label: '하의' },
  { key: 'brand_shoes', label: '신발' },
];
