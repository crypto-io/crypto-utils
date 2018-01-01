const test = require('tape');
const { encrypt, decrypt, read, write, remove, direxists } = require('./dist/utils-node.js');
test('ready', tape => {
  tape.plan(4);
  encrypt('data', 'uuu').then(cipher => {
    decrypt(cipher, 'uuu').then(data => tape.equal('data', data));
  });

  write('hello/hello.txt', 'some tekst').then(() => {
    const exists = direxists('hello');
    tape.equal(true, exists, 'create file/directory');

    read('hello/hello.txt', 'string').then(data => {
      tape.equal('some tekst', data, 'read from file');
      remove('hello').then(() => {
        const exists = direxists('hello')
        tape.equal(exists, false, 'remove directory');
      });
    });
  })
})
