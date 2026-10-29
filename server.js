require('dotenv').config();
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const port = process.env.PORT || 3000;

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.locals.title = 'web-betting';

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});