import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../src/App';

describe('UI Rendering', () => {
  it('renders the app title', () => {
    render(<App />);
    expect(screen.getByText(/Reaction Speed/i)).toBeInTheDocument();
  });

  it('renders the nickname input', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/Player name/i)).toBeInTheDocument();
  });

  it('renders the play button', () => {
    render(<App />);
    expect(screen.getByText('Play')).toBeInTheDocument();
  });

  it('renders the footer branding', () => {
    render(<App />);
    expect(screen.getByText(/Fayazahmad_Siddik/i)).toBeInTheDocument();
  });

  it('renders the leaderboard section', () => {
    render(<App />);
    expect(screen.getByText(/Global Leaderboard/i)).toBeInTheDocument();
  });
});
