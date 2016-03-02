require('sugar');

var talib = require('talib'),
    quant = require('quants'),
    async = require('async'),
    fs = require('fs'),
    csv = require("fast-csv");

var technicals = { },
    buggy = [ "MAMA", "IMI", "AVGDEV" ],
    excluded = [ "MAVP", "SAREXT", "MACDEXT", "ROCP", "ROCR", "ROCR100" ],
    overlapStudies = [ "ACCBANDS", "BBANDS", "HT_TRENDLINE", "SAR" ],
    movingAverageConfig = { };

talib.functions.forEach(function(fn) {
    if (fn.group.startsWith("Momentum") || fn.group.startsWith("Volatility") || 
        fn.group.startsWith("Volume") || fn.group.startsWith("Cycle") || 
        fn.group.startsWith("Pattern") || (fn.group.startsWith("Overlap") && overlapStudies.indexOf(fn.name) >= 0)) {
        
        if (buggy.indexOf(fn.name) < 0 && excluded.indexOf(fn.name) < 0) {
            technicals[fn.name] = fn.inputs.map(function(i) {
                return i.flags ? i.flags : i.name;
            }).union(fn.optInputs.map(function(i) {
                var opt = i.flags ? i.flags : i.name;
                if (i.defaultValue) return opt + ":" + i.defaultValue;
                else return opt;
            })).flatten().compact(true);

            if (technicals[fn.name][0] == "inReal0" && technicals[fn.name][1] == "inReal1") {
                delete technicals[fn.name];
            }
            else if ((fn.name.startsWith("MAX") || fn.name.startsWith("MIN")) && !fn.name.startsWith("MINUS")) {
                delete technicals[fn.name];
            }
        }
    }
});

exports.functions = technicals;

var calculate = exports.calculate = function(type, window, cb) {
    var params = { name: type, startIdx: 0, endIdx: window.length - 1 },
        fn = technicals[type];
    
    if (fn) {
        fn.forEach(function(input) {
            if (input == "inReal") {
                params[input] = window.map("adj");
            }
            else if (input.endsWith("MAType")) {
                if (movingAverageConfig[type]) {
                    if (movingAverageConfig[type][input]) {
                        params[input] = movingAverageConfig[type][input];
                    }
                    else params[input] = 0;
                }
                else params[input] = 0;
            }
            else if (input.indexOf(":") >= 0) {
                var parts = input.split(":");
                params[parts.first()] = parseInt(parts.last());
            }
            else {
                params[input] = window.map(input);
            }
        });

        talib.execute(params, function(result) {
            try {
                result = parseTechnical(result);
            }
            catch (ex) {
                cb(ex);
                return;
            }
            
            cb(null, result);
        });
    }
    else {
        cb();
    }
};

function parseTechnical(result) {
    if (result.error) {
        throw new Error(result.error + "\n" + JSON.stringify(params));
    }
    else {
        return result;
    }
}

exports.calculateSymbol = function(symbol, cb) {
    var window = [ ];
    csv.fromPath(
        __dirname + "/../data/quotes/" + symbol + ".csv", 
        { headers: false }
    ).on("data", function(data) {
        var parts = data[0].split("-");
        var quoteDate = Date.create(
            parseInt(parts[0]),
            parseInt(parts[1]) - 1,
            parseInt(parts[2])
        );

        window.push({
            date: quoteDate,
            open: parseFloat(data[1]),
            high: parseFloat(data[2]),
            low: parseFloat(data[3]),
            close: parseFloat(data[4]),
            volume: parseInt(data[5]),
            adj: parseFloat(data[6])
        });
    })
    .on("end", function() {
        var results = { },
            names = Object.keys(technicals);

        async.forEach(names, function(name, cb) {
            calculate(name, window, function(err, technical) {
                technical.name = name;
                technical.dates = window.from(technical.begIndex).to(technical.nbElement).map("date");
                results[name] = technical;
                cb(err);
            });
        }, function(err) {
            cb(err, results);
        });
    });      
};

exports.calculateAllSymbols = function(cb) {
    fs.readFile(__dirname + "/../symbols.json", function(err, json) {
        if (err) cb(err);
        else {
            async.forEachLimit(JSON.parse(json.toString()), 10, function(ticker, cb) {
                exports.calculateSymbol(ticker.symbol, function(err, data) {
                    if (err) cb(err);
                    else fs.writeFile(__dirname + "/../data/technicals/" + ticker.symbol + ".json", JSON.stringify(data, null, '\t'), cb);
                });
            }, cb);
        }
    });
};