const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

/*const users = {
    1: { id: 1, name: "John Doe", role: "technician", email: "john@example.com", phone: "123-456-7890", extraInfo: "Certified electrician", pic: "default_pfp.png" },
    2: { id: 2, name: "Jane Smith", role: "client", email: "jane@example.com", phone: "987-654-3210", extraInfo: "Regular customer", pic: "default_pfp.png"  }
};

app.get("/profile/:id", (req, res) => {
    const userId = req.params.id;
    const user = users[userId];

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
});*/

const PORT = process.env.PORT || 5501;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/api/message", (req, res) => {
    res.json({ message: "Hello from Node.js!" });
});




const mysql = require('mysql2');

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
/*
db.query('SELECT * FROM user', (error, results, fields) => {
  if (error) throw error;
  console.log(results);
});
*/
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
      INSERT INTO User (firebase_uid, name, email, phone_number, location, is_technician, created_at)
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    db.query(userSql, [uid, name, email, phone || null, location, isTechnician ? 1 : 0], (err) => {
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
                if (err) return res.status(500).json({ error: "Database error (Technician)" });

                db.query(expertiseQuery, [uid], (err, expertiseResult) => {
                    if (err) return res.status(500).json({ error: "Database error (Expertise)" });

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

app.put('/api/update-profile', async (req, res) => {
  const {
    firebase_uid: uid,
    location,
    role,
    expertise_level,
    min_price,
    max_price,
    services // array of selected expertise strings
  } = req.body;

  if (!uid) return res.status(400).send("Missing UID");

  // 1. Fetch current user data
  const getUserSql = `SELECT location, is_technician FROM User WHERE firebase_uid = ?`;
  db.query(getUserSql, [uid], (err, userResults) => {
    if (err) return res.status(500).send("DB error fetching user");
    if (userResults.length === 0) return res.status(404).send("User not found");

    const user = userResults[0];
    const updates = [];
    const values = [];

    if (user.location !== location) {
      updates.push("location = ?");
      values.push(location);
    }

    const isTechnician = role === "technician";
    if (user.is_technician !== isTechnician) {
      updates.push("is_technician = ?");
      values.push(isTechnician);
    }

    if (updates.length > 0) {
      const updateSql = `UPDATE User SET ${updates.join(", ")} WHERE firebase_uid = ?`;
      db.query(updateSql, [...values, uid], (err) => {
        if (err) {
          console.error("Error updating User table:", err);
          return res.status(500).send("User update failed");
        }
      });
    }

    // 2. If technician, update Technician & Technician_Expertise tables
    if (isTechnician) {
      const getTechSql = `SELECT * FROM Technician WHERE firebase_uid = ?`;
      db.query(getTechSql, [uid], (err, techResults) => {
        if (err) return res.status(500).send("DB error fetching technician");

        const tech = techResults[0] || {};
        const techUpdates = [];
        const techValues = [];

        if (tech.expertise_level !== expertise_level) {
          techUpdates.push("expertise_level = ?");
          techValues.push(expertise_level);
        }
        if (tech.min_price != min_price) {
          techUpdates.push("min_price = ?");
          techValues.push(min_price);
        }
        if (tech.max_price != max_price) {
          techUpdates.push("max_price = ?");
          techValues.push(max_price);
        }

        const updateOrInsertTech = () => {
          if (techResults.length === 0) {
            const insertTech = `
              INSERT INTO Technician (firebase_uid, expertise_level, min_price, max_price)
              VALUES (?, ?, ?, ?)
            `;
            db.query(insertTech, [uid, expertise_level, min_price, max_price], (err) => {
              if (err) return res.status(500).send("Error inserting into Technician");
            });
          } else if (techUpdates.length > 0) {
            const updateTechSql = `UPDATE Technician SET ${techUpdates.join(", ")} WHERE firebase_uid = ?`;
            db.query(updateTechSql, [...techValues, uid], (err) => {
              if (err) return res.status(500).send("Error updating Technician");
            });
          }
        };

        updateOrInsertTech();

        // Now handle Technician_Expertise
        const getOldServicesSql = `SELECT expertise FROM Technician_Expertise WHERE firebase_uid = ?`;
        db.query(getOldServicesSql, [uid], (err, results) => {
          if (err) return res.status(500).send("Error reading technician expertise");

          const oldServices = results.map(row => row.expertise).sort();
          const newServices = [...(services || [])].sort();

          const isSame = oldServices.length === newServices.length &&
            oldServices.every((val, i) => val === newServices[i]);

          if (isSame) {
            return res.status(200).send("Profile updated (no expertise changes)");
          }

          // Delete old and insert new
          const deleteSql = `DELETE FROM Technician_Expertise WHERE firebase_uid = ?`;
          db.query(deleteSql, [uid], (err) => {
            if (err) return res.status(500).send("Error deleting old expertise");

            if (newServices.length === 0) {
              return res.status(200).send("Profile updated (expertise cleared)");
            }

            const insertSql = `
              INSERT INTO Technician_Expertise (firebase_uid, expertise)
              VALUES ?
            `;
            const values = newServices.map(service => [uid, service]);
            db.query(insertSql, [values], (err) => {
              if (err) return res.status(500).send("Error inserting expertise");
              return res.status(200).send("Profile updated successfully");
            });
          });
        });
      });
    } else {
      // User is no longer a technician — clean up Technician and Technician_Expertise
        const deleteExpertiseSql = `DELETE FROM Technician_Expertise WHERE firebase_uid = ?`;
        db.query(deleteExpertiseSql, [uid], (err) => {
          if (err) console.error("Error deleting Technician_Expertise:", err);
        });

        const deleteTechSql = `DELETE FROM Technician WHERE firebase_uid = ?`;
        db.query(deleteTechSql, [uid], (err) => {
          if (err) console.error("Error deleting Technician:", err);
        });

      return res.status(200).send("Profile updated successfully");
    }
  });
});


app.get("/findTechnicians", async (req, res) => {
  const { uid, service } = req.query;

  if (!uid || !service) return res.status(400).json({ error: "Missing uid or service" });

  try {
    const [userResult] = await db.promise().query("SELECT location FROM User WHERE firebase_uid = ?", [uid]);
    if (userResult.length === 0) return res.status(404).json({ error: "User not found" });

    const location = userResult[0].location;

    const [techs] = await db.promise().query(
      `
      SELECT u.firebase_uid, u.name, u.phone_number AS phone, u.location, t.expertise_level AS experience, t.min_price, t.max_price, te.expertise AS task
      FROM User u
      JOIN Technician t ON u.firebase_uid = t.firebase_uid
      JOIN Technician_Expertise te ON t.firebase_uid = te.firebase_uid
      WHERE u.location = ? AND te.expertise = ?
      `,
      [location, service]
    );

    res.json(techs);
  } catch (err) {
    console.error("Error fetching technicians:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post('/api/create_appointment', async (req, res) => {
  const { DateAndTime, Status, CustomerID, TechnicianID, Service } = req.body;

  // Validate the incoming data
  if (!DateAndTime || !Status || !CustomerID || !TechnicianID || !Service) {
      return res.status(400).send("Missing required fields");
  }

  // Prepare SQL query to insert appointment into the database
  const sql = `INSERT INTO appointment (DateAndTime, Status, CustomerID, TechnicianID, Service, CreatedAt, UpdatedAt)
               VALUES (?, ?, ?, ?, ?, NOW(), NOW())`;

  // Execute the query
  db.query(sql, [DateAndTime, Status, CustomerID, TechnicianID, Service], (err, result) => {
      if (err) {
          console.error("Error inserting appointment:", err);
          return res.status(500).send("Error creating appointment");
      }

      res.status(200).send("Appointment created successfully");
  });
});
