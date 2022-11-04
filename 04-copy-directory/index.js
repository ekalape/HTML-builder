const fs = require('fs');
const path = require('path');
const readdir = require('fs/promises');

const existentDirPath = path.join(__dirname, 'files');
const newDirPath = path.join(__dirname, 'files-copy');

fs.mkdir(newDirPath, { recursive: true }, (err) => {
  if (err) throw err;
});

async function readDirectory() {
  const existentDir = await readdir.readdir(
    existentDirPath,
    { withFileTypes: true },
    (err) => {
      if (err) throw err;
    }
  );
  const newDirFiles = await readdir.readdir(
    newDirPath,
    { withFileTypes: true },
    (err) => {
      if (err) throw err;
    }
  );
  if (newDirFiles.length > 0) {
    for (f of newDirFiles) {
      fs.unlink(path.join(newDirPath, f.name), (err) => {
        if (err) {
          throw err;
        }
      });
    }
  }

  for (file of existentDir) {
    fs.copyFile(
      path.join(existentDirPath, file.name),
      path.join(newDirPath, file.name),
      (err) => {
        if (err) throw err;
      }
    );
  }
}
try {
  readDirectory();
} catch (err) {
  console.log(err);
}
