import { useState } from 'react';
import { buildApiUrl, API_ENDPOINTS } from '../config/api';
import { LOGIN_ERROR_MESSAGES } from '../services/authService';

async function signupUser({ name, email, password }) {
  const response = await fetch(buildApiUrl(API_ENDPOINTS.signup), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = data?.message || LOGIN_ERROR_MESSAGES.unexpected;
    throw new Error(errorMessage);
  }

  const token = data.token ?? data.accessToken ?? data.jwt;

  if (!token) {
    throw new Error(LOGIN_ERROR_MESSAGES.unexpected);
  }

  return { token, user: data.user ?? null };
}

export function useSignup() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function signup({ name, email, password }) {
    setIsSubmitting(true);
    try {
      return await signupUser({ name, email, password });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    signup,
    isSubmitting,
  };
}
