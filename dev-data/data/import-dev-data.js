const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');

dotenv.config({ path: './config.env' });

mongoose.set('strictQuery', true);

mongoose.connect(process.env.DATABASE, {}).then((res) => {
  console.log('Connected with Mongo Database');
});

//Read Json File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importDataIntoDB = async () => {
  try {
    await Tour.create(tours);
    console.log('[Data succesfully imported]');
    process.exit();
  } catch (err) {
    console.log('[err]', err);
  }
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('[Data succesfully deleted]');
    process.exit();
  } catch (err) {}
};

if (process.argv[2] === '--import') {
  importDataIntoDB();
} else if (process.argv[2] === '--delete') {
  deleteAllData();
}
