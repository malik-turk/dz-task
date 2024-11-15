// src/app/products/ProductsPage.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import ProductsPage from './page';
import '@testing-library/jest-dom';
import { CartProvider } from '@/context/CartContext';

// Mock the global fetch function
global.fetch = jest.fn();

describe('ProductsPage', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('displays loading message initially', () => {
    render(
      <CartProvider>
        <ProductsPage />
      </CartProvider>
    );
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  test('displays products after loading', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [
          {
            id: '1',
            name: 'Product 1',
            description: 'Description of Product 1',
            images: ['https://placehold.co/100x100'],
            price: { amount: 10, currency: 'USD' },
          },
          {
            id: '2',
            name: 'Product 2',
            description: 'Description of Product 2',
            images: ['https://placehold.co/100x100'],
            price: { amount: 20, currency: 'USD' },
          },
        ],
      }),
    });

    render(
      <CartProvider>
        <ProductsPage />
      </CartProvider>
    );

    // Wait for loading state to finish
    await waitFor(() => expect(screen.queryByText('Loading products...')).not.toBeInTheDocument());

    // Check that products are displayed
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('$10')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('$20')).toBeInTheDocument();
  });

  test('handles fetch error gracefully', async () => {
    // Simulate a failed fetch
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to fetch products' }), // Mock error response
    });

    render(
      <CartProvider>
        <ProductsPage />
      </CartProvider>
    );

    // Wait for loading state to finish
    await waitFor(() => expect(screen.queryByText('Loading products...')).not.toBeInTheDocument());

    // Verify that an error message is logged
    expect(console.error).toHaveBeenCalledWith('Failed to fetch products:', expect.any(Error));
  });
});
