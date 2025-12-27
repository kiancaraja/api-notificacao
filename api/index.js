const express = require('express');
const mongoose = require('mongoose');
const { Queue } = require('bullmq');
const FailedMessage = require('../models/FailedMessage');

const app = express();
app.use(express.json());

// 1. Conexão MongoDB com 127.0.0.1 (mais estável no Windows)
mongoose.connect('mongodb://127.0.0.1:27017/api-notificacao')
  .then(() => console.log("✅ MongoDB Conectado"))
  .catch(err => console.log("⚠️ MongoDB Offline"));

// 2. Configuração da Fila - O SEGREDO ESTÁ AQUI
const notificationQueue = new Queue('notification-queue', {
    connection: { 
        host: '127.0.0.1', 
        port: 6379,
        maxRetriesPerRequest: null // Impede o loop infinito de erros que trava tudo
    }
});

// Silencia os erros no console para não travar seu terminal
notificationQueue.on('error', (err) => {}); 

// 3. Rota com Resposta Imediata
app.post('/api/send-message', async (req, res) => {
    const { recipient, message } = req.body;

    try {
        await notificationQueue.add('send-email', { recipient, message });
        return res.status(202).json({ success: true, message: "Enfileirado!" });

    } catch (error) {
        console.log("⚠️ Plano B ativado: Salvando no MongoDB...");

        // Respondemos ao Postman PRIMEIRO para ele não dar ECONNRESET
        res.status(202).json({ 
            success: true, 
            message: "Recebido! Modo de segurança (MongoDB)." 
        });

        // Salvamos no banco depois, sem pressa
        FailedMessage.create({
            recipient,
            message,
            error: error.message,
            status: 'pending_redis'
        }).catch(e => console.log("Erro no banco"));
    }
});

app.listen(3000, () => console.log("🚀 Servidor pronto na porta 3000"));