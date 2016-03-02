require("sugar");

var async = require("async");

var nasdaq = require("finance-scraper-js").nasdaq,
    yahoo = require("finance-scraper-js").yahoo,
    other = require('finance-scraper'),
    yahooFinance = require('yahoo-finance');


////////////////////////////////////////////////////////////////////////////////
// COMPANIES
////////////////////////////////////////////////////////////////////////////////
exports.companies = function(cb) {
    nasdaq.getCompaniesList(cb);
};

var historicals = exports.historicals = function(symbol, from, to, cb) {
    yahooFinance.historical({
        symbol: symbol,
        from: from.format("{yyyy}-{MM}-{dd}"),
        to: to.format("{yyyy}-{MM}-{dd}"),
        period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only) 
    }, function(err, quotes) {
        if (err) cb(err);
        else {
            for (var i = 0; i < quotes.length; i++) {
                var quote = quotes[i],
                    last = quotes[Math.max(0, i - 1)],
                    next = quotes[Math.min(quotes.length - 1, i + 1)];

                quote.change = (quote.close - quote.open) / quote.open * 100;
                quote.volatility = (quote.high - quote.low) / quote.open * 100;
                quote.energy = quote.volatility / (quote.change ? quote.change : 0.01);

                quote.upside = (quote.high - quote.open) / quote.open * 100;
                quote.downside = (quote.open - quote.low) / quote.open * 100;

                quote.overshot = (quote.high - quote.close) / quote.close * 100;
                quote.undershot = (quote.close - quote.low) / quote.close * 100;

                quote.overnight = (quote.open - last.close) / last.close * 100;
            }
            
            cb(null, quotes);
        }
    });    
};


////////////////////////////////////////////////////////////////////////////////
// STATISTICS
////////////////////////////////////////////////////////////////////////////////
exports.statistics = function(symbol, cb) {
    async.series([
        function(cb) { other.getTickerData(symbol).then(cb); },
        function(cb) { other.getProfileData(symbol).then(cb); },
        function(cb) { yahoo.getKeyStatistics(symbol, null, cb); },
        function(cb) { yahoo.getHV(symbol, null, cb); }
    ], cb);
};

exports.keyStatistics = function(symbol, cb) {
    yahoo.getKeyStatistics(symbol, null, cb);
};

exports.volatility = function(symbol, cb) {
    yahoo.getHV(symbol, null, cb);
};


////////////////////////////////////////////////////////////////////////////////
// FUNDAMENTALS
////////////////////////////////////////////////////////////////////////////////
exports.fundamentals = function(symbol, cb) {
    async.series([
        function(cb) { yahoo.getFundamentals("Balance Sheet", symbol, "quarter", null, cb) },
        function(cb) { yahoo.getFundamentals("Cash Flow", symbol, "quarter", null, cb) },
        function(cb) { yahoo.getFundamentals("Income Statement", symbol, "quarter", null, cb) }
    ], cb);
};

exports.balanceSheet = function(symbol, cb) {
    yahoo.getFundamentals("Balance Sheet", symbol, "quarter", null, cb);    
};

exports.cashflow = function(symbol, cb) {
    yahoo.getFundamentals("Cash Flow", symbol, "quarter", null, cb);    
};

exports.income = function(symbol, cb) {
    yahoo.getFundamentals("Income Statement", symbol, "quarter", null, cb);    
};


////////////////////////////////////////////////////////////////////////////////
// YIELD CURVE
////////////////////////////////////////////////////////////////////////////////
exports.yieldCurve = function(cb) {
    async.mapSeries([ 3, 6, 24, 36, 60, 120, 360 ], function(tenor, cb) {
        yahoo.getRiskFreeRate(tenor, next);
    }, cb);
};

exports.rate3Month = function(cb) {
    yahoo.getRiskFreeRate(3, next);
};

exports.rate6Month = function(cb) {
    yahoo.getRiskFreeRate(6, next);
};

exports.rate2Year = function(cb) {
    yahoo.getRiskFreeRate(24, next);
};

exports.rate3Year = function(cb) {
    yahoo.getRiskFreeRate(36, next);
};

exports.rate5Year = function(cb) {
    yahoo.getRiskFreeRate(60, next);
};

exports.rate10Year = function(cb) {
    yahoo.getRiskFreeRate(12 * 10, next);
};

exports.rate30Year = function(cb) {
    yahoo.getRiskFreeRate(12 * 30, next);
};