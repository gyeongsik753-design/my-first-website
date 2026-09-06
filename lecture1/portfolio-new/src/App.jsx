import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Profile from './components/Profile';
import Projects from './components/Projects';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import FrameCorners from './components/FrameCorners';
import './App.css';

function App() {
  return (
    <>
      <CustomCursor />
      <FrameCorners />
      <div className="bg-bokeh" aria-hidden="true">
        <span className="bg-bokeh-dot bg-bokeh-dot--1" />
        <span className="bg-bokeh-dot bg-bokeh-dot--2" />
        <span className="bg-bokeh-dot bg-bokeh-dot--3" />
        <span className="bg-bokeh-dot bg-bokeh-dot--4" />
        <span className="bg-bokeh-dot bg-bokeh-dot--5" />
        <span className="bg-bokeh-dot bg-bokeh-dot--6" />
        <span className="bg-bokeh-dot bg-bokeh-dot--7" />
        <span className="bg-bokeh-dot bg-bokeh-dot--8" />
        <span className="bg-bokeh-dot bg-bokeh-dot--9" />
        <span className="bg-bokeh-dot bg-bokeh-dot--10" />
      </div>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Profile />
        <Projects />
      </main>
      <Footer />
    </>
  );
}

export default App;
