import {
  CATEGORIAS_SOLICITACAO,
  STATUS_SOLICITACAO,
} from '../services/solicitacoesService';

export function validarSolicitacao(form) {
  const errors = {};

  if (!form.titulo.trim()) {
    errors.titulo = 'Informe o título.';
  }

  if (!form.descricao.trim()) {
    errors.descricao = 'Informe a descrição.';
  }

  if (!form.categoria) {
    errors.categoria = 'Selecione uma categoria.';
  } else if (!CATEGORIAS_SOLICITACAO.includes(form.categoria)) {
    errors.categoria = 'Selecione uma categoria válida.';
  }

  if (form.status && !STATUS_SOLICITACAO.includes(form.status)) {
    errors.status = 'Selecione um status válido.';
  }

  return errors;
}
