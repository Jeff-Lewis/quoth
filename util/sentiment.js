require("sugar");

var async = require("async"),
    request = require("request"),
    htmlparser = require("htmlparser2"),
    sentiment = require('sentiment'),
    emotional = require("emotional");


///////////////////////////////////////////////////////////////////////////
// TWITTER
///////////////////////////////////////////////////////////////////////////
/*
    config = {
        consumer_key: '...',
        consumer_secret: '...',
        access_token_key: '...',
        access_token_secret: '...'
    };
*/

var twitter = null;

function init(config, cb) {
    twitter = new require("twitter")(config);
    emotional.load(function() {
        cb();
    });
}

function cleanTweet(str) {
    str = (str + " ")
        .replace(/\@[a-z0-9_]+/gi, "")
        .replace(/\$[A-Z]+/gi, "")
        .replace(/http:[^ ]+/gi, "")
        .replace(/\s+/gi, " ")
        .unescapeHTML()
        .trim();
    
    if (str.endsWith("via")) {
        str = str.to(-3).trim();
    }
    
    if (str.indexOf(":") < 5) {
        str = str.from(str.indexOf(":") + 1).trim();
    }
    
    return str;
}

function parseTweets(data) {
    if (data) {
        return data.map(function(d) {
            var ctweet = cleanTweet(d.text);
            return {
                date: Date.create(d.created_at),
                text: ctweet,
                popularity: d.retweet_count + d.favorite_count,
                sentiment: sentiment(ctweet),
                emotion: emotional.get(ctweet)
            };
        });
    }
    else return [ ];
}

function getHomeTweets(cb) {
    twitter.get('/statuses/home_timeline.json', function(data) {
        cb(null, parseTweets(data));
    });
}
    
function getTweets(symbol, cb) {    
    twitter.search("$" + symbol + ' OR #' + symbol, function(data) {
        cb(null, parseTweets(data.statuses));
    });
}


///////////////////////////////////////////////////////////////////////////
// RSS
///////////////////////////////////////////////////////////////////////////
function clean(str) {
    return str.unescapeHTML().stripTags()
                .replace(/\&#?[0-9a-z]+\;/gi, "")
                .replace(/\s+/gi, " ")
                .trim();
}

function parseRSS(body, cb) {
    var handler = new htmlparser.FeedHandler(cb),
        parser = new htmlparser.Parser(handler);

    parser.write(body.toString());
    parser.done();
}

function getNews(symbol, cb) {
    console.log("Getting news for " + symbol + "...");
    async.series([
        function(cb) {
            request("https://www.google.com/finance/company_news?q=" + symbol + "&output=rss", function(err, response, body) {
                if (err) cb(err);
                else if (response.statusCode != 200) {
                    console.log(symbol + " " + response.statusCode);
                    cb();
                    //cb(new Error("HTTP status code " + response.statusCode));
                }
                else parseRSS(body, cb);
            });
        },
        function(cb) {
            request("http://feeds.finance.yahoo.com/rss/2.0/headline?s=" + symbol + "&region=US&lang=en-US", function(err, response, body) {
                if (err) cb(err);
                else if (response.statusCode != 200) {
                    console.log(symbol + " " + response.statusCode);
                    cb();
                    //cb(new Error("HTTP status code " + response.statusCode));
                }
                else parseRSS(body, cb);
            });
        }
    ], function(err, feeds) {
        if (err) cb(err);
        else if (feeds) {
            cb(null, feeds.compact(true).map("items").flatten().compact(true).map(function(i) {
                var item = {
                    title: clean(i.title),
                    description: (i.description ? clean(i.description) : null)
                };
                
                var text = Object.values(item).join(". ").trim();
                item.sentiment = sentiment(text);
                item.emotion = emotional.get(text);

                return item;
            }).unique("title"));
        }
        else cb(err, feeds);
    });
};


///////////////////////////////////////////////////////////////////////////
// RUN AND UPDATE
///////////////////////////////////////////////////////////////////////////
exports.init = init;

exports.fetch = function(symbol, cb) {
    async.parallel([
        function(cb) {
            getNews(symbol, cb);
        },
        function(cb) {
            getTweets(symbol, cb);
        }
    ], function(err, results) {
        if (err) cb(err);
        else cb(null, { news: results[0], tweets: results[1] });
    });
};