const app = require('./app');

/* Creating a server */
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
