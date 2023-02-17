const User = require('../models/userModel');
const { promisify } = require('util');
const catchAsync = require('../utils/catchAsync');
const JWT = require('jsonwebtoken');
const AppError = require('../utils/appErrors');
const sendEmail = require('../utils/email');

const signToken = (userId) =>
  JWT.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    passwordResetExpires: req.body.passwordResetExpires,
    passwordResetToken: req.body.passwordResetToken,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    message: 'User created',
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req?.body;

  // 1) Check if email and password exists
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // 2) Check if user exists and password is correct
  const user = await User.findOne({ email: email }).select('+password');

  // 3) Compare original password with hash password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  // 4) If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the JWT token and check it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization?.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in.Please login to get access', 401)
    );
  }
  // 2) Verification JWT token
  const decoded = await promisify(JWT.verify)(token, process.env.JWT_SECRET);

  // 3) if Verification Successfully, Check if user still exists ?
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belonging to the token does no longer exists')
    );
  }

  // 4) Check if user changed password after the JWT token was issued ?
  // if (freshUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError(
  //       'Password changed after the login. Please login again to get new token',
  //       401
  //     )
  //   );
  // }

  //5) GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on Posted email
  const user = await User.findOne({ email: req.body.email });

  console.log('user', user);
  if (!user) {
    return next(new AppError('No User Found with that email', 404));
  }

  // 2) Generate random token and then send it back as email
  const resetToken = user.createPasswordResetToken();
  console.log('[Reset Token]', resetToken);
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}. \n  If you didn't forget your password, Please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Token (Only valid for 10 minutes)',
      message: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (err) {
    user.passwordResetExpires = undefined;
    user.passwordResetToken = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending email.Try again later!', 500)
    );
  }
});

exports.resetPassword = (req, res, next) => {};
