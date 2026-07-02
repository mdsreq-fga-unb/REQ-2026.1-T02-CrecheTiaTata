import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import AtualizarPerfilPage from './AtualizarPerfilPage';
import { navigateTo } from '../utils/navigation';
import { clearAuthToken } from '../utils/authStorage';
import { updateProfile } from '../services/profileService';

// Criando os Mocks das funções externas
vi.mock('../utils/navigation', () => ({
  navigateTo: vi.fn(),
}));

vi.mock('../utils/authStorage', () => ({
  clearAuthToken: vi.fn(),
  getUserEmailFromToken: vi.fn(() => 'usuario@exemplo.com'),
}));

vi.mock('../services/profileService', () => ({
  updateProfile: vi.fn(() => Promise.resolve({})),
  deleteAccount: vi.fn(() => Promise.resolve()),
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

  it('mantém o campo de e-mail desabilitado', () => {
    render(<AtualizarPerfilPage />);
    expect(screen.getByLabelText(/e-mail/i)).toBeDisabled();
  });

  it('realiza a atualização com sucesso e exibe estado de loading', async () => {
    render(<AtualizarPerfilPage />);
    const disponibilidadeInput = screen.getByLabelText(/disponibilidade/i);
    const form = disponibilidadeInput.closest('form');
    const saveButton = screen.getByRole('button', { name: /salvar alterações/i });

    fireEvent.change(disponibilidadeInput, { target: { value: 'Tarde' } });
    fireEvent.submit(form);

    expect(saveButton).toHaveTextContent(/salvando/i);
    expect(saveButton).toBeDisabled();

    expect(await screen.findByText(/dados atualizados com sucesso/i)).toBeInTheDocument();
    expect(updateProfile).toHaveBeenCalledWith('usuario@exemplo.com', { disponibilidade: 'Tarde' });
  });

  it('ao trocar a senha, limpa token e redireciona para o login', async () => {
    window.alert = vi.fn();

    render(<AtualizarPerfilPage />);
    const senhaInput = screen.getByLabelText(/nova senha/i);
    const form = senhaInput.closest('form');

    fireEvent.change(senhaInput, { target: { value: 'novaSenha456' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith('usuario@exemplo.com', { password: 'novaSenha456' });
      expect(clearAuthToken).toHaveBeenCalled();
      expect(navigateTo).toHaveBeenCalledWith('/login');
    });
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
