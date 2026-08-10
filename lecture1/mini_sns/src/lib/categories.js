import CheckroomIcon from '@mui/icons-material/CheckroomOutlined';
import SellIcon from '@mui/icons-material/SellOutlined';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBagOutlined';
import DryCleaningIcon from '@mui/icons-material/DryCleaningOutlined';

// 홈 피드 카테고리 목록. 새 카테고리를 추가하려면 이 배열에 항목을 더하면
// 게시물 작성 화면의 선택지와 홈 화면의 탭에 자동으로 반영됩니다.
export const CATEGORIES = [
  {
    value: 'OOTD',
    label: 'OOTD',
    icon: CheckroomIcon,
    color: '#FF3399',
  },
  {
    value: 'BRAND',
    label: '브랜드',
    icon: SellIcon,
    color: '#FFD400',
  },
  {
    value: 'MUSINSA',
    label: '무신사',
    icon: ShoppingBagIcon,
    color: '#4ADE80',
  },
  {
    value: 'COORDI',
    label: '코디',
    icon: DryCleaningIcon,
    color: '#4FC3F7',
  },
];

export const DEFAULT_CATEGORY = CATEGORIES[0].value;
