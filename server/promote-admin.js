require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const promoteToAdmin = async (email) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillbridge');
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`User with email '${email}' not found`);
      process.exit(1);
    }

    // Use updateOne to bypass the pre-save hook
    await User.updateOne({ _id: user._id }, { role: 'admin' });

    console.log(`✓ User '${user.name}' (${email}) has been promoted to admin role`);
    console.log(`✓ User ID: ${user._id}`);
    process.exit(0);
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    process.exit(1);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node promote-admin.js <user-email>');
  console.log('Example: node promote-admin.js admin@example.com');
  process.exit(1);
}

promoteToAdmin(email);
