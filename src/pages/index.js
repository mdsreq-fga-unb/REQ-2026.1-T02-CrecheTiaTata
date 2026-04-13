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