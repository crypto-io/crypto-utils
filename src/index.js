import { writeFile, readdirSync, mkdirSync, rmdirSync, readFile, unlinkSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import AES from './../node_modules/crypto-js/aes.js';
import ENC from './../node_modules/crypto-js/enc-utf8.js';

export const direxists = (dir = '') => {
  try {
    readdirSync(dir);
  } catch (e) {
    return false;
  }
  return true;
}

export const exists = path => {
  try {
    existsSync(path);
  } catch (e) {
    return false;
  }
  return true;
}

export const mkdir = path => {
  const dir = dirname(path);
  if (!direxists(dir)) {
    mkdir(dir)
    mkdirSync(dir)
  }
}

export const write = (path, data) => {
  return new Promise((resolve, reject) => {
    writeFile(path, data, (error, d) => {
      if (error) {
        if (error.code === 'ENOENT') {
          mkdir(path);
          return write(path, data).then(() => resolve());
        }
        reject(error);
      }
      resolve();
    })
  });
}

export const read = (path, as='string') => new Promise((resolve, reject) =>
  readFile(path, (error, data) => {
    if (error) reject(error);
    else try {
      if(as === 'string' || as === 'map') data = data.toString();
      else if (as === 'json') data = JSON.parse(data);
      else if (as === 'map') data = new Map(data);

      resolve(data);
    } catch (error) {
      reject(error);
    }
  }));

export const remove = path => new Promise((resolve, reject) => {
  try {
    unlinkSync(path);
    resolve();
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EISDIR') {
      try {
        rmdirSync(path);
        resolve();
      } catch (error) {
        if (error.code === 'ENOTEMPTY') {
          const files = readdirSync(path);
          for (let file of files) {
            file = join(path, file);
            unlinkSync(file)
          }
          return remove(path).then(() => {resolve()})
        } else {
          reject(error);
        }
      }
    } else {
      reject(error);
    }
  }
});

export const encrypt = (data, key) => new Promise((resolve, reject) => {
  if (!data || !key) reject(`${key ? 'data' : 'key'} missing`);
  else resolve(AES.encrypt(data, key));
});

export const decrypt = (cipher, key) => new Promise((resolve, reject) => {
  if (!cipher || !key) reject(`${key ? 'cipher' : 'key'} missing`);
  else resolve(AES.decrypt(cipher.toString(), key).toString(ENC));
});

export const trymore = (context, params, count = 0) => new Promise(async (resolve, reject) => {
  const max = (params.length - 1);
  const parts = params[count].split('|');
  try {
    const file = await context(parts[0], parts[1]);
    resolve([parts[0], file]);
  } catch (error) {
    if (count < max) {
      count++;
      try {
        await trymore(context, params, count);
      } catch (error) {
        if (count < max) {
          await trymore(context, params, count);
        } else {
          reject(error)
        }
      }
    } else {
      reject(error);
    }
  }
});

export default {
  read,
  write,
  remove,
  direxists,
  exists,
  encrypt,
  decrypt,
  trymore,
  mkdir
};
