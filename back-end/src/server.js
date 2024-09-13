import dotenv from "dotenv";
dotenv.config();

import express from "express";
import sequelize from "./config/configdb.js";

const port = process.env.PORT;

const app = express();
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});