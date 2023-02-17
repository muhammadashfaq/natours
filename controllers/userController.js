const APIFeatures = require('../utils/apiFeatures');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route has not been defined yet',
  });
};
exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById({ _id: req.params.id });

  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route has not been defined yet',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route has not been defined yet',
  });
};
