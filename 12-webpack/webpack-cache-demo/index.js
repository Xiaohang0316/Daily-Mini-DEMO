const CryptoJS = require('crypto-js');

const plaintext = 'Hello, Webpack cache!';
const md5Hash = CryptoJS.MD5(plaintext).toString(CryptoJS.enc.Hex)
console.log('%c [ md5Hash ]-4', 'font-size:13px; background:pink; color:#bf2c9f;', md5Hash)

console.log(plaintext);
 