require("dotenv").config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const Database = require("./db");
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : (process.env.PORT || 5000);

console.log("PORT:", process.env.PORT);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("API_KEY:", process.env.API_KEY);
console.log("JWT_SECRET:", process.env.JWT_SECRET);

//Works only express 4.16+ version if not please use body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

console.log('bcrypt+++++', bcrypt.hashSync('password', 8));

// Create a MySQL connection pool (better for production apps)
global.db = new Database({ 
  host: "localhost",
  user: "root",
  password: "",
  database: "mern1",
});

app.get('/users', async (req, res) => {
  try {
    const data = await db.runQuery('SELECT * FROM users1');
    if (data.status) {
      res.json(data.result); // ✅ correct way
    } else {
      res.status(500).json({ error: data.sqlMessage });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).send('Database error');
  }
});

app.get('/', (req, res) => {
  res.send('Hello World')
});

let appRoutes = require("./routes/");

app.use(appRoutes);

//app.listen(PORT, () => console.log('Server listening on port ' + PORT));
app.listen(5050, () => console.log('Server listening on port 5050'));
