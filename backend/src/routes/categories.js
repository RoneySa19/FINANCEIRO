const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Category = require('../models/Category');
const Transaction = require('../models/Transaction');

const router = express.Router();
router.use(auth);

// CRIAR CATEGORIA
router.post('/',
  body('name').trim().isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres'),
  body('type').isIn(['income', 'expense']).withMessage('Tipo inválido'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Cor inválida'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const category = new Category({
        ...req.body,
        userId: req.user._id
      });

      await category.save();
      res.status(201).json({ message: 'Categoria criada', data: category });
    } catch (error) {
      next(error);
    }
  }
);

// LISTAR CATEGORIAS
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find({ userId: req.user._id }).sort({ name: 1 });
    res.status(200).json({ data: categories });
  } catch (error) {
    next(error);
  }
});

// DELETAR CATEGORIA
router.delete('/:id', async (req, res, next) => {
  try {
    const hasTransactions = await Transaction.findOne({
      category: req.params.id,
      userId: req.user._id
    });

    if (hasTransactions) {
      return res.status(400).json({ message: 'Não pode deletar categoria com transações' });
    }

    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.status(200).json({ message: 'Categoria deletada' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
