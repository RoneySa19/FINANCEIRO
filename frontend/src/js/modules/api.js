/**
 * API Module - Gerencia requisições ao backend
 * Com suporte a autenticação, erro handling e retry logic
 */

class API {
  constructor(baseURL = 'http://localhost:5000/api') {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  /**
   * Define o token de autenticação
   */
  setToken(token, refreshToken) {
    this.token = token;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Remove tokens
   */
  clearTokens() {
    this.token = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Headers com autenticação
   */
  getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  /**
   * Refresh do token
   */
  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (!response.ok) throw new Error('Falha ao atualizar token');

      const data = await response.json();
      this.setToken(data.accessToken, data.refreshToken);
      return true;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  /**
   * Requisição genérica com retry
   */
  async request(endpoint, options = {}, retry = true) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: this.getHeaders()
    };

    try {
      const response = await fetch(url, config);

      // Token expirado - tenta renovar
      if (response.status === 401 && retry && this.refreshToken) {
        await this.refreshAccessToken();
        return this.request(endpoint, options, false);
      }

      // Erro na resposta
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Erro ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro na requisição:', error);
      throw error;
    }
  }

  // ========== AUTH ==========
  async register(name, email, password) {
    return this.request('/auth/registrar', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  // ========== TRANSACTIONS ==========
  async createTransaction(data) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getTransactions(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/transactions?${query}`, { method: 'GET' });
  }

  async getTransaction(id) {
    return this.request(`/transactions/${id}`, { method: 'GET' });
  }

  async updateTransaction(id, data) {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteTransaction(id) {
    return this.request(`/transactions/${id}`, { method: 'DELETE' });
  }

  // ========== CATEGORIES ==========
  async createCategory(data) {
    return this.request('/categories', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getCategories() {
    return this.request('/categories', { method: 'GET' });
  }

  async deleteCategory(id) {
    return this.request(`/categories/${id}`, { method: 'DELETE' });
  }

  // ========== REPORTS ==========
  async getSummary(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/reports/summary?${query}`, { method: 'GET' });
  }

  async getByCategory(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/reports/by-category?${query}`, { method: 'GET' });
  }

  // ========== USERS ==========
  async getProfile() {
    return this.request('/users/profile', { method: 'GET' });
  }

  async updateProfile(data) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword })
    });
  }
}

const api = new API();
