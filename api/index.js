const express = require('express');
const { Queue } = require('bullmq');
const { createBullBoard } = require('@bull-board/api');
const { BullMQAdapter } = require('@bull-board/api/bullMQAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const app = express();
app.use(express.json());

const connection = {
    host: 'localhost',
    port: 6379,
};

// Conexão com a fila que você já criou
const notificationQueue = new Queue('notification-queue', { connection });

// --- CONFIGURAÇÃO DO DASHBOARD (BULL BOARD) ---
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

createBullBoard({
    queues: [new BullMQAdapter(notificationQueue)],
    serverAdapter: serverAdapter,
});

// Adiciona a rota do painel na nossa API
app.use('/admin/queues', serverAdapter.getRouter());
// ----------------------------------------------

app.post('/api/send-notification', async (req, res) => {
    const { userId, message } = req.body;
    try {
        const job = await notificationQueue.add('notificationJob', { userId, message });
        res.status(200).send({ message: 'Notificação enfileirada!', jobId: job.id });
    } catch (error) {
        res.status(500).send({ error: 'Erro ao enfileirar' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 API rodando na porta ${PORT}`);
    console.log(`📊 Dashboard disponível em: http://localhost:${PORT}/admin/queues`);
});