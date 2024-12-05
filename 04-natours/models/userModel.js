const crypto = require('crypto');
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

  photo: { type: String, default: 'default.jpg' },

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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 16);

  this.passwordConfirm = undefined;

  next();
});

// Update changePasswordAt property for the user
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  // sometimes saving to the database is a bit slower than issuing a JWT making
  // it so that the "passwordChangedAt" timestamp is sometimes set AFTER the JWT has been created
  // because of this the user will not be able to login using the new token
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// Fetching only the users with active property set to TRUE
// Will work for all the queries that start with 'find'
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
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

userSchema.methods.createPasswordResetToken = function () {
  // Basic Token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Encrypted token to be stored in our database
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Expire the token in 10 Minutes
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

// 1. 2 input passwords are same (adding a custom validator in the user model)
// 2. Incrypting passwords
