const express = require("express");
const { Client } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

// PostgreSQL connection setup (same as before)
const client = new Client({
  user: "christopher",
  host: "localhost",
  database: "backend_test_db",
  password: "8",
  port: 5432,
});
client.connect();

// Middleware for JSON parsing
app.use(express.json());

// CRUD operations

// User Registration (Create)
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  const insertQuery = `
    INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id
  `;

  client.query(insertQuery, [name, email, hashedPassword], (err, result) => {
    if (err) {
      console.error("Error registering user", err);
      res.status(500).send("Error registering user");
    } else {
      const userId = result.rows[0].id;
      res.status(201).json({ id: userId });
    }
  });
});

// User Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const selectQuery = "SELECT * FROM users WHERE email = $1";
  client.query(selectQuery, [email], async (err, result) => {
    if (err) {
      console.error("Error authenticating user", err);
      res.status(500).send("Error authenticating user");
    } else {
      if (result.rows.length === 0) {
        res.status(401).send("Authentication failed");
      } else {
        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          // Create and send a JWT token
          const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET
          );
          res.json({ token });
        } else {
          res.status(401).send("Authentication failed");
        }
      }
    }
  });
});

// Protected Route
app.get("/protected", (req, res) => {
  // Middleware to verify JWT token here
  // For example, using 'express-jwt' or 'jsonwebtoken' package
  // Verify token and extract user information

  res.json({ message: "This is a protected route" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
