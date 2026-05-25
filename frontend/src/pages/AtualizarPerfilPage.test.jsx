import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import AtualizarPerfilPage from './AtualizarPerfilPage';

vi.mock('../utils/navigation', () => ({
  navigateTo: vi.fn(),
}));

describe('AtualizarPerfilPage', () => {
  it('renderiza os formulários de atualização e deleção corretamente', () => {
    render(<AtualizarPerfilPage />);

    expect(screen.getByRole('heading', { name: /meu perfil/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/disponibilidade/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apagar minha conta/i })).toBeInTheDocument();
  });

  it('exibe erro de e-mail inválido', async () => {
    render(<AtualizarPerfilPage />);

    const emailInput = screen.getByLabelText(/e-mail/i);
  
    const form = emailInput.closest('form'); 

    fireEvent.change(emailInput, { target: { value: 'email_errado_sem_arroba' } });
    
    fireEvent.submit(form);

    expect(await screen.findByText(/formato de e-mail inválido/i)).toBeInTheDocument();
  });
});