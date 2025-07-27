const express = require('express');
const http = require('http');
const axios = require('axios');
const db = require('./models/index.js');
const passport = require('./config/oAuth2Config.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const bookRoutes = require('./routes/bookRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const publisherRoutes = require('./routes/publisherRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const cartRoutes = require('./routes/cartRoutes.js');

const checkoutRoutes = require('./routes/checkoutRoutes.js');

const voucherRoutes = require('./routes/voucherRoutes.js');

const uploadRouter = require('./routes/upload.js');


const paymentRoutes = require('./routes/paymentRoutes.js');
const analystRoutes = require('./routes/analystRoutes.js');
const authorRoutes = require('./routes/authorRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');
const walletRoutes = require('./routes/walletRoute.js');
const genreRoutes = require('./routes/genreRoutes.js');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const setupWebSocket = require('./config/websocketConfig.js');
const { job } = require('../cron.js');

job.start();

const port = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cookieParser());

const wss = setupWebSocket(server); 

var corsOptions = {
  origin: ["http://localhost:3000", "http://uteshop.local:3000", "https://uteshop.vercel.app","http://192.168.1.7:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// JWT authentication routes
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/user', userRoutes);

app.use('/api/v1/book', bookRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/publisher', publisherRoutes);
app.use('/api/v1/order', (req, res, next) => {
  req.wss = wss;
  next();
}, orderRoutes);
app.use('/api/v1/cart', cartRoutes);

app.use('/api/v1/checkout', checkoutRoutes);

app.use('/api/v1/voucher', voucherRoutes);
// app.use('/api/v1/payment', paymentRoutes);

app.use('/api/v1/upload', uploadRouter);

app.use('/api/v1/payment', (req, res, next) => {
  req.wss = wss;
  next();
}, paymentRoutes);
app.use('/api/v1/analyst', analystRoutes);
app.use('/api/v1/author', authorRoutes);
app.use('/api/v1/notification', notificationRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/genre', genreRoutes);

app.get('/api/v1/distance', async (req, res) => {
  const { origins, destinations } = req.query;

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins,
        destinations,
        key: process.env.GOOGLE_MAPS_API_KEY,
        units: 'metric',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching distance:', error);
    res.status(500).json({ error: 'Failed to fetch distance' });
  }
});

server.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    await db.sequelize.sync(); // Sync models with the database
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
