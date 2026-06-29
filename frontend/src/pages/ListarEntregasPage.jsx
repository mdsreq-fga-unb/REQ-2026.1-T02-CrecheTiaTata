import { useState, useEffect } from 'react';

export default function ListarEntregasPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEntregas = async () => {
      setIsLoading(true);
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        
        // Requisição integrada (apontando para o endpoint do backend)
        const response = await fetch(`${apiUrl}/entregas`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) throw new Error('Erro ao buscar entregas');

        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error("Erro na integração:", err);
        setItems([]); // Retorna vazio se der erro ou se o backend estiver offline
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntregas();
  }, []);

  return (
    <section className="bg-stone-50 px-5 py-12 lg:px-8 min-h-[calc(100vh-11rem)]">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Entregas Realizadas</h2>
        </div>

        {/* Listagem ou Estados de Erro/Loading */}
        {isLoading ? (
          <div className="text-center py-20 text-emerald-600 animate-pulse">Carregando entregas...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white p-6 shadow-md border border-slate-200 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.item}</h3>
                <p className="text-sm text-slate-600"><strong>Quantidade:</strong> {item.quantidade} unidades</p>
                <p className="text-sm text-slate-600"><strong>Destinatário:</strong> {item.destinatario}</p>
                <p className="text-sm text-slate-500 mt-2">
                  Data: {item.data_entrega ? new Date(item.data_entrega).toLocaleDateString('pt-BR') : 'Data não informada'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">Nenhuma entrega registrada no momento.</p>
          </div>
        )}
      </div>
    </section>
  );
}