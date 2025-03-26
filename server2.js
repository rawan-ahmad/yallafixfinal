const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const users = {
    1: { id: 1, name: "John Doe", role: "technician", email: "john@example.com", phone: "123-456-7890", extraInfo: "Certified electrician" },
    2: { id: 2, name: "Jane Smith", role: "client", email: "jane@example.com", phone: "987-654-3210", extraInfo: "Regular customer" }
};

app.get("/profile/:id", (req, res) => {
    const userId = req.params.id;
    const user = users[userId];

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
});

const PORT = process.env.PORT || 5501;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/api/message", (req, res) => {
    res.json({ message: "Hello from Node.js!" });
});




const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '$Lut)@t@f@G',
  database: 'yallafix'
});

connection.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

connection.query('SELECT * FROM users', (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});


connection.end();
