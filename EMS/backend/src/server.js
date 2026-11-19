require("dotenv").config();
const app = require("./app");
const db = require("./config/db");

const port = Number(process.env.PORT || 5000);
if (!process.env.JWT_SECRET || process.env.JWT_SECRET === "replace_this_with_a_long_random_secret") {
  console.error("Set a private JWT_SECRET in backend/.env before starting the server.");
  process.exit(1);
}

(async () => {
  try {
    const connection = await db.getConnection();
    await connection.ping();
    connection.release();
    console.log("Connected to MySQL.");
    app.listen(port, () => console.log(`EMS backend running at http://localhost:${port}`));
  } catch (error) {
    console.error("Could not connect to MySQL. Check backend/.env and make sure MySQL is running.", error.message);
    process.exit(1);
  }
})();
