const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', getAllProperties);
router.get('/:id', getPropertyById);
router.post('/', authMiddleware, adminMiddleware, createProperty);
router.put('/:id', authMiddleware, adminMiddleware, updateProperty);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProperty);

module.exports = router;
