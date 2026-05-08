import React, { useState } from 'react';
import Button from '../components/Button/Button';
import '../styles/teste.css';
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="teste">
      <div className="container">
        <h1 style={{color: "white"}}>Bem-vindo à Creche Tia Tata</h1>
        <p style={{color: "white"}}>página para testar componentes.</p>
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <Button> Default </Button>
        </div>
        <div style={{ width: "100%", height: "50px", display: "flex", justifyContent: "center" }}>
          <Button onClick={() => navigate("/Home")} style={{ fontSize: '18px', borderRadius: '20px', color: 'Black', backgroundColor: "honeydew" }}> Personalizado </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
