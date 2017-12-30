import cryptoJS from 'crypto-js';

export const env = () => {if (window) return 'browser'; else return 'node'};

if (env() === 'node') {
  const { writeFile, readdirSync, mkdirSync, readFile } = require('fs');
  const { dirname } = require('path');
}

export const direxists = dir => {
  try {
    readdirSync(dir);
  } catch (e) {
    return false;
  }
  return true;
}

export const mkdirpath = path => {
  const dir = dirname(path);
  if (!direxists(dir)) {
    mkdirpath(dir)
    mkdirSync(dir)
  }
}

export const write = (path, data) => {
  return new Promise((resolve, reject) => {
    if (env() === 'browser') {

    } else {
      writeFile(path, data, (error, d) => {
        if (error) {
          if (error.code === 'ENOENT') {
            mkdirpath(path);
            return write(path, data).then(() => resolve());
          }
          reject(error);
        }
        resolve();
      })
    }
  });
}

export const read = (path, as='string') => new Promise((resolve, reject) => {
  if (env() === 'browser') {
    const input = document.createElement('input');
    input.type = 'file';
    input.click();
    const onSelectFile = event => console.log(event); // remove input ....
    input.addEventListener('change', onSelectFile , false);
  } else {
    readFile(path, (error, data) => {
      if (error) reject(error);
      else if (as === 'buffer') return resolve(data)
      else if(as === 'string' || as === 'map') data = data.toString();
      else if (as === 'json') data = JSON.parse(data);
      else if (as === 'map') data = new Map(data);

      resolve(data)
    })
  }
});

export const encrypt = (data, key) => new Promise((resolve, reject) => {
  if (!data || !key) reject(`${key ? 'data' : 'key'} missing`);
  else resolve(cryptoJS.AES.encrypt(data, key));
});

export const decrypt = (cipher, key) => new Promise((resolve, reject) => {
  if (!cipher || !key) reject(`${key ? 'cipher' : 'key'} missing`);
  else resolve(cryptoJS.AES.decrypt(cipher.toString(), key).toString(cryptoJS.enc.Utf8));
});

export default {
  write,
  direxists,
  read,
  encrypt,
  decrypt
};
