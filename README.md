#Quoth

## A free financial quotes library

```javascript

var quoth = require("quoth");

quoth.global.rates((err, result) => { });
quoth.global.indices((err, result) => { });
quoth.global.commodities((err, result) => { });
quoth.global.globalIndicies((err, result) => { });

quoth.histogram.analyze(symbol, from, to, bars, (err, result) => { });
quoth.histogram.histogram(quotes, fields, bars);
quoth.histogram.print(name, stats);

quoth.quote.companies((err, results) => { });
quoth.quote.historicals(symbol, from, to, (err, results) => { });

quoth.quote.statistics(symbol, (err, results) => { });
quoth.quote.keyStatistics(symbol, (err, results) => { });
quoth.quote.volatility(symbol, (err, results) => { });

quoth.quote.fundamentals(symbol, (err, results) => { });
quoth.quote.balanceSheet(symbol, (err, results) => { });
quoth.quote.cashflow(symbol, (err, results) => { });
quoth.quote.income(symbol, (err, results) => { });

quoth.quote.yieldCurve((err, results) => { });
quoth.quote.rate3Month((err, results) => { });
quoth.quote.rate6Month((err, results) => { });
quoth.quote.rate2Year((err, results) => { });
quoth.quote.rate3Year((err, results) => { });
quoth.quote.rate5Year((err, results) => { });
quoth.quote.rate10Year((err, results) => { });
quoth.quote.rate30Year((err, results) => { });

quoth.technicals.names == [ ... ];
quoth.technicals.functions[name](options, (err, results) => { });

```