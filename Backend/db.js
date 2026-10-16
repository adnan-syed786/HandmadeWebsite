const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;
const mongoDbName = process.env.MONGO_DB_NAME || 'orion_crafts';
const connectToMongo = async () => {
  try {
    if (!mongoURI) {
      throw new Error("MONGO_URI is not configured. Set it to your MongoDB Atlas connection string.");
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: mongoDbName
    });
    console.log(`✅ Connected to MongoDB successfully (database: ${mongoDbName})`);
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};
module.exports = connectToMongo;
