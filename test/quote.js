var quoth = require("../index"),
    chai = require("chai"),
    expect = chai.expect;

chai.should();

describe('Quote', function() {
    
    before((done) => {
        setTimeout(() => { done(); }, 1000);
    });
    
    this.timeout(30000);
    
    describe('#companies((err, results) => { })', function() {
        it('returns an array', function(done) {
            this.timeout(120000);
            quoth.companies((err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("array");
                    done();
                }
            });
        });
    });
    
    describe('#spot(symbol, (err, results) => { })', function () {
        it('returns an object', function(done) {
            quoth.spot("AAPL", (err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("object");
                    done();
                }
            });
        });
    });
    
    describe('#historicals(symbol, from, to, (err, results) => { })', function () {
        it('returns an array', function(done) {
            quoth.historicals("AAPL", Date.create("January 1, 2016"), Date.create("March 1, 2016"), (err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("array");
                    done();
                }
            });
        });
    });
    
    describe('#statistics(symbol, (err, results) => { })', function () {
        it('returns an array', function(done) {
            quoth.statistics("AAPL", (err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("array");
                    done();
                }
            });
        });
    });
    
    describe('#keyStatistics(symbol, (err, results) => { })', function () {
        it('returns an array', function(done) {
            quoth.keyStatistics("AAPL", (err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("array");
                    done();
                }
            });
        });
    });
    
    describe('#volatility(symbol, (err, results) => { })', function () {
        it('returns a number', function(done) {
            quoth.volatility("AAPL", (err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("number");
                    done();
                }
            });
        });
    });
    
    describe('#fundamentals(symbol, (err, results) => { })', function () {
        this.timeout(120000);
        it('returns an array', function(done) {
            quoth.fundamentals("AAPL", (err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("array");
                    done();
                }
            });
        });
    });
    
    describe('#balanceSheet(symbol, (err, results) => { })', function () {
        it('returns an array', function(done) {
            quoth.balanceSheet("AAPL", (err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("array");
                    done();
                }
            });
        });
    });
    
    describe('#cashflow(symbol, (err, results) => { })', function () {
        it('returns an array', function(done) {
            quoth.cashflow("AAPL", (err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("array");
                    done();
                }
            });
        });
    });
    
    describe('#income(symbol, (err, results) => { })', function () {
        it('returns an array', function(done) {
            quoth.income("AAPL", (err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("array");
                    done();
                }
            });
        });
    });
    
    describe('#treasuries((err, results) => { })', function () {
        this.timeout(120000);
        it('returns an object', function(done) {
            quoth.treasuries((err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("array");
                    done();
                }
            });
        });
    });
    
    describe('#globalIndices((err, result) => { })', function() {
        this.timeout(120000);
        it('returns an object', function(done) {
            quoth.globalIndices((err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("object");
                    done();
                }
            });
        });
    });
    
});