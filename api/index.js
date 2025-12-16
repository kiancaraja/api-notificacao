const express = require('express');
const { Queue } = require('bullmq');

const app = express();
app.use(express.json());

// Conexão com o Redis (a mesma usada no Worker)
const connection = {
    host: 'localhost',
    port: 6379,
};

// Cria a fila de notificação (o nome deve ser o mesmo usado no Worker)
const notificationQueue = new Queue('notification-queue', { connection });

// Endpoint para enviar notificações
app.post('/api/send-notification', async (req, res) => {
    const { userId, message } = req.body;

    if (!userId || !message) {
        return res.status(400).send({ error: 'Faltam userId e message' });
    }

    try {
        // Adiciona o job à fila
        const job = await notificationQueue.add('notificationJob', {
            userId,
            message,
            timestamp: new Date().toISOString()
        });

        console.log(`[API] Job enfileirado com ID: ${job.id} para o usuário ${userId}`);
        res.status(200).send({
            message: 'Notificação enfileirada com sucesso!',
            jobId: job.id
        });
    } catch (error) {
        console.error("[API] Erro ao adicionar job na fila:", error);
        res.status(500).send({ error: 'Erro interno ao enfileirar notificação.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Produtor Express rodando na porta ${PORT}`);
});