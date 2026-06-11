import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ListarDoacoesPage from './ListarDoacoesPage';

// "mock" do fetch para não precisar de um backend real nos testes
globalThis.fetch = vi.fn();

describe('Página de Listar Doações e Doadores (RF-03 e RF-06)', () => {
  
  beforeEach(() => {
    vi.clearAllMocks(); // Limpa as imitações antes de cada teste
  });

  it('deve renderizar as abas corretamente', async () => {

    // Finge que a API retornou uma lista vazia
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<ListarDoacoesPage />);

    // Verifica se os botões das abas estão na tela
    expect(screen.getByText('Itens Disponíveis')).toBeInTheDocument();
    expect(screen.getByText('Doadores')).toBeInTheDocument();
  });

  it('deve exibir as doações vindas da API', async () => {
    const mockDoacoes = [
      { id: 1, item: 'Leite em pó (Lata)', quantidade: 15, categoria: 'Alimentação', urgencia: 'Alta' }
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoacoes,
    });

    render(<ListarDoacoesPage />);

    // Aguarda o loading sumir e o item aparecer na tela
    await waitFor(() => {
      expect(screen.getByText('Leite em pó (Lata)')).toBeInTheDocument();
    });

    expect(screen.getByText('Alimentação')).toBeInTheDocument();
    expect(screen.getByText('Quero Doar')).toBeInTheDocument(); // Nosso botão novo!
  });

  it('deve mudar para a aba de doadores e carregar os dados', async () => {

    // 1º Fetch: Ocorre assim que a página abre (aba doações)
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<ListarDoacoesPage />);

    // 2º Fetch: Preparamos a resposta para quando a aba de Doadores for clicada
    const mockDoadores = [
      { id: 1, nome: 'Ana Silva', email: 'ana@email.com' }
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDoadores,
    });

    // Simula o usuário clicando na aba Doadores
    fireEvent.click(screen.getByText('Doadores'));

    // Aguarda o nome da doadora aparecer
    await waitFor(() => {
      expect(screen.getByText('Ana Silva')).toBeInTheDocument();
    });

    expect(screen.getByText('ana@email.com')).toBeInTheDocument();
    expect(screen.getByText('Ver Doações / Editar')).toBeInTheDocument(); // Botão do doador
  });

  it('deve lidar com falha na API graciosamente sem quebrar a interface', async () => {
    // Força um erro de servidor (simulando API offline)
    fetch.mockRejectedValueOnce(new Error('Servidor offline'));

    render(<ListarDoacoesPage />);

    // Verifica se o sistema passou pelo loading e sobreviveu
    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });

    // As abas devem continuar lá e o site não pode ficar tela branca
    expect(screen.getByText('Itens Disponíveis')).toBeInTheDocument();
  });
});