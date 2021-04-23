'use strict';

const {Storage} = require('@google-cloud/storage');
const firebase_config = require('../qmadan-storage-firebase.json');
const bucket = "gs://qmadan-storage.appspot.com/"
const storage = new Storage({
  keyFilename: firebase_config
});

module.exports = {
  storage,
  bucket
}
