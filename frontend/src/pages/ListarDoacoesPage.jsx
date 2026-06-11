import { useState, useEffect } from 'react';

export default function ListarDoacoesPage() {
  const [activeTab, setActiveTab] = useState('doacoes');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${apiUrl}${activeTab === 'doacoes' ? '/doacoes' : '/doadores'}`);
        if (!response.ok) throw new Error('Erro ao buscar dados');
        
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error("Erro na integração:", err);
        setItems([]); // Retorna array vazio em caso de erro para não quebrar a Interface
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  return (
    <section className="bg-stone-50 px-5 py-12 lg:px-8 min-h-[calc(100vh-11rem)]">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-center mb-8 border-b border-slate-200">
          <button onClick={() => setActiveTab('doacoes')} className={`pb-4 px-6 font-bold ${activeTab === 'doacoes' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-slate-500'}`}>Itens Disponíveis</button>
          <button onClick={() => setActiveTab('doadores')} className={`pb-4 px-6 font-bold ${activeTab === 'doadores' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-slate-500'}`}>Doadores</button>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-emerald-600 animate-pulse">Carregando...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

            {/* INÍCIO DOS CARDS */}
            
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{activeTab === 'doacoes' ? item.item : item.nome}</h3>
                  {activeTab === 'doacoes' && (
                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                      {item.urgencia}
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-slate-600 space-y-1 mb-6">
                  {activeTab === 'doacoes' ? (
                    <>
                      <p><strong className="text-slate-800">Categoria:</strong> {item.categoria}</p>
                      <p><strong className="text-slate-800">Quantidade:</strong> {item.quantidade} unidades</p>
                    </>
                  ) : (
                    <p><strong className="text-slate-800">Email:</strong> {item.email}</p>
                  )}
                </div>

                <button className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                  {activeTab === 'doacoes' ? 'Quero Doar' : 'Ver Doações / Editar'}
                </button>
              </div>
            ))}
            {/* FIM DOS CARDS */}
          </div>
        ) : (
          /* MENSAGEM DE ERRO CASO A LISTA ESTEJA VAZIA */
          <div className="rounded-xl bg-slate-100 p-8 text-center ring-1 ring-slate-200 mt-4">
            <h3 className="text-lg font-bold text-slate-700 mb-2">Ops! Tivemos um problema.</h3>
            <p className="text-slate-500">Nenhum dado encontrado no momento. O servidor pode estar indisponível.</p>
          </div>
        )}
      </div>
    </section>
  );
}