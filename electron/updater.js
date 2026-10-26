/*
 * 자동 업데이트 (설치판에서만 동작).
 * - Windows: GitHub Releases 의 latest.yml 을 보고 새 버전을 백그라운드로 받아 두었다가,
 *   "지금 다시 시작"을 누르거나 앱을 닫을 때 설치한다. 학습 기록(사용자 데이터 폴더)은 그대로 남는다.
 * - macOS: 코드 서명이 없으면 자동 설치가 안 되므로, 새 버전이 나오면 다운로드 페이지를 안내한다.
 */
const { app, dialog, shell, net } = require('electron');
const { isNewer } = require('./version');

const LATEST_API = 'https://api.github.com/repos/axd5501-bit/company/releases/latest';
const RELEASES_PAGE = 'https://github.com/axd5501-bit/company/releases/latest';
const CHECK_EVERY = 6 * 60 * 60 * 1000;

function ask(win, options) {
  return win ? dialog.showMessageBox(win, options) : dialog.showMessageBox(options);
}

function setupWindows(getWindow) {
  const { autoUpdater } = require('electron-updater');
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  let asked = false;
  autoUpdater.on('update-downloaded', async (info) => {
    if (asked) return;
    asked = true;
    const { response } = await ask(getWindow(), {
      type: 'info',
      buttons: ['지금 다시 시작', '나중에'],
      defaultId: 0,
      cancelId: 1,
      title: '업데이트 준비 완료',
      message: '새 버전(v' + info.version + ')이 준비됐어요.',
      detail: '지금 다시 시작하면 바로 적용돼요. "나중에"를 누르면 앱을 닫을 때 자동으로 설치됩니다. 학습 기록은 그대로 유지돼요.'
    });
    if (response === 0) autoUpdater.quitAndInstall();
  });
  // 오프라인 등으로 실패하면 다음 확인 때 다시 시도
  autoUpdater.on('error', () => {});
  const check = () => autoUpdater.checkForUpdates().catch(() => {});
  check();
  setInterval(check, CHECK_EVERY);
}

function setupMac(getWindow) {
  let notified = '';
  const check = async () => {
    try {
      const res = await net.fetch(LATEST_API, { headers: { accept: 'application/vnd.github+json' } });
      if (!res.ok) return;
      const release = await res.json();
      const latest = String(release.tag_name || '').replace(/^v/, '');
      if (!latest || notified === latest || !isNewer(latest, app.getVersion())) return;
      notified = latest;
      const { response } = await ask(getWindow(), {
        type: 'info',
        buttons: ['다운로드 페이지 열기', '나중에'],
        defaultId: 0,
        cancelId: 1,
        title: '새 버전',
        message: '새 버전(v' + latest + ')이 나왔어요.',
        detail: 'macOS 판은 자동 설치를 지원하지 않아요. 다운로드 페이지에서 dmg 를 받아 응용 프로그램 폴더에 덮어쓰면 됩니다. 학습 기록은 그대로 유지돼요.'
      });
      if (response === 0) shell.openExternal(release.html_url || RELEASES_PAGE);
    } catch (e) {
      // 오프라인: 다음 확인 때 다시 시도
    }
  };
  check();
  setInterval(check, CHECK_EVERY);
}

module.exports = function setupUpdates(getWindow) {
  if (!app.isPackaged) return;
  if (process.platform === 'win32') setupWindows(getWindow);
  else if (process.platform === 'darwin') setupMac(getWindow);
};
