import express from "express";
import sequelize from "./config/configdb.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookRoutes from './routes/bookRoutes.js';
import cors from "cors";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());
app.use(cookieParser());

var corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// JWT authentication routes
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/user', userRoutes);

app.use('/api/v1/books', bookRoutes);

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    await sequelize.sync(); // Sync models with the database
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});