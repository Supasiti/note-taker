const uuid = require('./uuid');

// create new Note
const noteFactory = ({title, text}) => {
  return {
    title: title,
    text: text,
    id: uuid(),
  };
};


module.exports = {
  noteFactory
}