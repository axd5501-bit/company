/** "2.10.0" 이 "2.9.3" 보다 새 버전인지 (의존성 없음: CI 테스트에서 electron 없이 불러온다) */
module.exports.isNewer = function isNewer(a, b) {
  const pa = a.split('.').map(Number), pb = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) > (pb[i] || 0);
  }
  return false;
};
