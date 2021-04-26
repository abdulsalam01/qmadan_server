const fs = require('fs');
const path = require('path');
const firebase = require('../config/firebase');

module.exports = baseResponseController = {list: {}, pages: {}, extras: {}};
module.exports = baseUploadController = ({stream, filename}, spesificDir = ``) => {
  const uploadDir = `../uploads/${spesificDir}`;
  const location = path.join(__dirname, `${uploadDir}`);
  const locationFile = `${location}/${Date.now()}_${filename}`;

  // create folder if doesn't exists
  if (!fs.existsSync(location)) fs.mkdirSync(location);

  return new Promise((resolve, reject) => {
    stream.on('error', err => {
        // delete the truncated file
        if (stream.truncated) fs.unlinkSync(locationFile);
        
        reject(err);
      })
      .pipe(fs.createWriteStream(locationFile))
      .on('error', err => reject(err))
      .on('finish', () => {
        const fileName = locationFile.split('/')[locationFile.split('/').length - 1];
        const joinDir = `${uploadDir}/${fileName}`.split('/').filter((n, i) => i > 1).join('/');

        resolve({ locationFile: joinDir })
      });
  });
}

// firebase-cloud-storage
module.exports = baseCloudUploadController = async(file, spesificDir = '') => {
  const uploadDir = `../uploads`;
  const fileName = path.join(__dirname, `${uploadDir}/${file}`);

  const bucketName = firebase.bucket;
  const uploadFirebase = await firebase.storage
    .bucket(bucketName)
    .upload(`${fileName}`, {
      destination: file,
      gzip: true,
      metadata: {
        metadata: {
          contentType: file.mimetype,
          firebaseStorageDownloadTokens: new Date().getTime()
        }
      }
    }, (err, res) => {
      if (err) throw err;
      // remove the files from local
      baseRemoveController(file)
    });

  return uploadFirebase
}

module.exports = baseCloudGenerateLinkController = async(file) => {
  const todayDate = new Date();
  const expireDate = new Date(todayDate.setMonth(todayDate.getMonth() + 1));

  const bucketName = firebase.bucket;
  const retriveImage = await firebase.storage
    .bucket(bucketName).file(file)
    .getSignedUrl({
      action: 'read',
      expires: expireDate
    })
    .then(res => res[0])
    .catch(err => err);
  
  return retriveImage;
}

module.exports = baseCloudRemoveController = async(file) => {
  const bucketName = firebase.bucket;
  console.log(file);
  const deleteImage = await firebase.storage
    .bucket(bucketName)
    .file(file)
    .delete()
    .then(res => res)
    .catch(err => err);

  return deleteImage;
}

// end: firebase-cloud-storage

module.exports = baseRemoveController = (filename) => {
  const uploadDir = `../uploads`;
  const location = path.join(__dirname, `${uploadDir}`);
  const locationFile = `${location}/${filename}`;

  fs.unlink(locationFile, (err) => {
    if (err) throw err;

    return true;
  });
}

module.exports = baseProccessController = async (proc, session) => {
  session = await db.startSession();
  session.startTransaction();
  // call function
  const res = proc();
  //
  await session.commitTransaction();
  session.endSession();

  return res;
}

module.exports = baseReadDirController = async (base = baseUrl, dirName) => {
  const dirResolver = `../uploads/${dirName}/`;
  const res = await fs.promises.readdir(path.join(__dirname, dirResolver))
    .then(files => {
        return files.map(file => {
          return `${base}/${dirName}/${file}`;
        });
      }
    ).catch(err => {
      if (err) throw err;
    });

  return res;
}
