const mongoose = require('mongoose');

// Definimos a estrutura dos dados de "emergência"
const FailedMessageSchema = new mongoose.Schema({
  recipient: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  error: { 
    type: String 
  }, // Guardamos o erro técnico para saber por que o Redis falhou
  status: { 
    type: String, 
    default: 'pending_redis' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('FailedMessage', FailedMessageSchema);