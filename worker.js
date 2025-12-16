// worker/notificationWorker.js

const { Worker } = require('bullmq');

// Configuração da conexão com o Redis
// Nota: Se rodar local no terminal, use '127.0.0.1'. Se fosse dentro do Docker, seria 'redis'.
const connection = {
  host: '127.0.0.1', 
  port: 6379,
};

// Simulando uma função de envio de e-mail (demorada)
const sleep = (t) => new Promise((resolve) => setTimeout(resolve, t));

// 1. Cria o Worker
const worker = new Worker('notifications', async (job) => {
    // Esta função é executada para CADA job que chega na fila
    console.log(`[WORKER] Processando Job ID ${job.id} | Usuário: ${job.data.userId}`);
    
    // Simula o tempo de envio de um e-mail (3 segundos)
    await sleep(3000); 
    
    console.log(`[WORKER] Job ID ${job.id} concluído! Notificação enviada: "${job.data.message}"`);
  }, 
  { connection }
);

// ------------------------------------------------------------------
// 🎯 O DIFERENCIAL SÊNIOR: Graceful Shutdown (SIGTERM)
// ------------------------------------------------------------------
// Quando o ECS/Fargate (ou Docker) mandar parar, o Worker não morre na hora.
// Ele termina o que está fazendo primeiro.

process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM recebido. Fechando o Worker de forma graciosa...');
  
  await worker.close(); // O BullMQ espera os jobs ativos terminarem
  
  console.log('✅ Worker encerrado com sucesso. Tchau!');
  process.exit(0);
});

console.log('🚀 Worker de Notificações INICIADO. Aguardando jobs...');