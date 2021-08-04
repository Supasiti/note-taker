const express = require('express');
const fs = require('fs');
const util = require('util');
const router = express.Router();

// readFromFile
const readFromFile = util.promisify(fs.readFile);



// GET notes
//  - read the db.json file 
//  - then return all saved notes as JSON.
const handleGetRequest = (req, res) => { 
  readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch(console.error);
};

// requests
router.get('/', handleGetRequest)

module.exports = router;