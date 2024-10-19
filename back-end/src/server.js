const express = require('express');
const axios = require('axios');
const db = require('./models/index.js');
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const bookRoutes = require('./routes/bookRoutes.js');
const reviewRoutes = require('./routes/reviewRoutes.js');
const publisherRoutes = require('./routes/publisherRoutes.js');
const orderRoutes = require('./routes/orderRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes.js');
const analystRoutes = require('./routes/analystRoutes.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cookieParser());

var corsOptions = {
  origin: ["http://localhost:3000", "http://uteshop.local:3000"],
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
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/analyst', analystRoutes);

app.get('/api/distance', async (req, res) => {
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

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    await db.sequelize.sync(); // Sync models with the database
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
