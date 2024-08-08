import pool from "../../lib/db";

export default async function handler(req, res) {
  try {
    const [rows] = await pool.query("SELECT user_point FROM user LIMIT 1");
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
