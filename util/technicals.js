var talib = require("talib");

console.log("TALib Version: " + talib.version);
 
exports.functions = Object.extend(talib.functions);
exports.names = Object.keys(talib.functions);