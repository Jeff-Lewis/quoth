var talib = require("talib");

console.log("TALib Version: " + talib.version);
 
exports.functions = talib.functions;
exports.names = Object.keys(talib.functions);