# crypto-io-utils

[![Build Status](https://travis-ci.org/crypto-io/crypto-utils.svg?branch=master)](https://travis-ci.org/crypto-io/crypto-utils)

> Utility's used in crypto-modules.

```js
import { encrypt, decrypt, read, write, ... } from 'crypto-io-utils';

(async () => {
  const result = await encrypt('hello', 'pubkey');
  await write('hello.txt', result);
  const cipher = await read('hello.txt');
  const data = await decrypt(cipher, 'secret');
})();
```


## API

### backed[{options}]
#### options

#### encrypt
Type: `Promise`<br>
Params: `data, secret`<br>

```js
encrypt(data, secret).then(cipher => ...);
```
#### decrypt
Type: `Promise`<br>
Params: `cipher, secret`<br>

```js
decrypt(cipher, secret).then(data => ...);
```

#### read
Type: `Promise`<br>
Params: `path, as`<br>
Options:  <br>
*as*  `string, json & map`

```js
write(path, data).then(() => ...);
```

#### write
Type: `Promise`<br>
Params: `path, data`<br>

```js
write(path, data).then(() => ...);
```

#### remove
Type: `string`<br>
Default: `''`<br>

```js
remove('rainbows').then(() => ...);
```

#### mkdir
Type: `string`<br>
Default: `''`<br>

```js
mkdir('rainbows').then(() => ...);
```

#### direxists
Type: `string`<br>
Default: `''`<br>

```js
direxists('rainbows').then(exists => ...);
```

#### exists
Type: `string`<br>
Default: `''`<br>

```js
exists('rainbows.txt').then(exists => ...);
```
