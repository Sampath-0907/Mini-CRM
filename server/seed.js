const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-crm');
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@minicrm.ai' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = new User({
      name: 'System Commander',
      email: 'admin@minicrm.ai',
      password: 'admin123' // This will be hashed by the model pre-save hook
    });

    await admin.save();
    console.log('Admin user seeded successfully');
    console.log('Email: admin@minicrm.ai');
    console.log('Password: admin123');
    process.exit();
  } catch (err) {
    console.error('Error seeding admin:', err);
    if (err.name === 'ValidationError') {
      console.error('Validation errors:', err.errors);
    }
    process.exit(1);
  }
};

seedAdmin();
