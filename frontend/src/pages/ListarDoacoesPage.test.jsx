import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ListarDoacoesPage from './ListarDoacoesPage';

// Mock do fetch para não depender do backend real durante os testes
globalThis.fetch = vi.fn();

describe('Página de Listar Doações e Doadores', () => {
  
  beforeEach(() => {
    vi.clearAllMocks(); // Limpa as chamadas falsas antes de cada teste
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

    // Aguarda o loading sumir e o item aparecer na tela
    await waitFor(() => {
      expect(screen.getByText('Leite em pó (Lata)')).toBeInTheDocument();
    });

    expect(screen.getByText('Alimentação')).toBeInTheDocument();
    expect(screen.getByText('Quero Doar')).toBeInTheDocument();
    
    // Como o admin é true por padrão, o botão Editar deve estar lá
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

    // Desmarca o checkbox de Admin
    const adminCheckbox = screen.getByRole('checkbox');
    fireEvent.click(adminCheckbox);

    // O botão Editar não pode mais estar na tela
    expect(screen.queryByText('Editar')).not.toBeInTheDocument();
  });

  it('deve exibir doadores com telefone e abrir o modal de histórico ao clicar em Ver Doações', async () => {
    // 1º Fetch (aba default de doações)
    fetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    render(<ListarDoacoesPage />);

    // 2º Fetch (aba de doadores com os novos dados)
    const mockDoadores = [
      { 
        id: 1, nome: 'Lorena Ribeiro', email: 'lorena@email.com', telefone: '(61) 99999-2222',
        historico: [{ id: 101, item: 'Cobertor', quantidade: 2, data: '10/06/2026' }]
      }
    ];
    fetch.mockResolvedValueOnce({ ok: true, json: async () => mockDoadores });
    
    // Simula clique na aba Doadores
    fireEvent.click(screen.getByText('Doadores'));

    await waitFor(() => {
      expect(screen.getByText('Lorena Ribeiro')).toBeInTheDocument();
    });
    
    // Verifica se o novo campo de telefone renderizou
    expect(screen.getByText('(61) 99999-2222')).toBeInTheDocument();

    // Clica no botão Ver Doações do card
    fireEvent.click(screen.getByText('Ver Doações'));

    // Verifica se o modal de histórico abriu com as informações certas
    expect(screen.getByText('Histórico de Doações')).toBeInTheDocument();
    expect(screen.getByText('Cobertor')).toBeInTheDocument();
  });

  it('deve lidar com falha na API graciosamente sem quebrar a interface', async () => {
    // Força erro no fetch
    fetch.mockRejectedValueOnce(new Error('Servidor offline'));
    render(<ListarDoacoesPage />);

    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });

    // Deve mostrar a mensagem de erro que fizemos na tela
    expect(screen.getByText('Ops! Tivemos um problema.')).toBeInTheDocument();
  });
});