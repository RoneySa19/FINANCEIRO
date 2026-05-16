const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();
router.use(auth);

// OBTER PERFIL
router.get('/profile', async (req, res, next) => {
  try {
    res.status(200).json({ data: req.user });
  } catch (error) {
    next(error);
  }
});

// ATUALIZAR PERFIL
router.put('/profile',
  body('name').optional().trim().isLength({ min: 3 }),
  body('phone').optional().isMobilePhone(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, phone } = req.body;
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, phone, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      res.status(200).json({ message: 'Perfil atualizado', data: user });
    } catch (error) {
      next(error);
    }
  }
);

// ALTERAR SENHA
router.post('/change-password',
  body('currentPassword').notEmpty().withMessage('Senha atual obrigatória'),
  body('newPassword').isLength({ min: 6 }).withMessage('Nova senha deve ter pelo menos 6 caracteres'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select('+password');

      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
