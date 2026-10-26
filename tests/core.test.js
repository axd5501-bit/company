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
