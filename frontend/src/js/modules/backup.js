/**
 * 💾 Módulo de Backup Automático
 * Salva, restaura e exporta dados de forma automática
 */

class BackupManager {
  constructor() {
    this.STORAGE_KEY = 'app_backup';
    this.BACKUP_INTERVAL = 6 * 60 * 60 * 1000; // 6 horas em ms
    this.backupInterval = null;
  }

  /**
   * Iniciar backup automático
   */
  startAutoBackup() {
    if (this.backupInterval) {
      console.warn('⚠️ Backup automático já está em execução');
      return;
    }

    this.performBackup();

    this.backupInterval = setInterval(() => {
      this.performBackup();
    }, this.BACKUP_INTERVAL);

    console.log('✅ Backup automático iniciado (a cada 6 horas)');
  }

  /**
   * Parar backup automático
   */
  stopAutoBackup() {
    if (this.backupInterval) {
      clearInterval(this.backupInterval);
      this.backupInterval = null;
      console.log('⏹️ Backup automático parado');
    }
  }

  /**
   * Executar backup manual
   */
  async performBackup() {
    try {
      // Recuperar dados da API ou localStorage
      const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const categories = JSON.parse(localStorage.getItem('categories') || '[]');
      const userProfile = JSON.parse(localStorage.getItem('user_profile') || '{}');

      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          transactions,
          categories,
          userProfile,
        },
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(backup));
      console.log('✅ Backup realizado com sucesso');
      return backup;
    } catch (error) {
      console.error('❌ Erro ao fazer backup:', error);
      return null;
    }
  }

  /**
   * Restaurar de backup
   */
  async restoreFromBackup() {
    try {
      const backup = JSON.parse(localStorage.getItem(this.STORAGE_KEY));

      if (!backup) {
        console.warn('⚠️ Nenhum backup disponível');
        return false;
      }

      const { data } = backup;

      localStorage.setItem('transactions', JSON.stringify(data.transactions || []));
      localStorage.setItem('categories', JSON.stringify(data.categories || []));
      localStorage.setItem('user_profile', JSON.stringify(data.userProfile || {}));

      console.log('✅ Dados restaurados do backup');
      return true;
    } catch (error) {
      console.error('❌ Erro ao restaurar backup:', error);
      return false;
    }
  }

  /**
   * Obter último backup
   */
  getLastBackup() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    } catch (error) {
      console.error('❌ Erro ao recuperar backup:', error);
      return null;
    }
  }

  /**
   * Obter tempo do último backup
   */
  getLastBackupTime() {
    const backup = this.getLastBackup();
    if (backup && backup.timestamp) {
      return new Date(backup.timestamp);
    }
    return null;
  }

  /**
   * Exportar backup como JSON
   */
  exportBackupAsJson(filename = `backup-${new Date().toISOString().split('T')[0]}.json`) {
    try {
      const backup = this.getLastBackup();

      if (!backup) {
        console.warn('⚠️ Nenhum backup disponível para exportar');
        return;
      }

      const json = JSON.stringify(backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log('✅ Backup exportado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao exportar backup:', error);
    }
  }

  /**
   * Importar backup de arquivo
   */
  async importBackupFromFile(file) {
    return new Promise((resolve) => {
      try {
        const reader = new FileReader();

        reader.onload = (event) => {
          try {
            const backup = JSON.parse(event.target.result);

            if (!backup.version || !backup.data) {
              throw new Error('Formato de arquivo inválido');
            }

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(backup));
            console.log('✅ Backup importado com sucesso');
            resolve(true);
          } catch (error) {
            console.error('❌ Erro ao processar arquivo:', error);
            resolve(false);
          }
        };

        reader.readAsText(file);
      } catch (error) {
        console.error('❌ Erro ao importar backup:', error);
        resolve(false);
      }
    });
  }

  /**
   * Obter informações do backup
   */
  getBackupInfo() {
    const backup = this.getLastBackup();

    if (!backup) {
      return {
        available: false,
        message: 'Nenhum backup disponível',
      };
    }

    const { data, timestamp } = backup;
    const size = new Blob([JSON.stringify(backup)]).size;

    return {
      available: true,
      timestamp: new Date(timestamp).toLocaleString('pt-BR'),
      size: this.formatBytes(size),
      transactions: data.transactions?.length || 0,
      categories: data.categories?.length || 0,
      version: backup.version,
    };
  }

  /**
   * Formatar bytes para unidade legível
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * Limpar backup local
   */
  clearBackup() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      console.log('✅ Backup local removido');
    } catch (error) {
      console.error('❌ Erro ao limpar backup:', error);
    }
  }

  /**
   * Criar arquivo de agendamento para backend
   */
  getBackupSchedule() {
    return {
      interval: this.BACKUP_INTERVAL,
      intervalHours: this.BACKUP_INTERVAL / (60 * 60 * 1000),
      nextBackupTime: new Date(Date.now() + this.BACKUP_INTERVAL).toISOString(),
    };
  }
}

// Criar instância global
const backupManager = new BackupManager();

// Iniciar backup automático ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  backupManager.startAutoBackup();
});
