const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../app/js/core.js');
const LESSONS = require('../app/js/data.js');

test('레슨 id 와 표현 id 가 고유하다', () => {
  const lessonIds = LESSONS.map(l => l.id);
  assert.equal(new Set(lessonIds).size, lessonIds.length);
  const exprIds = LESSONS.flatMap(l => l.expressions.map(e => e.id));
  assert.equal(new Set(exprIds).size, exprIds.length);
});

for (const lesson of LESSONS) {
  test(`[${lesson.id}] 콘텐츠 형식이 올바르다`, () => {
    for (const key of ['icon', 'title', 'titleEn', 'goal']) assert.ok(lesson[key], `${key} 누락`);
    assert.ok(lesson.expressions.length >= 4, '표현은 4개 이상');

    for (const e of lesson.expressions) {
      assert.ok(e.en && e.ko, `${e.id} 문장 누락`);
      assert.ok(C.makeBlank(e.en, e.blank), `${e.id}: 빈칸 단어 "${e.blank}" 가 문장에 없음`);
    }

    const d = lesson.dialogue;
    assert.ok(d.roles[d.you], '학습자 역할이 roles 에 없음');
    assert.ok(d.lines.some(ln => ln.s === d.you), '학습자 대사가 없음');
    assert.ok(d.lines.some(ln => ln.s !== d.you), '상대방 대사가 없음');
    for (const ln of d.lines) {
      assert.ok(d.roles[ln.s], `알 수 없는 화자 ${ln.s}`);
      assert.ok(ln.en && ln.ko, '대사 누락');
    }

    for (const s of lesson.situations) {
      assert.equal(s.options.length, 4);
      assert.ok(s.answer >= 0 && s.answer < s.options.length);
      assert.equal(new Set(s.options).size, 4, '보기 중복');
    }
  });

  test(`[${lesson.id}] 퀴즈가 10문제로 만들어지고 정답이 유효하다`, () => {
    for (let seed = 1; seed <= 20; seed++) {
      let x = seed;
      const rng = () => { x = (x * 16807) % 2147483647; return x / 2147483647; };
      const qs = C.buildQuiz(lesson, rng);
      assert.equal(qs.length, 10);
      for (const q of qs) {
        if (q.type === 'choice') {
          assert.equal(new Set(q.options).size, q.options.length, '보기 중복');
          assert.ok(q.options[q.answer] !== undefined);
        } else if (q.type === 'blank') {
          assert.ok(q.sentence.includes('_____'));
          assert.ok(C.isBlankCorrect(q.answer, q.answer));
        } else {
          assert.equal(q.type, 'order');
          assert.deepEqual(q.words.slice().sort(), q.answer.slice().sort());
        }
      }
    }
  });

  test(`[${lesson.id}] 모범 답안을 그대로 말하면 롤플레이 100점`, () => {
    for (const ln of lesson.dialogue.lines) {
      assert.equal(C.compareSentence(ln.en, ln.en).score, 100, ln.en);
    }
  });
}
