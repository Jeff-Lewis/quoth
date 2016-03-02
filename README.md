#Quoth

## A free financial quotes library

```javascript

var quoth = require("quoth");

// Listed companies
quoth.quote.companies((err, results) => { });

// Quotes
quoth.quote.spot(symbol, (err, result) => { });
quoth.quote.statistics(symbol, (err, results) => { });
quoth.quote.keyStatistics(symbol, (err, results) => { });
quoth.quote.volatility(symbol, (err, results) => { });
quoth.quote.historicals(symbol, from, to, (err, results) => { });

// Fundamentals
quoth.quote.fundamentals(symbol, (err, results) => { });
quoth.quote.balanceSheet(symbol, (err, results) => { });
quoth.quote.cashflow(symbol, (err, results) => { });
quoth.quote.income(symbol, (err, results) => { });

// Bonds
quoth.quote.treasuries((err, results) => { });

// Global Indices
quoth.quote.indices = [ ... ];
quoth.quote.commodities = [ ... ];
quoth.quote.globalIndicies((err, result) => { });

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