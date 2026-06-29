import { useState, useEffect } from 'react';

export default function ListarEntregasPage() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Busca dados na API
  const fetchEntregas = async () => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${apiUrl}/entregas`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!response.ok) throw new Error('Erro ao buscar');
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntregas();
  }, []);

  return (
    <section className="bg-stone-50 px-5 py-12 lg:px-8 min-h-[calc(100vh-11rem)]">
      <div className="mx-auto max-w-5xl">
        {/* Header com o Botão para abrir o Modal */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-800">Entregas Realizadas</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            + Nova Entrega
          </button>
        </div>

        {/* Listagem */}
        {isLoading ? (
          <div className="text-center py-20 text-emerald-600 animate-pulse">Carregando entregas...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.item}</h3>
                <p className="text-sm text-slate-600"><strong>Quantidade:</strong> {item.quantidade} unidades</p>
                <p className="text-sm text-slate-600"><strong>Destinatário:</strong> {item.destinatario}</p>
                <p className="text-sm text-slate-500 mt-2">
                  Data: {item.data_entrega ? new Date(item.data_entrega).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">Nenhuma entrega registrada ainda.</p>
          </div>
        )}
      </div>

      {/* Modal de Registro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Registrar Nova Entrega</h3>
            
            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const payload = {
                item: formData.get('item'),
                quantidade: Number(formData.get('quantidade')),
                data_entrega: formData.get('data'),
                destinatario: formData.get('destinatario')
              };

              try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/entregas`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                  },
                  body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error('Erro ao salvar');
                
                setIsModalOpen(false);
                fetchEntregas(); // Atualiza a lista automaticamente
              } catch (err) {
                alert("Ops, erro ao registrar entrega!");
              }
            }}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Item</label>
                <input name="item" required type="text" className="w-full mt-1 p-2 border rounded-lg" placeholder="Ex: Leite em pó" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700">Qtd</label>
                  <input name="quantidade" required type="number" className="w-full mt-1 p-2 border rounded-lg" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700">Data</label>
                  <input name="data" required type="date" className="w-full mt-1 p-2 border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Destinatário</label>
                <input name="destinatario" required type="text" className="w-full mt-1 p-2 border rounded-lg" />
              </div>

              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded-lg bg-slate-100 font-semibold hover:bg-slate-200">Cancelar</button>
                <button type="submit" className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}