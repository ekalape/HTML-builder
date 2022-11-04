const fs = require('fs');
const path = require('path');
const rl = require('fs/promises');

const targetDirPath = path.join(__dirname, 'styles');
const destinationDirPath = path.join(__dirname, 'project-dist', 'bundle.css');

console.log(targetDirPath);

(async () => {
  const files = await rl.readdir(targetDirPath, { withFileTypes: true });

  const styleFiles = files.filter(
    (d) => d.isFile() && /.+(.css)$/.test(d.name)
  );

  fs.writeFile(destinationDirPath, '', 'utf-8', (err) => {
    if (err) throw err;
  });

  const writeStream = fs.createWriteStream(destinationDirPath);

  for (f of styleFiles) {
    const readStream = fs.createReadStream(
      path.join(targetDirPath, f.name),
      'utf-8',
      (err) => {
        if (err) throw err;
      }
    );

    readStream.on('data', (chunk) => {
      writeStream.write(chunk);
    });
    readStream.on('error', (err) => console.log(err));
  }
})();
