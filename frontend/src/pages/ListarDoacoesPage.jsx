import { useState, useEffect } from 'react';

export default function ListarDoacoesPage() {
  const [activeTab, setActiveTab] = useState('doacoes');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ESTADO DE ADMIN PARA TESTES DE REQUISITOS
  const [isAdmin, setIsAdmin] = useState(true);

  // ESTADOS DO MODAL DE EDIÇÃO
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [isSaving, setIsSaving] = useState(false);

  // ESTADOS DO MODAL DE HISTÓRICO DE DOAÇÕES
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [donorHistory, setDonorHistory] = useState(null);

  const getCorUrgencia = (urgencia) => {
    switch (urgencia?.toLowerCase()) {
      case 'baixa': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'média':
      case 'media': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'alta': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

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
        setItems([]); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData(item);
    setStatusMessage({ type: '', text: '' });
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const openHistoryModal = (doador) => {
    setDonorHistory(doador);
    setIsHistoryModalOpen(true);
  };

  const closeHistoryModal = () => {
    setIsHistoryModalOpen(false);
    setDonorHistory(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (activeTab === 'doacoes' && (!formData.item || !formData.quantidade || !formData.categoria)) {
      setStatusMessage({ type: 'error', text: 'Preencha todos os campos da doação!' });
      return;
    }
    if (activeTab === 'doadores' && (!formData.nome || !formData.email || !formData.telefone)) {
      setStatusMessage({ type: 'error', text: 'Preencha todos os campos do doador, incluindo telefone!' });
      return;
    }

    setIsSaving(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL;
      const endpoint = activeTab === 'doacoes' ? `/doacoes/${editingItem.id}` : `/doadores/${editingItem.id}`;
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Falha ao atualizar no backend');

      setStatusMessage({ type: 'success', text: 'Atualizado com sucesso!' });
      
      setItems(items.map(item => item.id === editingItem.id ? formData : item));
      
      setTimeout(() => closeEditModal(), 1500);
      
    } catch (err) {
      console.error("Erro no update:", err);
      setStatusMessage({ type: 'error', text: 'Erro ao salvar as alterações.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="bg-stone-50 px-5 py-12 lg:px-8 min-h-[calc(100vh-11rem)] relative">
      <div className="mx-auto max-w-5xl">
        
        {/* TOGGLE DE ADMIN */}
        <div className="flex justify-end mb-4">
          <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} className="accent-emerald-600 w-4 h-4"/>
            <span className="text-sm font-bold text-slate-700">Simular visão de Admin</span>
          </label>
        </div>

        <div className="flex justify-center mb-8 border-b border-slate-200">
          <button onClick={() => setActiveTab('doacoes')} className={`pb-4 px-6 font-bold ${activeTab === 'doacoes' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-slate-500'}`}>Itens Disponíveis</button>
          <button onClick={() => setActiveTab('doadores')} className={`pb-4 px-6 font-bold ${activeTab === 'doadores' ? 'text-emerald-700 border-b-2 border-emerald-700' : 'text-slate-500'}`}>Doadores</button>
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-emerald-600 animate-pulse">Carregando...</div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-slate-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900">{activeTab === 'doacoes' ? item.item : item.nome}</h3>
                  {activeTab === 'doacoes' && (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getCorUrgencia(item.urgencia)}`}>
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
                    <>
                      <p><strong className="text-slate-800">Email:</strong> {item.email}</p>
                      <p><strong className="text-slate-800">Telefone:</strong> {item.telefone || 'Não informado'}</p>
                    </>
                  )}
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => activeTab === 'doadores' ? openHistoryModal(item) : null}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">
                    {activeTab === 'doacoes' ? 'Quero Doar' : 'Ver Doações'}
                  </button>
                  
                  {isAdmin && (
                    <button onClick={() => openEditModal(item)} className="flex-1 rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors border border-slate-300">
                      Editar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-slate-100 p-8 text-center ring-1 ring-slate-200 mt-4">
            <h3 className="text-lg font-bold text-slate-700 mb-2">Ops! Tivemos um problema.</h3>
            <p className="text-slate-500">Nenhum dado encontrado no momento. O servidor pode estar indisponível.</p>
          </div>
        )}
      </div>

      {/* MODAL DE EDIÇÃO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">Editar {activeTab === 'doacoes' ? 'Doação' : 'Doador'}</h2>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              {activeTab === 'doacoes' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Item</label>
                    <input type="text" name="item" value={formData.item || ''} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 border p-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                    <input type="text" name="categoria" value={formData.categoria || ''} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 border p-2 outline-none" required />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Qtd</label>
                      <input type="number" name="quantidade" value={formData.quantidade || ''} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 border p-2 outline-none" required />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Urgência</label>
                      <select name="urgencia" value={formData.urgencia || ''} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 border p-2 outline-none">
                        <option value="Baixa">Baixa</option>
                        <option value="Média">Média</option>
                        <option value="Alta">Alta</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                    <input type="text" name="nome" value={formData.nome || ''} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 border p-2 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 border p-2 outline-none" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
                    <input type="tel" name="telefone" value={formData.telefone || ''} onChange={handleInputChange} className="w-full rounded-lg border-slate-300 border p-2 outline-none" required placeholder="(00) 00000-0000" />
                  </div>
                </>
              )}
              {statusMessage.text && (
                <div className={`p-3 rounded-lg text-sm font-medium ${statusMessage.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {statusMessage.text}
                </div>
              )}
              <div className="pt-2">
                <button type="submit" disabled={isSaving} className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 transition-colors disabled:opacity-70">
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE HISTÓRICO DE DOAÇÕES */}
      {isHistoryModalOpen && donorHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Histórico de Doações</h2>
                <p className="text-sm text-slate-500">Doador(a): <span className="font-semibold text-slate-700">{donorHistory.nome}</span></p>
              </div>
              <button onClick={closeHistoryModal} className="text-slate-400 hover:text-slate-600 font-bold text-2xl leading-none">&times;</button>
            </div>

            {donorHistory.historico && donorHistory.historico.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-slate-800">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Item</th>
                      <th className="px-4 py-3 font-semibold text-center">Qtd</th>
                      <th className="px-4 py-3 font-semibold">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {donorHistory.historico.map((doacao) => (
                      <tr key={doacao.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{doacao.item}</td>
                        <td className="px-4 py-3 text-center">{doacao.quantidade}</td>
                        <td className="px-4 py-3">{doacao.data}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-lg bg-slate-50 p-6 text-center border border-slate-200">
                <p className="text-slate-500">Nenhuma doação registrada para este usuário ainda.</p>
              </div>
            )}

            <div className="mt-6">
              <button onClick={closeHistoryModal} className="w-full rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}