if(process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
const express = require('express');
const app = express();
// const PORT = process.env.PORT || 3000;
const router = require('./routes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(errorHandler);

// app.listen(PORT, () => console.log(`E-commerce server is listening on ${PORT}`));

module.exports = app;