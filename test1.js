const crypto = require('crypto');

function generateShortKey(input, length) {
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  return hash.slice(0, length);
}

const data = 'Hello, world!';
const shortKey = generateShortKey(data, 8);

console.log('Short Key:', shortKey);