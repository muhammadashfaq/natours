const mongoose = require('mongoose');
const Validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [Validator.Email, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8,
  },
  photo: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
