const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  uploadDocument,
  getDocuments,
  deleteDocument,
} = require('../controllers/documentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/upload', upload.single('document'), uploadDocument);
router.get('/', getDocuments);
router.delete('/:id', deleteDocument);

module.exports = router;
