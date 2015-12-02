// Chai reference:
// http://chaijs.com/api/bdd/

var expect = chai.expect;
chai.should();

var test_country = {
	long_name: "Australia",
	short_name: "AU",
	types: ["country", "political"]
}

describe('Unit Tests', function() {
	it('getIso3ByName()', function () {
		expect(getIso3ByName("Sweden")).to.equal("SWE");
	});

	it('getIso2ByName()', function () {
		expect(getIso2ByName("Sweden")).to.equal("SE");
	});

	it('getCurrentCountry()', function () {
		expect(getCurrentCountry()).to.equal("United States");
	});	
	
	it('getCountryIcon()', function () {
		expect(getCountryIcon(test_country)).to.equal("https://chart.googleapis.com/chart?chst=d_simple_text_icon_left&chld=Australia|14|999|flag_au|24|000|FFF");
	});
});


