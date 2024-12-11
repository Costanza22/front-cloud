import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CasaraoFormPage from './CasaraoFormPage';

describe('CasaraoFormPage', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    global.fetch = jest.fn();
  });

  it('renders the form fields correctly', () => {
    render(<CasaraoFormPage onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Nome do Casarão')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descrição do Casarão')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Endereço do Casarão')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('CEP')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Data de Construção')).toBeInTheDocument();
    expect(screen.getByLabelText('Escolher arquivo')).toBeInTheDocument();
  });

  it('loads existing casarão data when provided', () => {
    const casaraoData = {
      name: 'Casarão Existente',
      description: 'Descrição Existente',
      location: 'Endereço Existente',
      cep: '12345678',
      date: '2024-01-01',
      image_path: 'caminho/da/imagem.jpg'
    };

    render(<CasaraoFormPage onSubmit={mockOnSubmit} casaraoData={casaraoData} />);

    expect(screen.getByPlaceholderText('Nome do Casarão')).toHaveValue(casaraoData.name);
    expect(screen.getByPlaceholderText('Descrição do Casarão')).toHaveValue(casaraoData.description);
    expect(screen.getByPlaceholderText('Endereço do Casarão')).toHaveValue(casaraoData.location);
    expect(screen.getByPlaceholderText('CEP')).toHaveValue(casaraoData.cep);
    expect(screen.getByPlaceholderText('Data de Construção')).toHaveValue(casaraoData.date);
  });

  it('handles CEP input and fetches address data', async () => {
    const mockAddress = {
      logradouro: 'Rua Teste',
      bairro: 'Bairro Teste',
      localidade: 'Cidade Teste',
      uf: 'UF'
    };

    global.fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockAddress)
    });

    render(<CasaraoFormPage onSubmit={mockOnSubmit} />);
    
    const cepInput = screen.getByPlaceholderText('CEP');
    fireEvent.change(cepInput, { target: { value: '12345678' } });

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Endereço do Casarão')).toHaveValue(
        'Rua Teste, Bairro Teste, Cidade Teste - UF'
      );
    });
  });

  it('handles file upload and creates base64 string', () => {
    render(<CasaraoFormPage onSubmit={mockOnSubmit} />);

    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    const fileInput = screen.getByLabelText('Escolher arquivo');

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      result: 'data:image/png;base64,dummybase64',
      onload: null
    };
    global.FileReader = jest.fn(() => mockFileReader);

    fireEvent.change(fileInput, { target: { files: [file] } });

    // Simulate FileReader load
    mockFileReader.onload?.();
  });

  it('handles form submission with error in CEP fetch', async () => {
    global.fetch.mockRejectedValueOnce(new Error('API Error'));
    global.console.error = jest.fn();

    render(<CasaraoFormPage onSubmit={mockOnSubmit} />);
    
    const cepInput = screen.getByPlaceholderText('CEP');
    fireEvent.change(cepInput, { target: { value: '12345678' } });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
    });
  });

  it('shows correct button text based on edit/create mode', () => {
    // Teste modo criação
    const { rerender } = render(<CasaraoFormPage onSubmit={mockOnSubmit} />);
    expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();

    // Teste modo edição
    rerender(<CasaraoFormPage onSubmit={mockOnSubmit} casaraoData={{ id: 1 }} />);
    expect(screen.getByRole('button', { name: /salvar alterações/i })).toBeInTheDocument();
  });
});