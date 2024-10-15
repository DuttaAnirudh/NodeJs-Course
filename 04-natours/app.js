const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

// // Sending a get request
// // .get('route', routeHnadlerFunction)
// app.get('/', (req, res) => {
//   res.status(200).json({ message: 'Hello from the server!', app: 'Natours' });
// });

// // Sending a post request
// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/* GET */
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});

// Optional Params = /:paramName?
// app.get('/api/v1/tours/:id?', (req, res) => {})
app.get('/api/v1/tours/:id', (req, res) => {
  //   console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    res.status(404).json({
      status: 'Not Found',
      message: 'The requested tour can not be found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

/* POST */
app.post('/api/v1/tours', (req, res) => {
  //   console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  //   push the new tour to tours array
  tours.push(newTour);

  // Update Data in JSON file
  // 1. specify JSON file path
  // 2. specify data to be replaced(tours)
  // 3. callback function
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

/* PATCH */
app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    res.status(404).json({
      status: 'Not Found',
      message: 'The requested tour can not be found',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
});

/* DELETE */
app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    res.status(404).json({
      status: 'Not Found',
      message: 'The requested tour can not be found',
    });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Creating a server
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// 200: OK
// 201: Created
// 204: No Content
// 404: Not Found
