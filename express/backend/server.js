require("dotenv").config();
const express = require("express");
const cors = require("cors");

const journalRoutes = require("./routes/journal");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/journal", journalRoutes);
app.use("/users", userRoutes);

// Error handling middleware, always has 4 arguments
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

app.listen(3000, () => console.log("Express running on http://localhost:3000"));