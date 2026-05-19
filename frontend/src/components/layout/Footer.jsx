import { navigateTo } from '../../utils/navigation';

export default function Footer() {
  return (
    <footer id="contato" className="bg-slate-950 px-5 py-12 text-white lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <h2 className="text-xl font-black">Creche Tia Tata</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-300">
            Cuidando com amor e conectando pessoas para transformar realidades.
          </p>
        </div>
        <div>
          <h3 className="font-bold">Contato</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <a className="block hover:text-white" href="https://wa.me/5561996483772" target="_blank" rel="noreferrer">
              (61) 99648-3772
            </a>
            <p>mf2347089@gmail.com</p>
            <p>Santa Luzia, Cidade Estrutural - DF</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold">Acesso</h3>
          <div className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
            <button type="button" onClick={() => navigateTo('/sobre')} className="text-left hover:text-white">
              Sobre a creche
            </button>
            <button type="button" onClick={() => navigateTo('/como-ajudar')} className="text-left hover:text-white">
              Como ajudar
            </button>
            <button type="button" onClick={() => navigateTo('/contato')} className="text-left hover:text-white">
              Contato
            </button>
            <a className="hover:text-white" href="https://www.instagram.com/crechedatiatata/" target="_blank" rel="noreferrer">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
