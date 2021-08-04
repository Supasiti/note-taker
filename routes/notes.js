const express = require('express');
const router = express.Router();

// GET notes
router.get('/', (req,res) => {

  res.send("get request received");
})

module.exports = router;