const express = require('express');
const uuid = require('../src/uuid');
const {readFromFile, 
  writeToFile, 
  readAndAppend} = require('../src/fsUtils');
const router = express.Router();
const dbFilePath = './db/db.json';


// get success reponse
const getSuccessResponse = (content) =>  { 
  return {
    status: 'success',
    body: content,
  };
}

// get new Note
const getNewNote = ({title, text}) => {
  return {
    title: title,
    text: text,
    id: uuid(),
  };
};

// ----------------------------------------------------
// GET

// GET notes
//  - read the db.json file 
//  - then return all saved notes as JSON.
const handleGetRequest = (req, res) => { 
  readFromFile(dbFilePath)
    .then((data) => res.json(JSON.parse(data)))
    .catch(console.error);
};

// ----------------------------------------------------
// POST

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
    const newNote = getNewNote(req.body);
    const response = getSuccessResponse(newNote);
    readAndAppend(newNote, dbFilePath);
    res.json(response)
  };
};

// ----------------------------------------------------
// DELETE

// validate the note id for deletion
const validateNoteId = (idToDelete, notes, res) => {
  if (notes.map((note) => note.id).includes(idToDelete)){
    return true;
  }
  res.json(`There is no note with id ${idToDelete}`);
  return false;
}

// delete note if found
const deleteNoteIfFound = (idToDelete, notes, res) => {

  if (validateNoteId(idToDelete, notes, res)){
    const noteToDelete = notes.find((note) => note.id === idToDelete);
    const response = getSuccessResponse(noteToDelete);
    const newNotes = notes.filter((note) => note.id != idToDelete);
    writeToFile(dbFilePath, newNotes);    
    res.json(response);
  }
};

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
    .then((notes) => {deleteNoteIfFound(idToDelete, notes, res)})
    .catch(console.error)
};

// requests
router.get('/', handleGetRequest);
router.post('/', handlePostRequest);
router.delete('/:id', handleDeleteRequest);

module.exports = router;