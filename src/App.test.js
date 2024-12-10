import { render, screen } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders learn react link', () => {
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', 'https://reactjs.org');
    expect(linkElement).toHaveAttribute('target', '_blank');
    expect(linkElement).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('renders the React logo', () => {
    const logoElement = screen.getByAltText('logo');
    expect(logoElement).toBeInTheDocument();
    expect(logoElement).toHaveClass('App-logo');
  });

  test('renders the edit text message', () => {
    const textElement = screen.getByText(/Edit/i);
    expect(textElement).toBeInTheDocument();
    
    const codeElement = screen.getByText('src/App.js');
    expect(codeElement).toBeInTheDocument();
    expect(codeElement.tagName.toLowerCase()).toBe('code');
  });

  test('renders the header with correct class', () => {
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toHaveClass('App-header');
  });
});