const mongoose = require('mongoose');
const slugify = require('slugify');

// Defining a Schema for our data (blueprint)
const tourSchema = new mongoose.Schema(
  {
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
    slug: String,
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
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// VIRTUAL PROPERTIES
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/////////////////////////////////////////////////////////
// DOCUMENT MIDDLEWARE : runs before .save() and .create()
// but NOT before .inserMany()
// PRE HOOK
tourSchema.pre('save', function (next) {
  // console.log(this); // points to currently proccesed document

  // Adding a slug to the document
  this.slug = slugify(this.name, { lower: true });

  next(); // call next middleware in the stacks : !IMPORTANT
});

// POST HOOK
// tourSchema.post('save', function (doc, next) {
//   // doc : document which was just saved to the DB

//   console.log(doc);
//   next();
// });

/////////////////////////////////////////////////////////
// QUERY MIDDLEWARE
// the 'find' hook will make the following a 'query middleware' and NOT 'document middleware'
// following code is executed before " await features.quwery " refer-to "getAllTours" in tourController.js
// tourSchema.pre('find', function (next) {
// "find" | "findOne" | "findOneAndDelete" | "findOneAndUpdate"
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); // this keyword points to the query of "features.query" and then "this.find" is chained to "features.query"
  next();
});

// tourSchema.post(/^find/, function (docs, next) {
//   // doc : all the documents returned from the query
//   console.log(docs);
//   next();
// });

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
