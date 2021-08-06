const helpers = require('../src/fsUtils');
const {
  noteFactory,
  getNotesFromDb,
  appendNoteToDb,
  deleteNoteFromDb
} = require('../src/notes');

jest.mock('../src/fsUtils');

const mockData = `[
  {
    "title" : "My cat",
    "text" : "is cuter",
    "id" : "1e90"
  },
  {
    "title" : "My dog",
    "text" : "to clean him today",
    "id" : "2d90"
  }
]`;

const mockArray = [
  {
    title: "My cat",
    text: "is cuter",
    id: "1e90"
  },
  {
    title: "My dog",
    text: "to clean him today",
    id: "2d90"
  }
];

describe('./src/notes.js', () => {

  // note factory
  describe('noteFactory', () => {
    it('should return a note with an id', () => {
      const input = {title: 'hello', text: 'world'};

      const result = noteFactory(input);

      expect(result.title).toEqual(input.title);
      expect(result.text).toEqual(input.text);
      expect(typeof result.id).toEqual('string');
    });
  });

  // get notes from db
  describe('getNotesFromDb', () => {
    it('should return a list of notes', () => {
      helpers.readFromFile.mockImplementation(() => Promise.resolve(mockData));

      const result = getNotesFromDb();

      expect(result).resolves.toHaveLength(mockArray.length);
      expect(result).resolves.toEqual(expect.arrayContaining(mockArray));
      helpers.readFromFile.mockRestore();
    });
  });

  // append note to database
  describe('appendNoteToDb', () => {
    it('should append a note and write it to the database', () => {
      helpers.readFromFile.mockImplementation(() => Promise.resolve(mockData));
      helpers.writeToFile.mockImplementation(() => Promise.resolve());

      const input = { title: "Vaccine", text:"book appointment", id:"badb"};
      const expectedArray = [...mockArray, input];
      const dbFilePath = './db/db.json'

      appendNoteToDb(input)
        .then( () => {
          expect(helpers.writeToFile).toHaveBeenCalledWith(dbFilePath, expectedArray);
          helpers.readFromFile.mockRestore();
          helpers.writeToFile.mockRestore();
        })
    });
  });


  // delete note from database
  describe('deleteNoteFromDb', () => {

    // if the id exists
    it('should delete a note from database if exists', () => {
      helpers.readFromFile.mockImplementation(() => Promise.resolve(mockData));
      helpers.writeToFile.mockImplementation(() => Promise.resolve());

      const input = "2d90";
      const expectedArray = mockArray.filter((item) => item.id != input);
      const dbFilePath = './db/db.json'
      const expected = {
        title: "My dog",
        text: "to clean him today",
        id: "2d90"
      };

      deleteNoteFromDb(input)
        .then( (result) => {
          expect(helpers.writeToFile).toHaveBeenCalledWith(dbFilePath, expectedArray);
          expect(result).toEqual(expected);

          helpers.readFromFile.mockRestore();
          helpers.writeToFile.mockRestore();
        })
    });

    // if the id does not exist
    it('should do nothing and return undefined if the id does not exist', () => {
      helpers.readFromFile.mockImplementation(() => Promise.resolve(mockData));
      helpers.writeToFile.mockImplementation(() => Promise.resolve());

      const input = "2db0";
      const expectedArray = mockArray;
      const expected = undefined;

      deleteNoteFromDb(input)
        .then( (result) => {
          expect(helpers.writeToFile).not.toHaveBeenCalled();
          expect(result).toEqual(expected);

          helpers.readFromFile.mockRestore();
          helpers.writeToFile.mockRestore();
        })
    });
  });

});
