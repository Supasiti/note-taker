const express = require('express');
const {readFromFile, 
  writeToFile} = require('../src/fsUtils');
const { noteFactory, appendNoteToDb, getNotesFromDb } = require('../src/notes');

const router = express.Router();
const dbFilePath = './db/db.json';


// get success reponse
const getSuccessResponse = (content) =>  { 
  return {
    status: 'success',
    body: content,
  };
}

// ----------------------------------------------------
// GET
const handleGetRequest = (req, res) => { 
  getNotesFromDb()
    .then((notes) => res.json(notes))
    .catch(console.error);
};

// ----------------------------------------------------
// POST

// check if there are missing title or text
const validatePostRequest = (req, res) => {
  if (!req.body.title || !req.body.text) {
    res.json('The body of POST request must contain both title and text');
    return false;
  }
  return true;
};

// create a new note and append to database
const createAndAddNote = (req, res) => {
  const aNote = noteFactory(req.body);
  const response = getSuccessResponse(aNote);
  appendNoteToDb(aNote);
  res.json(response)
}

// POST 
const handlePostRequest = (req, res) => {
  if (validatePostRequest(req, res)) createAndAddNote(req,res);
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