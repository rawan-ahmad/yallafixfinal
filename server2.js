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

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '$Lut)@t@f@G',
  database: 'yallafix'
});

db.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

db.query('SELECT * FROM users', (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});

app.post('/api/saveUser', (req, res) => {
    const {
      uid,
      name,
      email,
      phone,
      location,
      isTechnician,
      expertiseLevel,
      priceMin,
      priceMax,
      services
    } = req.body;
  
    if (!uid || !name || !location) {
      return res.status(400).send('Missing required user fields');
    }
  
    // Insert into user table
    const userSql = `
      INSERT INTO User (firebase_uid, name, phone_number, location, is_technician, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    db.query(userSql, [uid, name, phone || null, location, isTechnician ? 1 : 0], (err) => {
      if (err) {
        console.error('Error inserting into User:', err);
        return res.status(500).send('Error inserting user');
      }
  
      if (isTechnician) {
        // Insert into Technician table
        const technicianSql = `
          INSERT INTO Technician (firebase_uid, expertise_level, min_price, max_price)
          VALUES (?, ?, ?, ?)
        `;
        db.query(
          technicianSql,
          [uid, expertiseLevel || null, priceMin || null, priceMax || null],
          (err) => {
            if (err) {
              console.error('Error inserting into Technician:', err);
              return res.status(500).send('Error inserting technician');
            }
  
            // Insert multiple services (technician_expertise)
            if (Array.isArray(services) && services.length > 0) {
              const expertiseSql = `
                INSERT INTO Technician_Expertise (firebase_uid, expertise)
                VALUES ?
              `;
              const expertiseValues = services.map((service) => [uid, service]);
  
              db.query(expertiseSql, [expertiseValues], (err) => {
                if (err) {
                  console.error('Error inserting into Technician_Expertise:', err);
                  return res.status(500).send('Error inserting expertise');
                }
  
                return res.status(200).send('Technician user saved successfully');
              });
            } else {
              // No expertise selected
              return res.status(200).send('Technician user saved without expertise');
            }
          }
        );
      } else {
        return res.status(200).send('Service seeker user saved successfully');
      }
    });
  });
  
  app.get("/profile/:uid", (req, res) => {
    const uid = req.params.uid;

    const userQuery = `SELECT * FROM User WHERE firebase_uid = ?`;
    db.query(userQuery, [uid], (err, userResult) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (userResult.length === 0) return res.status(404).json({ error: "User not found" });

        const user = userResult[0];

        if (user.is_technician) {
            const techQuery = `SELECT * FROM Technician WHERE firebase_uid = ?`;
            const expertiseQuery = `SELECT expertise FROM Technician_Expertise WHERE firebase_uid = ?`;

            db.query(techQuery, [uid], (err, techResult) => {
                if (err) return res.status(500).json({ error: "Database error" });

                db.query(expertiseQuery, [uid], (err, expertiseResult) => {
                    if (err) return res.status(500).json({ error: "Database error" });

                    const expertise = expertiseResult.map(row => row.expertise);
                    res.json({
                        ...user,
                        ...techResult[0],
                        expertise
                    });
                });
            });
        } else {
            res.json(user);
        }
    });
});



db.end();
