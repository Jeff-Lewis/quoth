var quoth = require("../index");
    assert = require('assert');

describe('Quote', function() {
    
    before(() => {
        setTimeout(() => { done(); }, 1000);
    });
    
    describe('#spot(symbol, (err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#historicals(symbol, from, to, (err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#statistics(symbol, (err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#keyStatistics(symbol, (err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#volatility(symbol, (err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#fundamentals(symbol, (err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#balanceSheet(symbol, (err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#cashflow(symbol, (err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#income(symbol, (err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#yieldCurve((err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#rate3Month((err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#rate6Month((err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#rate2Year((err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#rate3Year((err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#rate5Year((err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#rate10Year((err, results) => { }))', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#rate30Year((err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#treasuries((err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
    describe('#rates((err, result) => { })', function() {
        it('Returns an object', function () {
            quoth.quote.rates((err, results) => { 
                should(err).not.be.ok();
                results.should.be.an("object");
                done();
            });
        });
    });
    
    describe('#indices', function() {
        it('Returns an object', function() {
            
        });
    });
    
    describe('#commodities', function () {
        it('Returns an object', function() {
            
        });
    });
    
    describe('#globalIndices((err, result) => { })', function() {
        it('Returns an object', function() {
            
        });
    });
    
    describe('#companies((err, results) => { })', function () {
        it.skip('Returns an object', function () {
            
        });
    });
    
});