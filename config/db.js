const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // The MONGO_URI is loaded from the .env file by dotenv
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Log successful connection to the console
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
  } catch (error) {
    // Log error and exit if connection fails
    console.error(`Error: ${error.message}`);
    process.exit(1); 
  }
};

// This line is essential: it makes the connectDB function available 
// to be imported and used in server.js
module.exports = connectDB;