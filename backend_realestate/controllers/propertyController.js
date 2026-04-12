const { pool } = require('../config/db');

const getAllProperties = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching properties' });
  }
};

const getPropertyById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching property' });
  }
};

const createProperty = async (req, res) => {
  const { title, description, location, price, status, images } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO properties (title, description, location, price, status, images) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, location, price, status || 'available', images || []]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating property' });
  }
};

const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { title, description, location, price, status, images } = req.body;
  try {
    const result = await pool.query(
      'UPDATE properties SET title = $1, description = $2, location = $3, price = $4, status = $5, images = $6 WHERE id = $7 RETURNING *',
      [title, description, location, price, status, images, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating property' });
  }
};

const deleteProperty = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM properties WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting property' });
  }
};

module.exports = {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
