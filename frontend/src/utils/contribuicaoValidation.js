import {
  TIPOS_DOACAO,
  TIPOS_DOADOR,
} from '../services/contribuicoesService';

const DOMINIOS_EMAIL_PERMITIDOS = [
  'gmail.com',
  'outlook.com',
  'outlook.com.br',
  'hotmail.com',
  'hotmail.com.br',
  'live.com',
  'yahoo.com',
  'yahoo.com.br',
  'icloud.com',
  'proton.me',
  'protonmail.com',
];

export function validarDoador(form) {
  const errors = {};

  if (!form.nome.trim()) {
    errors.nome = 'Informe o nome do doador.';
  }

  if (!TIPOS_DOADOR.includes(form.tipo)) {
    errors.tipo = 'Selecione um tipo de doador válido.';
  }

  if (form.email.trim()) {
    const email = form.email.trim().toLowerCase();
    const formatoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const dominio = email.split('@')[1];

    if (!formatoValido || !DOMINIOS_EMAIL_PERMITIDOS.includes(dominio)) {
      errors.email = 'Informe um e-mail válido de um provedor reconhecido.';
    }
  }

  return errors;
}

export function validarDoacao(form) {
  const errors = {};

  if (!TIPOS_DOACAO.includes(form.tipo)) {
    errors.tipo = form.tipo
      ? 'Selecione um tipo de doação válido.'
      : 'Selecione o tipo da doação.';
  }

  if (!form.descricao.trim()) {
    errors.descricao = 'Informe a descrição da doação.';
  }

  const quantidade = Number(form.quantidade);
  if (!Number.isInteger(quantidade) || quantidade <= 0) {
    errors.quantidade = 'A quantidade deve ser um número inteiro maior que zero.';
  }

  return errors;
}
