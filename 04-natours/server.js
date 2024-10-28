const dotenv = require('dotenv');
const mongoose = require('mongoose');

// uncaughtException like using a variable which is not defined or calling a function which was never declared
// 'uncaughtException' event is emitted when an uncaught JavaScript exception bubbles all the way back to the event loop
process.on('uncaughtException', (err) => {
  console.error(`Error: Uncaught Exception. ${err.message}`);
  process.exit(1);
});

const app = require('./app');

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
    console.error('There was an issue connecting with Database');
    console.error('ERROR - ', err.errorResponse.errmsg);
  }
}
run();

// Gets env environment variable
// console.log(app.get('env'));

// Get all the environment variables
// console.log(process.env);

/* Creating a server */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Handling unhandled/rejected promises
process.on('unhandledRejection', (err) => {
  console.log('Error: A Promise was rejected');
});
