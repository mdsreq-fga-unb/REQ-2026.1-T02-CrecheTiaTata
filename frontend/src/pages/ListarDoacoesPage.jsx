import { useCallback, useEffect, useState } from 'react';
import RegistrarDoacaoModal from '../components/contribuicoes/RegistrarDoacaoModal';
import RegistrarDoadorModal from '../components/contribuicoes/RegistrarDoadorModal';
import {
  listarDoacoes,
  listarDoadores,
} from '../services/contribuicoesService';

const TIPO_DOACAO_LABELS = {
  dinheiro: 'Dinheiro',
  alimento: 'Alimento',
  roupa: 'Roupa',
  brinquedo: 'Brinquedo',
  material: 'Material',
  outro: 'Outro',
};

const TIPO_DOADOR_LABELS = {
  pessoa_fisica: 'Pessoa física',
  pessoa_juridica: 'Pessoa jurídica',
};

function carregarAba(activeTab) {
  return activeTab === 'doacoes' ? listarDoacoes() : listarDoadores();
}

export default function ListarDoacoesPage() {
  const [activeTab, setActiveTab] = useState('doacoes');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [modal, setModal] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const refetch = useCallback(async (tab, { preserveItems = false } = {}) => {
    try {
      const data = await carregarAba(tab);
      setItems(data);
      setLoadError('');
    } catch (error) {
      setLoadError(error.message || 'Não foi possível carregar os dados.');
      if (!preserveItems) {
        setItems([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    carregarAba(activeTab)
      .then((data) => {
        if (!cancelled) {
          setItems(data);
          setLoadError('');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setItems([]);
          setLoadError(error.message || 'Não foi possível carregar os dados.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  const changeTab = (tab) => {
    if (tab === activeTab) {
      return;
    }

    setActiveTab(tab);
    setItems([]);
    setIsLoading(true);
    setLoadError('');
    setSuccessMessage('');
  };

  const handleRegistered = async (item, tab, message) => {
    if (item) {
      setItems((current) => [
        item,
        ...current.filter((currentItem) => currentItem.id !== item.id),
      ]);
    }

    setSuccessMessage(message);
    await refetch(tab, { preserveItems: true });
  };

  const isDoacoes = activeTab === 'doacoes';

  return (
    <section className="min-h-[calc(100vh-11rem)] bg-stone-50 px-5 py-12 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
              Gestão de contribuições
            </p>
            <h1 className="mt-1 text-3xl font-black text-slate-950 sm:text-4xl">
              Doações e doadores
            </h1>
            <p className="mt-2 text-slate-500">
              Registre e acompanhe as contribuições recebidas pela creche.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSuccessMessage('');
              setModal(isDoacoes ? 'doacao' : 'doador');
            }}
            className="shrink-0 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700"
          >
            {isDoacoes ? '+ Registrar doação' : '+ Registrar doador'}
          </button>
        </div>

        <div className="mb-8 flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => changeTab('doacoes')}
            className={`px-6 pb-4 font-bold transition ${
              isDoacoes
                ? 'border-b-2 border-emerald-700 text-emerald-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Doações
          </button>
          <button
            type="button"
            onClick={() => changeTab('doadores')}
            className={`px-6 pb-4 font-bold transition ${
              !isDoacoes
                ? 'border-b-2 border-emerald-700 text-emerald-700'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Doadores
          </button>
        </div>

        {successMessage && (
          <div
            role="status"
            className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700"
          >
            {successMessage}
          </div>
        )}

        {loadError && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm font-semibold">{loadError}</span>
            <button
              type="button"
              onClick={() => {
                setIsLoading(true);
                refetch(activeTab);
              }}
              className="text-sm font-black underline underline-offset-2"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {isLoading ? (
          <div
            aria-label="Carregando contribuições"
            className="grid gap-5 sm:grid-cols-2"
          >
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-3xl bg-white p-14 text-center shadow-sm ring-1 ring-slate-200">
            <p className="text-xl font-black text-slate-400">
              {isDoacoes
                ? 'Nenhuma doação registrada'
                : 'Nenhum doador registrado'}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Use o botão de registro para cadastrar o primeiro item.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.id}
                className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md"
              >
                {isDoacoes ? (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                        {TIPO_DOACAO_LABELS[item.tipo] ?? item.tipo}
                      </span>
                      <span className="text-sm font-black text-slate-500">
                        {item.quantidade ?? 1}{' '}
                        {(item.quantidade ?? 1) === 1 ? 'unidade' : 'unidades'}
                      </span>
                    </div>
                    <h2 className="mt-5 text-xl font-black text-slate-950">
                      {item.item || item.descricao}
                    </h2>
                    {item.item && item.descricao && (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.descricao}
                      </p>
                    )}
                    <div className="mt-4 space-y-1 text-sm text-slate-500">
                      <p>
                        <strong className="text-slate-700">Doador:</strong>{' '}
                        {item.doador_nome || 'Não informado'}
                      </p>
                      {item.data_doacao && (
                        <p>
                          <strong className="text-slate-700">Data:</strong>{' '}
                          {new Date(
                            `${item.data_doacao}T00:00:00`,
                          ).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h2 className="text-xl font-black text-slate-950">
                        {item.nome}
                      </h2>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                        {TIPO_DOADOR_LABELS[item.tipo] ??
                          item.tipo ??
                          'Pessoa física'}
                      </span>
                    </div>
                    <div className="mt-5 space-y-2 text-sm text-slate-600">
                      <p>
                        <strong className="text-slate-800">E-mail:</strong>{' '}
                        {item.email || 'Não informado'}
                      </p>
                      <p>
                        <strong className="text-slate-800">Telefone:</strong>{' '}
                        {item.telefone || 'Não informado'}
                      </p>
                    </div>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {modal === 'doacao' && (
        <RegistrarDoacaoModal
          onClose={() => setModal(null)}
          onRegistered={(doacao) =>
            handleRegistered(
              doacao,
              'doacoes',
              'Doação registrada com sucesso.',
            )
          }
        />
      )}

      {modal === 'doador' && (
        <RegistrarDoadorModal
          onClose={() => setModal(null)}
          onRegistered={(doador) =>
            handleRegistered(
              doador,
              'doadores',
              'Doador registrado com sucesso.',
            )
          }
        />
      )}
    </section>
  );
}
