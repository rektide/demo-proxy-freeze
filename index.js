// a mini demonstration of Proxy's to freeze things, then add recursive freezing
// Proxy documentation: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy

console.log()
console.log(`[[[ ==== 1 - quasi-frozen-handler ==== ]]]`);
require("./1-frozen");

console.log()
console.log(`[[[ ==== 2 - quasi-deep-frozen-handler ==== ]]]`);
require("./2-deep-frozen")