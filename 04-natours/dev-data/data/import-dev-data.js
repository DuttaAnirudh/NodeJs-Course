const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

// Connecting MongoDB database using mongoose
const uri = process.env.DATABASE_URI;

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri);

    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!',
    );
  } catch (err) {
    console.log(err);
  }
}

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'),
);

// IMPORT ALL DATA INTO MONGODB DATABASE
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('DATA SUCCESSFULLY LOADED');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

// DELETE ALL DATA FROM THE MONGODB DATABASE
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('DATABASE SUCCESSFULLY CLEARED');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

run().catch(console.dir);

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);
