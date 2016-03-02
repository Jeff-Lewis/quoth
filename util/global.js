require("sugar");

var async = require("async"),
    quote = require("./quote"),
    fx = require('yahoo-currency');

exports.rates = function(cb) {
    fx.fullRate().then(function(data) {
        cb(null, data);
    });
};

exports.indices = Object.extend({
    "United States": "^GSPC",
    "United Kingdom": "^FTSE",
    "Germany": "^GDAXI",
    "France": "^FCHI",
    "Japan": "^N225",
    "Hong Kong": "^HSI",
    "China": "000001.SS",
    "Australia": "^AXJO",
    "Canada": "^GSPTSE",
    "South Africa": "JN0U.FGI",
    "India": "^BSESN",
    "Indonesia": "^JKSE",
    "Malaysia": "^KLSE",
    "New Zealand": "^NZ50",
    "Korea": "^KS11",
    "Taiwan": "^TWII",
    "Mexico": "^MXX",
    "Brazil": "^BVSP",
    "Russia": "RTS.RS",
    "Argentina": "^MERV",
    "Spain": "^IBEX",
    "Norway": "^OSEAX",
    "Sweden": "^OMX",
    "Finland": "^OMXH25",
    "Ireland": "^ISEQ",
    "Netherlands": "^AEX",
    "Switzerland": "^SSMI",
    "Greece": "GD.AT",
    "Austria": "^ATX"
});

exports.commodities = Object.extend({
    "Gold": "XAUUSD",
    "Vix": "^VXX",
});

exports.globalIndices = function(cb) {
    async.mapSeries(exports.indices, function(symbol, cb) {
        quote.historicals(symbol, Date.create("1 week ago"), Date.create(), cb);
    }, function(err, results) {
        if (err) cb(err);
        else {
            var last = { };
            Object.keys(results).forEach(function(key) { last[key] = results[key].last(); });
            cb(null, last);
        }
    });
};