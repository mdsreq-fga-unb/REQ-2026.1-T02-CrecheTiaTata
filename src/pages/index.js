import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    // Tira a cor verde de fundo e deixa transparente para mesclar com o tema
    <header className={clsx('hero', styles.heroBanner)} style={{ backgroundColor: 'transparent', padding: '6rem 0' }}>
      <div className="container">
        <div className="row" style={{ alignItems: 'center' }}>
          
          {/* Lado Esquerdo: Textos e Botões */}
          <div className="col col--6" style={{ textAlign: 'left' }}>
            <h1 className="hero__title" style={{ fontSize: '3.5rem', fontWeight: 'bold' }}>
              {siteConfig.title}
            </h1>
            <p className="hero__subtitle" style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
              {siteConfig.tagline}
            </p>
            <div className={styles.buttons} style={{ justifyContent: 'flex-start' }}>
              <Link
                className="button button--primary button--lg"
                style={{ borderRadius: '30px', padding: '0.8rem 2rem' }}
                to="/docs/intro">
                Documentação &rarr;
              </Link>
            </div>
            {/* Cards de acesso rápido */}
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
  {[
    {
      label: 'Planejamento',
      description: 'Iterações, cronograma e organização do projeto',
      icon: '',
      to: '/docs/Planejamento-e-Organizacao/Planejamento',
    },
    {
      label: 'Rastreabilidade',
      description: 'Fluxograma de requisitos e vínculos entre RFs, RNFs e OEs',
      icon: '',
      href: '/REQ-2026.1-T02-CrecheTiaTata/unidade3/docs/visao-produto-projeto/h-requisitos/fluxograma',
    },
    {
      label: 'Itens de Trabalho e MVP',
      description: 'Itens de trabalho e board do produto mínimo viável',
      icon: '',
      href: '/REQ-2026.1-T02-CrecheTiaTata/unidade3/docs/visao-produto-projeto/j-backlog#priorizacao',
    },
  ].map(({ label, description, icon, to, href }) => {
    const cardStyle = {
      display: 'flex', flexDirection: 'column', gap: '0.4rem',
      padding: '1.1rem 1.4rem', borderRadius: '12px',
      border: '1.5px solid var(--ifm-color-primary)',
      textDecoration: 'none', color: 'inherit',
      transition: 'all 0.25s ease',
      background: 'var(--ifm-card-background-color)',
      flex: '1 1 180px', minWidth: '160px', maxWidth: '240px',
    };
    const inner = (
      <>
        <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{icon}</span>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--ifm-color-primary)' }}>{label}</span>
        <span style={{ fontSize: '0.8rem', opacity: 0.75, lineHeight: 1.4 }}>{description}</span>
      </>
    );
    return href
      ? <a key={label} href={href} style={cardStyle}>{inner}</a>
      : <Link key={label} to={to} style={cardStyle}>{inner}</Link>;
  })}
</div>

          </div>

          {/* Lado Direito: Imagem/Logo */}
          <div className="col col--6" style={{ textAlign: 'center' }}>
            {/* A imagem puxa automaticamente da pasta static/img/ */}
            <img 
              src={useBaseUrl('/img/logo.svg')} 
              alt="Logo Creche Tia Tata" 
              style={{ maxWidth: '100%', maxHeight: '400px' }} 
            />
          </div>

        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`Início | ${siteConfig.title}`}
      description="Documentação do projeto Creche da Tia Tata - Requisitos UnB">
      <HomepageHeader />
    </Layout>
  );
}