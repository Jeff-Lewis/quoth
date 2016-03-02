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
            quoth.quote.companies((err, results) => { 
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
            quoth.quote.spot("AAPL", (err, results) => { 
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
            quoth.quote.historicals("AAPL", Date.create("January 1, 2016"), Date.create("March 1, 2016"), (err, results) => { 
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
            quoth.quote.statistics("AAPL", (err, results) => { 
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
            quoth.quote.keyStatistics("AAPL", (err, results) => { 
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
            quoth.quote.volatility("AAPL", (err, results) => { 
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
            quoth.quote.fundamentals("AAPL", (err, results) => { 
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
            quoth.quote.balanceSheet("AAPL", (err, results) => { 
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
            quoth.quote.cashflow("AAPL", (err, results) => { 
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
            quoth.quote.income("AAPL", (err, results) => { 
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
            quoth.quote.treasuries((err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("array");
                    done();
                }
            });
        });
    });
    
    describe('#indices', function() {
        it.skip('returns an object', function () {
            expect(quoth.quote.indicies).to.be.an("object");
        });
    });
    
    describe('#commodities', function () {
        it.skip('returns an object', function () {
            expect(quoth.quote.commodities).to.be.an("object");
        });
    });
    
    describe('#globalIndices((err, result) => { })', function() {
        this.timeout(120000);
        it('returns an object', function(done) {
            quoth.quote.globalIndices((err, results) => { 
                if (err) throw err;
                else {
                    results.should.be.an("object");
                    done();
                }
            });
        });
    });
    
});