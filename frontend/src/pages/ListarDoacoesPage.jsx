import { useState, useEffect } from 'react';

export default function ListarDoacoesPage() {
  const [doacoes, setDoacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoacoes = async () => {
      try {
        // Puxa a URL base do .env ou usa o localhost de fallback
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        
        const response = await fetch(`${apiUrl}/doacoes`);
        
        if (!response.ok) {
          throw new Error('Não foi possível conectar com o servidor da creche.');
        }
        
        const data = await response.json();
        setDoacoes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoacoes();
  }, []);

  return (
    <section className="bg-stone-50 px-5 py-12 lg:px-8 lg:py-16 min-h-[calc(100vh-11rem)]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">Mural de Doações</span>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Itens Disponíveis</h1>
          <p className="mt-4 text-slate-600">Confira a lista de doações cadastradas no sistema.</p>
        </header>

        {/* 1. Tratamento de Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            <span className="ml-4 text-slate-500 font-medium">Buscando itens na creche...</span>
          </div>
        )}

        {/* 2. Tratamento de Erro de Conexão */}
        {!isLoading && error && (
          <div className="rounded-xl bg-red-50 p-6 text-center ring-1 ring-red-200">
            <h3 className="text-lg font-bold text-red-800 mb-2">Ops! Tivemos um problema.</h3>
            <p className="text-red-600">{error}</p>
            <p className="text-sm text-red-500 mt-4">Verifique se o backend está rodando e tente recarregar a página.</p>
          </div>
        )}

        {/* 3. Tratamento de Lista Vazia */}
        {!isLoading && !error && doacoes.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
            <span className="text-4xl">📦</span>
            <h3 className="mt-4 text-xl font-bold text-slate-900">Nenhum item disponível</h3>
            <p className="mt-2 text-slate-600">No momento, não temos itens cadastrados no mural de doações.</p>
          </div>
        )}

        {/* 4. Lista Real de Doações */}
        {!isLoading && !error && doacoes.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {doacoes.map((doacao) => (
              <div key={doacao.id} className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{doacao.item}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${doacao.urgencia === 'Alta' ? 'bg-red-100 text-red-700' : 
                      doacao.urgencia === 'Média' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-emerald-100 text-emerald-700'}`}>
                    {doacao.urgencia}
                  </span>
                </div>
                <div className="text-sm text-slate-600 space-y-2">
                  <p><strong>Categoria:</strong> {doacao.categoria}</p>
                  <p><strong>Quantidade disponível:</strong> {doacao.quantidade} unidades</p>
                </div>
                <button className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                  Quero Doar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}