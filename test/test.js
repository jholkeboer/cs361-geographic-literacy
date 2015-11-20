var expect = chai.expect;

describe('Is Even Tests', function () {
	it('Should always return a boolean', function() {
		expect(isEven(2)).to.be.a('boolean');
	});
});