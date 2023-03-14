const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appErrors');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes')
const errorController = require('./controllers/errorController');

const app = express();

// 1) ENVOIRNMENT VARIABLES

// 2) MIDDLEWARES
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.request_time = new Date().toISOString();
  /// console.log('[Request Headers]', req.headers);
  next();
});

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.url}`, 404));
});

app.use(errorController);

module.exports = app;
