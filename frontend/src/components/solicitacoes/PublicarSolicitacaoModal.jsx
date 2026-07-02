import { useEffect, useRef, useState } from 'react';
import {
  CATEGORIAS_SOLICITACAO,
  STATUS_SOLICITACAO,
  publicarSolicitacao,
} from '../../services/solicitacoesService';
import { validarSolicitacao } from '../../utils/solicitacaoValidation';

const INITIAL_FORM = {
  titulo: '',
  descricao: '',
  categoria: '',
  status: 'pendente',
};

const CATEGORIA_LABELS = {
  alimentacao: 'Alimentação',
  material: 'Material',
  voluntario: 'Voluntariado',
  financeiro: 'Financeiro',
  outro: 'Outro',
};

const STATUS_LABELS = {
  pendente: 'Pendente',
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
};

function getRequestErrorMessage(error) {
  if (error?.status === 401) {
    return 'Sua sessão expirou ou não é válida. Entre novamente para publicar.';
  }

  if (error?.status === 422) {
    return error.message || 'Revise os campos informados.';
  }

  if (error?.status === 400) {
    return error.message || 'Os dados enviados não puderam ser processados.';
  }

  return error?.message || 'Não foi possível publicar. Tente novamente.';
}

export default function PublicarSolicitacaoModal({
  isOpen,
  onClose,
  onPublished,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const titleInputRef = useRef(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    titleInputRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !isSavingRef.current) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleChange = ({ target: { name, value } }) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setRequestError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validarSolicitacao(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setRequestError('Corrija os campos destacados antes de publicar.');
      return;
    }

    setIsSaving(true);
    setRequestError('');

    try {
      const solicitacao = await publicarSolicitacao({
        titulo: form.titulo.trim(),
        descricao: form.descricao.trim(),
        categoria: form.categoria,
        status: form.status || 'pendente',
      });

      await onPublished(solicitacao);
      onClose();
    } catch (error) {
      setRequestError(getRequestErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !isSaving) {
      onClose();
    }
  };

  const inputClass = (field) =>
    `mt-1.5 w-full rounded-xl border bg-white px-3.5 py-2.5 text-slate-900 outline-none transition focus:ring-2 ${
      errors[field]
        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
        : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-100'
    }`;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
      onMouseDown={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="publicar-solicitacao-title"
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
              Nova necessidade
            </p>
            <h2
              id="publicar-solicitacao-title"
              className="mt-1 text-2xl font-black text-slate-950"
            >
              Publicar solicitação de apoio
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Fechar modal"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="titulo" className="text-sm font-bold text-slate-700">
              Título <span className="text-red-500">*</span>
            </label>
            <input
              ref={titleInputRef}
              id="titulo"
              name="titulo"
              type="text"
              value={form.titulo}
              onChange={handleChange}
              disabled={isSaving}
              aria-invalid={Boolean(errors.titulo)}
              aria-describedby={errors.titulo ? 'titulo-error' : undefined}
              className={inputClass('titulo')}
              placeholder="Ex.: Materiais escolares para o maternal"
            />
            {errors.titulo && (
              <p id="titulo-error" className="mt-1 text-sm text-red-600">
                {errors.titulo}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="text-sm font-bold text-slate-700"
            >
              Descrição <span className="text-red-500">*</span>
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows="4"
              value={form.descricao}
              onChange={handleChange}
              disabled={isSaving}
              aria-invalid={Boolean(errors.descricao)}
              aria-describedby={
                errors.descricao ? 'descricao-error' : undefined
              }
              className={`${inputClass('descricao')} resize-y`}
              placeholder="Explique o que a creche precisa e como a pessoa pode ajudar."
            />
            {errors.descricao && (
              <p id="descricao-error" className="mt-1 text-sm text-red-600">
                {errors.descricao}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="categoria"
                className="text-sm font-bold text-slate-700"
              >
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                id="categoria"
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                disabled={isSaving}
                aria-invalid={Boolean(errors.categoria)}
                aria-describedby={
                  errors.categoria ? 'categoria-error' : undefined
                }
                className={inputClass('categoria')}
              >
                <option value="">Selecione</option>
                {CATEGORIAS_SOLICITACAO.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {CATEGORIA_LABELS[categoria]}
                  </option>
                ))}
              </select>
              {errors.categoria && (
                <p id="categoria-error" className="mt-1 text-sm text-red-600">
                  {errors.categoria}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="text-sm font-bold text-slate-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
                disabled={isSaving}
                aria-invalid={Boolean(errors.status)}
                aria-describedby={errors.status ? 'status-error' : undefined}
                className={inputClass('status')}
              >
                {STATUS_SOLICITACAO.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABELS[status]}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p id="status-error" className="mt-1 text-sm text-red-600">
                  {errors.status}
                </p>
              )}
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
              className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-70"
            >
              {isSaving ? 'Publicando...' : 'Publicar solicitação'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
