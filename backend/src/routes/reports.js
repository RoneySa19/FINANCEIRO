const express = require('express');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

const router = express.Router();
router.use(auth);

// RESUMO FINANCEIRO
router.get('/summary', async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query);

    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
      transactionCount: transactions.length
    };

    transactions.forEach(t => {
      if (t.type === 'income') {
        summary.totalIncome += t.amount;
      } else {
        summary.totalExpense += t.amount;
      }
    });

    summary.balance = summary.totalIncome - summary.totalExpense;

    res.status(200).json({ data: summary });
  } catch (error) {
    next(error);
  }
});

// ANÁLISE POR CATEGORIA
router.get('/by-category', async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;
    const query = { userId: req.user._id };

    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const data = await Transaction.aggregate([
      { $match: query },
      { $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }},
      { $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'categoryInfo'
      }}
    ]);

    res.status(200).json({ data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
