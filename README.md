# BizTalk English — 비즈니스 미팅 영어

비즈니스 미팅 상황에 맞춘 사내 영어 학습 프로그램입니다.

- **PC**: Windows/macOS 설치 파일 (인터넷 없이 동작)
- **휴대폰**: 웹 주소로 열고 "홈 화면에 추가"하면 앱처럼 사용 (오프라인 지원)

## 메뉴 구성

| 구분 | 메뉴 | 내용 |
|---|---|---|
| 학습 | 홈 | 레벨·오늘의 목표, 이어서 학습하기, 오늘의 표현, 트랙별 진행률 |
| | 코스 | 4개 트랙 · 12개 레슨 (아래 표) |
| | 복습 | 간격 반복 플래시카드 (잊어버릴 때쯤 다시 출제) |
| 실전 | 실전 연습 | 회의 시뮬레이션, 스피드 챌린지, 오디오 학습 |
| | AI 회의 파트너 | Claude가 상대역을 맡아 자유 대화 + 턴마다 문장 교정 |
| 도구 | 표현 사전 | 전체 표현 검색, 즐겨찾기, 인쇄용 치트시트 |
| | 내 기록 | 레벨, 배지 12종, 학습 캘린더, 트랙별 진행률 |
| | 설정 | 음성, AI 키, 학습 데이터 백업/복원 |

### 코스 (4개 트랙 · 12개 레슨 · 표현 84개)

| 트랙 | 레슨 |
|---|---|
| 🧭 회의 진행 | 스몰토크 & 자기소개 · 회의 시작 & 안건 소개 · 회의 마무리 & 후속 조치 |
| 💬 토론 & 아이디어 | 의견 제시하기 · 동의와 반대 · 브레인스토밍 |
| 🌐 소통 & 원격 협업 | 끼어들기 & 확인하기 · 화상회의 · 일정 조율 |
| 📈 보고 & 협상 | 현황 보고 & 데이터 설명 · 발표 & 질의응답 · 협상 & 문제 해결 |

레슨마다 4단계로 진행합니다: **핵심 표현**(듣기·녹음 비교) → **대화 듣기**(등장인물별 음성) → **롤플레이**(내 역할로 답하고 단어 단위 채점) → **퀴즈**(10문제, 80점 통과).

### 실전 기능

- **🎬 회의 시뮬레이션**: 가격 협상, 지연 보고, 팀 갈등 진행 등 3개 시나리오. 상대의 말에 제한 시간(25초) 안에 답을 고르면 상대 반응이 달라지고, 끝나면 **정중함·명확성·주도성** 점수와 S~C 등급을 받습니다.
- **⚡ 스피드 챌린지**: 60초 동안 한국어 뜻에 맞는 영어 표현 맞히기 (콤보, 오답 시 -3초).
- **🎧 오디오 학습**: 영어 → 한국어 뜻 → 천천히 영어 순서로 자동 재생. 출퇴근길 핸즈프리 학습용.
- **🤖 AI 회의 파트너**: 해외 파트너 첫 미팅, 단가 협상, 현황 보고 등 상황을 고르거나 직접 만들어 AI와 회의합니다. 내가 한 말마다 교정 문장·더 자연스러운 표현·한 줄 팁을 받고, 회의가 끝나면 리포트와 외울 표현을 복습 카드로 저장할 수 있습니다.
- **🏆 동기 부여**: 학습할 때마다 XP가 쌓여 인턴 → 글로벌 CEO까지 레벨업, 하루 목표 60 XP, 연속 학습일, 배지.

## 설치 · 실행

### PC (설치 파일)

설치 파일은 GitHub Actions가 자동으로 빌드합니다.

- 저장소 **Actions** 탭 → *Build installers* → 하단 **Artifacts**
  - `BizTalk-English-Windows` → `BizTalk-English-Setup-x.y.z.exe`
  - `BizTalk-English-macOS` → `BizTalk-English-x.y.z-mac.dmg`
- 정식 배포: `v2.0.0` 같은 태그를 만들면 **Releases** 페이지에 설치 파일이 첨부됩니다.

설치 시 참고:
- **Windows**: 코드 서명이 없어 처음 실행할 때 "Windows의 PC 보호" 창이 뜨면 **추가 정보 → 실행**을 누르세요.
- **macOS**: 처음에는 Finder에서 앱을 **우클릭 → 열기**로 실행하세요.

### 휴대폰 (웹 앱)

`app/` 폴더가 GitHub Pages로 자동 배포됩니다 (*Deploy web app* 워크플로).

1. **최초 1회**: 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 바꾸고, Actions 탭에서 *Deploy web app*을 다시 실행합니다.
2. 배포 주소(예: `https://<계정>.github.io/<저장소>/`)를 휴대폰에서 엽니다.
3. **홈 화면에 추가** — iPhone(Safari): 공유 → 홈 화면에 추가 / Android(Chrome): ⋮ → 홈 화면에 추가

휴대폰 Chrome·Safari에서는 **말하고 채점**(음성 인식) 기능도 쓸 수 있습니다. PC 설치판에는 음성 인식 서버가 없어서 녹음 비교와 입력 채점 방식을 씁니다.

> 저장소가 공개(public)이면 배포된 웹 앱도 누구나 열 수 있습니다. 학습 기록과 API 키는 각자의 기기에만 저장되고 서버로 전송되지 않습니다.

### 공통 설정

- **영어 음성이 안 나올 때**: 앱은 기기에 설치된 음성을 씁니다. 한국어 Windows는 설정 → 시간 및 언어 → 음성 → **음성 추가**에서 "English (United States)"를 설치하세요.
- **마이크**: Windows 설정 → 개인 정보 및 보안 → 마이크 → 데스크톱 앱 액세스 허용.
- **AI 회의 파트너**: [console.anthropic.com](https://console.anthropic.com)에서 Claude API 키를 발급받아 **설정 → AI 회의 파트너**에 저장합니다. 키는 그 기기에만 저장되며 백업 파일에도 포함되지 않습니다. 대화한 만큼 API 요금이 부과됩니다. 모델은 `claude-opus-5-5`이고, 안전 분류기가 요청을 거절하면 서버가 권장 모델로 자동 재시도하도록(`fallbacks: "default"`) 설정되어 있습니다.
- **PC ↔ 휴대폰 기록 옮기기**: 설정 → 학습 데이터 → 내보내기 / 가져오기.

## 개발

Node.js 22 이상이 필요합니다.

```bash
npm install          # 의존성 설치
npm start            # 데스크톱 앱 실행 (개발 모드)
npm test             # 채점·퀴즈·복습·레벨·배지 로직과 콘텐츠, 오프라인 캐시 목록 검증
npm run dist:win     # Windows 설치 파일 (Windows에서 실행)
npm run dist:mac     # macOS dmg (macOS에서 실행)
npm run build:vendor # Anthropic SDK를 app/vendor/anthropic-sdk.js 로 다시 번들
```

웹으로 확인할 때는 `app/` 폴더를 아무 정적 서버로 띄우면 됩니다 (예: `npx serve app`). `app/index.html`을 파일로 바로 열어도 동작하지만 오프라인 캐시는 웹 주소로 열 때만 켜집니다.

### 폴더 구조

```
app/                    화면 (빌드 과정 없는 HTML/CSS/JS)
  index.html            레이아웃 (사이드바 · 모바일 하단 탭)
  css/style.css         디자인 (라이트/다크 모드, 반응형, 인쇄)
  js/data.js            트랙 · 레슨 콘텐츠 ← 표현/대화/문제 추가는 여기서
  js/scenarios.js       회의 시뮬레이션 시나리오
  js/core.js            채점, 퀴즈 생성, 복습 일정, XP·레벨·배지 (순수 로직)
  js/app.js             공통: 상태 저장, 음성, 경험치, 라우팅
  js/views-learn.js     홈 · 코스 · 레슨 4단계
  js/views-practice.js  실전 연습 · 시뮬레이션 · 스피드 · 오디오
  js/views-ai.js        AI 회의 파트너 (Claude API)
  js/views-more.js      복습 · 표현 사전 · 내 기록 · 설정
  vendor/               번들된 Anthropic SDK (npm run build:vendor)
  fonts/                Pretendard (SIL OFL 1.1)
  manifest.webmanifest, sw.js, icons/   휴대폰 설치 · 오프라인 지원
electron/main.js        데스크톱 창, 마이크 권한
build/icon.png          데스크톱 앱 아이콘
tests/                  node:test 단위 테스트
.github/workflows/      설치 파일 빌드(build.yml), 웹 배포(pages.yml)
```

### 콘텐츠 추가·수정

- **레슨**: `app/js/data.js`의 `LESSONS`에 추가하고 `TRACKS`의 해당 트랙 `lessons`와 `LEVELS`에 id를 넣으세요.
  - `expressions[].blank`: 빈칸 퀴즈에서 비울 단어 (문장 안에 반드시 포함)
  - `dialogue.you`: 롤플레이에서 학습자가 맡는 역할
  - `situations[].answer`: 정답 보기 인덱스 (화면에서는 섞여서 나옴)
- **시뮬레이션**: `app/js/scenarios.js`. 단계마다 평가 역량(`polite`/`clear`/`lead`)과 등급 0·1·2 답변 3개, 각 답변에 대한 상대 반응을 넣습니다.
- 앱 파일을 바꾸면 `app/sw.js`의 `VERSION`을 올려야 휴대폰에 새 버전이 반영됩니다.

`npm test`가 빈칸 단어 누락, 정답 인덱스 오류, 알 수 없는 화자, 시나리오 등급 누락, 오프라인 캐시 누락 같은 실수를 잡아 줍니다.
