const mongoose = require('mongoose');

// Defining a Schema for our data (blueprint)
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // [boolean, errorMessage]
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
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
