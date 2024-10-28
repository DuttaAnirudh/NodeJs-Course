const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'a user must have a name'],
    maxLength: [35, "A name can't have more than 35 charectors"],
  },

  email: {
    type: String,
    required: [true, 'a user must have an email'],
    unique: true,
    validate: [validator.isEmail, 'Please provide a valid email address'],
  },

  photo: String,

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'A password needs to be atleast 8 charectors long'],
  },

  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // works only on CREATE( .create() ) & SAVE( .save() ) and NOT on update
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords do not match',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 16);

  this.passwordConfirm = undefined;

  next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;

// 1. 2 input passwords are same (adding a custom validator in the user model)
// 2. Incrypting passwords
