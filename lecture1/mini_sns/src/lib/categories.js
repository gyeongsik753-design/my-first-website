import CheckroomIcon from '@mui/icons-material/Checkroom';

// 홈 피드 카테고리 목록. 새 카테고리를 추가하려면 이 배열에 항목을 더하면
// 게시물 작성 화면의 선택지와 홈 화면의 탭에 자동으로 반영됩니다.
export const CATEGORIES = [
  {
    value: 'OOTD',
    label: 'OOTD',
    icon: CheckroomIcon,
    gradient: 'linear-gradient(135deg, #E1263F, #111111)',
  },
];

export const DEFAULT_CATEGORY = CATEGORIES[0].value;
