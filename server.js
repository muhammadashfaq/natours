const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config({ path: './config.env' });

mongoose.set('strictQuery', true);

mongoose.connect(process.env.DATABASE, {}).then((res) => {
  console.log('Connected with Mongo Database');
});



const PORT = process.env.PORT | 3000;
app.listen(PORT, () => {
  console.log('App running on Port ', PORT);
});
