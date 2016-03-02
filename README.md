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
quoth.quote.yieldCurve((err, results) => { });
quoth.quote.rate3Month((err, results) => { });
quoth.quote.rate6Month((err, results) => { });
quoth.quote.rate2Year((err, results) => { });
quoth.quote.rate3Year((err, results) => { });
quoth.quote.rate5Year((err, results) => { });
quoth.quote.rate10Year((err, results) => { });
quoth.quote.rate30Year((err, results) => { });
quoth.quote.treasuries((err, results) => { });

// FX Rates and Global Indices
quoth.quote.rates((err, result) => { });
quoth.quote.indices((err, result) => { });
quoth.quote.commodities((err, result) => { });
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