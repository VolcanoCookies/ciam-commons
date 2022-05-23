import assert from 'assert';
import { Flag, validFlag } from '../lib/index.js';

const validFlags = [
	'some.valid.flag',
	'some.more.*',
	'some',
	'*',
	'some.?.d',
	'some.123',
	'1',
	'?',
	'?.asd',
];

const invalidFlags = [
	'',
	'some.',
	'*.d',
	'asd.*.asd',
	'.',
	'a_',
	'A',
	'asd.A.asd',
];

describe('Flags', function () {
	describe('#validFlag()', function () {
		it('Return true for valid flags', function () {
			validFlags.forEach((s) => assert.ok(validFlag(s)));
		});

		it('Return false for invalid flags', function () {
			invalidFlags.forEach((s) => assert.ok(!validFlag(s)));
		});
	});
});
