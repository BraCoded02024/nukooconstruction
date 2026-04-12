const { pool } = require('../config/db');

const transporter = require('../config/email');

const getAllLeads = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leads ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching leads' });
  }
};

const createLead = async (req, res) => {
  const { name, email, phone, interest, notes } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO leads (name, email, phone, interest, status, notes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, phone, interest, 'new', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating lead' });
  }
};

const updateLeadStatus = async (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;
  try {
    const result = await pool.query(
      'UPDATE leads SET status = $1, notes = $2 WHERE id = $3 RETURNING *',
      [status, notes, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating lead' });
  }
};

const deleteLead = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting lead' });
  }
};

const replyToLead = async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  try {
    const result = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    const lead = result.rows[0];
    if (!lead.email) {
      return res.status(400).json({ error: 'Lead has no email address' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: lead.email,
      subject: `Reply to your inquiry - Nukoo Construction`,
      text: message,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #c4854d;">Nukoo Construction</h2>
          <p>Hello ${lead.name},</p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #888;">
            This is a reply to your inquiry regarding ${lead.interest || 'our services'}.<br>
            <strong>Nukoo Construction & Properties</strong><br>
            Ghana, Oyarifa High Tension
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    // Optionally update lead status to 'contacted'
    await pool.query('UPDATE leads SET status = $1 WHERE id = $2', ['contacted', id]);

    res.json({ message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending reply email' });
  }
};

module.exports = {
  getAllLeads,
  createLead,
  updateLeadStatus,
  deleteLead,
  replyToLead,
};
