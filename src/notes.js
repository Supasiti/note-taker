const uuid = require('./uuid');
const {readFromFile, writeToFile} = require('./fsUtils');

const dbFilePath = './db/db.json';

// create new Note
const noteFactory = ({title, text}) => {
  return {
    title: title,
    text: text,
    id: uuid(),
  };
};

// append the note
const appendToNotes = (newNote, currentNotes) => [...currentNotes, newNote];

// ------------------------
// Interact with database

// get all notes from database
const getNotesFromDb = () => {
  return readFromFile(dbFilePath)
    .then(JSON.parse)
    .catch(console.error)
}

//  append new note to database
const appendNoteToDb = (newNote) => {
  return getNotesFromDb()
    .then((current) => appendToNotes(newNote, current))
    .then((newNotes) => {writeToFile(dbFilePath, newNotes)})
    .catch(console.error)
}

// return undefined if it can't find a note in a database otherwise it returns the deleted
// note and update the database 
const deleteNoteFromDbIfExists = (idToDelete, currentNotes) => {
  const deleted = currentNotes.find((note) => note.id === idToDelete);
  const newNotes = currentNotes.filter((note) => note.id != idToDelete);
  if (deleted) writeToFile(dbFilePath, newNotes);
  return deleted;
};

// delete note from a database if it exists
const deleteNoteFromDb = (id) => {
  return getNotesFromDb()
    .then((notes) => deleteNoteFromDbIfExists(id, notes))
    .catch(console.error)
};


module.exports = {
  noteFactory,
  getNotesFromDb,
  appendNoteToDb,
  deleteNoteFromDb
}