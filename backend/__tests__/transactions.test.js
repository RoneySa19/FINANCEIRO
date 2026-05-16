const request = require('supertest');
const app = require('../src/server');
const User = require('../src/models/User');
const Category = require('../src/models/Category');
const Transaction = require('../src/models/Transaction');

let token, userId, categoryId;

beforeAll(async () => {
  const user = await User.create({
    name: 'Teste User',
    email: 'teste@example.com',
    password: '123456'
  });

  userId = user._id;

  const category = await Category.create({
    userId,
    name: 'Alimentação',
    type: 'expense'
  });

  categoryId = category._id;

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'teste@example.com',
      password: '123456'
    });

  token = loginRes.body.accessToken;
});

afterAll(async () => {
  await User.deleteMany({});
  await Category.deleteMany({});
  await Transaction.deleteMany({});
});

describe('Transaction Routes', () => {
  describe('POST /api/transactions', () => {
    it('deve criar transação válida', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'expense',
          category: categoryId,
          amount: 50.00,
          description: 'Compra no supermercado'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.data.amount).toBe(50);
    });

    it('deve validar valor positivo', async () => {
      const res = await request(app)
        .post('/api/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'expense',
          category: categoryId,
          amount: -50,
          description: 'Compra no supermercado'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('GET /api/transactions', () => {
    it('deve listar transações do usuário', async () => {
      const res = await request(app)
        .get('/api/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });
});
