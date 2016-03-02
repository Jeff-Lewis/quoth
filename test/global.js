var quoth = require("../index");
    assert = require('assert'),
    should = require('should');

describe('Global', function() {
    
    before(() => {
        setTimeout(() => { done(); }, 1000);
    });
    
    describe('#rates((err, result) => { })', function() {
        it('Returns an object', function () {
            quoth.global.rates((err, results) => { 
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
    
});