'use strict';

const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', () => console.log("Success"));

module.exports = router;
