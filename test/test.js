// Chai reference:
// http://chaijs.com/api/bdd/

var expect = chai.expect;


describe('General Tests', function() {
	it('Get country ISO3 by name', function () {
		expect(getIso3ByName("Sweden")).to.equal("SWE");
	});
	it('Get country ISO2 by name', function () {
		expect(getIso2ByName("Sweden")).to.equal("SE");
	})
});

// describe('News Tests', function () {	
// 	it('Get News', function () {
// 		expect()
// 	});
// });

// describe('Weather Tests', function () {
// 	it('Get Weather', function () {
// 		expect()
// 	})
// });