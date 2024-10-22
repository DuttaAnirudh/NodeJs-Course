const mongoose = require('mongoose');

// Defining a Schema for our data (blueprint)
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // [boolean, errorMessage]
    unique: true,
    trim: true, // remove all the white spaces in the beggining and at the end of the string
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty level'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'A tour must have a description'],
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(), // MongoDB immediatly converts current date in miliseconds into Today's date in readable format
    select: false, // Hiding this property(createdAt) data from being fetched
  },
  startDates: [Date],
  endDate: [Date],
});

// Creating a Model out of the Schema
// always use Uppercase in model names
const Tour = mongoose.model('Tour', tourSchema); // ("NameOfTheModel", schema)

// // Creating a document (which is an instance of model)
// const testTour = new Tour({
//   name: 'The Forest Hiker',
//   rating: 4.7,
//   price: 497,
// });

// // Saving the document
// testTour
//   .save()
//   .then((doc) => {
//     console.log(doc);
//   })
//   .catch((err) => console.log('ERROR: ', err));

module.exports = Tour;
