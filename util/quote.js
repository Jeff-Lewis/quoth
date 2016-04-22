require("sugar");

var async = require("async"),
    request = require("request"), 
    nasdaq = require("finance-scraper-js").nasdaq,
    yahoo = require("finance-scraper-js").yahoo,
    other = require('finance-scraper'),
    yahooFinance = require('yahoo-finance'),
    request = require("request"),
    parse = require('xml-parser');


////////////////////////////////////////////////////////////////////////////////
// QUOTE
////////////////////////////////////////////////////////////////////////////////
function parseOptions(options) {
    return options.map(function(o) {
        return {
            expiry: Date.create(o.expiry),
            strike: parseFloat(o.strike),
            volume: (o.vol != '-' ? parseFloat(o.vol) : 0),
            interest: (o.oi != '-' ? parseFloat(o.oi) : 0),
            price: (o.p != '-' ? parseFloat(o.p) : null),
            bid: (o.b != '-' ? parseFloat(o.b) : null),
            ask: (o.a != '-' ? parseFloat(o.a) : null),
            change: (o.c != '-' ? parseFloat(o.c) : null)
        };
    }).sortBy("strike")
}

function analyzeOptions(options) {
    options.stats = {
        putVolume: options.puts.sum("volume"),
        callVolume: options.calls.sum("volume"),
        putInterest: options.puts.sum("interest"),
        callInterest: options.calls.sum("interest")
    };
    
    options.stats.putCallVolumeRatio = (options.stats.putVolume / options.stats.callVolume);
    options.stats.putCallInterestRatio = (options.stats.putInterest / options.stats.callInterest);
    
    options.stats.currentImpliedDownsidePrice = options.puts.map(function(o) {
        if (o.volume) return (o.strike - o.price) * (o.volume / options.stats.putVolume);
        else return null;
    }).compact(true).sum();
    
    options.stats.currentImpliedUpsidePrice = options.calls.map(function(o) {
        if (o.volume) return  (o.strike + o.price) * (o.volume / options.stats.callVolume);
        else return null;
    }).compact(true).sum();
    
    options.stats.totalImpliedDownsidePrice = options.puts.map(function(o) {
        if (o.interest) return (o.strike - o.price) * (o.interest / options.stats.putInterest);
        else return null;
    }).compact(true).sum();
    
    options.stats.totalImpliedUpsidePrice = options.calls.map(function(o) {
        if (o.interest) return  (o.strike + o.price) * (o.interest / options.stats.callInterest);
        else return null;
    }).compact(true).sum();
    
    options.stats.currentImpliedDownsideVolatility = (options.stats.currentImpliedDownsidePrice - options.quote.close) / options.quote.close;
    options.stats.currentImpliedUpsideVolatility = (options.stats.currentImpliedUpsidePrice - options.quote.close) / options.quote.close;
    options.stats.currentImpliedVolatility = (options.stats.currentImpliedUpsidePrice - options.stats.currentImpliedDownsidePrice) / options.quote.close;
    
    options.stats.totalImpliedDownsideVolatility = (options.stats.totalImpliedDownsidePrice - options.quote.close) / options.quote.close;
    options.stats.totalImpliedUpsideVolatility = (options.stats.totalImpliedUpsidePrice - options.quote.close) / options.quote.close;
    options.stats.totalImpliedVolatility = (options.stats.totalImpliedUpsidePrice - options.stats.totalImpliedDownsidePrice) / options.quote.close;
    
    options.stats.impliedNegativity = options.stats.currentImpliedDownsideVolatility / options.stats.totalImpliedDownsideVolatility;
    options.stats.impliedPositivity = options.stats.currentImpliedUpsideVolatility / options.stats.totalImpliedUpsideVolatility;
    options.stats.impliedUncertainty = options.stats.currentImpliedVolatility / options.stats.totalImpliedVolatility;
    
    return options;
}

function getQuote(symbol, cb) {
    var url = "https://www.google.com/finance?q=" + symbol + "&output=json";
    request(url, function(err, response, body) {
        if (err) cb(err);
        else if (response.statusCode == 200) {
            var data = null;
            
            var body = body.toString().trim();
            if (body.startsWith("//")) body = body.from(2);
            
            try { data = eval("(" + body + ")"); }
            catch (ex) { cb(ex); return; }
            
            if (data && Array.isArray(data) && data.length == 1) {
                data = data.first();
            }
            
            if (data.mc) {
                if (data.mc.endsWith("M")) {
                    data.mc = parseFloat(data.mc) * 1000000;
                }
                else if (data.mc.endsWith("B")) {
                    data.mc = parseFloat(data.mc) * 1000000000;
                }
                else data.mc = null;
            }
            else data.mc = null;
            
            if (data.events) {
                data.events = data.events.filter(function(e) {
                    return e.future;
                }).map(function(e) {
                    return {
                        date: Date.create(e.date + " " + e.time.to(-4)),
                        description: e.desc
                    }
                });
            }
            
            var ratios = { };
            if (data.keyratios) {
                data.keyratios.forEach(function(k) {
                    var parameter = k.title.camelize(false);
                    if (parameter == "employees") {
                        ratios[parameter] = parseFloat(k.recent_quarter) * 1000;
                    }
                    else {
                        ratios[parameter] = {
                            previousQuarter: (k.recent_quarter == '' || k.recent_quarter == '-' ? null : parseFloat(k.recent_quarter) / 100),
                            previousYear: (k.annual == '' || k.annual == '-' ? null : parseFloat(k.annual) / 100),
                            trailingTwelveMonths: (k.ttm == '' || k.ttm == '-' ? null : parseFloat(k.ttm) / 100)
                        };

                        ratios[parameter].growing = (ratios[parameter].trailingTwelveMonths > ratios[parameter].previousYear);
                        ratios[parameter].performing = (ratios[parameter].previousQuarter > ratios[parameter].trailingTwelveMonths);
                    }
                });
            }
            
            data = Object.merge({
                open: parseFloat(data.op),
                high: parseFloat(data.hi),
                low: parseFloat(data.lo),
                close: parseFloat(data.l),
                high52Week: parseFloat(data.hi52),
                low52Week: parseFloat(data.lo52),
                marketCap: data.mc,
                peRatio: parseFloat(data.pe),
                beta: parseFloat(data.beta),
                eps: parseFloat(data.eps),
                dividendYield: parseFloat(data.dy),
                institutionOwned: parseFloat(data.instown) / 100,
                events: data.events ? data.events.map("date").unique() : []
            }, ratios);
            
            cb(null, data);
        }
        else cb(new Error("HTTP status code " + response.statusCode + "."));
    });
}

exports.spot = function(symbol, cb) {
    var url = "https://www.google.com/finance/option_chain?q=" + symbol + "&output=json";
    request(url, function(err, response, body) {
        if (err) cb(err);
        else if (response.statusCode == 200) {
            var data = null;
            try { data = eval("(" + body.toString() + ")"); }
            catch (ex) { cb(ex); return; }
            
            getQuote(symbol, function(err, quote) {
                if (err) cb(err);
                else {
                    cb(null, analyzeOptions({
                        symbol: symbol,
                        quote: quote,
                        puts: parseOptions(data.puts || []),
                        calls: parseOptions(data.calls || [])
                    }));
                }
            });
        }
        else cb(new Error("HTTP status code " + response.statusCode + "."));
    });
};


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
    }, cb);    
};


////////////////////////////////////////////////////////////////////////////////
// STATISTICS
////////////////////////////////////////////////////////////////////////////////
exports.statistics = function(symbol, cb) {
    async.series([
        function(cb) { 
            other.getTickerData(symbol).then(function(data) {
                cb(null, data);
            }); 
        },
        function(cb) { 
            other.getProfileData(symbol).then(function(data) {
                cb(null, data);
            }); 
        },
        function(cb) { yahoo.getKeyStatistics(symbol, null, cb); },
        function(cb) { yahoo.getHV(symbol, null, cb); }
    ], function(err, results) {
        cb(err, results);
    });
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
    ], function(err, results) {
        cb(err, results);
    });
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
exports.treasuries = function(cb) {
    request("http://data.treasury.gov/feed.svc/DailyTreasuryYieldCurveRateData", function(err, response, body) {
        if (err) {
            cb(err);
        }
        else if (response.statusCode != 200) {
            cb(new Error(response.statusCode + " HTTP response."));
        }
        else {
            var xml = body.toString(),
                records = null;
            
            try {
                xml = parse(xml);
                records = xml.root.children.filter(function(x) {
                    return x.name == "entry";
                }).map(function(d) {
                    var record = { };
                    d.children.find(function(c) { return c.name == "content"; }).children[0].children.forEach(function(field) {
                        if (field.name.indexOf(":") >= 0) {
                            field.name = field.name.from(field.name.indexOf(":") + 1);
                        }

                        field.name = field.name.replace("BC_", "rate");

                        var fieldName = field.name.camelize(false);
                        record[fieldName] = field.content;
                        if (fieldName.indexOf("Date") >= 0) {
                            record[fieldName] = Date.create(record[fieldName]);
                        }
                        else if (fieldName.startsWith("rate")) {
                            record[fieldName] = parseFloat(record[fieldName]);
                        }
                        else if (fieldName == "id") {
                            record[fieldName] = parseInt(record[fieldName]);
                        }
                    });

                    delete record.rate30Yeardisplay;
                    delete record.id;

                    return record;
                }).sortBy("newDate");
            }
            catch (ex) {
                cb(ex);
                return;
            }

            cb(null, records);
        }
    });
};


////////////////////////////////////////////////////////////////////////////////
// FOREIGN EXCHANGE
////////////////////////////////////////////////////////////////////////////////
exports.indices = {
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
};

exports.commodities = {
    "Gold": "XAUUSD",
    "VIX": "^VXX",
};

exports.globalIndices = function(cb) {
    var last = { };
    async.forEachSeries(Object.keys(exports.indices), function(symbol, cb) {
        last[symbol] = exports.historicals(exports.indices[symbol], Date.create("1 week ago"), Date.create(), cb);
    }, function(err, results) {
        if (err) cb(err);
        else cb(null, last);
    });
};