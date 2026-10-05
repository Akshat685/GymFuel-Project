import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Login from './Pages/Login';
import authReducer from './redux/authSlice';
import { canRenderScene } from './components/fuel/FuelHero';

jest.mock('axios', () => ({ post: jest.fn() }));
jest.mock('react-toastify', () => ({ toast: { success: jest.fn() } }));

beforeEach(() => {
  localStorage.clear();
  window.matchMedia = jest.fn(() => ({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() }));
  window.IntersectionObserver = class { observe() {} disconnect() {} };
  jest.clearAllMocks();
});
function renderLogin() {
  const store = configureStore({ reducer: { auth: authReducer } });
  return render(<Provider store={store}><MemoryRouter><Routes><Route path="/" element={<Login />} /><Route path="/dashboard" element={<h1>Dashboard destination</h1>} /></Routes></MemoryRouter></Provider>);
}

test('reduced motion keeps real form content accessible without loading WebGL', () => {
  renderLogin();
  expect(screen.getByRole('heading', { name: 'Welcome back.' })).toBeVisible();
  expect(screen.getByLabelText('Email address')).toHaveAttribute('autocomplete', 'username');
  expect(screen.getByText('SMALL HABITS. STRONGER EVERY DAY.')).toBeVisible();
  expect(screen.queryByRole('group', { name: 'Shaker view controls' })).not.toBeInTheDocument();
});

test('password visibility control preserves the entered value', () => {
  renderLogin();
  const password = screen.getByLabelText('Password', { exact: true });
  fireEvent.change(password, { target: { value: 'test-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Show password' }));
  expect(password).toHaveAttribute('type', 'text');
  expect(password).toHaveValue('test-password');
  fireEvent.click(screen.getByRole('button', { name: 'Hide password' }));
  expect(password).toHaveAttribute('type', 'password');
});

test('failed authentication remains readable and permits another attempt', async () => {
  axios.post.mockRejectedValueOnce({ response: { data: { message: 'Invalid credentials' } } });
  renderLogin();
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password', { exact: true }), { target: { value: 'test-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign in', exact: true }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials');
  expect(screen.getByRole('button', { name: 'Sign in', exact: true })).toBeEnabled();
});

test('successful authentication retains the existing token and dashboard flow', async () => {
  axios.post.mockResolvedValueOnce({ data: { token: 'test-token', email: 'test@example.com', username: 'Test' } });
  renderLogin();
  fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText('Password', { exact: true }), { target: { value: 'test-password' } });
  fireEvent.click(screen.getByRole('button', { name: 'Sign in', exact: true }));
  await waitFor(() => expect(screen.getByText('Dashboard destination')).toBeVisible());
  expect(localStorage.getItem('token')).toBe('test-token');
  expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/auth/login'), { email: 'test@example.com', password: 'test-password' });
});

test('unsupported WebGL returns a fallback instead of throwing', () => {
  window.matchMedia.mockReturnValue({ matches: false });
  const getContext = jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  expect(canRenderScene()).toBe(false);
  getContext.mockRestore();
});
