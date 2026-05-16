const request = require('supertest');
const app = require('../src/server');
const User = require('../src/models/User');

describe('Auth Routes', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/registrar', () => {
    it('deve registrar novo usuário', async () => {
      const res = await request(app)
        .post('/api/auth/registrar')
        .send({
          name: 'João Silva',
          email: 'joao@example.com',
          password: '123456'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.user.email).toBe('joao@example.com');
    });

    it('deve rejeitar email duplicado', async () => {
      await request(app)
        .post('/api/auth/registrar')
        .send({
          name: 'João Silva',
          email: 'joao@example.com',
          password: '123456'
        });

      const res = await request(app)
        .post('/api/auth/registrar')
        .send({
          name: 'Maria Silva',
          email: 'joao@example.com',
          password: '123456'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('já cadastrado');
    });

    it('deve validar email inválido', async () => {
      const res = await request(app)
        .post('/api/auth/registrar')
        .send({
          name: 'João Silva',
          email: 'email-invalido',
          password: '123456'
        });

      expect(res.statusCode).toBe(400);
    });

    it('deve validar senha mínima', async () => {
      const res = await request(app)
        .post('/api/auth/registrar')
        .send({
          name: 'João Silva',
          email: 'joao@example.com',
          password: '123'
        });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/registrar')
        .send({
          name: 'João Silva',
          email: 'joao@example.com',
          password: '123456'
        });
    });

    it('deve fazer login com credenciais válidas', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'joao@example.com',
          password: '123456'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.accessToken).toBeDefined();
    });

    it('deve rejeitar senha incorreta', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'joao@example.com',
          password: 'senhaerrada'
        });

      expect(res.statusCode).toBe(401);
    });

    it('deve rejeitar email inexistente', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'inexistente@example.com',
          password: '123456'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
