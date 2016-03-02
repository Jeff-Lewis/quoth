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
    
    describe('#indices((err, result) => { })', function () {
        it('Returns an object', function () {
            quoth.global.indices((err, results) => { 
                should.not.exist(err);
                results.should.be.an("object");
                done();
            });
        });
    });
    
    describe('#commodities((err, result) => { })', function () {
        it('Returns an object', function () {
            quoth.global.commodities((err, results) => { 
                should.not.exist(err);
                results.should.be.an("object");
                done();
            });
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