import React, { useEffect, useRef } from 'react';
import Layout from '@theme/Layout';
import BrowserOnly from '@docusaurus/BrowserOnly';

const pageStyle = {
  background: '#0f172a',
  minHeight: '100vh',
  color: '#e2e8f0',
  fontFamily: "'Segoe UI', sans-serif",
};

const sectionHeader = {
  padding: '20px',
  background: '#020617',
  borderBottom: '1px solid #1e293b',
  textAlign: 'center',
  fontSize: '24px',
  fontWeight: 'bold',
};

const gridContainer = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
  gap: '20px',
  padding: '20px',
};

const cardStyle = {
  background: '#020617',
  borderRadius: '12px',
  padding: '20px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
};

const h2Style = {
  marginTop: 0,
  marginBottom: '15px',
  color: '#38bdf8',
};

const requisitoStyle = {
  padding: '10px',
  marginBottom: '8px',
  background: '#0f172a',
  borderRadius: '8px',
  borderLeft: '4px solid #38bdf8',
};

const idStyle = {
  fontWeight: 'bold',
  color: '#38bdf8',
};

const funcionais = [
  ['RF-01', 'Autenticar Administrador'],
  ['RF-02', 'Registrar Doação'],
  ['RF-03', 'Listar Doações'],
  ['RF-04', 'Editar Doação'],
  ['RF-05', 'Registrar Doador'],
  ['RF-06', 'Listar Doadores'],
  ['RF-07', 'Registrar Entrega'],
  ['RF-08', 'Listar Entregas'],
  ['RF-09', 'Registrar Voluntário'],
  ['RF-10', 'Listar Voluntários'],
  ['RF-11', 'Registrar Disponibilidade'],
  ['RF-12', 'Editar Disponibilidade'],
  ['RF-13', 'Gerar Escala'],
  ['RF-14', 'Registrar Evento'],
  ['RF-15', 'Listar Eventos'],
  ['RF-16', 'Associar Voluntário a Evento'],
  ['RF-17', 'Registrar Recursos por Evento'],
  ['RF-18', 'Resumo de Recursos por Evento'],
  ['RF-19', 'Página institucional pública'],
  ['RF-20', 'Publicar Solicitação de Apoio'],
  ['RF-21', 'Listar Solicitações'],
  ['RF-22', 'Excluir Voluntário'],
  ['RF-23', 'Desalocar Voluntário'],
  ['RF-24', 'Editar Voluntário'],
  ['RF-25', 'Histórico do Voluntário'],
  ['RF-26', 'Relatório de Participação'],
];

const naoFuncionais = [
  ['RNF-01', 'Resposta em até 3s'],
  ['RNF-02', 'Página pública em até 5s'],
  ['RNF-03', '50 usuários simultâneos'],
  ['RNF-04', 'Alta disponibilidade'],
  ['RNF-05', 'Confirmação em ações críticas'],
  ['RNF-06', 'Recuperação em 30 min'],
  ['RNF-07', 'Interface intuitiva'],
  ['RNF-08', 'Bloqueio sem login'],
  ['RNF-09', 'Segurança (bcrypt + AES)'],
  ['RNF-10', 'Logs de operações'],
  ['RNF-11', 'Padrões web modernos'],
  ['RNF-12', 'Expiração de sessão'],
  ['RNF-13', 'Feedback ao usuário'],
  ['RNF-14', 'Contato e doações visíveis'],
];

const mermaidDiagram = `graph LR
A[Problema: Baixo engajamento] --> B[Objetivo Geral]

B --> C1[OE1 Controle de Doações]
B --> C2[OE2 Gestão de Voluntários]
B --> C3[OE3 Centralização]
B --> C4[OE4 Captação Digital]

C1 --> D1[RF-02 Registrar Doação]
C1 --> D2[RF-03 Listar Doações]
C1 --> D3[RF-04 Editar Doação]
C1 --> D4[RF-05 Registrar Doador]
C1 --> D5[RF-06 Listar Doadores]
C1 --> E1[RF-07 Registrar Entrega]
C1 --> E2[RF-08 Listar Entregas]

C2 --> F1[RF-09 Registrar Voluntário]
C2 --> F2[RF-10 Listar Voluntários]
C2 --> F3[RF-22 Excluir Voluntário]
C2 --> F4[RF-24 Editar Voluntário]
C2 --> F5[RF-25 Histórico]
C2 --> F6[RF-26 Relatório]
C2 --> G1[RF-11 Registrar Disponibilidade]
C2 --> G2[RF-12 Editar Disponibilidade]
C2 --> G3[RF-13 Gerar Escala]
C2 --> G4[RF-23 Desalocar]
C2 --> H1[RF-14 Registrar Evento]
C2 --> H2[RF-15 Listar Eventos]
C2 --> H3[RF-16 Associar Voluntário]
C2 --> H4[RF-17 Registrar Recursos]
C2 --> H5[RF-18 Resumo Recursos]

C4 --> I1[RF-19 Página Institucional]
C4 --> I2[RF-20 Publicar Solicitação]
C4 --> I3[RF-21 Listar Solicitações]

B --> J[Requisitos Não Funcionais]
J --> RNF1[RNF-01 Performance]
J --> RNF2[RNF-02 Carregamento]
J --> RNF3[RNF-03 Escalabilidade]
J --> RNF4[RNF-04 Disponibilidade]
J --> RNF5[RNF-05 Integridade]
J --> RNF6[RNF-06 Recuperação]
J --> RNF7[RNF-07 Usabilidade]
J --> RNF8[RNF-08 Segurança]
J --> RNF9[RNF-09 Proteção Dados]
J --> RNF10[RNF-10 Auditoria]
J --> RNF11[RNF-11 Compatibilidade]
J --> RNF12[RNF-12 Sessão]
J --> RNF13[RNF-13 Feedback]`;

const btnStyle = {
  background: '#1e293b',
  color: '#e2e8f0',
  border: '1px solid #38bdf8',
  borderRadius: '6px',
  padding: '6px 14px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold',
};

function MermaidChart() {
  const containerRef = useRef(null);
  const panZoomRef = useRef(null);

  useEffect(() => {
    const applyPanZoom = (svg) => {
      const loadPZ = () => {
        panZoomRef.current = window.svgPanZoom(svg, {
          zoomEnabled: true,
          controlIconsEnabled: false,
          fit: true,
          center: true,
          minZoom: 0.05,
          maxZoom: 20,
          mouseWheelZoomEnabled: true,
        });
      };
      if (window.svgPanZoom) {
        loadPZ();
      } else {
        const pzScript = document.createElement('script');
        pzScript.src = 'https://cdn.jsdelivr.net/npm/svg-pan-zoom@3.6.1/dist/svg-pan-zoom.min.js';
        pzScript.onload = loadPZ;
        document.head.appendChild(pzScript);
      }
    };

    const render = () => {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        flowchart: { useMaxWidth: false, htmlLabels: true },
      });
      window.mermaid.run({ querySelector: '.mermaid-req' }).then(() => {
        const svg = containerRef.current?.querySelector('svg');
        if (svg) {
          // Remove background rect mermaid injeta (causa a "barra preta")
          const bgRect = svg.querySelector('rect.er.relationshipLabelBox, rect[class="background"], rect:first-child');
          if (bgRect && (bgRect.getAttribute('fill') === 'black' || bgRect.getAttribute('fill') === '#1f2020' || bgRect.getAttribute('fill') === 'hsl(0, 0%, 12.9411764706%)')) {
            bgRect.setAttribute('fill', 'transparent');
          }
          // Remove todos os rects de fundo (qualquer fill escuro no primeiro rect)
          const firstRect = svg.querySelector('rect');
          if (firstRect) firstRect.setAttribute('fill', 'transparent');

          const container = containerRef.current;
          svg.setAttribute('width', container.clientWidth);
          svg.setAttribute('height', container.clientHeight);
          svg.style.display = 'block';
          applyPanZoom(svg);
        }
      });
    };

    if (window.mermaid) {
      render();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      script.onload = render;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      {/* Botões de controle */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', justifyContent: 'flex-end' }}>
        <button style={btnStyle} onClick={() => panZoomRef.current?.zoomIn()}>＋ Zoom</button>
        <button style={btnStyle} onClick={() => panZoomRef.current?.zoomOut()}>－ Zoom</button>
        <button style={btnStyle} onClick={() => panZoomRef.current?.reset()}>↺ Reset</button>
        <button style={btnStyle} onClick={() => panZoomRef.current?.fit()}>⊡ Fit</button>
      </div>

      {/* Container do diagrama */}
      <div
        ref={containerRef}
        style={{
          background: '#020617',
          borderRadius: '12px',
          width: '100%',
          height: '600px',
          overflow: 'hidden',
          cursor: 'grab',
          border: '1px solid #1e293b',
        }}
      >
        <div className="mermaid-req mermaid">{mermaidDiagram}</div>
      </div>
      <p style={{ color: '#64748b', fontSize: '13px', marginTop: '8px', textAlign: 'center' }}>
        🖱️ Arraste para mover · Scroll para zoom · Botões acima para controlar
      </p>
    </div>
  );
}

export default function Requisitos() {
  return (
    <Layout title="Requisitos" description="Dashboard de Requisitos e Fluxograma do Sistema">
      <div style={pageStyle}>

        {/* ── DASHBOARD DE REQUISITOS ── */}
        <div style={sectionHeader}>📊 Dashboard de Requisitos</div>
        <div style={gridContainer}>
          <div style={cardStyle}>
            <h2 style={h2Style}>✅ Requisitos Funcionais</h2>
            {funcionais.map(([id, desc]) => (
              <div key={id} style={requisitoStyle}>
                <span style={idStyle}>{id}</span> - {desc}
              </div>
            ))}
          </div>
          <div style={cardStyle}>
            <h2 style={h2Style}>⚙️ Requisitos Não Funcionais</h2>
            {naoFuncionais.map(([id, desc]) => (
              <div key={id} style={requisitoStyle}>
                <span style={idStyle}>{id}</span> - {desc}
              </div>
            ))}
          </div>
        </div>

        {/* ── FLUXOGRAMA ── */}
        <div style={{ ...sectionHeader, marginTop: '20px' }}>📊 Fluxograma do Sistema</div>
        <div style={{ padding: '20px' }}>
          <BrowserOnly>{() => <MermaidChart />}</BrowserOnly>
        </div>

      </div>
    </Layout>
  );
}
