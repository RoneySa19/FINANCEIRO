# Backend - Sistema de Finanças

API RESTful segura para gerenciamento de finanças pessoais.

## 🚀 Quick Start

### 1. Instalação
```bash
cd backend
npm install
```

### 2. Configuração
```bash
cp .env.example .env
# Edite .env com suas configurações
```

### 3. MongoDB
```bash
# Local
mongod

# Ou use MongoDB Atlas (cloud)
# https://www.mongodb.com/cloud/atlas
```

### 4. Iniciar
```bash
npm run dev
```

Servidor em: `http://localhost:5000`

## 📁 Estrutura

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Conexão MongoDB
│   ├── models/
│   │   ├── User.js           # Usuário
│   │   ├── Transaction.js    # Transação
│   │   └── Category.js       # Categoria
│   ├── routes/
│   │   ├── auth.js           # Autenticação
│   │   ├── transactions.js   # Transações
│   │   ├── categories.js     # Categorias
│   │   ├── reports.js        # Relatórios
│   │   └── users.js          # Usuários
│   ├── middleware/
│   │   ├── auth.js           # Autenticação JWT
│   │   ├── rateLimiter.js    # Rate limiting
│   │   ├── errorHandler.js   # Tratamento de erros
│   │   └── security.js       # Headers de segurança
│   └── server.js             # Entrada
├── __tests__/
│   ├── auth.test.js
│   └── transactions.test.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Segurança

✅ **Implementado:**
- Hash de senhas com bcrypt
- JWT com expiração
- Rate limiting
- CORS configurável
- Headers de segurança (Helmet)
- Validação de entrada
- Proteção contra XSS
- Proteção contra SQL Injection
- Account lockout após tentativas

## 📚 API Endpoints

### 🔑 Autenticação
```
POST   /api/auth/registrar      # Criar conta
POST   /api/auth/login          # Fazer login
POST   /api/auth/refresh-token  # Renovar token
```

### 💰 Transações
```
GET    /api/transactions        # Listar (com filtros)
POST   /api/transactions        # Criar
GET    /api/transactions/:id    # Detalhe
PUT    /api/transactions/:id    # Atualizar
DELETE /api/transactions/:id    # Deletar
```

### 📂 Categorias
```
GET    /api/categories          # Listar
POST   /api/categories          # Criar
DELETE /api/categories/:id      # Deletar
```

### 📊 Relatórios
```
GET    /api/reports/summary     # Resumo financeiro
GET    /api/reports/by-category # Análise por categoria
```

### 👤 Usuários
```
GET    /api/users/profile       # Obter perfil
PUT    /api/users/profile       # Atualizar perfil
POST   /api/users/change-password # Mudar senha
```

## 🧪 Testes

```bash
# Executar todos
npm test

# Com cobertura
npm test -- --coverage

# Modo watch
npm test -- --watch
```

**Cobertura mínima:** 70%

## 📝 Variáveis de Ambiente

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/financeiro
JWT_SECRET=sua_chave_secreta_muito_segura
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=sua_chave_refresh_muito_segura
JWT_REFRESH_EXPIRE=30d
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=10
MAX_LOGIN_ATTEMPTS=5
LOCK_TIME=15
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

## 🔧 NPM Scripts

```bash
npm start              # Inicia servidor
npm run dev            # Modo desenvolvimento (nodemon)
npm test               # Executar testes
npm run lint           # Verificar código
npm run lint:fix       # Corrigir código
```

## 📖 Exemplos de Requisição

### Registrar
```bash
curl -X POST http://localhost:5000/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "123456"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "123456"
  }'
```

### Criar Transação
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token" \
  -d '{
    "type": "expense",
    "category": "id_categoria",
    "amount": 50.00,
    "description": "Compra no supermercado"
  }'
```

## 🚀 Deploy

### Heroku
```bash
heroku create seu-app
git push heroku main
heroku config:set JWT_SECRET=sua_chave
```

### Docker
```bash
docker build -t financeiro-backend .
docker run -p 5000:5000 financeiro-backend
```

## 📚 Documentação

- [Express](https://expressjs.com/)
- [MongoDB](https://docs.mongodb.com/)
- [JWT](https://jwt.io/)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

## 🤝 Contribuir

1. Faça um fork
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

MIT
