export default function ListarDoacoesPage() {

  // Mocks para testar a interface

  const mockDoacoes = [
    { id: 1, item: 'Leite em pó (Lata)', quantidade: 15, categoria: 'Alimentação', urgencia: 'Alta' },
    { id: 2, item: 'Fraldas Tamanho M', quantidade: 8, categoria: 'Higiene', urgencia: 'Alta' },
    { id: 3, item: 'Casacos infantis', quantidade: 25, categoria: 'Vestuário', urgencia: 'Média' },
    { id: 4, item: 'Brinquedos educativos', quantidade: 10, categoria: 'Lazer', urgencia: 'Baixa' },
  ];

  return (
    <section className="bg-stone-50 px-5 py-12 lg:px-8 lg:py-16 min-h-[calc(100vh-11rem)]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 text-center">
          <span className="text-sm font-bold uppercase tracking-wide text-emerald-700">Mural de Doações</span>
          <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">Itens Disponíveis</h1>
          <p className="mt-4 text-slate-600">Confira a lista de doações cadastradas no sistema.</p>
        </header>

        {/* Cartões baseados nos mocks */}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {mockDoacoes.map((doacao) => (
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

      </div>
    </section>
  );
}