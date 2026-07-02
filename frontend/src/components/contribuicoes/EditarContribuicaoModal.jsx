import { useEffect, useRef, useState } from 'react';
import {
  atualizarDoacao,
  atualizarDoador,
  TIPOS_DOACAO,
  TIPOS_DOADOR,
} from '../../services/contribuicoesService';
import {
  validarDoacao,
  validarDoador,
} from '../../utils/contribuicaoValidation';

const TIPO_DOACAO_LABELS = {
  dinheiro: 'Dinheiro',
  alimento: 'Alimento',
  roupa: 'Roupa',
  brinquedo: 'Brinquedo',
  material: 'Material',
  outro: 'Outro',
};

const TIPO_DOADOR_LABELS = {
  pessoa_fisica: 'Pessoa física',
  pessoa_juridica: 'Pessoa jurídica',
};

function initialForm(item, type) {
  if (type === 'doacao') {
    return {
      doador_nome: item.doador_nome ?? '',
      tipo: item.tipo ?? '',
      descricao: item.descricao ?? item.item ?? '',
      quantidade: String(item.quantidade ?? 1),
      data_doacao: item.data_doacao ?? '',
    };
  }

  return {
    nome: item.nome ?? '',
    tipo: item.tipo ?? 'pessoa_fisica',
    email: item.email ?? '',
    telefone: item.telefone ?? '',
  };
}

export default function EditarContribuicaoModal({
  item,
  type,
  onClose,
  onUpdated,
}) {
  const [form, setForm] = useState(() => initialForm(item, type));
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const firstInputRef = useRef(null);
  const isSavingRef = useRef(false);
  const isDoacao = type === 'doacao';

  useEffect(() => {
    isSavingRef.current = isSaving;
  }, [isSaving]);

  useEffect(() => {
    firstInputRef.current?.focus();

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
    const validationErrors = isDoacao
      ? validarDoacao(form)
      : validarDoador(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setRequestError('Corrija os campos destacados antes de salvar.');
      return;
    }

    setIsSaving(true);
    setRequestError('');

    try {
      const changes = isDoacao
        ? {
            tipo: form.tipo,
            descricao: form.descricao.trim(),
            quantidade: Number(form.quantidade),
            ...(form.doador_nome.trim() && {
              doador_nome: form.doador_nome.trim(),
            }),
            ...(form.data_doacao && { data_doacao: form.data_doacao }),
          }
        : {
            nome: form.nome.trim(),
            tipo: form.tipo,
            ...(form.email.trim() && {
              email: form.email.trim().toLowerCase(),
            }),
            ...(form.telefone.trim() && {
              telefone: form.telefone.trim(),
            }),
          };

      const updated = isDoacao
        ? await atualizarDoacao(item.id, changes)
        : await atualizarDoador(item.id, changes);

      await onUpdated({ ...item, ...changes, ...updated });
      onClose();
    } catch (error) {
      setRequestError(
        error?.message || 'Não foi possível salvar as alterações.',
      );
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="editar-contribuicao-title"
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">
              Editar cadastro
            </p>
            <h2
              id="editar-contribuicao-title"
              className="mt-1 text-2xl font-black text-slate-950"
            >
              Editar {isDoacao ? 'doação' : 'doador'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Fechar edição"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {isDoacao ? (
            <>
              <div>
                <label htmlFor="editar-doador" className="text-sm font-bold text-slate-700">
                  Nome do doador
                </label>
                <input
                  ref={firstInputRef}
                  id="editar-doador"
                  name="doador_nome"
                  value={form.doador_nome}
                  onChange={handleChange}
                  disabled={isSaving}
                  className={inputClass('doador_nome')}
                />
              </div>
              <div>
                <label htmlFor="editar-tipo-doacao" className="text-sm font-bold text-slate-700">
                  Tipo
                </label>
                <select
                  id="editar-tipo-doacao"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  disabled={isSaving}
                  className={inputClass('tipo')}
                >
                  <option value="">Selecione</option>
                  {TIPOS_DOACAO.map((tipoDoacao) => (
                    <option key={tipoDoacao} value={tipoDoacao}>
                      {TIPO_DOACAO_LABELS[tipoDoacao]}
                    </option>
                  ))}
                </select>
                {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>}
              </div>
              <div>
                <label htmlFor="editar-descricao" className="text-sm font-bold text-slate-700">
                  Descrição
                </label>
                <textarea
                  id="editar-descricao"
                  name="descricao"
                  rows="4"
                  value={form.descricao}
                  onChange={handleChange}
                  disabled={isSaving}
                  className={`${inputClass('descricao')} resize-y`}
                />
                {errors.descricao && <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="editar-quantidade" className="text-sm font-bold text-slate-700">
                    Quantidade
                  </label>
                  <input
                    id="editar-quantidade"
                    name="quantidade"
                    type="number"
                    min="1"
                    step="1"
                    value={form.quantidade}
                    onChange={handleChange}
                    disabled={isSaving}
                    className={inputClass('quantidade')}
                  />
                  {errors.quantidade && <p className="mt-1 text-sm text-red-600">{errors.quantidade}</p>}
                </div>
                <div>
                  <label htmlFor="editar-data" className="text-sm font-bold text-slate-700">
                    Data
                  </label>
                  <input
                    id="editar-data"
                    name="data_doacao"
                    type="date"
                    value={form.data_doacao}
                    onChange={handleChange}
                    disabled={isSaving}
                    className={inputClass('data_doacao')}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label htmlFor="editar-nome" className="text-sm font-bold text-slate-700">
                  Nome
                </label>
                <input
                  ref={firstInputRef}
                  id="editar-nome"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  disabled={isSaving}
                  className={inputClass('nome')}
                />
                {errors.nome && <p className="mt-1 text-sm text-red-600">{errors.nome}</p>}
              </div>
              <div>
                <label htmlFor="editar-tipo-doador" className="text-sm font-bold text-slate-700">
                  Tipo
                </label>
                <select
                  id="editar-tipo-doador"
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  disabled={isSaving}
                  className={inputClass('tipo')}
                >
                  {TIPOS_DOADOR.map((tipoDoador) => (
                    <option key={tipoDoador} value={tipoDoador}>
                      {TIPO_DOADOR_LABELS[tipoDoador]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="editar-email" className="text-sm font-bold text-slate-700">
                    E-mail
                  </label>
                  <input
                    id="editar-email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={isSaving}
                    className={inputClass('email')}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="editar-telefone" className="text-sm font-bold text-slate-700">
                    Telefone
                  </label>
                  <input
                    id="editar-telefone"
                    name="telefone"
                    type="tel"
                    value={form.telefone}
                    onChange={handleChange}
                    disabled={isSaving}
                    className={inputClass('telefone')}
                  />
                </div>
              </div>
            </>
          )}

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
              {isSaving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
