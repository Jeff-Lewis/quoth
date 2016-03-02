var quoth = require("../index"),
    chai = require("chai"),
    expect = chai.expect,
    fs = require("fs");

chai.should();

describe('Sentiment', function() {
    
    var config = null;
    
    before((done) => {
        fs.readFile(__dirname + "/../credentials.json", (err, json) => {
            if (err) throw err;
            else {
                json = JSON.parse(json);
                config = json;
                done();
            }
        })
    });
    
    describe('#init((err, result) => { })', function() {
        it('Returns an object', (done) => {
            quoth.sentiment.init(config, done);
        });
    }); 
    
    describe('#fetch(symbol, (err, result) => { })', function() {
        it('Returns an object', (done) => {
            quoth.sentiment.fetch("AAPL", (err, results) => {
                if (err) throw err;
                else {
                    results.should.be.an("object");
                    done();
                }
            });
        });
    }); 
    
});