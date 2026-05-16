const mongoose = require('mongoose');

const mongooseConnection = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/financeiro';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ Conectado ao MongoDB');
  } catch (error) {
    console.error('❌ Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = mongooseConnection;
