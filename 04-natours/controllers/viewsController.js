const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1. Get Tour Data from Collection

  const tours = await Tour.find();

  // 2 Build Template (in other file)

  // 3. Render Template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // 1. get data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  // 2 Build Template (in other file)

  // 3. Render Template
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
