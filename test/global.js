var quoth = require("../index");
    assert = require('assert');

describe('Global', function() {
    
    describe('#rates((err, result) => { })', function () {
        it('Returns an object', function () {
            quoth.global.rates((err, results) => { 
                should.not.exist(err);
                results.should.be.an("object");
                done();
            });
        });
    });
    
    describe('#indices', function () {
        it('Returns an object', function () {
            quoth.global.indices.should.be.ok();
        });
    });
    
    describe('#commodities', function () {
        it('Returns an object', function () {
            quoth.global.commodities.should.be.ok();
        });
    });
    
    describe('#globalIndices((err, result) => { })', function () {
        it('Returns an object', function () {
            quoth.global.globalIndices((err, results) => { 
                should.not.exist(err);
                results.should.be.an("object");
                done();
            });
        });
    });
    
});