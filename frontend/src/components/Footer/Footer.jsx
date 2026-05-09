import React from 'react';
import './Footer.css';
import Button from '../Button/Button';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <h3>Contato</h3>
          <p>Telefone: (61) 9999-9999</p>
          <p>E-mail: naosei@emaildela.com</p>
          <p>Endereço: ???, 123</p>
        </div>

        <div className="footer-section">
          <h3>Redes sociais</h3>
          <div className="footer-socials">
            <a href="#">Instagram</a>
            <a href="#">WhatsApp</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Creche Tia Tata. Todos os direitos reservados.</p>
        <Button style={{ backgroundColor: 'rgba(255, 255, 255, 0.18)' }}>Área administrativa</Button>
      </div>
    </footer>
  );
};

export default Footer;
