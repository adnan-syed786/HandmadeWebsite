const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/orion_crafts";
const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });
    console.log("✅ Connected to MongoDB successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};
module.exports = connectToMongo;
