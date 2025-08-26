import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole('generic');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<LoadingSpinner size="lg" />);
    const spinner = screen.getByRole('generic');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with text', () => {
    const text = 'Loading...';
    render(<LoadingSpinner text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<LoadingSpinner className={customClass} />);
    const spinner = screen.getByRole('generic');
    expect(spinner).toHaveClass(customClass);
  });
});
