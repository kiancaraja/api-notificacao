// queue.js
const { Queue, Worker } = require('bullmq'); // CORREÇÃO: Adicionada a vírgula e o Worker

// Configuração do Redis (mesma porta padrão)
const connection = {
    host: 'localhost',
    port: 6379
};

// 1. Definição da Fila de Mensagens (Onde o Produtor adiciona)
const notificationQueue = new Queue('notificationQueue', { connection });

// 2. Definição do Worker (Processador de Jobs)
// O Worker é o que realmente processa o trabalho de envio (o consumidor).
const worker = new Worker('notificationQueue', async job => {
    // CORREÇÃO: Uso de backticks (`) para template literals
    console.log(`[Worker] Processando Job ${job.id} para: ${job.data.recipient}`);
    console.log(`[Worker] Mensagem: ${job.data.message}`);

    // Simulação de tempo de processamento para evitar bloqueio
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    // CORREÇÃO: Sintaxe correta do return
    return { status: 'processed', message: 'Notificação enviada com sucesso (Simulado)' };
}, { connection }); // CORREÇÃO: Fechamento correto da definição do Worker


console.log('Fila e Worker inicializados com sucesso.'); // CORREÇÃO: Texto do console.log

module.exports = {
    notificationQueue 
};