import React, { act } from 'react'; 
import { render, screen, fireEvent } from '@testing-library/react';
import CasaraoFormPage from './CasaraoFormPage';

describe('CasaraoFormPage', () => {
  const mockOnSubmit = jest.fn();

  it('renders the form fields correctly', () => {
    render(<CasaraoFormPage onSubmit={mockOnSubmit} />);

    // Verifica se os campos do formulário estão presentes
    expect(screen.getByPlaceholderText('Nome do Casarão')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descrição do Casarão')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Endereço do Casarão')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('CEP')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Data de Construção')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cadastrar/i })).toBeInTheDocument();
  });

  it('calls onSubmit with form data when the form is submitted', () => {
    render(<CasaraoFormPage onSubmit={mockOnSubmit} />);

    // Preenche os campos do formulário
    fireEvent.change(screen.getByPlaceholderText('Nome do Casarão'), {
      target: { value: 'Casarão Teste' },
    });
    fireEvent.change(screen.getByPlaceholderText('Descrição do Casarão'), {
      target: { value: 'Descrição de teste' },
    });
    fireEvent.change(screen.getByPlaceholderText('Endereço do Casarão'), {
      target: { value: 'Rua Teste, 123, Bairro Teste' },
    });
    fireEvent.change(screen.getByPlaceholderText('CEP'), {
      target: { value: '12345678' },
    });
    fireEvent.change(screen.getByPlaceholderText('Data de Construção'), {
      target: { value: '2024-01-01' },
    });

    // Simula o envio do formulário
    fireEvent.click(screen.getByRole('button', { name: /Cadastrar/i }));

    // Verifica se o onSubmit foi chamado com os dados corretos
    expect(mockOnSubmit).toHaveBeenCalledWith({
      formData: {
        name: 'Casarão Teste',
        description: 'Descrição de teste',
        location: 'Rua Teste, 123, Bairro Teste',
        cep: '12345678',
        date: '2024-01-01',
      },
      base64: '',
    });

    // Verifica se o formulário foi resetado
    expect(screen.getByPlaceholderText('Nome do Casarão')).toHaveValue('');
    expect(screen.getByPlaceholderText('Descrição do Casarão')).toHaveValue('');
    expect(screen.getByPlaceholderText('Endereço do Casarão')).toHaveValue('');
    expect(screen.getByPlaceholderText('CEP')).toHaveValue('');
    expect(screen.getByPlaceholderText('Data de Construção')).toHaveValue('');
  });
});
