const { pool } = require('../config/db');

const getAllAppointments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM appointments ORDER BY visit_date ASC, visit_time ASC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching appointments' });
  }
};

const createAppointment = async (req, res) => {
  const { client_name, client_email, client_phone, visit_date, visit_time, purpose } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO appointments (client_name, client_email, client_phone, visit_date, visit_time, purpose) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [client_name, client_email, client_phone, visit_date, visit_time, purpose]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating appointment' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating appointment' });
  }
};

const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting appointment' });
  }
};

module.exports = {
  getAllAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
};
