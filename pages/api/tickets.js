//이젠 필요 없음
/*
import pool from "../../lib/db";

export default async function handler(req, res) {
  const { floor } = req.query;
  try {
    const [
      rows
    ] = await pool.query("SELECT * FROM ticket WHERE ticket_floor = ?", [
      floor
    ]);
    console.log("Query Result:", rows); // 쿼리 결과 로그
    res.status(200).json(rows);
  } catch (error) {
    console.error("Database query error:", error); // 오류 로그
    res.status(500).json({ message: "Internal Server Error" });
  }
}
*/
