var expect = require('chai').expect;
var secsSoFarToday = require("../lib/timehelper").secsSoFarToday,
    MS_IN_DAY = require("../lib/timehelper").MS_IN_DAY,
    bucketGivenNChunks = require("../lib/timehelper").bucketGivenNChunks;


describe('timehelper', function() {

    var june_11_2014 = 16233 * MS_IN_DAY;
    var MS_IN_HOUR = 60 * 60 * 1000;

    describe('Calculating Seconds So Far today', function() {
        it("should zero out zero", function() {
            expect(secsSoFarToday(0)).to.equal(0);
            expect(secsSoFarToday(MS_IN_DAY)).to.equal(0);
            expect(secsSoFarToday(june_11_2014)).to.equal(0);
        });

        it("should count seconds up from out zero", function() {
            expect(secsSoFarToday(MS_IN_DAY + 4000)).to.equal(4);
        });


        it("should wrap multiple days", function() {
            expect(secsSoFarToday(MS_IN_DAY * 1231 + 4000)).to.equal(4);
        });
    });

    describe('Calculating Buckets', function() {

        it("Should zero-reference buckets", function() {
            expect(bucketGivenNChunks((0), 1)).to.equal(0);
        });


        it("Should put any time into bucket 0 if there is only one bucket", function() {
            expect(bucketGivenNChunks((0), 1)).to.equal(0);
            expect(bucketGivenNChunks((june_11_2014), 1)).to.equal(0);
            expect(bucketGivenNChunks((MS_IN_DAY + 4000), 1)).to.equal(0);
            expect(bucketGivenNChunks((MS_IN_DAY * 1231 + 4000), 1)).to.equal(0);
            expect(bucketGivenNChunks((june_11_2014 + 12345), 1)).to.equal(0);
        });

        it("Should apportion two buckets appropriately", function() {
            expect(bucketGivenNChunks((0), 2)).to.equal(0);
            expect(bucketGivenNChunks((MS_IN_HOUR), 2)).to.equal(0);
            expect(bucketGivenNChunks(((MS_IN_HOUR * 12) - 1), 2)).to.equal(0);
            expect(bucketGivenNChunks((MS_IN_HOUR * 12), 2)).to.equal(1);
            expect(bucketGivenNChunks((june_11_2014 + (MS_IN_HOUR * 12)), 2)).to.equal(1);
        });

        it("Should apportion 12 buckets appropriately", function() {

            expect(bucketGivenNChunks((0), 12)).to.equal(0);
            expect(bucketGivenNChunks((MS_IN_HOUR), 12)).to.equal(0);
            expect(bucketGivenNChunks(((MS_IN_HOUR * 11) - 1), 12)).to.equal(5);
            expect(bucketGivenNChunks((MS_IN_HOUR * 12), 12)).to.equal(6);
            expect(bucketGivenNChunks((june_11_2014 + (MS_IN_HOUR * 12)), 12)).to.equal(6);
            expect(bucketGivenNChunks((june_11_2014 - 1), 12)).to.equal(11);
        });


        it("Should apportion 24 buckets appropriately", function() {

            expect(bucketGivenNChunks((0), 24)).to.equal(0);
            expect(bucketGivenNChunks((MS_IN_HOUR), 24)).to.equal(1);
            expect(bucketGivenNChunks(((MS_IN_HOUR * 11) - 1), 24)).to.equal(10);
            expect(bucketGivenNChunks((MS_IN_HOUR * 12), 24)).to.equal(12);
            expect(bucketGivenNChunks((june_11_2014 + (MS_IN_HOUR * 12)), 24)).to.equal(12);
            expect(bucketGivenNChunks((june_11_2014 - 1), 24)).to.equal(23);
        });


    });

});
