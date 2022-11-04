const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const rStream = fs.createReadStream(filePath, 'utf-8');

let text = '';

rStream.on('data', (chunk) => {
  text += chunk;
});
rStream.on('end', () =>
  console.log(
    `-------\nreading text from the file text.txt:\n-------\n ${text}`
  )
);
rStream.on('error', (err) => console.log('error', err.message));
