require('dotenv').config();
const connectToMongo = require('../db');
const User = require('../Models/User');
const bcrypt = require('bcryptjs');

async function createAdmin() {
  await connectToMongo();
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log(`✅ Admin user already exists: ${existingAdmin.email}`);
      console.log('You can log in with this admin account to access the admin pages.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@orion.com',
      phoneNumber: '1234567890',
      address: '123 Admin Street',
      city: 'Admin City',
      zipCode: '100001',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Created default admin user successfully!');
    console.log('-------------------------------------------');
    console.log(`Email:    admin@orion.com`);
    console.log(`Password: admin123`);
    console.log('-------------------------------------------');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creating admin user:', err);
    process.exit(1);
  }
}

createAdmin();
