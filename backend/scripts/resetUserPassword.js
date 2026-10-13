require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');
const { getMongoUri } = require('../src/config/runtime');

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.log('Usage:');
    console.log('node scripts/resetUserPassword.js "admin@email.com" "NewPassword123!"');
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.log('Password must be at least 6 characters long.');
    process.exit(1);
  }

  const mongoUrl = getMongoUri();

  if (!mongoUrl) {
    console.log('MONGODB_URI is missing in .env.');
    process.exit(1);
  }

  await mongoose.connect(mongoUrl);

  const user = await User.findOne({ email: email.toLowerCase().trim() });

  if (!user) {
    console.log(`No user found with email: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  console.log('Password reset successful.');
  console.log(`Email: ${user.email}`);
  console.log(`Role: ${user.role}`);

  await mongoose.disconnect();
}

resetPassword().catch(async (error) => {
  console.error('Password reset failed:', error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
