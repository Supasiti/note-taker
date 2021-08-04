// Custom middleware that logs out the type and path of each request to the server
const clog = (req, res, next) => {
  const fgCyan = '\x1b[36m';
  const fgReset = '\033[0m'
  switch (req.method) {
    case 'GET': {
      console.info(`📗 ${fgCyan}${req.method} request to ${req.path}${fgReset}`);
      break;
    }
    case 'POST': {
      console.info(`📘 ${fgCyan}${req.method} request to ${req.path}${fgReset}`);
      break;
    }
    default:
      console.log(`📙${fgCyan}${req.method} request to ${req.path}${fgReset}`);
  }

  next();
};

exports.clog = clog;
