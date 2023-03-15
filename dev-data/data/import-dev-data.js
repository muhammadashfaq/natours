const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

mongoose.set('strictQuery', true);

mongoose.connect(process.env.DATABASE, {}).then((res) => {
  console.log('Connected with Mongo Database');
});

//Read Json File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);

const importDataIntoDB = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('[Data successfully imported]');
    process.exit();
  } catch (err) {
    console.log('[err]', err);
  }
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('[Data successfully deleted]');
    process.exit();
  } catch (err) {}
};

if (process.argv[2] === '--import') {
  importDataIntoDB();
} else if (process.argv[2] === '--delete') {
  deleteAllData();
}
