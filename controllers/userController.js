const User = require('../models/userModel');
const factory = require('../controllers/handlerFactory');

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'The route has not been defined yet! Please use /signup instead',
  });
};
