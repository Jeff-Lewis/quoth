require("sugar");

var async = require("async"),
    request = require("request"),
    parse = require('xml-parser');

exports.run = function(cb) {
    console.log("Downloading bond data...");
    request("http://data.treasury.gov/feed.svc/DailyTreasuryYieldCurveRateData", function(err, response, body) {
        console.log("Parsing bond data...");
        var xml = parse(body.toString());
        
        console.log("Pruning bond data...");
        var records = null;
        
        try {
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
    });
};