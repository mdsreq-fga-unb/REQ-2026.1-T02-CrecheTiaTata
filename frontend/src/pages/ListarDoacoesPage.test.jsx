import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ListarDoacoesPage from './ListarDoacoesPage';

// Mock do fetch para não depender do backend real durante os testes
globalThis.fetch = vi.fn();

describe('Página de Listar Doações e Doadores (RF-03 e RF-06)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve renderizar as abas e o toggle de admin corretamente', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<ListarDoacoesPage />);
    
    expect(screen.getByText('Itens Disponíveis')).toBeInTheDocument();
    expect(screen.getByText('Doadores')).toBeInTheDocument();
    expect(screen.getByText('Simular visão de Admin')).toBeInTheDocument();
  });

  it('deve exibir as doações vindas da API', async () => {
    const mockDoacoes = [
      { id: 1, item: 'Leite em pó (Lata)', quantidade: 15, categoria: 'Alimentação', urgencia: 'Alta' }
    ];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockDoacoes });
    
    render(<ListarDoacoesPage />);

    await waitFor(() => {
      expect(screen.getByText('Leite em pó (Lata)')).toBeInTheDocument();
    });

    expect(screen.getByText('Alimentação')).toBeInTheDocument();
    expect(screen.getByText('Quero Doar')).toBeInTheDocument();
    expect(screen.getByText('Editar')).toBeInTheDocument();
  });

  it('não deve mostrar o botão Editar na aba de doações se o Admin estiver desativado', async () => {
    const mockDoacoes = [
      { id: 1, item: 'Roupa de Frio', quantidade: 5, categoria: 'Vestuário', urgencia: 'Média' }
    ];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockDoacoes });
    
    render(<ListarDoacoesPage />);

    await waitFor(() => {
      expect(screen.getByText('Roupa de Frio')).toBeInTheDocument();
    });

    const adminCheckbox = screen.getByRole('checkbox');
    fireEvent.click(adminCheckbox);

    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });

  it('deve exibir doadores com telefone e abrir o modal de histórico ao clicar em Ver Doações', async () => {
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<ListarDoacoesPage />);

    const mockDoadores = [
      { 
        id: 1, nome: 'Lorena Ribeiro', email: 'lorena@email.com', telefone: '(61) 99999-2222',
        historico: [{ id: 101, item: 'Cobertor', quantidade: 2, data: '10/06/2026' }]
      }
    ];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockDoadores });
    
    fireEvent.click(screen.getByText('Doadores'));

    await waitFor(() => {
      expect(screen.getByText('Lorena Ribeiro')).toBeInTheDocument();
    });
    
    expect(screen.getByText('(61) 99999-2222')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Ver Doações'));

    expect(screen.getByText('Histórico de Doações')).toBeInTheDocument();
    expect(screen.getByText('Cobertor')).toBeInTheDocument();
  });

  it('deve lidar com falha na API graciosamente sem quebrar a interface', async () => {
    fetch.mockRejectedValueOnce(new Error('Servidor offline'));
    render(<ListarDoacoesPage />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Ops! Tivemos um problema.')).toBeInTheDocument();
    expect(screen.getByText('Itens Disponíveis')).toBeInTheDocument();
  });
});