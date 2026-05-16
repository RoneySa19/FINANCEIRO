/**
 * UI Module - Componentes e interações de interface
 */

class UI {
  /**
   * Exibe mensagem de sucesso
   */
  static showSuccess(message, duration = 3000) {
    this.showNotification(message, 'success', duration);
  }

  /**
   * Exibe mensagem de erro
   */
  static showError(message, duration = 4000) {
    this.showNotification(message, 'error', duration);
  }

  /**
   * Exibe mensagem de aviso
   */
  static showWarning(message, duration = 3000) {
    this.showNotification(message, 'warning', duration);
  }

  /**
   * Exibe notificação genérica
   */
  static showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 20px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      z-index: 9999;
      animation: slideIn 0.3s ease;
      background-color: ${this.getNotificationColor(type)};
      color: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }

  /**
   * Cores das notificações
   */
  static getNotificationColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    return colors[type] || colors.info;
  }

  /**
   * Exibe loader
   */
  static showLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9998;
    `;
    loader.innerHTML = '<div style="border: 4px solid #f3f4f6; border-top-color: #3b82f6; border-radius: 50%; width: 40px; height: 40px; animation: spin 0.8s linear infinite;"></div>';
    document.body.appendChild(loader);
  }

  /**
   * Remove loader
   */
  static hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
  }

  /**
   * Modal de confirmação
   */
  static confirm(message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>${message}</h3>
        <div class="modal-buttons">
          <button class="btn btn-outline" id="cancelBtn">Cancelar</button>
          <button class="btn btn-primary" id="confirmBtn">Confirmar</button>
        </div>
      </div>
    `;
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;

    document.body.appendChild(modal);

    document.getElementById('confirmBtn').addEventListener('click', () => {
      modal.remove();
      onConfirm();
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
      modal.remove();
      if (onCancel) onCancel();
    });
  }

  /**
   * Formata valor monetário
   */
  static formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  /**
   * Formata data
   */
  static formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
  }
}

// Adiciona estilos das animações
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
  @keyframes spin { to { transform: rotate(360deg); } }
`;
document.head.appendChild(style);
