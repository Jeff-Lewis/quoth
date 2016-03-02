require("sugar");
require('descriptive-statistics');

var quote = require('./quote'),
    printHistogram = require('bars'),
    colors = require('colors');

exports.analyze = analyze;
exports.histograms = histograms;
exports.print = print;

function analyze(symbol, from, to, bars, cb) {
    quote.historicals(symbol, from, to, function(err, quotes) {
        if (err) console.log(err);
        else {
            cb(null, quotes, histograms(quotes, [ 
                "change", "overnight", 
                "volatility", "energy", 
                "upside", "downside", 
                "overshot", "undershot", 
                "volume" 
            ], bars || 12));
        }
    });
}

function histograms(quotes, fields, bars) {
    var histograms = { };
    if (!bars) bars = 12;
    if (!fields) fields = [ ];
    else if (!Array.isArray(fields)) fields = [ fields ];
    
    fields.forEach(function(field) {
        var stats = histograms[field] = { 
            values: quotes.map(field),
            histogram: { } 
        };
        
        stats.min = stats.values.min();
        stats.max = stats.values.max();
        stats.mean = stats.values.mean;
        stats.stdDev = stats.values.standard_deviation;
        stats.dev1 = [ stats.mean - stats.stdDev, stats.mean + stats.stdDev ];
        stats.dev2 = [ stats.mean - 2 * stats.stdDev, stats.mean + 2 * stats.stdDev ];
        
        if (stats.max != stats.min) {
            var interval = ((stats.max.ceil() - stats.min.floor()) / bars).round(2);
            
            var buckets = (0).upto(stats.min.floor() - interval, null, interval * Math.sign(stats.min.floor())).reverse();
            buckets.add((0).upto(stats.max.ceil() + interval, null, interval * Math.sign(stats.max.ceil())));
            buckets = buckets.unique();
            buckets.forEach(function(bucket) { 
                stats.histogram[bucket.format(2)] = 0; 
            });

            quotes.forEach(function(quote) {
                var value = quote[field], found = false;
                for (var j = 0; j < buckets.length; j++) {
                    if (value <= buckets[j]) {
                        stats.histogram[buckets[j].format(2)]++;
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    console.log(field + " value " + value + " was not bucketed.".red);
                }
            });
        }
    });
    
    return histograms;
}

function print(name, stats) {
    console.log((" " + name.toUpperCase().padRight(99)).bold.inverse + "\n");

    console.log(
        ("  Min\t" + stats.min.format(2)).red + "\t\t" +
        ("  Max\t" + stats.max.format(2)).green
    );
    
    console.log(
        ("  Avg\t" + stats.mean.format(2)).gray + "\t\t" +
        ("  Dev\t" + stats.stdDev.format(2)).gray
    );
    
    console.log();

    console.log(
        ("  68.2%: " +
        stats.dev1[0].format(2) + 
        " to " +
        stats.dev1[1].format(2)).blue +
        "\n" +
        ("  95.4%: " +
        stats.dev2[0].format(2) + 
        " to " +
        stats.dev2[1].format(2)).cyan
    );

    console.log();
    console.log(printHistogram(stats.histogram, { bar: "=" }).yellow);
}