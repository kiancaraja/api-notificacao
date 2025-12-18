const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');

const connection = {
    host: 'localhost',
    port: 6379,
};

// Função para enviar o e-mail
async function sendEmail(jobData) {
    // Criando uma conta de teste no Ethereal (apenas para desenvolvimento)
    let testAccount = await nodemailer.createTestAccount();

   const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'emsmms42@gmail.com',
        pass: 'u-ua. as. sx x u-ud. db. bu-u u-uo thei. ia. a k- kli. im. m' // Sem espaços!
    },
});

let info = await transporter.sendMail({
    from: '"Eliene - API Notificação" <emsmms42@gmail.com>',
    to: "emsmms42@gmail.com", // Enviando para você mesma para testar
    subject: "TESTE REAL: Notificação via BullMQ! 🚀",
    text: jobData.message,
    html: `<b>Olá Eliene!</b><p>Sua fila funcionou! Mensagem: ${jobData.message}</p>`,
});

        console.log("✉️ E-mail enviado: %s", info.messageId);
    console.log("🔗 Visualize o e-mail aqui: %s", nodemailer.getTestMessageUrl(info));
}

const worker = new Worker('notification-queue', async (job) => {
    console.log(`👷 Processando job ${job.id}...`);
    
    // Agora o worker realmente faz algo útil: envia um e-mail!
    await sendEmail(job.data);
    
}, { connection });

console.log('👷 Worker de e-mail rodando...');