/* global describe, it, expect */

import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListarDoacoesPage from './ListarDoacoesPage';

describe('Página de Listar Doações', () => {
  
  it('deve renderizar o cabeçalho e os títulos da página corretamente', () => {
    render(<ListarDoacoesPage />);
    
    expect(screen.getByText('Mural de Doações')).toBeInTheDocument();
    expect(screen.getByText('Itens Disponíveis')).toBeInTheDocument();
    expect(screen.getByText('Confira a lista de doações cadastradas no sistema.')).toBeInTheDocument();
  });

  it('deve renderizar todos os itens (mocks) de doação na tela', () => {
    render(<ListarDoacoesPage />);
    
    expect(screen.getByText('Leite em pó (Lata)')).toBeInTheDocument();
    expect(screen.getByText('Fraldas Tamanho M')).toBeInTheDocument();
    expect(screen.getByText('Casacos infantis')).toBeInTheDocument();
    expect(screen.getByText('Brinquedos educativos')).toBeInTheDocument();
  });

  it('deve exibir as tags de urgência e categorias', () => {
    render(<ListarDoacoesPage />);

    expect(screen.getByText('Alimentação')).toBeInTheDocument();
    expect(screen.getByText('Higiene')).toBeInTheDocument();
  });

  it('deve renderizar os botões de ação para cada card', () => {
    render(<ListarDoacoesPage />);
    
    // 4 mocks, logo, 4 botões de "Quero Doar"
    const botoes = screen.getAllByText('Quero Doar');
    expect(botoes).toHaveLength(4);
  });
});