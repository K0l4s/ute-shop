const db = require('../models');
const Notification = db.Notification;
const WebSocket = require('ws');

// Tạo WebSocket server dựa trên server HTTP của Express
const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  // Lắng nghe các kết nối WebSocket
  wss.on('connection', async (ws, req) => {
    console.log('Client connected');
    // Lấy userId từ query string
    const userId = req.url.split('userId=')[1];
    if (!userId) {
      ws.close(4001, 'Unauthorized');
      return;
    }
    ws.userId = userId;

    // Nhận tin nhắn từ client
    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
    });

    // Gửi thông báo cho client
    // const newNotification = await Notification.create({
    //   user_id: 1, // Thay thế bằng ID người dùng thực tế
    //   message: 'This is a test notification',
    //   is_read: false
    // });

    // ws.send(JSON.stringify(newNotification));

    // Đóng kết nối
    ws.on('close', () => {
      console.log('Client disconnected'); 
    });
  });

  return wss;
}

module.exports = setupWebSocket;
