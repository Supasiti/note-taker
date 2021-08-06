const express = require('express');
const { 
  noteFactory, 
  appendNoteToDb, 
  getNotesFromDb, 
  deleteNoteFromDb } = require('../src/notes');

const router = express.Router();

// get success response
const getSuccessResponse = (content) =>  { 
  return {
    status: 'success',
    body: content,
  };
}

// get fail response
const getFailResponse = (message) =>  { 
  return {
    status: 'fail',
    message: message
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
    const response = getFailResponse('The body of POST request must contain both title and text')
    res.json(response);
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

//  get delete response
const getDeleteResponse = (content, idToDelete) => {
  return content !== undefined? 
    getSuccessResponse(content) : 
    getFailResponse(`There is no note with id ${idToDelete}`);
}

// DELETE 
const handleDeleteRequest = (req, res) => {
  const idToDelete = req.params.id;  //  assume that an id is included

  deleteNoteFromDb(idToDelete)
    .then((deleted) => getDeleteResponse(deleted, idToDelete))
    .then((response) => res.json(response))
    .catch(console.error)
};

// requests
router.get('/', handleGetRequest);
router.post('/', handlePostRequest);
router.delete('/:id', handleDeleteRequest);

module.exports = router;