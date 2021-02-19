const fs = require('fs');
const path = require('path');

module.exports = baseResponseController = {list: {}, pages: {}};
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
      .on('finish', () => resolve({ locationFile }));
  });
}

module.exports = baseRemoveController = (filename) => {
  fs.unlink(filename, (err) => {
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
