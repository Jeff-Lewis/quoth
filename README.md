#Quoth

## A free financial quotes library

```javascript

var quoth = require("quoth");

// Listed companies
quoth.companies((err, results) => { });

// Quotes
quoth.spot(symbol, (err, result) => { });
quoth.statistics(symbol, (err, results) => { });
quoth.keyStatistics(symbol, (err, results) => { });
quoth.volatility(symbol, (err, results) => { });
quoth.historicals(symbol, from, to, (err, results) => { });

// Fundamentals
quoth.fundamentals(symbol, (err, results) => { });
quoth.balanceSheet(symbol, (err, results) => { });
quoth.cashflow(symbol, (err, results) => { });
quoth.income(symbol, (err, results) => { });

// Bonds
quoth.treasuries((err, results) => { });

// Global Indices
quoth.indices = { ... };
quoth.commodities = { ... };
quoth.globalIndicies((err, result) => { });

// Sentiment and Emotion
quoth.sentiment.init({
    consumer_key: '...',
    consumer_secret: '...',
    access_token_key: '...',
    access_token_secret: '...'
}, (err) => { 
    if (err) throw err;
    else quote.sentiment.fetch(symbol, (err, results) => { });
});


```