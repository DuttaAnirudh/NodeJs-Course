// const fs = require('fs');
const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
// );

/* ROUTE HANDLERS */

// // Checking if the requested tour exists
// exports.checkID = (req, res, next, val) => {
//   console.log('Tour ID: ', val);
//   if (val > tours.length) {
//     return res.status(404).json({
//       status: 'Not Found',
//       message: 'The requested tour can not be found',
//     });
//   }
//   next();
// };

////////////////////////////////////////////
// Route Controller for "TOP 5 CHEAP TOURS"
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

// exports.getAllTours = async (req, res) => {
//   try {
//     // 1. BUILD QUERY
//     let query;

//     /*****************************************/
//     /* FILTERING */
//     // A. NORMAL FILTERING
//     const queryObj = { ...req.query };

//     // Creating an array of queries we want to exclude from getAllTours URL query object
//     const excludedFields = ['page', 'sort', 'limit', 'fields'];

//     // delete all the excluded fields from the query object
//     excludedFields.forEach((el) => delete queryObj[el]);

//     // B. ADVANCED FILTERING
//     // MongoDB Query: {difficulty : 'easy', duration : {$gte : 5}}
//     // URL Query: { difficulty: 'easy', duration: { gte: '5' }}

//     let queryStr = JSON.stringify(queryObj);

//     // Add a "$" sign to each of the operators in the URL query object
//     queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

//     query = Tour.find(JSON.parse(queryStr));

//     // /*****************************************/
//     // /* SORTING */
//     if (req.query.sort) {
//       // Chaining methods to 'query'
//       // Sorting the response based of query mentioned in the URL
//       // Sorting based of multiple properties of the obejct data
//       const sortBy = req.query.sort.split(',').join(' ');
//       query = query.sort(sortBy);
//     } else {
//       query = query.sort('-createdAt');
//     }

//     /*****************************************/
//     /* FIELD LIMITING */

//     if (req.query.fields) {
//       const fields = req.query.fields.split(',').join(' ');
//       query = query.select(fields);
//     } else {
//       query = query.select('-__v'); // adding '-' before a field name excludes them from being selected from the DB
//     }

//     /*****************************************/
//     /* PAGINATION */
//     // ?page=2&limit=10
//     // query = query.skip(10).limit(10);

//     const page = +req.query.page || 1;
//     const limit = req.query.limit || 100;

//     const skip = (page - 1) * limit;

//     query = query.skip(skip).limit(limit);

//     if (req.query.page) {
//       const numTours = await Tour.countDocuments(); // number of documents available in the Tour model database
//       if (skip >= numTours) {
//         throw new Error('This page does not exist');
//       }
//     }

//     // 2. EXECUTE QUERY

//     const tours = await query;

//     // const tours = await Tour.find()
//     //   .where('duration')
//     //   .equals(5)
//     //   .where('difficulty')
//     //   .equals('easy');

//     // 3. SEND RESOPONSE
//     res.status(200).json({
//       status: 'success',
//       results: tours.length,
//       data: { tours },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: `There was an error fetching tours`,
//     });
//   }
// };

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    // 3. SEND RESOPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: `There was an error fetching tours`,
    });
  }
};

// exports.getTour = (req, res) => {
//     console.log(req.params);
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
//     // data: {
//     //   tour,
//     // },
//   });
// };
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // Tour.findOne({_id : req.params.id})

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'There was an error finding tour',
    });
  }
};

// // Middleware: checking if the post request body to create a new tour contains valid 'name' and 'price'.
// exports.checkBody = (req, res, next) => {
//   const {
//     body: { name, price },
//   } = req;

//   const validRequest = !!name && !!price;

//   if (!validRequest) {
//     return res.status(400).json({
//       status: 'failed',
//       message: 'Bad Request.',
//     });
//   }

//   next();
// };

// exports.createNewTour = (req, res) => {
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
//     `${__dirname}/../dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tour: newTour,
//         },
//       });
//     },
//   );
// };

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `There was an error creating tour.`,
    });
  }
};

// exports.updateTour = (req, res) => {
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
// };

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // new updated document will be returned
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `There was an error updating tour`,
    });
  }
};

// exports.deleteTour = (req, res) => {
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
// };

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `There was an error deleting tour`,
    });
  }
};

// AGGREAGTION PIPELINE
// Following is how you aggregate in MongoDB
// db.orders.aggregate([
//   { $match: { price: { $lt: 15 } } },
//   { $lookup: {
//         from: "inventory",
//         localField: "item",
//         foreignField: "sku",
//         as: "inventory_docs"
//   } },
//   { $sort: { price: 1 } },
// ])

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      // Stages
      // A $match stage to filter for documents whose categories
      // array field contains the element "ratingsAverage"
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        // Allows us to group documets using accumulater
        $group: {
          // 1. ID
          _id: { $toUpper: '$difficulty' }, // statistics will be created for each of the difficulty levels
          numTours: { $sum: 1 },
          numRating: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgprice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      // sort: which field we want our stats to sort by.
      // only field names mentioned in $group can be mentioned in $sort
      {
        $sort: { avgprice: 1 }, // "1" : asc && "-1" : desc
      },

      // We can also repeat stages
      // { $match: { _id: { $ne: 'EASY' } } }, // excluding all the data which has _id of 'EASY'
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `There was an error fetching tour stats`,
    });
  }
};

// AGGREAGTION PIPELINE
// Getting monthly plan which informs about the tours in a particular year
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = +req.params.year;

    const plan = await Tour.aggregate([
      {
        // "$unwind": deconstructs an array field from the input documents
        // and then output one document for each element of the
        // array
        $unwind: '$startDates',
      },

      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        // To add new fields
        $addFields: { month: '$_id' },
      },
      {
        // we give each of the field names a 0(zero) or a 1
        $project: {
          _id: 0, // This will hide _id property in the response data object
        },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      // {
      //   // Allows to limit the number of results in response data
      //   $limit: 6,
      // },
    ]);

    res.status(200).json({
      status: 'success',
      data: { plan },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: `There was an error fetching monthly plan`,
    });
  }
};
