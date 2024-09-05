import mysql from "mysql";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  const result = dotenv.config({ path: "config/config.env" });

  if (result.error) {
    throw result.error;
  }
}

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: process.env.DB_TIMEZONE,
});

con.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.message);
  } else {
    console.log("SQLDatabase Connected Successfully!");
  }
});

export default con;
