const dotenv = require('dotenv');
const mongoose = require('mongoose');
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
    console.log(err);
  }
}
run().catch(console.dir);

// Gets env environment variable
// console.log(app.get('env'));

// Get all the environment variables
// console.log(process.env);

/* Creating a server */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
