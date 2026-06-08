/* global describe, it, expect, beforeEach, afterEach, global */
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import ListarDoacoesPage from './ListarDoacoesPage';

// Mock local apenas para o teste passar sem precisar do backend ligado
const mockData = [
  { id: 1, item: 'Leite em pó (Lata)', quantidade: 15, categoria: 'Alimentação', urgencia: 'Alta' },
  { id: 2, item: 'Fraldas Tamanho M', quantidade: 8, categoria: 'Higiene', urgencia: 'Alta' },
  { id: 3, item: 'Casacos infantis', quantidade: 25, categoria: 'Vestuário', urgencia: 'Média' },
  { id: 4, item: 'Brinquedos educativos', quantidade: 10, categoria: 'Lazer', urgencia: 'Baixa' }
];

describe('Página de Listar Doações', () => {
  
  // Antes de cada teste, interceptamos o fetch com o Vitest (vi)
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );
  });

  // Limpar o Mock após os testes para não dar interferência

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar o cabeçalho e os títulos da página corretamente', async () => {
    render(<ListarDoacoesPage />);
    
    expect(screen.getByText('Mural de Doações')).toBeInTheDocument();
    expect(screen.getByText('Itens Disponíveis')).toBeInTheDocument();
    
    // Esperar a interface atualizar

    await waitFor(() => {
      expect(screen.getByText('Leite em pó (Lata)')).toBeInTheDocument();
    });
  });

  it('deve exibir feedback visual caso a lista de doações venha vazia', async () => {

    // Forçando o mock a retornar um array vazio para este teste específico
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve([]) })
    );

    render(<ListarDoacoesPage />);

    await waitFor(() => {
      expect(screen.getByText('Nenhum item disponível')).toBeInTheDocument();
      expect(screen.getByText('No momento, não temos itens cadastrados no mural de doações.')).toBeInTheDocument();
    });
  });

  it('deve renderizar todos os itens vindos da API na tela com tags', async () => {
    render(<ListarDoacoesPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Leite em pó (Lata)')).toBeInTheDocument();
      expect(screen.getByText('Fraldas Tamanho M')).toBeInTheDocument();
      expect(screen.getByText('Alimentação')).toBeInTheDocument();
      expect(screen.getByText('Higiene')).toBeInTheDocument();
    });
  });

  it('deve renderizar o estado de erro caso a requisição falhe', async () => {

    // Forçando a requisição a dar erro
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({ ok: false })
    );

    render(<ListarDoacoesPage />);

    await waitFor(() => {
      expect(screen.getByText('Ops! Tivemos um problema.')).toBeInTheDocument();
      expect(screen.getByText('Não foi possível conectar com o servidor da creche.')).toBeInTheDocument();
    });
  });
});