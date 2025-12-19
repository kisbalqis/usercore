
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import React from 'react';

// Mocking the global fetch for API testing
// Fix: Use globalThis instead of global to avoid "Cannot find name 'global'" error in TypeScript
(globalThis as any).fetch = vi.fn();

describe('UserCore Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Fix: Use globalThis instead of global to avoid "Cannot find name 'global'" error in TypeScript
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => [
        {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: { name: 'Romaguera-Crona', catchPhrase: 'Multi-layered client-server neural-net' },
          address: { street: 'Kulas Light', suite: 'Apt. 556', city: 'Gwenborough', zipcode: '92998-3874' }
        }
      ],
    });
  });

  it('renders the application title and search bar', async () => {
    render(<App />);
    expect(screen.getByText(/User Management/i)).toBeTruthy();
    expect(screen.getByPlaceholderText(/Search by name/i)).toBeTruthy();
  });

  it('displays loading skeletons initially', () => {
    render(<App />);
    // Check for skeletons or loading state if applicable
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('allows the user to open the "Add User" modal', async () => {
    render(<App />);
    const addBtn = screen.getByRole('button', { name: /Add User/i });
    fireEvent.click(addBtn);
    expect(screen.getByText(/Add New User/i)).toBeTruthy();
  });

  it('filters users based on search input', async () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Search by name/i);
    fireEvent.change(searchInput, { target: { value: 'Leanne' } });
    
    await waitFor(() => {
      expect(screen.getByText('Leanne Graham')).toBeTruthy();
    });
  });
});
