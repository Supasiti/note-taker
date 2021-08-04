const express = require('express');
const uuid = require('../src/uuid');
const {readFromFile, 
  writeToFile, 
  readAndAppend} = require('../src/fsUtils');
const router = express.Router();
const dbFilePath = './db/db.json';

// GET notes
//  - read the db.json file 
//  - then return all saved notes as JSON.
const handleGetRequest = (req, res) => { 
  readFromFile(dbFilePath)
    .then((data) => res.json(JSON.parse(data)))
    .catch(console.error);
};

// catch an error if there are no title or text
const validatePostRequest = (req, res) => {
  if (!req.body.title || !req.body.text){
    res.json('The body of POST request must contain both title and text');
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

      readAndAppend(newNote, dbFilePath);

      const response = {
        status: 'success',
        body: newNote,
      };
      res.json(response)
  };
};



// const validateDeleteRequest = (req, res) => {
//   if (!req.params){
//     res.json('A DELETE request must contain the note\'id as parameter');
//     return false;
//   }
//   return true;
// }


// DELETE notes
// should receive a query parameter that contains the id of a note to delete. 
// remove the note with the given id property, 
// and then rewrite the notes to the db.json file
// will send a response containing the deleted note
const handleDeleteRequest = (req, res) => {
  //  assume that an id is included
  const idToDelete = req.params.id;

  readFromFile(dbFilePath)
    .then(JSON.parse)
    .then((notes) => {
      const noteToDelete = notes.find((note) => note.id === idToDelete);
      if (!noteToDelete){
        res.json(`There is no note with id ${idToDelete}`);
      } else {
        const response = {
          status: 'success',
          body: noteToDelete,
        };
        res.json(response);
        return notes.filter((note) => note.id != idToDelete);
      }
    })
    .then((newNotes) => {writeToFile(dbFilePath, newNotes)})
    .catch(console.error)
};

// requests
router.get('/', handleGetRequest);
router.post('/', handlePostRequest);
router.delete('/:id', handleDeleteRequest);

module.exports = router;