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
    select: false,
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
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 16);

  this.passwordConfirm = undefined;

  next();
});

// creating an instance methods
// an instance methods is a method which will be available on all documents of certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  // 'this' points to current password

  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    // Password changed is the condition when  JWTTimestamp < changedTimestamp
    return JWTTimestamp < changedTimestamp;
  }

  // FALSE means NOT changed
  return false;
};

const User = mongoose.model('user', userSchema);

module.exports = User;

// 1. 2 input passwords are same (adding a custom validator in the user model)
// 2. Incrypting passwords
