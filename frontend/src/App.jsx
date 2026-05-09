import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './pages/teste-de-componentes';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import ComoAjudar from './pages/Como-ajudar';
import Contato from './pages/Contato';
import QueroAjudar from './pages/Quero-ajudar';

function App() {
  return (
    <Router>
      <NavBar />
      <div className="App" style={{ paddingTop: '4rem' }}>
        <Routes>
          <Route path="/Test" element={<Test />} />
          <Route path="/" element={<Home />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/como-ajudar" element={<ComoAjudar />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="/quero-ajudar" element={<QueroAjudar />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
