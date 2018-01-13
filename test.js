const test = require('blue-tape');
const { encrypt, decrypt, read, write, remove, direxists, trymore } = require('./dist/utils-node.js');
(async () => {
  await test('encrypt/decrypt', async tape => {
    tape.plan(1);
    const cipher = await encrypt('data', 'uuu');
    const data = await decrypt(cipher, 'uuu');
    tape.equal('data', data);
  });

  await test('ready', async tape => {
    tape.plan(1);

    try {
      await write('hello/hello.txt', 'some tekst');
      await write('no-object.json', '[object object]');

      tape.ok('create file/directory');
    } catch (e) {
      tape.fail(e)
    }
  });

  await test('trymore', async tape => {
    tape.plan(1);
    try {
      const data = await trymore(read, ['hello|string', 'hello/hello.txt|string']);
      tape.equal('some tekst', data[1], 'trymore');
    } catch (e) {
      tape.fail(e)
    } finally {

    }
  })

  await test('read', async tape => {
    tape.plan(2);
    tape.shouldFail(read('no-object.json', 'json'), 'returns errors for read');

    const data = await read('hello/hello.txt', 'string')
    tape.equal('some tekst', data, 'read from file');
  });

  await test('direxists', async tape => {
    tape.plan(1);
    const exists = direxists('hello');
    tape.equal(exists, true, 'directory exists');
  });

  await test('remove', async tape => {
    tape.plan(1);
    await remove('hello')
    await remove('no-object.json')
    const exists = direxists('hello');
    tape.equal(exists, false, 'remove directory');
  });

})()
