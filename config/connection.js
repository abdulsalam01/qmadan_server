'use strict';

const mongoose = require('mongoose');
const dbName = 'Qmadan_db';
const isOffline = false;
//
const uri = isOffline ? 
  `mongodb://localhost:27017/${dbName}` : 
  `mongodb+srv://devops786:devops786@cluster0.4hdsq.mongodb.net/${dbName}?retryWrites=true&w=majority`;

let db;
// connect to mongodb
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(
  () => { console.log("Connected to ", db.name) },
  err => { console.log(err) }
);

db = mongoose.connection;
//
module.exports = db;
