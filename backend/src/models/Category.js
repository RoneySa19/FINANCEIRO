const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  color: {
    type: String,
    default: '#3b82f6',
    match: [/^#[0-9A-F]{6}$/i, 'Cor inválida']
  },
  icon: String,
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Índice de unicidade por usuário
CategorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Category', CategorySchema);
