const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1) ENVOIRNMENT VARIABLES

// 2) MIDDLEWARES
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
