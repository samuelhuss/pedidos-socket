const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors'); // Import CORS middleware


const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());

io.on('connection', (socket) => {
  console.log('Novo cliente conectado.');

  socket.on('message', (message) => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      console.error('Erro ao parsear mensagem JSON:', error);
      return;
    }

    parsedMessage.timestamp = new Date().toISOString();

    io.emit('message', JSON.stringify(parsedMessage));
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado.');
  });

  socket.on('error', (error) => {
    console.error('Erro no Socket.IO:', error);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
