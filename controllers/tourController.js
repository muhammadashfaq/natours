const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'failed',
    });
  }
};

exports.getTourDetail = async (req, res) => {
  try {
    console.log(req.params);

    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const response = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: response,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent',
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: 'failed',
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.deleteOne({ id: req.params.id });
    return res.status(200).json({
      status: 'success',
      data: {
        tour: 'Tour deleted',
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
    });
  }
};
