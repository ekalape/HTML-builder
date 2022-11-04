const fs = require('fs');
const path = require('path');
const ReadLine = require('readline');

const { stdin, stdout } = process;

const rl = ReadLine.createInterface(stdin, stdout);

const filePath = path.join(__dirname, 'text.txt');

fs.writeFile(filePath, '', (error) => {
  if (error) {
    throw error;
  }
});

console.log('------------------\nWrite smth down here:');

rl.on('line', (data) => {
  if (data === 'exit') {
    rl.close();
  } else {
    fs.appendFile(filePath, data + ' ', (error) => {
      if (error) throw error;
    });
  }
});

rl.on('close', () => {
  console.log('\n----------------------\nThank you! File "text.txt" is done!');
});
