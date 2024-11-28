const path = require('path');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp'); // http parameter pollution
const cookirParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files from a folder
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public')));

/* MIDDLEWARE */
// SET Security HTTP Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", 'https://unpkg.com'],
      'img-src': ["'self'", 'data:', 'https://*.tile.openstreetmap.org'],
    },
  }),
);

// Run the following code only in development mode
// Development loging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // specify time which in this case is "1hr". So user can only send atmost 100requests/hr
  message: 'Too many requests, please try again in an hour',
});
app.use('/api', limiter);
app.use(cookirParser());

// Body parser, reading data from the body into req.body
app.use(express.json({ limit: '10kb' })); // limiting data that can be accepted by the server
app.use(bodyParser.json());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization againt XSS
app.use(xss());

// Preventing Http Paramter Pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'maxGroupSize',
      'price',
    ],
  }),
);

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log('Cookie', req.cookies);
  next();
});

/* MOUNTING THE ROUTER */

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

/****************************************************/
/****************************************************/
// ERROR HANDLING
// (Unknown URL)

// The idea here is :
// If we are able to reach this part of the code, then it means the request-response cycle was not yet finished at this point in our code
// because middleware runs in the sequence of where they are defined in the code.

// .all() can be used to handle all the http methods at once(GET, POST, PATCH...)
/*
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  err.status = 'fail';
  err.statusCode = 404;

  // If 'next()' function recieves an arguement, Express.js will automatically know that there was an error
  // and thus Express.js will assume whatever was passed as the arguement is the error
  next(err);
});
 */

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

/***************************************/
/* EXPRESS ERROR HANDLING MIDDLEWARE */
app.use(globalErrorHandler);

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
// 401: Unauthorised
// 403: Forbidden
// 404: Not Found
