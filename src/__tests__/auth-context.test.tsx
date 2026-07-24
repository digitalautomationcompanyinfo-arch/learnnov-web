import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/context/AuthContext';

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('throws an error when useAuth is used outside AuthProvider', () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });

  it('initializes with logged-out state when localStorage is empty', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.accessToken).toBeNull();
  });

  it('stores token and user info on login', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login(
        'mock-access-token',
        'mock-refresh-token',
        'student',
        'طالب اختبار',
        'أ'
      );
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.accessToken).toBe('mock-access-token');
    expect(result.current.userRole).toBe('student');
    expect(result.current.userName).toBe('طالب اختبار');
    expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', 'mock-access-token');
  });

  it('clears session and localStorage on logout', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.login('access', 'refresh', 'student', 'User', 'A');
    });
    expect(result.current.isLoggedIn).toBe(true);

    act(() => {
      result.current.logout();
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.accessToken).toBeNull();
    expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken');
  });
});
