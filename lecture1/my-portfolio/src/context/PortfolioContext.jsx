import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import BrushIcon from '@mui/icons-material/Brush';
import GestureIcon from '@mui/icons-material/Gesture';
import GridViewIcon from '@mui/icons-material/GridView';
import CodeIcon from '@mui/icons-material/Code';
import StorageIcon from '@mui/icons-material/Storage';
import BuildIcon from '@mui/icons-material/Build';

/* ─── 카테고리 설정 (AboutMe + Home 공용) ─── */
export const CATEGORY_CONFIG = {
  Design:    { color: '#C8102E', bg: '#FFF0F0', label: 'Design'    },
  Frontend:  { color: '#1565C0', bg: '#E8F0FE', label: 'Frontend'  },
  Framework: { color: '#2E7D32', bg: '#E8F5E9', label: 'Framework' },
  Backend:   { color: '#E65100', bg: '#FFF3E0', label: 'Backend'   },
  Tools:     { color: '#6A1B9A', bg: '#F3E5F5', label: 'Tools'     },
};

/* ─── 아이콘 맵 (AboutMe + Home 공용) ─── */
export const ICON_MAP = {
  BrushIcon:    <BrushIcon />,
  GestureIcon:  <GestureIcon />,
  GridViewIcon: <GridViewIcon />,
  CodeIcon:     <CodeIcon />,
  StorageIcon:  <StorageIcon />,
  BuildIcon:    <BuildIcon />,
};

/* ─── 초기 데이터 ─── */
const INITIAL_DATA = {
  basicInfo: {
    name: '신경식',
    education: '마산대학교 호텔조리과 (전문대)',
    major: '조리',
    experience: '신입',
    photo: '',
  },
  sections: [
    { id: 'dev-story',  title: '나의 개발 스토리', content: '컴퓨터 관련 일을 찾아보다가 관심이 생겼습니다.', showInHome: true  },
    { id: 'philosophy', title: '개발 철학',         content: '표현하고 싶은 부분은 확실하게 표현합니다.',       showInHome: true  },
    { id: 'personal',   title: '개인적인 이야기',   content: '',                                               showInHome: false },
  ],
  skills: [
    { id: 1, icon: 'BrushIcon',    name: 'Adobe Photoshop',   level: 30, category: 'Design', description: '사진 편집 및 합성 작업 가능',  showInMain: false },
    { id: 2, icon: 'GestureIcon',  name: 'Adobe Illustrator', level: 30, category: 'Design', description: '벡터 그래픽 및 로고 제작 가능', showInMain: false },
    { id: 3, icon: 'GridViewIcon', name: 'Figma',             level: 60, category: 'Design', description: 'UI/UX 프로토타입 설계 가능',   showInMain: true  },
  ],
};

/* ─── Context ─── */
const PortfolioContext = createContext(null);

/* ─── Provider ─── */
export const PortfolioProvider = ({ children }) => {
  const [aboutMeData, setAboutMeData] = useState(INITIAL_DATA);

  /* useCallback: setAboutMeData 는 항상 안정적이므로 의존성 [] 가능 */
  const updateSectionContent = useCallback((id, content) => {
    setAboutMeData((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, content } : s)),
    }));
  }, []);

  const addSkill = useCallback((skill) => {
    setAboutMeData((prev) => ({
      ...prev,
      skills: [...prev.skills, { ...skill, id: Date.now(), showInMain: false }],
    }));
  }, []);

  const updatePhoto = useCallback((photoDataUrl) => {
    setAboutMeData((prev) => ({
      ...prev,
      basicInfo: { ...prev.basicInfo, photo: photoDataUrl },
    }));
  }, []);

  /*
   * useMemo: aboutMeData 가 바뀔 때만 재계산.
   * getHomeData() 함수 대신 homeData 값으로 노출 → Home.jsx 매 렌더 재계산 방지.
   */
  const homeData = useMemo(() => {
    const content = aboutMeData.sections
      .filter((s) => s.showInHome && s.content)
      .map((s) => ({
        id: s.id,
        title: s.title,
        summary: s.content.length > 80 ? s.content.substring(0, 80) + '…' : s.content,
      }));

    const skills = [...aboutMeData.skills]
      .sort((a, b) => b.level - a.level)
      .slice(0, 4);

    return { content, skills, basicInfo: aboutMeData.basicInfo };
  }, [aboutMeData]);

  const value = useMemo(
    () => ({ aboutMeData, setAboutMeData, updateSectionContent, addSkill, updatePhoto, homeData }),
    [aboutMeData, updateSectionContent, addSkill, updatePhoto, homeData],
  );

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

/* ─── 커스텀 훅 ─── */
export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
};
