const express = require('express');
const { queue } = require('bulmq');

const emailQueue - new Queue('email-sender' , {
    connection: {
        host: 'localhost',
        port: 6379,
    }
});
const app = express();
app.use(express.json());

app.post('/api/send-email', async (req, res) => { 
    const { recipient, message } = req.body;

if (!recipient || !message) { 
    return res.status(400).send({ error: 'Faltam dados: destinatário e mensagem.' });

    const job = await emailQueue.add('send-email-job', { reciepient, message });

    console.log('Tarefa adicionada à fila! Job ID: ${job.id}');
    res.status(202).send({
        message: 'Tarefa de email enfileirada com sucesso!',
        jobId: job.id})
    });
    });

 
const PORT = 3000;
app.listen(PORT, () => {
    console.log('Produtor rodando na porta ${PORT}');
});