const test = require('node:test');
const assert = require('node:assert/strict');
const { isNewer } = require('../electron/updater.js');

test('설치판 업데이트: 버전 비교', () => {
  assert.equal(isNewer('2.6.1', '2.6.0'), true);
  assert.equal(isNewer('2.10.0', '2.9.3'), true);
  assert.equal(isNewer('3.0.0', '2.99.99'), true);
  assert.equal(isNewer('2.6.0', '2.6.0'), false);
  assert.equal(isNewer('2.5.9', '2.6.0'), false);
});
