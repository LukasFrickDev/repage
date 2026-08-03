import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import Services from '../pages/Services';
import Projects from '../pages/Projects';
import Contacts from '../pages/Contact';
import About from '../pages/About';

const Rotas = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/services" element={<Services />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contacts />} />
  </Routes>
);

export default Rotas;
