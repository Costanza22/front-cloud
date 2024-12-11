import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CasaraoListPage from './CasaraoListPage';

describe('CasaraoListPage', () => {
  const mockCasaroes = [
    {
      id: 1,
      name: 'Casarão Histórico',
      description: 'Descrição do casarão',
      location: 'Rua Teste, 123',
      date: '2024-01-01',
      image_path: 'base64string'
    }
  ];

  beforeEach(() => {
    // Mock do localStorage
    const mockLocalStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage
    });

    // Mock do fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockCasaroes),
      })
    );
  });

  it('deve renderizar o título corretamente', () => {
    render(<CasaraoListPage />);
    expect(screen.getByText('Lista de Casarões')).toBeInTheDocument();
  });

  it('deve mostrar/esconder a lista ao clicar no botão consultar', async () => {
    render(<CasaraoListPage />);
    
    const consultarButton = screen.getByText('Consultar Casarões');
    fireEvent.click(consultarButton);
    
    await waitFor(() => {
      expect(screen.getByText('Casarão Histórico')).toBeInTheDocument();
    });

    fireEvent.click(consultarButton);
    expect(screen.queryByText('Casarão Histórico')).not.toBeInTheDocument();
  });

  it('deve mostrar botão de cadastro quando usuário é admin', () => {
    render(<CasaraoListPage isAdmin={true} />);
    expect(screen.getByText('Cadastrar Novo Casarão')).toBeInTheDocument();
  });

  it('não deve mostrar botão de cadastro quando usuário não é admin', () => {
    render(<CasaraoListPage isAdmin={false} />);
    expect(screen.queryByText('Cadastrar Novo Casarão')).not.toBeInTheDocument();
  });

  it('deve permitir favoritar um casarão para usuários não-admin', async () => {
    render(<CasaraoListPage isAdmin={false} />);
    
    fireEvent.click(screen.getByText('Consultar Casarões'));
    
    await waitFor(() => {
      expect(screen.getByText('Casarão Histórico')).toBeInTheDocument();
    });

    const favoritoButton = screen.getByTitle('Adicionar aos favoritos');
    fireEvent.click(favoritoButton);

    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('deve exibir mensagem quando não houver casarões', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    render(<CasaraoListPage />);
    
    fireEvent.click(screen.getByText('Consultar Casarões'));
    
    await waitFor(() => {
      expect(screen.getByText('Nenhum casarão cadastrado.')).toBeInTheDocument();
    });
  });
});
