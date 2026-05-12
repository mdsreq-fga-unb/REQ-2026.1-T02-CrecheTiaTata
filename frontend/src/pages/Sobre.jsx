import React from 'react';
import '../styles/Sobre.css';

const Sobre = () => {
  return (
    <div className="page-wrapper">
      
      <main className="sobre-container">
        <h1 className="sobre-titulo">
          <span className="icon-titulo">ℹ️</span> Sobre a Creche Tia Tata
        </h1>

        {/* Seção: Nossa História */}
        <section className="sobre-card historia-card">
          <div className="historia-titulo">
            <h2>Nossa História</h2>
          </div>

          {/* icones e texto */}
          <div className="historia-item">
            <span className="icon">💚</span>
            <p>A Creche Tia Tata nasceu há 15 anos do sonho de uma pessoa que queria fazer a diferença na vida de crianças e famílias em situação de vulnerabilidade.</p>
          </div>
          <div className="historia-item">
            <span className="icon">👥</span>
            <p>Desde então, já atendemos mais de 500 famílias, oferecendo não apenas doações de alimentos e roupas, mas também carinho, esperança e dignidade.</p>
          </div>
          <div className="historia-item">
            <span className="icon">🤝</span>
            <p>Nossa missão é proporcionar um futuro melhor para crianças que mais precisam, através do amor, cuidado e apoio da comunidade.</p>
          </div>
        </section>

{/* Seção: Missão, Visão e Valores (MVV) */}
        <section className="mvv-container">
          <div className="mvv-card missao">
            <span className="icon-grande">🎯</span>
            <h3>Missão</h3>
            <p>Atender crianças e famílias vulneráveis com amor e dignidade</p>
          </div>
          
          <div className="mvv-card visao">
            <span className="icon-grande">👁️</span>
            <h3>Visão</h3>
            <p>Ser referência em apoio social comunitário</p>
          </div>
          
          <div className="mvv-card valores">
            <span className="icon-grande">💎</span>
            <h3>Valores</h3>
            <p>Amor, respeito, transparência e solidariedade</p>
          </div>
        </section>

        {/* Seção: O Que Fazemos) */}
        <section className="sobre-card fazemos-card">
          <h2 className="fazemos-titulo">O Que Fazemos</h2>
          
          <div className="fazemos-grid">
            <div className="fazemos-item">
              <span className="icon-grande">🍚</span>
              <div>
                <h3>Distribuição de Alimentos</h3>
                <p>Cestas básicas e alimentos para famílias</p>
              </div>
            </div>

            <div className="fazemos-item">
              <span className="icon-grande">👕</span>
              <div>
                <h3>Doação de Roupas</h3>
                <p>Roupas e calçados para crianças e adultos</p>
              </div>
            </div>

            <div className="fazemos-item">
              <span className="icon-grande">🎓</span>
              <div>
                <h3>Apoio Educacional</h3>
                <p>Material escolar e apoio pedagógico</p>
              </div>
            </div>

            <div className="fazemos-item">
              <span className="icon-grande">🤝</span>
              <div>
                <h3>Eventos Comunitários</h3>
                <p>Festas, atividades e momentos de alegria</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção: Veja Nosso Trabalho (Vídeo) */}
        <section className="sobre-video-section">
          <h2 className="video-titulo">Veja Nosso Trabalho</h2>
          <div className="video-placeholder">
            <span className="icon-video">🎬</span>
            <h3>[Vídeo: Nossa História e Impacto]</h3>
          </div>
        </section>
        
      </main>

    </div>
  );
};

export default Sobre;