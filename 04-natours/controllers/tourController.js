const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

/* ROUTE HANDLERS */

// Checking if the requested tour exists
exports.checkID = (req, res, next, val) => {
  // console.log('Tour ID: ', val);
  if (val > tours.length) {
    return res.status(404).json({
      status: 'Not Found',
      message: 'The requested tour can not be found',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  //   console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (!tour) {
  //   res.status(404).json({
  //     status: 'Not Found',
  //     message: 'The requested tour can not be found',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

// Middleware: checking if the post request body to create a new tour contains valid 'name' and 'price'.
exports.checkBody = (req, res, next) => {
  const {
    body: { name, price },
  } = req;

  const validRequest = !!name && !!price;

  if (!validRequest) {
    return res.status(400).json({
      status: 'failed',
      message: 'Bad Request.',
    });
  }

  next();
};

exports.createNewTour = (req, res) => {
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
    `${__dirname}/../dev-data/data/tours-simple.json`,
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
};

exports.updateTour = (req, res) => {
  // const id = req.params.id * 1;

  // if (id > tours.length) {
  //   res.status(404).json({
  //     status: 'Not Found',
  //     message: 'The requested tour can not be found',
  //   });
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  // const id = req.params.id * 1;

  // if (id > tours.length) {
  //   res.status(404).json({
  //     status: 'Not Found',
  //     message: 'The requested tour can not be found',
  //   });
  // }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};
