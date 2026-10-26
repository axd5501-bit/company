const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../app/js/core.js');

function seeded(seed) {
  return function () {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
}

test('tokenize: 축약형·숫자·기호 표기 차이를 무시한다', () => {
  assert.deepEqual(C.tokenize("I'm"), C.tokenize('I am'));
  assert.deepEqual(C.tokenize("We'd be willing"), C.tokenize('we would be willing'));
  assert.deepEqual(C.tokenize("Let's"), ['let', 'us']);
  assert.deepEqual(C.tokenize("can't won't don't"), ['can', 'not', 'will', 'not', 'do', 'not']);
  assert.deepEqual(C.tokenize('increased by 15%'), C.tokenize('increased by fifteen percent'));
  assert.deepEqual(C.tokenize('Did you find the office OK?'), C.tokenize('did you find the office okay'));
  assert.deepEqual(C.tokenize("today's meeting"), ["today's", 'meeting']);
  assert.deepEqual(C.tokenize('it’s'), ['it', 'is']);
});

test('compareSentence: 같은 문장은 100점, 빈 답은 0점', () => {
  const s = "Shall we get started?";
  assert.equal(C.compareSentence(s, 'shall we get started').score, 100);
  assert.equal(C.compareSentence(s, '').score, 0);
});

test('compareSentence: 빠진 단어를 원문 단어 단위로 표시한다', () => {
  const r = C.compareSentence("I'm afraid I have to disagree.", 'I am afraid I disagree');
  assert.ok(r.score > 50 && r.score < 100);
  assert.deepEqual(r.words.map(w => w.ok), [true, true, true, false, false, true]);
  assert.equal(r.words[0].text, "I'm");
});

test('compareSentence: 음성 인식이 숫자를 쉼표 없이 적어도 같은 문장으로 본다', () => {
  assert.equal(C.compareSentence('The design airflow for this zone is 2,000 CFM.', 'the design airflow for this zone is 2000 CFM').score, 100);
  assert.equal(C.compareSentence('The CO2 levels exceed 1,500 ppm.', 'the CO2 levels exceed 1500 ppm').score, 100);
});

test('compareSentence: 추가로 덧붙인 단어도 감점된다', () => {
  const exact = C.compareSentence('Let me share my screen.', 'Let me share my screen').score;
  const padded = C.compareSentence('Let me share my screen.', 'okay so let me share my screen now please').score;
  assert.equal(exact, 100);
  assert.ok(padded < exact);
});

test('makeBlank / isBlankCorrect', () => {
  assert.equal(C.makeBlank("We're on track to meet the deadline.", 'track'), "We're on _____ to meet the deadline.");
  assert.equal(C.makeBlank('Could you send me the report by Friday?', 'friday'), 'Could you send me the report by _____?');
  assert.equal(C.makeBlank('Hello there', 'missing'), null);
  // 단어 일부와 겹치지 않아야 한다
  assert.equal(C.makeBlank('We need to wrap up. Let us wrap things.', 'wrap'), 'We need to _____ up. Let us wrap things.');
  assert.ok(C.isBlankCorrect(' Track ', 'track'));
  assert.ok(!C.isBlankCorrect('tracks', 'track'));
  assert.ok(!C.isBlankCorrect('', 'track'));
});

test('shuffle 은 원본을 바꾸지 않고 같은 원소를 유지한다', () => {
  const a = [1, 2, 3, 4, 5];
  const b = C.shuffle(a, seeded(1));
  assert.deepEqual(a, [1, 2, 3, 4, 5]);
  assert.deepEqual(b.slice().sort(), a);
});

test('reviewCard: 학습할수록 간격이 늘어나고, 다시를 누르면 초기화된다', () => {
  const now = 1_700_000_000_000;
  const DAY = 86400000;
  let card = C.newCard(now);
  assert.equal(card.due, now);

  card = C.reviewCard(card, C.GRADES.GOOD, now);
  assert.equal(card.interval, 1);
  assert.equal(card.due, now + DAY);

  card = C.reviewCard(card, C.GRADES.GOOD, now);
  assert.equal(card.interval, 3);

  card = C.reviewCard(card, C.GRADES.GOOD, now);
  assert.equal(card.interval, Math.round(3 * 2.5));

  const easy = C.reviewCard(card, C.GRADES.EASY, now);
  const good = C.reviewCard(card, C.GRADES.GOOD, now);
  const hard = C.reviewCard(card, C.GRADES.HARD, now);
  assert.ok(easy.interval > good.interval && good.interval > hard.interval);

  const again = C.reviewCard(card, C.GRADES.AGAIN, now);
  assert.equal(again.reps, 0);
  assert.equal(again.due, now + 10 * 60 * 1000);
  assert.ok(again.ease >= 1.3 && again.ease < card.ease);
});

test('describeNext 는 분/일 단위 문구를 돌려준다', () => {
  const now = 0;
  const card = C.newCard(now);
  assert.equal(C.describeNext(card, C.GRADES.AGAIN, now), '10분');
  assert.equal(C.describeNext(card, C.GRADES.GOOD, now), '1일');
});

test('dueCardIds 는 기한이 지난 카드만 오래된 순으로', () => {
  const srs = { a: { due: 30 }, b: { due: 10 }, c: { due: 100 } };
  assert.deepEqual(C.dueCardIds(srs, 50), ['b', 'a']);
});

test('streak: 오늘 또는 어제까지 이어진 연속 학습일', () => {
  const today = new Date(2026, 9, 26);
  const key = (d) => C.dateKey(new Date(2026, 9, d));
  assert.equal(C.streak({}, today), 0);
  assert.equal(C.streak({ [key(26)]: 1, [key(25)]: 2, [key(24)]: 1, [key(22)]: 1 }, today), 3);
  assert.equal(C.streak({ [key(25)]: 1, [key(24)]: 1 }, today), 2);
  assert.equal(C.streak({ [key(23)]: 1 }, today), 0);
  // 월 경계
  const first = new Date(2026, 10, 1);
  assert.equal(C.streak({ [C.dateKey(first)]: 1, [key(31)]: 1 }, first), 2);
});

test('lessonProgress: 네 단계 각 25%, 퀴즈는 80점 이상만 인정', () => {
  assert.equal(C.lessonProgress(undefined), 0);
  assert.equal(C.lessonProgress({ expressions: true, dialogue: false, roleplayBest: null, quizBest: 70 }), 25);
  assert.equal(C.lessonProgress({ expressions: true, dialogue: true, roleplayBest: 0, quizBest: 80 }), 100);
});

test('levelInfo: 누적 XP 로 레벨과 진행률 계산', () => {
  assert.equal(C.levelInfo(0).level, 1);
  assert.equal(C.levelInfo(99).level, 1);
  assert.equal(C.levelInfo(100).level, 2);
  assert.equal(C.levelInfo(300).level, 3);
  const mid = C.levelInfo(200);
  assert.equal(mid.level, 2);
  assert.equal(mid.pct, 50);
  assert.equal(C.levelInfo(1e9).title, 'Global CEO');
});

test('heatmap: 12주 격자, 미래 날짜는 -1, XP 구간별 단계', () => {
  const today = new Date(2026, 9, 28); // 수요일
  const xp = { [C.dateKey(today)]: 70, '2026-10-27': 10, '2026-10-26': 30 };
  const grid = C.heatmap(xp, today, 12);
  assert.equal(grid.length, 12);
  assert.ok(grid.every(col => col.length === 7));
  const last = grid[11];
  assert.equal(last[0].key, '2026-10-25'); // 일요일 시작
  assert.equal(last[1].lv, 2);  // 30xp
  assert.equal(last[2].lv, 1);  // 10xp
  assert.equal(last[3].lv, 3);  // 70xp
  assert.equal(last[4].lv, -1); // 내일
});

test('simResult: 등급 합으로 점수·S~C 등급·역량별 점수', () => {
  const steps = [{ skill: 'polite' }, { skill: 'clear' }, { skill: 'lead' }, { skill: 'lead' }];
  const best = C.simResult(steps, [2, 2, 2, 2]);
  assert.deepEqual([best.pct, best.letter], [100, 'S']);
  const mixed = C.simResult(steps, [2, 1, 2, 0]);
  assert.equal(mixed.pct, 63);
  assert.equal(mixed.letter, 'B');
  assert.deepEqual(mixed.skills, { polite: 100, clear: 50, lead: 50 });
  assert.equal(C.simResult(steps, [null, null, null, null]).letter, 'C');
});

test('speedQuestion: 정답이 보기에 한 번만 있다', () => {
  const pool = [1, 2, 3, 4, 5, 6].map(i => ({ id: 'e' + i, en: 'sentence ' + i, ko: '문장 ' + i }));
  let seed = 7;
  const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < 30; i++) {
    const q = C.speedQuestion(pool, rng, 'e1');
    assert.notEqual(q.id, 'e1');
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.equal(q.options[q.answer], pool.find(e => e.id === q.id).en);
  }
});

test('speedQuestion: 표현에 swaps 가 있으면 정답을 살짝 바꾼 오답이 나온다', () => {
  const pool = [
    { id: 'a', en: 'Could you send me the report by Friday?', ko: '금요일까지 보고서 보내 주시겠어요?', swaps: ['by>until|till', 'Friday>Monday|Thursday'] },
    { id: 'b', en: 'Shall we get started?', ko: '시작할까요?' },
    { id: 'c', en: 'Let me share my screen.', ko: '화면 공유할게요.' },
    { id: 'd', en: 'I think you are on mute.', ko: '음소거 되어 있어요.' }
  ];
  const rng = seeded(5);
  for (let i = 0; i < 20; i++) {
    const q = C.speedQuestion(pool, rng, 'b');
    if (q.id !== 'a') continue;
    assert.equal(q.options.length, 4);
    for (const o of q.options) assert.match(o, /^Could you send me the report (by|until|till) (Friday|Monday|Thursday)\?$/);
  }
});

test('nearMisses: 숫자는 한 곳만 바꾼 서로 다른 오답 3개', () => {
  const s = 'The motor weighs 40 kilograms.';
  const d = C.nearMisses(s, null, seeded(3));
  assert.equal(new Set(d).size, 3);
  for (const x of d) {
    assert.notEqual(x, s);
    assert.equal(C.diffWords(s, x).filter(w => w.diff).length, 1, x);
  }
  assert.deepEqual(C.nearMisses('The flow is 2,000 CFM.', null, seeded(1)).sort(),
    ['The flow is 20,000 CFM.', 'The flow is 200 CFM.', 'The flow is 4,000 CFM.'].sort());
});

test('nearMisses: 두 자리를 바꿀 때는 2×2 조합이라 다수결로 정답이 드러나지 않는다', () => {
  const s = 'This risk has a high severity but a low probability.';
  const d = C.nearMisses(s, ['a high severity>a low severity', 'a low probability>a high probability'], seeded(1));
  assert.deepEqual(d.slice().sort(), [
    'This risk has a high severity but a high probability.',
    'This risk has a low severity but a high probability.',
    'This risk has a low severity but a low probability.'
  ]);
  assert.ok(C.isFairSet(s, d));
  // 보기마다 서로 다른 단어를 바꾸면 정답이 '가장 많이 겹치는 보기'가 되어 드러난다
  assert.equal(C.isFairSet("That's a good point.", ["That's good point.", "That's a good points.", "That's a well point."]), false);
});

test('nearMisses: swaps 가 없으면 반대말·부정으로 바꾸고 의문문 첫 단어는 그대로 둔다', () => {
  assert.deepEqual(C.nearMisses('The valve is open.', null, seeded(2)).sort(),
    ['The valve is closed.', "The valve isn't closed.", "The valve isn't open."].sort());
  const d = C.nearMisses('Can we lower the supply temperature?', null, seeded(4));
  assert.ok(d.length >= 2);
  for (const x of d) assert.match(x, /^Can we /);
  // 약어가 붙은 용어는 약어와 안 맞는 오답이 생기므로 자동으로 바꾸지 않는다
  assert.deepEqual(C.nearMisses('relative humidity (RH)', null, seeded(1)), []);
});

test('distractorsFor: 비슷한 문장이 모자라면 생김새가 비슷한 표현으로 채운다', () => {
  const pool = ['root cause', 'defect', 'roll back', 'corrective action', 'failure rate'].map(en => ({ en: en }));
  for (let k = 1; k <= 10; k++) {
    const d = C.distractorsFor(pool[0], pool, seeded(k));
    assert.equal(d.length, 3);
    assert.equal(new Set(d).size, 3);
    assert.ok(!d.includes('root cause'));
    assert.ok(d.includes('route cause'));
  }
});

test('diffWords: 비슷한 보기에서 다른 단어만 표시하고, 완전히 다른 문장은 표시하지 않는다', () => {
  const w = C.diffWords('Could you send me the report by Friday?', 'Could you send me the report until Friday?');
  assert.deepEqual(w.filter(x => x.diff).map(x => x.text), ['until']);
  assert.ok(C.diffWords('Shall we get started?', 'I think you are on mute.').every(x => !x.diff));
});

test('searchExpressions: 영어·한국어·팁 검색, 트랙·즐겨찾기 필터', () => {
  const lessons = [
    { id: 'a', track: 't1', expressions: [{ id: 'a-1', en: 'Shall we get started?', ko: '시작할까요?' }, { id: 'a-2', en: 'Let us wrap up', ko: '마무리하죠', tip: 'wrap up = 마무리' }] },
    { id: 'b', track: 't2', expressions: [{ id: 'b-1', en: 'You are on mute', ko: '음소거 상태예요' }] }
  ];
  assert.equal(C.searchExpressions(lessons, '').length, 3);
  assert.deepEqual(C.searchExpressions(lessons, 'START').map(r => r.expr.id), ['a-1']);
  assert.deepEqual(C.searchExpressions(lessons, '음소거').map(r => r.expr.id), ['b-1']);
  assert.deepEqual(C.searchExpressions(lessons, '마무리').map(r => r.expr.id), ['a-2']);
  assert.deepEqual(C.searchExpressions(lessons, '', { track: 't2' }).map(r => r.expr.id), ['b-1']);
  assert.deepEqual(C.searchExpressions(lessons, '', { favorites: ['a-2'] }).map(r => r.expr.id), ['a-2']);
});

test('earnedBadges: 학습 기록에서 배지 판정', () => {
  const tracks = [{ id: 't', lessons: ['x', 'y'] }];
  const done = { expressions: true, dialogue: true, roleplayBest: 95, quizBest: 100 };
  assert.deepEqual(C.earnedBadges({ xp: {}, lessons: {} }, tracks), []);
  const ids = C.earnedBadges({
    xp: { [C.dateKey(new Date())]: 30 },
    lessons: { x: done, y: done },
    sim: { s1: 92 },
    stats: { speedBest: 16, reviews: 50, aiTurns: 1, bestStreak: 7 }
  }, tracks);
  for (const id of ['first-step', 'streak-3', 'streak-7', 'lesson-1', 'track-1', 'all-lessons', 'quiz-perfect', 'roleplay-90', 'sim-s', 'speed-15', 'reviews-50', 'ai-chat']) {
    assert.ok(ids.includes(id), id);
  }
});

test('buildQuiz: 기술 용어가 있는 레슨은 용어 문제 2개를 포함한다', () => {
  const { LESSONS } = require('../app/js/data.js');
  const lesson = LESSONS.find(l => l.terms);
  let seed = 3;
  const rng = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const qs = C.buildQuiz(lesson, rng);
  assert.equal(qs.length, 10);
  const termQs = qs.filter(q => /기술 용어/.test(q.prompt));
  assert.equal(termQs.length, 2);
  for (const q of termQs) {
    const term = lesson.terms.find(t => t.ko === q.sub || t.en === q.sub);
    assert.ok(term);
    assert.equal(q.options[q.answer], term.ko === q.sub ? term.en : term.ko);
  }
});

test('searchExpressions: 기술 용어도 검색되고 termsOnly 로 용어만 고를 수 있다', () => {
  const lessons = [{ id: 'x', track: 't', expressions: [{ id: 'x-1', en: 'Find the root cause.', ko: '원인을 찾아요' }],
    terms: [{ id: 'x-t1', en: 'root cause', ko: '근본 원인', ex: 'It was the root cause.', term: true }] }];
  assert.deepEqual(C.searchExpressions(lessons, 'root').map(r => r.expr.id), ['x-1', 'x-t1']);
  assert.deepEqual(C.searchExpressions(lessons, '', { termsOnly: true }).map(r => r.expr.id), ['x-t1']);
  assert.deepEqual(C.searchExpressions(lessons, '근본').map(r => r.expr.id), ['x-t1']);
});
