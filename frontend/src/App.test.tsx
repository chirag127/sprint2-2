import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the AuthContext and CartContext
jest.mock('./context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuth: () => ({
    user: null,
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    isAdmin: () => false,
    isAuthenticated: () => false,
    loading: false,
  }),
}));

jest.mock('./context/CartContext', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useCart: () => ({
    cartItems: [],
    addToCart: jest.fn(),
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn(),
    getCartTotal: () => 0,
    getCartItemCount: () => 0,
  }),
}));

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

test('renders grocery store navigation', () => {
  renderApp();
  const logoElement = screen.getByText(/🛒 Grocery Store/i);
  expect(logoElement).toBeInTheDocument();
});

test('renders home page by default', () => {
  renderApp();
  const welcomeElement = screen.getByText(/Welcome to Our Grocery Store/i);
  expect(welcomeElement).toBeInTheDocument();
});

test('renders navigation links', () => {
  renderApp();

  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Products')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();
  expect(screen.getByText('Register')).toBeInTheDocument();
});
