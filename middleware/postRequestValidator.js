const validatePostRequest = (req, res, next) => {
  if (req.method === 'POST' && !req.body) {
    res.json('the body of POST request cannot be empty');
  } else {
    next();
  }
}

module.exports = validatePostRequest;