import dotenv from "dotenv";
dotenv.config();

import express from "express";
import sequelize from "./config/configdb.js";
import authRoutes from "./routes/authRoutes.js";

const port = process.env.PORT || 8080;

const app = express();
app.use(express.json());

// JWT authentication routes
app.use('/api/auth', authRoutes);

app.listen(port, async () => {
  console.log(`Server is running on http://localhost:${port}`);
  try {
    await sequelize.sync(); // Sync models with the database
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
