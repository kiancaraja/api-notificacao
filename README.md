# 🔔 API de Mensageira Assíncrona (Produtor/Worker - Node.js e BullMQ) (Desenvolvimento Concluído)

## Contexto e Objetivo
Esta API foi desenvolvida para solucionar problemas de **bloqueio** e **falha de escalabilidade** em sistemas que precisam enviar um alto volume de notificações (e-mail, WhatsApp, SMS). Em vez de processar o envio imediatamente (o que "trava" a API), ela enfileira o trabalho para ser processado de forma lenta e segura. Este padrão é essencial para a **resiliência do sistema**.

## 🧱 Arquitetura e Fluxo de Dados
O coração do projeto é a separação entre o Produtor e o Consumidor (Worker), garantindo a resiliência do sistema:

1.  **Produtor (index.js - Express):** Recebe a requisição HTTP (em massa) e, em milissegundos, adiciona a tarefa na fila.
2.  **Fila (Queue/Redis):** Gerenciada pelo **BullMQ**, que utiliza o **Redis** como *broker* (armazenamento temporário e persistente das tarefas). Serve como um *buffer* de segurança.
3.  **Worker (queue.js - Consumidor):** Processa os trabalhos da fila de forma **assíncrona e controlada**, simulando um *delay* entre envios (Estratégia Anti-Bloqueio/Resiliência).

## 🛠️ Tecnologias Utilizadas
* **Backend:** Node.js, Express
* **Fila/Processamento:** BullMQ
* **Broker da Fila:** Redis
* **Padrão de Arquitetura:** Produtor/Consumidor (Filas)

## 💡 Como Testar
1.  **Pré-requisito:** Certifique-se de que o **Redis** esteja a ser executado na porta padrão (6379).
2.  Inicie a aplicação: `node index.js` (isso inicia o Worker e o Produtor).
3.  Envie uma requisição POST para: `http://localhost:3000/api/send-message`
    
    Corpo da Requisição (JSON):
    ```json
    {
      "recipient": "cliente@exemplo.com",
      "message": "Sua notificação foi enfileirada com sucesso."
    }
    ```
A API responderá em milissegundos (status 202), mas o Worker fará o processamento real no *background*.

Desenvolvedora Backend: Eliene Maria da Silva 💚🌱🌵🌻