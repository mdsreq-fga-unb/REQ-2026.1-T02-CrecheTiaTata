export default function HistoricoDoacoesModal({ donor, onClose }) {
  const history = donor.historico_contribuicoes ?? donor.historico ?? [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="historico-doacoes-title"
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
              Doador: {donor.nome}
            </p>
            <h2
              id="historico-doacoes-title"
              className="mt-1 text-2xl font-black text-slate-950"
            >
              Histórico de doações
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar histórico"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            ×
          </button>
        </div>

        {history.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 p-8 text-center text-sm font-semibold text-slate-500">
            Nenhuma doação registrada para este doador.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-700">
                <tr>
                  <th className="px-4 py-3 font-bold">Doação</th>
                  <th className="px-4 py-3 text-center font-bold">Qtd.</th>
                  <th className="px-4 py-3 font-bold">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600">
                {history.map((donation) => (
                  <tr key={donation.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {donation.item || donation.descricao}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {donation.quantidade ?? 1}
                    </td>
                    <td className="px-4 py-3">
                      {donation.data || donation.data_doacao || 'Não informada'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
