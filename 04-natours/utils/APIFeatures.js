class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  /*****************************************/
  /* FILTERING */
  filter() {
    // A. NORMAL FILTERING
    const queryObj = { ...this.queryString };

    // Creating an array of queries we want to exclude from getAllTours URL query object
    const excludedFields = ['page', 'sort', 'limit', 'fields'];

    // delete all the excluded fields from the query object
    excludedFields.forEach((el) => delete queryObj[el]);

    // B. ADVANCED FILTERING
    // MongoDB Query: {difficulty : 'easy', duration : {$gte : 5}}
    // URL Query: { difficulty: 'easy', duration: { gte: '5' }}

    let queryStr = JSON.stringify(queryObj);

    // Add a "$" sign to each of the operators in the URL query object
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  /*****************************************/
  /* SORTING */
  sort() {
    if (this.queryString.sort) {
      // Chaining methods to 'query'
      // Sorting the response based of query mentioned in the URL
      // Sorting based of multiple properties of the obejct data
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  /*****************************************/
  /* FIELD LIMITING */
  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // adding '-' before a field name excludes them from being selected from the DB
    }

    return this;
  }

  /*****************************************/
  /* PAGINATION */
  paginate() {
    const page = +this.queryString.page || 1;
    const limit = this.queryString.limit || 100;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
