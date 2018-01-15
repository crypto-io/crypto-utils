import AES from 'crypto-js/aes.js';
import ENC from 'crypto-js/enc-utf8.js';

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
        resolve(await trymore(context, params, count));
      } catch (error) {
        if (count < max) {
          resolve(await trymore(context, params, count));
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
  encrypt,
  decrypt,
  trymore
};
