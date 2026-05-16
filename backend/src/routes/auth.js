const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Helper para gerar tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
  return { accessToken, refreshToken };
};

// REGISTRAR
router.post('/registrar',
  body('name').trim().isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Verificar se email já existe
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }

      // Criar novo usuário
      const user = new User({ name, email: email.toLowerCase(), password });
      await user.save();

      // Gerar tokens
      const { accessToken, refreshToken } = generateTokens(user._id);

      res.status(201).json({
        message: 'Usuário criado com sucesso',
        user: { id: user._id, name: user.name, email: user.email },
        accessToken,
        refreshToken
      });
    } catch (error) {
      next(error);
    }
  }
);

// LOGIN
router.post('/login',
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Encontrar usuário
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Verificar se está bloqueado
      if (user.isLocked()) {
        return res.status(429).json({ message: 'Conta bloqueada. Tente novamente mais tarde' });
      }

      // Validar senha
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        user.loginAttempts += 1;
        if (user.loginAttempts >= parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5) {
          user.lockUntil = new Date(Date.now() + parseInt(process.env.LOCK_TIME) * 60 * 1000 || 15 * 60 * 1000);
        }
        await user.save();
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      // Reset login attempts
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      user.lastLogin = new Date();
      await user.save();

      // Gerar tokens
      const { accessToken, refreshToken } = generateTokens(user._id);

      res.status(200).json({
        message: 'Login bem-sucedido',
        user: { id: user._id, name: user.name, email: user.email },
        accessToken,
        refreshToken
      });
    } catch (error) {
      next(error);
    }
  }
);

// REFRESH TOKEN
router.post('/refresh-token', (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token não fornecido' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(decoded.id);

    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
