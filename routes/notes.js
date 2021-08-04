const express = require('express');
const uuid = require('../src/uuid');
const {readFromFile, readAndAppend} = require('../src/fsUtils');
const router = express.Router();

// GET notes
//  - read the db.json file 
//  - then return all saved notes as JSON.
const handleGetRequest = (req, res) => { 
  readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch(console.error);
};

// catch an error if there are no title or text
const validatePostRequest = (req, res) => {
  if (!req.body.title || !req.body.text){
    res.json('the body of POST request must contain both title and text');
    return false;
  }
  return true;
}

// POST notes
//  - should receive a new note to save on the request body, 
//  - add it to the db.json file, 
//  - then return the new note to the client. 
const handlePostRequest = (req, res) => {

  if (validatePostRequest(req, res)){
    const { title, text} = req.body;
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
};


// requests
router.get('/', handleGetRequest);
router.post('/', handlePostRequest);

module.exports = router;