const { pool } = require('./config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
  const adminData = {
    name: 'Admin',
    email: 'admin@nukono.com',
    password: 'AdminPassword123!',
    role: 'admin'
  };

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [adminData.email]);
    if (userCheck.rows.length > 0) {
      console.log('Admin user already exists. Updating password instead...');
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      await pool.query(
        'UPDATE users SET password = $1, name = $2, role = $3 WHERE email = $4',
        [hashedPassword, adminData.name, adminData.role, adminData.email]
      );
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        [adminData.name, adminData.email, hashedPassword, adminData.role]
      );
      console.log('Admin user created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await pool.end();
    process.exit();
  }
};

seedAdmin();
