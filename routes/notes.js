const express = require('express');
const fs = require('fs');
const util = require('util');
const router = express.Router();

// ----------
// fs util

//  read from file
const readFromFile = util.promisify(fs.readFile);

// write to file
const writeToFile = (filePath, content) => {
  const toWrite = JSON.stringify(content, null, 2);

  fs.writeFile(filePath, toWrite, (err) =>
    err ? console.error(err) : console.info(`\nData written to ${filePath}`)
  );
};

// read and append
const readAndAppend = (toAppend, filePath) => {
  readFromFile(filePath)
    .then(JSON.parse)
    .then((current) => {return [...current, toAppend]})
    .then((newContent) => {writeToFile(filePath, newContent)})
    .catch(console.error)
};

// uuid
// generates a string of random numbers and letters
const uuid = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);


// GET notes
//  - read the db.json file 
//  - then return all saved notes as JSON.
const handleGetRequest = (req, res) => { 
  readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch(console.error);
};



// const validatePostRequest = (req, res) => {
//   // error if there is no body
//     if (!req.body) {
//       res.json('the body of POST request cannot be empty');
//     }
// };

// POST notes
//  - should receive a new note to save on the request body, 
//  - add it to the db.json file, 
//  - then return the new note to the client. 
const handlePostRequest = (req, res) => {

  
  const {title, text} = req.body;

  // error if there are no title or text
  if (!title || !text){res.json('the body of POST request must contain both title and text');}

  const newNote = {
    title,
    text,
    id: uuid(),
  };

  readAndAppend(newNote, './db/db.json');

  const response = {
    status: 'success',
    body: newNote,
  };
  res.json(response)
};


// requests
router.get('/', handleGetRequest);
router.post('/', handlePostRequest);

module.exports = router;