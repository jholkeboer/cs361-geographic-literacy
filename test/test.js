// Chai reference:
// http://chaijs.com/api/bdd/

var expect = chai.expect;
chai.should();


describe('Unit Tests', function() {
	it('Get country ISO3 by name', function () {
		expect(getIso3ByName("Sweden")).to.equal("SWE");
	});
	it('Get country ISO2 by name', function () {
		expect(getIso2ByName("Sweden")).to.equal("SE");
	})
});


