const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

/* MIDDLEWARE */
// Run the following code only in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(bodyParser.json());

// Server static files from a folder
app.use(express.static(`${__dirname}/public`));

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

/* MOUNTING THE ROUTER */
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

// app.use((req, res, next) => {
//   console.log('Hello from the middleware 🎈');
//   next();
// });

// // Sending a get request
// // .get('route', routeHnadlerFunction)
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server!', app: 'Natours' });
// });

// // Sending a post request
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint');
// });

/* GET */
// app.get('/api/v1/tours', (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     results: tours.length,
//     data: { tours },
//   });
// });

// Optional Params = /:paramName?
// app.get('/api/v1/tours/:id?', (req, res) => {})
// app.get('/api/v1/tours/:id', (req, res) => {
//   //   console.log(req.params);
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);

//   if (!tour) {
//     res.status(404).json({
//       status: 'Not Found',
//       message: 'The requested tour can not be found',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// });

/* POST */
// app.post('/api/v1/tours', (req, res) => {
//   //   console.log(req.body);

//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   //   push the new tour to tours array
//   tours.push(newTour);

//   // Update Data in JSON file
//   // 1. specify JSON file path
//   // 2. specify data to be replaced(tours)
//   // 3. callback function
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// });

/* PATCH */
// app.patch('/api/v1/tours/:id', (req, res) => {
//   const id = req.params.id * 1;

//   if (id > tours.length) {
//     res.status(404).json({
//       status: 'Not Found',
//       message: 'The requested tour can not be found',
//     });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated tour here...>',
//     },
//   });
// });

/* DELETE */
// app.delete('/api/v1/tours/:id', (req, res) => {
//   const id = req.params.id * 1;

//   if (id > tours.length) {
//     res.status(404).json({
//       status: 'Not Found',
//       message: 'The requested tour can not be found',
//     });
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createNewTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// 200: OK
// 201: Created
// 204: No Content
// 400: Bad Request
// 404: Not Found
