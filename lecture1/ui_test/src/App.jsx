import { Box, Container, Typography, Divider } from '@mui/material';
import Section01Button from './components/sections/Section01Button';
import Section02Input from './components/sections/Section02Input';
import Section03Navigation from './components/sections/Section03Navigation';
import Section04Dropdown from './components/sections/Section04Dropdown';
import Section05Checkbox from './components/sections/Section05Checkbox';
import Section06Radio from './components/sections/Section06Radio';
import Section07Slider from './components/sections/Section07Slider';
import Section08Modal from './components/sections/Section08Modal';
import Section09Card from './components/sections/Section09Card';
import Section10DragDrop from './components/sections/Section10DragDrop';
import Section11Scroll from './components/sections/Section11Scroll';
import Section12Animation from './components/sections/Section12Animation';
import Section13Menu from './components/sections/Section13Menu';
import Section14Sidebar from './components/sections/Section14Sidebar';
import Section15Hover from './components/sections/Section15Hover';
import Section16Swipe from './components/sections/Section16Swipe';
import Section17FlexNav from './components/sections/Section17FlexNav';

const App = () => {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          UI 컴포넌트 테스트
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          16개 UI 요소를 순차적으로 학습합니다.
        </Typography>

        <Divider sx={{ mb: 4 }} />

        <Section01Button />
        <Section02Input />
        <Section03Navigation />
        <Section04Dropdown />
        <Section05Checkbox />
        <Section06Radio />
        <Section07Slider />
        <Section08Modal />
        <Section09Card />
        <Section10DragDrop />
        <Section11Scroll />
        <Section12Animation />
        <Section13Menu />
        <Section14Sidebar />
        <Section15Hover />
        <Section16Swipe />
        <Section17FlexNav />

      </Container>
    </Box>
  );
};

export default App;
