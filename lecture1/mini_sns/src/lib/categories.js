import CheckroomIcon from '@mui/icons-material/Checkroom';
import SellIcon from '@mui/icons-material/Sell';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

// 홈 피드 카테고리 목록. 새 카테고리를 추가하려면 이 배열에 항목을 더하면
// 게시물 작성 화면의 선택지와 홈 화면의 탭에 자동으로 반영됩니다.
export const CATEGORIES = [
  {
    value: 'OOTD',
    label: 'OOTD',
    icon: CheckroomIcon,
    gradient: 'linear-gradient(135deg, #E1263F, #111111)',
  },
  {
    value: 'BRAND',
    label: '브랜드',
    icon: SellIcon,
    gradient: 'linear-gradient(135deg, #C9A227, #111111)',
  },
  {
    value: 'MUSINSA',
    label: '무신사',
    icon: ShoppingBagIcon,
    gradient: 'linear-gradient(135deg, #444444, #111111)',
  },
  {
    value: 'SALE',
    label: '할인',
    icon: LocalOfferIcon,
    gradient: 'linear-gradient(135deg, #FF6B35, #C9302C)',
  },
];

export const DEFAULT_CATEGORY = CATEGORIES[0].value;
