const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/APIFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

////////////////////////////////////////////
// Route Controller for "TOP 5 CHEAP TOURS"
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';

  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
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
});

exports.getTour = catchAsync(async (req, res, next) => {
  // .populate(propertyNameInSchema) will add guide data based of the IDs mentioned and will return a tour data with actual data of guides rather than just providing guide(user) id
  // .populate() won't actually fill the guide data in the mongoose DB
  // It'll add the data when a request is made to getTour tour route
  // const tour = await Tour.findById(req.params.id).populate({
  //   path: 'guides',
  //   select: '-_v -passwordChangedAt',
  // });

  const tour = await Tour.findById(req.params.id); // Tour.findOne({_id : req.params.id})

  if (!tour) {
    return next(new AppError('No tour found. Incorrect ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // new updated document will be returned
    runValidators: true,
  });

  if (!tour) {
    return next(new AppError('No tour found. Incorrect ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found. Incorrect ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

// AGGREAGTION PIPELINE
// Getting monthly plan which informs about the tours in a particular year
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});
