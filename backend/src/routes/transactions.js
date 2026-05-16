const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const router = express.Router();
router.use(auth);

// CRIAR TRANSAÇÃO
router.post('/',
  body('type').isIn(['income', 'expense']).withMessage('Tipo inválido'),
  body('category').notEmpty().withMessage('Categoria obrigatória'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valor inválido'),
  body('description').trim().isLength({ min: 3 }).withMessage('Descrição obrigatória'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const transaction = new Transaction({
        ...req.body,
        userId: req.user._id
      });

      await transaction.save();
      await transaction.populate('category');

      res.status(201).json({ message: 'Transação criada', data: transaction });
    } catch (error) {
      next(error);
    }
  }
);

// LISTAR TRANSAÇÕES
router.get('/',
  query('type').optional().isIn(['income', 'expense']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { type, startDate, endDate, page = 1, limit = 10 } = req.query;
      const query = { userId: req.user._id };

      if (type) query.type = type;
      if (startDate || endDate) {
        query.date = {};
        if (startDate) query.date.$gte = new Date(startDate);
        if (endDate) query.date.$lte = new Date(endDate);
      }

      const skip = (page - 1) * limit;
      const total = await Transaction.countDocuments(query);
      const transactions = await Transaction.find(query)
        .populate('category')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit);

      res.status(200).json({
        data: transactions,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) }
      });
    } catch (error) {
      next(error);
    }
  }
);

// OBTER TRANSAÇÃO
router.get('/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  async (req, res, next) => {
    try {
      const transaction = await Transaction.findOne({
        _id: req.params.id,
        userId: req.user._id
      }).populate('category');

      if (!transaction) {
        return res.status(404).json({ message: 'Transação não encontrada' });
      }

      res.status(200).json({ data: transaction });
    } catch (error) {
      next(error);
    }
  }
);

// ATUALIZAR TRANSAÇÃO
router.put('/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  body('amount').optional().isFloat({ min: 0.01 }),
  async (req, res, next) => {
    try {
      const transaction = await Transaction.findOneAndUpdate(
        { _id: req.params.id, userId: req.user._id },
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).populate('category');

      if (!transaction) {
        return res.status(404).json({ message: 'Transação não encontrada' });
      }

      res.status(200).json({ message: 'Transação atualizada', data: transaction });
    } catch (error) {
      next(error);
    }
  }
);

// DELETAR TRANSAÇÃO
router.delete('/:id',
  param('id').isMongoId().withMessage('ID inválido'),
  async (req, res, next) => {
    try {
      const transaction = await Transaction.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transação não encontrada' });
      }

      res.status(200).json({ message: 'Transação deletada' });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
