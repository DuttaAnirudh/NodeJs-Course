const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

// Gets env environment variable
// console.log(app.get('env'));

// Get all the environment variables
// console.log(process.env);

/* Creating a server */
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
