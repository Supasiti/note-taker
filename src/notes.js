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



module.exports = {
  noteFactory,
  getNotesFromDb,
  appendNoteToDb
}