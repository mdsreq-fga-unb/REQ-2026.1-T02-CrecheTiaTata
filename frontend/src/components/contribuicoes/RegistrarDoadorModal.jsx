import { useEffect, useRef, useState } from 'react';
import {
  registrarDoador,
  TIPOS_DOADOR,
} from '../../services/contribuicoesService';
import { validarDoador } from '../../utils/contribuicaoValidation';

const INITIAL_FORM = {
  nome: '',
  tipo: 'pessoa_fisica',
  email: '',
  telefone: '',
};

const TIPO_LABELS = {
  pessoa_fisica: 'Pessoa física',
  pessoa_juridica: 'Pessoa jurídica',
};

function getErrorMessage(error) {
  if (error?.status === 401) {
    return 'Sua sessão expirou ou não é válida. Entre novamente.';
  }

  return error?.message || 'Não foi possível registrar o doador.';
}

export default function RegistrarDoadorModal({ onClose, onRegistered }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const nameRef = useRef(null);
  const isSavingRef = useRef(false);

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  useEffect(() => {
    nameRef.current?.focus();

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
    const validationErrors = validarDoador(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setRequestError('Corrija os campos destacados antes de registrar.');
      return;
    }

    setIsSaving(true);
    setRequestError('');

    try {
      const doador = await registrarDoador({
        nome: form.nome.trim(),
        tipo: form.tipo,
        ...(form.email.trim() && { email: form.email.trim().toLowerCase() }),
        ...(form.telefone.trim() && { telefone: form.telefone.trim() }),
      });
      await onRegistered(doador);
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
        aria-labelledby="registrar-doador-title"
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
              RF-05
            </p>
            <h2
              id="registrar-doador-title"
              className="mt-1 text-2xl font-black text-slate-950"
            >
              Registrar novo doador
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Fechar cadastro de doador"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="doador-nome" className="text-sm font-bold text-slate-700">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameRef}
              id="doador-nome"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              disabled={isSaving}
              aria-invalid={Boolean(errors.nome)}
              className={inputClass('nome')}
              placeholder="Nome completo ou razão social"
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
            )}
          </div>

          <div>
            <label htmlFor="doador-tipo" className="text-sm font-bold text-slate-700">
              Tipo
            </label>
            <select
              id="doador-tipo"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              disabled={isSaving}
              aria-invalid={Boolean(errors.tipo)}
              className={inputClass('tipo')}
            >
              {TIPOS_DOADOR.map((tipo) => (
                <option key={tipo} value={tipo}>
                  {TIPO_LABELS[tipo]}
                </option>
              ))}
            </select>
            {errors.tipo && (
              <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="doador-email"
                className="text-sm font-bold text-slate-700"
              >
                E-mail
              </label>
              <input
                id="doador-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                disabled={isSaving}
                aria-invalid={Boolean(errors.email)}
                className={inputClass('email')}
                placeholder="email@exemplo.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="doador-telefone"
                className="text-sm font-bold text-slate-700"
              >
                Telefone
              </label>
              <input
                id="doador-telefone"
                name="telefone"
                type="tel"
                value={form.telefone}
                onChange={handleChange}
                disabled={isSaving}
                className={inputClass('telefone')}
                placeholder="(61) 99999-9999"
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
              {isSaving ? 'Registrando...' : 'Registrar doador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
