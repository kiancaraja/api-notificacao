const { Worker } = require('bullmq');

// A conexão com o Redis deve ser a mesma usada no Produtor (API)
const connection = {
    host: 'localhost',
    port: 6379,
};

// Cria e inicia o Worker que consome a fila 'notification-queue'
const worker = new Worker('notification-queue', async job => {
    // Lógica de processamento do Job
    console.log(`[Worker] 📥 Job recebido: ${job.id}`);
    console.log(`[Worker] Processando notificação para o usuário ${job.data.userId}...`);

    // Simula o tempo que levaria para enviar um e-mail/SMS (operação assíncrona)
    // Deixamos um delay de 3 segundos para ver a fila trabalhando
    await new Promise(resolve => setTimeout(resolve, 3000)); 

    console.log(`✅ Job ${job.id} processado com sucesso! Mensagem: "${job.data.message}"`);
    
    // Retorne um valor (opcional)
    return { status: 'Notificação enviada' };
}, { connection });

console.log('🚀 Worker INICIADO. Aguardando jobs...');

// Tratamento de erros
worker.on('failed', (job, err) => {
  console.error(`[Worker] ❌ Job ${job.id} falhou: ${err.message}`);
});

// Tratamento de encerramento
process.on('SIGINT', async () => {
    console.log('\n[Worker] SIGINT recebido. Fechando o Worker de forma graciosa...');
    await worker.close();
    console.log('[Worker] Worker encerrado com sucesso. Tchau!');
    process.exit(0);
});