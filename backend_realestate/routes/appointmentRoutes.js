const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} = require('../controllers/appointmentController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllAppointments);
router.post('/', createAppointment); // Public can schedule visit
router.put('/:id/status', authMiddleware, updateAppointmentStatus);
router.delete('/:id', authMiddleware, deleteAppointment);

module.exports = router;
