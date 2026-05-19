export interface Crianca {
  id?: string;
  nome: string;
  data_nascimento: string;
  responsavel_nome: string;
  turma_id?: string;
  created_at?: string;
}

export interface ApiError {
  error: string;
  status: number;
}
