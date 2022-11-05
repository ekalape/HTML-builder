const fs = require('fs');

const path = require('path');

const destinationDir = path.join(__dirname, 'project-dist');
const templatePath = path.join(__dirname, 'template.html');

const rl = require('fs/promises');

fs.mkdir(destinationDir, { recursive: true }, (err) => {
  if (err) throw err;
});
(async function main() {
  let templateHtml = await readF(templatePath);

  const components = await rl.readdir(path.join(__dirname, 'components'), {
    withFileTypes: true,
  });
  for (c of components) {
    if (c.isFile && path.extname(c.name) === '.html') {
      const tagname = c.name.slice(0, -5);
      try {
        const content = await readF(path.join(__dirname, 'components', c.name));
        templateHtml = templateHtml.replace(`{{${tagname}}}`, content);
      } catch (err) {
        throw err;
      }
    }
  }
  fs.writeFile(path.join(destinationDir, 'index.html'), templateHtml, (err) => {
    if (err) throw err;
  });
  console.log('Done');
  combineStyles();
  copyAssets(path.join(__dirname, 'assets'), path.join(destinationDir, 'assets'));
})();
async function readF(path) {
  let chunks = '';
  const rs = fs.createReadStream(path, 'utf-8');
  return new Promise((res, rej) => {
    rs.on('data', (data) => {
      chunks += data;
    });
    rs.on('end', () => res(chunks));
    rs.on('error', (err) => rej(err));
  });
}

async function combineStyles() {
  const cssFiles = await rl.readdir(path.join(__dirname, 'styles'), {
    withFileTypes: true,
  });

  fs.writeFile(path.join(destinationDir, 'style.css'), '', (err) => {
    if (err) throw err;
  });
  const w = fs.createWriteStream(path.join(destinationDir, 'style.css'));
  for (f of cssFiles) {
    if (f.isFile && /.+(.css)$/.test(f.name)) {
      const r = fs.createReadStream(path.join(__dirname, 'styles', f.name), 'utf-8');

      r.on('data', (text) => w.write(text));
      r.on('error', (err) => console.log(err));
    }
  }
}

async function copyAssets(src, dest) {
  const assetsDir = await rl.readdir(src, { withFileTypes: true });
  await fs.mkdir(dest, { recursive: true }, (err) => {
    if (err) throw err;
  });
  for (d of assetsDir) {
    const srcPath = path.join(src, d.name);
    const destPath = path.join(dest, d.name);
    if (d.isDirectory()) {
      await copyAssets(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath, (err) => {
        if (err) throw err;
      });
    }
  }
}
