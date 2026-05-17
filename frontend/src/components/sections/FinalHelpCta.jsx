import { HeartIcon } from '../icons';
import { requireAuthForAction } from '../../utils/protectedActions';

export default function FinalHelpCta() {
  return (
    <section className="bg-emerald-700 px-5 py-16 text-center text-white lg:px-8">
      <div className="mx-auto max-w-3xl">
        <HeartIcon className="mx-auto h-10 w-10" />
        <h2 className="mt-4 text-3xl font-black sm:text-4xl">Pronto para fazer a diferença?</h2>
        <p className="mt-4 text-emerald-50">Entre em contato e descubra como sua ajuda pode transformar vidas.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" onClick={() => requireAuthForAction('/contato?acao=doar')} className="rounded-xl bg-white px-6 py-4 font-bold text-emerald-700">
            Quero doar
          </button>
          <button type="button" onClick={() => requireAuthForAction('/contato?acao=voluntario')} className="rounded-xl border border-emerald-300 px-6 py-4 font-bold text-white">
            Quero ser voluntário
          </button>
        </div>
      </div>
    </section>
  );
}
