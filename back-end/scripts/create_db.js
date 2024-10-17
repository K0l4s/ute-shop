const mysql = require('mysql2');
const dotenv = require('dotenv');

// Load env
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }

  const createDatabaseQuery = `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``;

  connection.query(createDatabaseQuery, (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }

    console.log('Database created or already exists.');
    connection.end();
  });
});