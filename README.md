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

quote.quote.companies((err, results) => { });
quote.quote.historicals(symbol, from, to, (err, results) => { });

quote.quote.statistics(symbol, (err, results) => { });
quote.quote.keyStatistics(symbol, (err, results) => { });
quote.quote.volatility(symbol, (err, results) => { });

quote.quote.fundamentals(symbol, (err, results) => { });
quote.quote.balanceSheet(symbol, (err, results) => { });
quote.quote.cashflow(symbol, (err, results) => { });
quote.quote.income(symbol, (err, results) => { });

quote.quote.yieldCurve((err, results) => { });
quote.quote.rate3Month((err, results) => { });
quote.quote.rate6Month((err, results) => { });
quote.quote.rate2Year((err, results) => { });
quote.quote.rate3Year((err, results) => { });
quote.quote.rate5Year((err, results) => { });
quote.quote.rate10Year((err, results) => { });
quote.quote.rate30Year((err, results) => { });

quote.technicals.names == [ ... ];
quotes.technicals.functions[name](options, (err, results) => { });

```