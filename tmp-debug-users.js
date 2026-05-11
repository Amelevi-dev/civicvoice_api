const mongoose = require('mongoose');
const User = require('./src/models/user.model');
(async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || 'mongodb://localhost:27017/civicvoice_api');
    const users = await User.find().limit(5).lean();
    console.log(JSON.stringify(users, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await mongoose.disconnect();
  }
})();
