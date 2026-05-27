import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import AtualizarPerfilPage from './AtualizarPerfilPage';
import { navigateTo } from '../utils/navigation';
import { clearAuthToken } from '../utils/authStorage';

// Criando os Mocks das funções externas
vi.mock('../utils/navigation', () => ({
  navigateTo: vi.fn(),
}));

vi.mock('../utils/authStorage', () => ({
  clearAuthToken: vi.fn(),
}));

describe('AtualizarPerfilPage', () => {
  // Limpa o histórico dos mocks antes de cada teste para um não interferir no outro
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza os formulários de atualização e deleção corretamente', () => {
    render(<AtualizarPerfilPage />);
    expect(screen.getByRole('heading', { name: /meu perfil/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /apagar minha conta/i })).toBeInTheDocument();
  });

  // --- TESTES DO FORMULÁRIO DE ATUALIZAÇÃO ---

  it('exibe erro de e-mail inválido ao tentar atualizar', async () => {
    render(<AtualizarPerfilPage />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const form = emailInput.closest('form');

    fireEvent.change(emailInput, { target: { value: 'email_invalido_sem_arroba' } });
    fireEvent.submit(form);

    expect(await screen.findByText(/formato de e-mail inválido/i)).toBeInTheDocument();
  });

  it('realiza a atualização com sucesso e exibe estado de loading', async () => {
    render(<AtualizarPerfilPage />);
    const emailInput = screen.getByLabelText(/e-mail/i);
    const form = emailInput.closest('form');
    const saveButton = screen.getByRole('button', { name: /salvar alterações/i });

    fireEvent.change(emailInput, { target: { value: 'certo@exemplo.com' } });
    fireEvent.submit(form);

    // O botão deve mudar de texto e ficar desabilitado imediatamente após o clique
    expect(saveButton).toHaveTextContent(/salvando/i);
    expect(saveButton).toBeDisabled();

    // Aguarda o fim do delay simulado e verifica a mensagem de sucesso
    expect(await screen.findByText(/dados atualizados com sucesso/i)).toBeInTheDocument();
  });

  // --- TESTES DA ZONA DE PERIGO (DELETAR CONTA) ---

  it('exibe erro ao tentar apagar conta com senhas divergentes', async () => {
    render(<AtualizarPerfilPage />);
    const senhaInput = screen.getByLabelText(/digite sua senha/i);
    const confirmaSenhaInput = screen.getByLabelText(/confirme sua senha/i);
    const deleteForm = senhaInput.closest('form');

    fireEvent.change(senhaInput, { target: { value: 'senha123' } });
    fireEvent.change(confirmaSenhaInput, { target: { value: 'senhaerrada' } });
    fireEvent.submit(deleteForm);

    expect(await screen.findByText(/as senhas não coincidem/i)).toBeInTheDocument();
  });

  it('exibe erro se o checkbox de confirmação não for marcado', async () => {
    render(<AtualizarPerfilPage />);
    const senhaInput = screen.getByLabelText(/digite sua senha/i);
    const confirmaSenhaInput = screen.getByLabelText(/confirme sua senha/i);
    const deleteForm = senhaInput.closest('form');

    fireEvent.change(senhaInput, { target: { value: 'senha123' } });
    fireEvent.change(confirmaSenhaInput, { target: { value: 'senha123' } });
    
    // Deixamos o checkbox desmarcado de propósito
    fireEvent.submit(deleteForm);

    expect(await screen.findByText(/você precisa confirmar que deseja apagar a conta/i)).toBeInTheDocument();
  });

  it('apaga a conta com sucesso, limpa token e redireciona', async () => {
    // Ignora o window.alert nativo para não travar o teste
    window.alert = vi.fn();

    render(<AtualizarPerfilPage />);
    const senhaInput = screen.getByLabelText(/digite sua senha/i);
    const confirmaSenhaInput = screen.getByLabelText(/confirme sua senha/i);
    const checkbox = screen.getByRole('checkbox');
    const deleteForm = senhaInput.closest('form');

    // Preenche tudo certinho
    fireEvent.change(senhaInput, { target: { value: 'senha123' } });
    fireEvent.change(confirmaSenhaInput, { target: { value: 'senha123' } });
    
    // O pulo do gato: forçamos o valor do checkbox ANTES de submeter
    fireEvent.click(checkbox);

    // Dispara o formulário
    fireEvent.submit(deleteForm);
    
    // O waitFor garante que o teste espere o setTimeout do seu mock terminar
    await waitFor(() => {
      expect(clearAuthToken).toHaveBeenCalled();
      expect(navigateTo).toHaveBeenCalledWith('/');
    });
  });
});