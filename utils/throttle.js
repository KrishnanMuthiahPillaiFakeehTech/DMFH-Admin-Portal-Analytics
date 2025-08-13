// throttle.js
const pLimit = require('p-limit');

const gaApiLimiter = pLimit(8);

module.exports = gaApiLimiter;