require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const booksRoute = require('./routes/books');
const usersRoute = require('./routes/users');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/books', booksRoute);
app.use('/api/users', usersRoute);

const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> {
    console.log('MongoDB connected');
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err.message));
