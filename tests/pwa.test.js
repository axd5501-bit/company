const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const APP = path.join(__dirname, '..', 'app');

function swAssets() {
  const src = fs.readFileSync(path.join(APP, 'sw.js'), 'utf8');
  const list = src.match(/const ASSETS = \[([\s\S]*?)\];/)[1];
  return [...list.matchAll(/'([^']+)'/g)].map(m => m[1]);
}

test('오프라인 캐시 목록의 파일이 모두 존재한다', () => {
  for (const asset of swAssets()) {
    if (asset === './') continue;
    assert.ok(fs.existsSync(path.join(APP, asset)), `${asset} 없음`);
  }
});

test('index.html 이 불러오는 스크립트·스타일이 모두 오프라인 캐시에 들어 있다', () => {
  const html = fs.readFileSync(path.join(APP, 'index.html'), 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)].map(m => m[1]);
  const assets = swAssets();
  for (const ref of refs) assert.ok(assets.includes(ref), `${ref} 가 sw.js ASSETS 에 없음`);
});

test('manifest 아이콘 파일이 존재한다', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(APP, 'manifest.webmanifest'), 'utf8'));
  assert.ok(manifest.icons.some(i => i.purpose === 'maskable'));
  for (const icon of manifest.icons) assert.ok(fs.existsSync(path.join(APP, icon.src)), icon.src);
});
