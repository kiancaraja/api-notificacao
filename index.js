const express = require('express');
const { Queue } = require('bullmq'); // Corrigido: Queue maiúsculo e bullmq

// Definição da Fila no Produtor
const emailQueue = new Queue('email-sender', { // Corrigido: Usando =
    connection: {
        host: 'localhost',
        port: 6379,
    }
});

const app = express();
app.use(express.json());

// Rota POST para adicionar tarefas
app.post('/api/send-message', async (req, res) => { 
    const { recipient, message } = req.body;

    if (!recipient || !message) { 
        // Retorna se faltarem dados
        return res.status(400).send({ error: 'Faltam dados: destinatário e mensagem.' });
    }

    try {
        // Corrigido: Variável recipient e try/catch para segurança
        const job = await emailQueue.add('send-email-job', { recipient, message });

        // Corrigido: Uso de backticks (`) para interpolação
        console.log(`Tarefa adicionada à fila! Job ID: ${job.id}`);

        res.status(202).send({
            message: 'Tarefa de email enfileirada com sucesso!',
            jobId: job.id
        });
    } catch (error) {
        console.error('Erro ao adicionar tarefa na fila:', error);
        res.status(500).send({ error: 'Falha interna ao enfileirar a mensagem.' });
    }
});
 
const PORT = 3000;
app.listen(PORT, () => {
    // Corrigido: Uso de backticks (`) para interpolação
    console.log(`Produtor rodando na porta ${PORT}`);
});