import { writeFile, readdirSync, mkdirSync, readFile } from 'fs';
import { dirname } from 'path';

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
    writeFile(path, data, (error, d) => {
      if (error) {
        if (error.code === 'ENOENT') {
          mkdirpath(path);
          return write(path, data);
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
    else if (as === 'buffer') return resolve(data)
    else if(as === 'string' || as === 'map') data = data.toString();
    else if (as === 'json') data = JSON.parse(data);
    else if (as === 'map') data = new Map(data);

    resolve(data)
  }));

export default {
  write,
  direxists,
  read
};
