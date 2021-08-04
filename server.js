const express = require('express');
const path = require('path');
const { clog } = require('./middleware/clog');
const validatePostRequest  = require('./middleware/postRequestValidator');
const api = require('./routes/index');
const PORT = process.env.PORT || 3001;

const app = express();

// valiations and logging
app.use(clog);
app.use(validatePostRequest);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', api);
app.use(express.static('public'));

// GET Route for homepage
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for Default ----- PUT THIS LAST!
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);