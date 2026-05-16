/**
 * Storage Module - Gerenciamento de localStorage com segurança
 */

class Storage {
  constructor(prefix = 'financeiro_') {
    this.prefix = prefix;
  }

  /**
   * Salva dados (com expiração opcional)
   */
  set(key, value, expiresIn = null) {
    const data = {
      value,
      timestamp: Date.now(),
      expiresIn
    };
    localStorage.setItem(this.prefix + key, JSON.stringify(data));
  }

  /**
   * Recupera dados
   */
  get(key) {
    const item = localStorage.getItem(this.prefix + key);
    if (!item) return null;

    try {
      const data = JSON.parse(item);

      // Verificar expiração
      if (data.expiresIn) {
        const now = Date.now();
        const expired = (now - data.timestamp) > data.expiresIn;
        if (expired) {
          this.remove(key);
          return null;
        }
      }

      return data.value;
    } catch (error) {
      console.error('Erro ao recuperar do storage:', error);
      return null;
    }
  }

  /**
   * Remove item
   */
  remove(key) {
    localStorage.removeItem(this.prefix + key);
  }

  /**
   * Limpa tudo
   */
  clear() {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  /**
   * Lista todas as chaves
   */
  keys() {
    return Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .map(key => key.replace(this.prefix, ''));
  }
}

const storage = new Storage();
