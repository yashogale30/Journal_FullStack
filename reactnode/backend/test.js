const pool = require("./db");

pool.query("SELECT * FROM users").then((result) => {
  console.log(result.rows);
  pool.end();
});