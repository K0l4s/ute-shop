const WebSocket = require('ws');

// Tạo WebSocket server dựa trên server HTTP của Express
const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  // Lắng nghe các kết nối WebSocket
  wss.on('connection', (ws) => {
    console.log('Client connected');

    // Nhận tin nhắn từ client
    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
    });

    // Gửi thông báo cho client
    // ws.send(JSON.stringify({ message: 'Welcome to the notification system' }));
    // ws.send(JSON.stringify({ message: 'Don hang sap duoc giao den ban, vui long chu y dien' }));

    // Đóng kết nối
    ws.on('close', () => {
      console.log('Client disconnected'); 
    });
  });

  return wss;
}

module.exports = setupWebSocket;
