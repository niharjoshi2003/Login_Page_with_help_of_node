// Import required modules
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

// Create a PostgreSQL client
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "your_password",
  port: 5432,
});

// Connect to the PostgreSQL database
db.connect();

// Create an instance of Express
const app = express();
const port = 3000;

// Query the database to get data
let quiz = [];
db.query("SELECT * FROM submit", (err, result) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = result.rows;
  }

  // Close the database connection after the query is executed
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// GET home page
app.get("/", (req, res) => {
  res.render("first.ejs");
});

// POST a new post
app.post("/submit", (req, res) => {
  let enteredUsername = req.body.username;
  let enteredPassword = req.body.password;

  // Query the database to check if the username and password match
  db.query("SELECT * FROM submit WHERE username = $1 AND password = $2", [enteredUsername, enteredPassword], (err, result) => {
    if (err) {
      console.error("Error executing query", err.stack);
      return res.status(500).send("Internal Server Error");
    }

    if (result.rows.length > 0) {
      // Username and password are correct
      res.render("new.ejs");
    } else {
      // Username or password is incorrect
      res.render("old.ejs");
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
