const WebSocket = require('ws');
const os = require('os');

const interfaces = os.networkInterfaces();
let localIpAddress;

Object.keys(interfaces).forEach((interfaceName) => {
  interfaces[interfaceName].forEach((iface) => {
    if (iface.family === 'IPv4' && !iface.internal) {
      localIpAddress = iface.address;
    }
  });
})

const wss = new WebSocket.Server({ port: 8080, host: '0.0.0.0' });

wss.on('listening', () => {
  console.log(`WebSocket server running at ws://${localIpAddress}:8080`);
});

wss.on('connection', (ws) => {
  console.log('Novo cliente conectado.');

  ws.on('message', (message) => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (error) {
      console.error('Erro ao parsear mensagem JSON:', error);
      return;
    }

    parsedMessage.timestamp = new Date().toISOString()

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedMessage));
      }
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado.');
  });

  ws.on('error', (error) => {
    console.error('Erro no WebSocket:', error);
  });
});
