import pool from "../../lib/db";

export default async function handler(req, res) {
  const { floor } = req.query;

  try {
    const [ticketInfoRows] = await pool.query(
      "SELECT ticket_name, ticket_date, ticket_time, ticket_age, ticket_place FROM ticket LIMIT 1"
    );
    const [
      ticketsRows
    ] = await pool.query("SELECT * FROM ticket WHERE ticket_floor = ?", [
      floor
    ]);

    res.status(200).json({
      ticketInfo: ticketInfoRows[0],
      tickets: ticketsRows
    });
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
