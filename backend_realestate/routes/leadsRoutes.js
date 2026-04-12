const express = require('express');
const router = express.Router();
const {
  getAllLeads,
  createLead,
  updateLeadStatus,
  deleteLead,
  replyToLead,
} = require('../controllers/leadsController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllLeads);
router.post('/', createLead); // Public can create lead
router.put('/:id', authMiddleware, updateLeadStatus);
router.delete('/:id', authMiddleware, deleteLead);
router.post('/:id/reply', authMiddleware, replyToLead);

module.exports = router;
