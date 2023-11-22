const mongoose = require('mongoose');

const uri = "mongodb+srv://ruhulamin010398:25XLmIYd4ygng027@cluster0.pqvspyo.mongodb.net/doctor-appoinment?retryWrites=true&w=majority";

async function run() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri);

    // Confirm a successful connection by checking the readyState
    if (mongoose.connection.readyState === 1) {
      console.log("Connected to MongoDB!");
    } else {
      console.log("Unable to connect to MongoDB");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  } finally {
    // Close the Mongoose connection when done
    // await mongoose.connection.close();
  }
}

run();
