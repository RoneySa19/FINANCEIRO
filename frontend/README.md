# Frontend - Sistema de Finanças

Interface moderna e responsiva para gerenciamento de finanças pessoais.

## 📁 Estrutura de Pastas

```
frontend/
├── src/
│   ├── css/
│   │   ├── modules/          # Módulos CSS reutilizáveis
│   │   │   ├── buttons.css   # Estilos de botões
│   │   │   ├── forms.css     # Estilos de formulários
│   │   │   ├── cards.css     # Estilos de cards
│   │   │   └── layout.css    # Sistema de grid/flex
│   │   ├── style.css         # Estilos globais
│   │   └── variables.css     # Variáveis CSS
│   ├── js/
│   │   ├── modules/          # Módulos JavaScript
│   │   │   ├── api.js        # Requisições ao backend
│   │   │   ├── validation.js # Validações
│   │   │   ├── storage.js    # Gerenciamento de dados locais
│   │   │   └── ui.js         # Componentes de UI
│   │   └── app.js            # Inicialização da aplicação
│   └── index.html            # Página principal
└── public/                   # Arquivos estáticos
```

## 🚀 Como Usar

### 1. Instalação
```bash
cd frontend
# Nenhuma dependência necessária - apenas HTML, CSS e JavaScript vanilla
```

### 2. Servidor Local
```bash
# Usando Python
python -m http.server 3000

# Ou usando Node.js
npm install -g http-server
http-server -p 3000
```

### 3. Acessar
Abra o navegador em `http://localhost:3000`

## 📦 Componentes

### CSS Modular
- **buttons.css** - Botões com variantes (primary, danger, success)
- **forms.css** - Inputs, selects, textareas com validação visual
- **cards.css** - Cards com sombra e variantes
- **layout.css** - Sistema de grid/flex responsive

### JavaScript Modular
- **api.js** - Classe API com autenticação e retry automático
- **validation.js** - Validador com múltiplas regras
- **storage.js** - LocalStorage com expiração
- **ui.js** - Notificações, modais, formatação

## 🔧 Configuração

Edite `src/js/modules/api.js` para alterar a URL do backend:

```javascript
const api = new API('http://localhost:5000/api');
```

## 📱 Responsivo

Todos os módulos CSS suportam breakpoints:
- Desktop: 1024px+
- Tablet: 768px - 1024px
- Mobile: < 768px

## 🔐 Segurança

- Tokens armazenados em localStorage
- Validação antes de enviar para API
- Headers de segurança automáticos
- Refresh de token automático

## 🎨 Temas

Altera cores editando variáveis CSS em cada módulo:

```css
:root {
  --btn-primary-bg: #3b82f6;
  --input-border: #d1d5db;
  --card-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
```

## 📚 Exemplos de Uso

### Login
```javascript
try {
  const result = await api.login('user@example.com', 'password123');
  api.setToken(result.accessToken, result.refreshToken);
  UI.showSuccess('Login realizado!');
} catch (error) {
  UI.showError(error.message);
}
```

### Criar Transação
```javascript
const transaction = await api.createTransaction({
  type: 'expense',
  category: categoryId,
  amount: 50.00,
  description: 'Compra no supermercado'
});
UI.showSuccess('Transação criada!');
```

### Validação
```javascript
const errors = Validator.validate({
  email: { value: email, rules: ['required', 'email'] },
  password: { value: password, rules: ['required', 'password'] }
});

if (errors) {
  UI.showError(Object.values(errors)[0]);
}
```

## 🧪 Testes

Execute testes do frontend com Vitest:

```bash
npm run test:frontend
```

## 📄 Licença

MIT
