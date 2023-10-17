const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const { Client } = require("pg");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("./middleware/auth");
require("dotenv").config();

// Connect DB
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
client.connect();

app.use(express.json());

app.post("/register", async (req, res) => {
  const { code, name, email, password } = req.body;

  if (!code || !name || !email || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const checkUserCodeExistQuery = "SELECT id FROM users WHERE code = $1";
    const checkUserEmailExistQuery = "SELECT id FROM users WHERE email = $1";
    const userCodeResult = await client.query(checkUserCodeExistQuery, [code]);
    const userEmailResult = await client.query(checkUserEmailExistQuery, [
      email,
    ]);

    if (userCodeResult.rows.length > 0 || userEmailResult.rows.length > 0) {
      return res.status(400).json({ error: "User code / email already exist" });
    }

    const insertQuery = `INSERT INTO users (code, name, email, password, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`;

    client.query(
      insertQuery,
      [code, name, email, hashedPassword, "1"],
      (err, result) => {
        if (err) {
          console.error("Error registering user", err);
          res.status(500).send("Error registering user");
        } else {
          const userId = result.rows[0].id;
          res.status(201).json({ id: userId });
        }
      }
    );
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const selectQuery = "SELECT * FROM users WHERE email = $1";
    client.query(selectQuery, [email], async (err, result) => {
      if (err) {
        res.status(500).send("Error authenticating user");
      } else {
        if (result.rows.length === 0) {
          res.status(401).send("Authentication failed");
        } else {
          const user = result.rows[0];
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (isPasswordValid) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: "1h",
            });
            res.json({ token });
          } else {
            res.status(401).send("Authentication failed");
          }
        }
      }
    });
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
});

// Protected Route
app.get("/items", verifyToken, async (req, res) => {
  try {
    client.query("SELECT * FROM items", (err, result) => {
      if (err) {
        console.error(err);
      } else {
        if (result.rows.length === 0) {
          // console.log("Item not found.");
          return res.status(200).json({ message: "No Item" });
        } else {
          const item = result.rows;
          // console.log("Retrieved item:", item);
          return res.status(200).json({ items: item });
        }
      }
    });
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
});

app.get("/item/", verifyToken, async (req, res) => {
  try {
    const itemId = req.query.id;

    if (!itemId) {
      return res.status(400).json({ error: "Please fill all fields" });
    }

    client.query(
      "SELECT * FROM items WHERE id = $1",
      [itemId],
      (err, result) => {
        if (err) {
          console.error(err);
        } else {
          if (result.rows.length === 0) {
            return res.status(400).json({ message: "Item not found" });
          } else {
            const item = result.rows[0];
            return res.status(200).json({ items: item });
          }
        }
      }
    );
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
});

app.post("/item/create", verifyToken, async (req, res) => {
  const { code, sku, name, price, stock } = req.body;

  if (!code || !sku || !name || !price) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const checkItemExistQuery = "SELECT id FROM items WHERE code = $1";
    const result = await client.query(checkItemExistQuery, [code]);

    if (result.rows.length > 0) {
      // console.log(result.rows[0]);
      return res.status(400).json({ error: "Item code already exist" });
    }

    const insertItemQuery = `INSERT INTO items (code, sku, name, price, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`;
    client.query(
      insertItemQuery,
      [code, sku, name, price, "1"],
      (err, result) => {
        if (err) {
          console.error("Error registering item", err);
          res.status(500).send("Error registering item");
        } else {
          const itemId = result.rows[0].id;
          const itemQty = stock ?? 0;

          const insertStockQuery = `INSERT INTO stocks (item_id, qty) VALUES ($1, $2) RETURNING id`;
          client.query(insertStockQuery, [itemId, itemQty], (err, result) => {
            if (err) {
              console.error("Error registering item", err);
              res.status(500).send("Error registering item");
            } else {
              const itemId = result.rows[0].id;
              res.status(201).json({ id: itemId });
            }
          });
          res.status(201).json({ id: itemId });
        }
      }
    );
  } catch (err) {
    console.error("error:", err);
    throw err;
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server is running"));
