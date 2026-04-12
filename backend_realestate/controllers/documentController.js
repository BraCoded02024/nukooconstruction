const { pool } = require('../config/db');
const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const { title, property_id } = req.body;

  try {
    // Upload file to Cloudinary
    console.log('Uploading file to Cloudinary:', req.file.path);
    const result_cloudinary = await cloudinary.uploader.upload(req.file.path, {
      folder: 'nukoo_realestate',
      resource_type: 'auto', // Support non-image files (PDF, DOCX, etc.)
    });
    console.log('Cloudinary upload successful:', result_cloudinary.secure_url);

    // URL and public_id from Cloudinary
    const file_url = result_cloudinary.secure_url;
    const public_id = result_cloudinary.public_id;

    // Delete temporary file from backend local storage
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.log('Inserting document into database:', { title, file_url, property_id });
    const result = await pool.query(
      'INSERT INTO documents (title, file_url, public_id, property_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title || req.file.originalname, file_url, public_id, property_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Upload error details:', error);
    // Cleanup local file on error if it still exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ 
      error: 'Error uploading to Cloudinary', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const getDocuments = async (req, res) => {
  const { property_id } = req.query;
  try {
    let query = 'SELECT * FROM documents';
    let params = [];
    
    if (property_id) {
      query += ' WHERE property_id = $1';
      params.push(property_id);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching documents' });
  }
};

const deleteDocument = async (req, res) => {
  const { id } = req.params;
  console.log('Attempting to delete document with ID:', id);
  try {
    const result = await pool.query('DELETE FROM documents WHERE id = $1 RETURNING *', [id]);
    console.log('Delete query result rows:', result.rows.length);
    if (result.rows.length === 0) {
      console.log('Document not found in database for ID:', id);
      return res.status(404).json({ error: 'Document not found' });
    }

    const doc = result.rows[0];
    console.log('Document found, proceeding with Cloudinary deletion:', doc.public_id);
    
    // Cloudinary deletion logic
    if (doc.public_id) {
      try {
        const cloudinaryResult = await cloudinary.uploader.destroy(doc.public_id);
        console.log('Cloudinary deletion result:', cloudinaryResult);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error (non-fatal):', cloudinaryError);
      }
    }

    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error in deleteDocument controller:', error);
    res.status(500).json({ error: 'Error deleting document', details: error.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  deleteDocument,
};
