const fs = require('fs');
const path = require('path');
const rd = require('fs/promises');

const dirPath = path.join(__dirname, 'secret-folder');

async function rDir() {
  console.log(
    '------------------\nFiles in the secret folder:\n------------------'
  );
  const dir = await rd.readdir(dirPath, { withFileTypes: true }, (err) => {
    if (err) throw err;
  });
  for (const d of dir) {
    if (d.isFile()) {
      const p = path.join(__dirname, 'secret-folder', d.name);
      let size = '';
      let file = d.name.split('.');
      fs.stat(p, (err, stats) => {
        if (err) throw err;
        file.push((stats.size / 1024).toPrecision(5) + ' kb');
        size = stats.size;
        let output = file.join(' - ');
        console.log(output);
      });
    }
  }
}
try {
  rDir();
} catch (err) {
  console.log(err);
}
