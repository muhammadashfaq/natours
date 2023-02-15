const Tour = require('../models/tourModel');
const AppError = require('../utils/appErrors');
const catchAsync = require('../utils/catchAsync');

exports.getAllTours = catchAsync(async (req, res, next) => {
  const queryObj = { ...res.query };
  const excludeFields = ['page', 'sort', 'limit', 'fields'];
  excludeFields.forEach((el) => delete queryObj[el]);

  const tours = await Tour.find(queryObj);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTourDetail = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  // if (!tour) {
  //   next(new AppError('No Tour found with that ID', 404));
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.createTour = catchAsync(async (req, res, next) => {
  const response = await Tour.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      tour: response,
    },
  });
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  await Tour.deleteOne({ id: req.params.id });
  return res.status(200).json({
    status: 'success',
    data: {
      tour: 'Tour deleted',
    },
  });
});
