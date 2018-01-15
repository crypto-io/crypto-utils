const test = require('blue-tape');
const { encrypt, decrypt, read, write, remove, direxists, trymore } = require('./dist/utils-node.js');
let once = 0;
const throwOnce = () => {
  if (once > 0) {
    return 'some tekst';
  }
  once++;
  throw 'error';
}

(async () => {
  await test('encrypt/decrypt', async tape => {
    tape.plan(1);
    const cipher = await encrypt('data', 'uuu');
    const data = await decrypt(cipher, 'uuu');
    tape.equal('data', data);
  });

  await test('trymore', async tape => {
    tape.plan(1);
    try {
      const data = await trymore(throwOnce, ['hello|string', 'hello/hello.txt|string']);
      tape.equal('some tekst', data[1], 'trymore');
    } catch (e) {
      tape.fail(e)
    }
  });

})()
