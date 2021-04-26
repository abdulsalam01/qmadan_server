'use strict';

const {Storage} = require('@google-cloud/storage');
const path = require('path');
const firebase_config = require('../qmadan-storage-firebase.json');
const bucket = "gs://qmadan-storage.appspot.com/"

const storage = new Storage({
  projectId: firebase_config.project_id,
  keyFilename: path.join(__dirname, '../qmadan-storage-firebase.json')
});

module.exports = {
  storage,
  bucket
}
