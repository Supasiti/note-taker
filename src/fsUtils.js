const fs = require('fs');
const util = require('util');


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


module.exports = {
  readFromFile,
  writeToFile,
  readAndAppend
}