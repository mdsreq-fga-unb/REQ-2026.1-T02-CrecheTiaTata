import { useEffect, useRef, useState } from 'react';
import {
  registrarDoacao,
  TIPOS_DOACAO,
} from '../../services/contribuicoesService';
import { validarDoacao } from '../../utils/contribuicaoValidation';

const INITIAL_FORM = {
  doador_nome: '',
  tipo: '',
  descricao: '',
  quantidade: '1',
  data_doacao: '',
};

const TIPO_LABELS = {
  dinheiro: 'Dinheiro',
  alimento: 'Alimento',
  roupa: 'Roupa',
  brinquedo: 'Brinquedo',
  material: 'Material',
  outro: 'Outro',
};

function getErrorMessage(error) {
  if (error?.status === 401) {
    return 'Sua sessão expirou ou não é válida. Entre novamente.';
  }

  return error?.message || 'Não foi possível registrar a doação.';
}

export default function RegistrarDoacaoModal({ onClose, onRegistered }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const donorRef = useRef(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  useEffect(() => {
    donorRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSavingRef.current) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setRequestError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validarDoacao(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setRequestError('Corrija os campos destacados antes de registrar.');
      return;
    }

    setIsSaving(true);
    setRequestError('');

    try {
      const doacao = await registrarDoacao({
        tipo: form.tipo,
        descricao: form.descricao.trim(),
        quantidade: Number(form.quantidade),
        ...(form.doador_nome.trim() && {
          doador_nome: form.doador_nome.trim(),
        }),
        ...(form.data_doacao && { data_doacao: form.data_doacao }),
      });
      await onRegistered(doacao);
      onClose();
    } catch (error) {
      setRequestError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (field) =>
    `mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 outline-none transition focus:ring-2 ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
    }`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSaving) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="registrar-doacao-title"
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
              RF-02
            </p>
            <h2
              id="registrar-doacao-title"
              className="mt-1 text-2xl font-black text-slate-950"
            >
              Registrar nova doação
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Fechar cadastro de doação"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="doacao-doador"
              className="text-sm font-bold text-slate-700"
            >
              Nome do doador
            </label>
            <input
              ref={donorRef}
              id="doacao-doador"
              name="doador_nome"
              value={form.doador_nome}
              onChange={handleChange}
              disabled={isSaving}
              className={inputClass('doador_nome')}
              placeholder="Opcional"
            />
          </div>

          <div>
            <label
              htmlFor="doacao-tipo"
              className="text-sm font-bold text-slate-700"
            >
              Tipo <span className="text-red-500">*</span>
            </label>
            <select
              id="doacao-tipo"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              disabled={isSaving}
              aria-invalid={Boolean(errors.tipo)}
              className={inputClass('tipo')}
            >
              <option value="">Selecione</option>
              {TIPOS_DOACAO.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {TIPO_LABELS[tipo]}
                </option>
              ))}
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="doacao-descricao"
              className="text-sm font-bold text-slate-700"
            >
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              id="doacao-descricao"
              name="descricao"
              rows="4"
              value={form.descricao}
              onChange={handleChange}
              disabled={isSaving}
              aria-invalid={Boolean(errors.descricao)}
              className={`${inputClass('descricao')} resize-y`}
              placeholder="Descreva os itens ou valores recebidos"
            />
            {errors.descricao && (
              <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="doacao-quantidade"
                className="text-sm font-bold text-slate-700"
              >
                Quantidade <span className="text-red-500">*</span>
              </label>
              <input
                id="doacao-quantidade"
                name="quantidade"
                type="number"
                min="1"
                step="1"
                value={form.quantidade}
                onChange={handleChange}
                disabled={isSaving}
                aria-invalid={Boolean(errors.quantidade)}
                className={inputClass('quantidade')}
              />
              {errors.quantidade && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.quantidade}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="doacao-data"
                className="text-sm font-bold text-slate-700"
              >
                Data da doação
              </label>
              <input
                id="doacao-data"
                name="data_doacao"
                type="date"
                value={form.data_doacao}
                onChange={handleChange}
                disabled={isSaving}
                className={inputClass('data_doacao')}
              />
            </div>
          </div>

          {requestError && (
            <div
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
            >
              {requestError}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
            >
              {isSaving ? 'Registrando...' : 'Registrar doação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
