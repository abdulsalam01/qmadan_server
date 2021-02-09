'use strict';

const mongoose = require('mongoose');
const dbName = 'Qmadan_db';
const isOffline = true;
//
const uri = isOffline ? `mongodb://localhost:27017/${dbName}` : 'mongodb://192.168.1.100/dbOn';
let db;

// connect to mongodb
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(
  () => { console.log("Connected to ", db.name) },
  err => { console.log(err) }
);

db = mongoose.connection;
//
module.exports = db;
