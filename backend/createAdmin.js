const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // adjust path

mongoose.connect('mongodb://localhost:27017/clothing-website');

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('adminpassword', 10);
  const admin = new User({
    name: 'Admin_User',
    email: 'admin@example.com',
    password: hashedPassword,
    isAdmin: true,
    isVerified: true,
  });

  await admin.save();
  console.log('Admin user created');
  mongoose.disconnect();
}

createAdmin();
