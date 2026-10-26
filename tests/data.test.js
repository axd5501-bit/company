const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../app/js/core.js');
const { TRACKS, LESSONS } = require('../app/js/data.js');
const SCENARIOS = require('../app/js/scenarios.js');

test('모든 레슨이 정확히 한 트랙에 속하고 레벨이 있다', () => {
  const inTracks = TRACKS.flatMap(t => t.lessons);
  assert.equal(new Set(inTracks).size, inTracks.length, '트랙 간 레슨 중복');
  assert.deepEqual(inTracks.slice().sort(), LESSONS.map(l => l.id).sort());
  for (const l of LESSONS) {
    assert.ok(TRACKS.some(t => t.id === l.track));
    assert.ok(['기초', '중급', '고급'].includes(l.level), `${l.id} 레벨`);
  }
  // 화면 번호 순서 = 트랙 순서
  assert.deepEqual(LESSONS.map(l => l.id), inTracks);
});

test('시뮬레이션 시나리오 형식이 올바르다', () => {
  assert.ok(SCENARIOS.length >= 3);
  assert.equal(new Set(SCENARIOS.map(s => s.id)).size, SCENARIOS.length);
  for (const sc of SCENARIOS) {
    assert.ok(TRACKS.some(t => t.id === sc.track), sc.id);
    assert.ok(sc.steps.length >= 3);
    for (const st of sc.steps) {
      assert.ok(sc.roles[st.s], `${sc.id}: 알 수 없는 화자 ${st.s}`);
      assert.ok(['polite', 'clear', 'lead'].includes(st.skill));
      assert.ok(st.en && st.ko);
      assert.deepEqual(st.choices.map(c => c.grade).sort(), [0, 1, 2], `${sc.id}: 등급 0/1/2 가 하나씩`);
      for (const c of st.choices) {
        assert.ok(c.en && c.feedback && c.reply.en && c.reply.ko);
        if (c.reply.s) assert.ok(sc.roles[c.reply.s], `${sc.id}: 알 수 없는 응답 화자 ${c.reply.s}`);
      }
    }
  }
});

test('기술 용어는 레슨 전체에서 중복되지 않는다', () => {
  const ens = LESSONS.flatMap(l => (l.terms || []).map(t => t.en.toLowerCase()));
  assert.equal(new Set(ens).size, ens.length);
});

test('레슨 id 와 표현 id 가 고유하다', () => {
  const lessonIds = LESSONS.map(l => l.id);
  assert.equal(new Set(lessonIds).size, lessonIds.length);
  const exprIds = LESSONS.flatMap(l => l.expressions.map(e => e.id).concat((l.terms || []).map(t => t.id)));
  assert.equal(new Set(exprIds).size, exprIds.length);
});

for (const lesson of LESSONS) {
  test(`[${lesson.id}] 콘텐츠 형식이 올바르다`, () => {
    for (const key of ['icon', 'title', 'titleEn', 'goal']) assert.ok(lesson[key], `${key} 누락`);
    assert.ok(lesson.expressions.length >= 4, '표현은 4개 이상');

    for (const e of lesson.expressions) {
      assert.ok(e.en && e.ko, `${e.id} 문장 누락`);
      assert.ok(C.makeBlank(e.en, e.blank), `${e.id}: 빈칸 단어 "${e.blank}" 가 문장에 없음`);
      assert.ok(Array.isArray(e.swaps) && e.swaps.length, `${e.id}: 비슷한 오답(swaps) 누락`);
      const ranges = e.swaps.map(sw => {
        const [from, alts] = sw.split('>');
        assert.ok(from && alts, `${e.id}: "${sw}" 는 "바꿀 부분>오답1|오답2" 형식이어야 함`);
        const at = e.en.indexOf(from);
        assert.ok(at !== -1, `${e.id}: "${from}" 가 문장에 없음`);
        for (const a of alts.split('|')) assert.ok(a && a !== from, `${e.id}: 오답 "${a}" 가 비었거나 원문과 같음`);
        return [at, at + from.length];
      });
      ranges.forEach((r, i) => ranges.forEach((q, j) => {
        if (i < j) assert.ok(r[1] <= q[0] || q[1] <= r[0], `${e.id}: swaps 가 서로 겹침`);
      }));
    }

    const d = lesson.dialogue;
    assert.ok(d.roles[d.you], '학습자 역할이 roles 에 없음');
    assert.ok(d.lines.some(ln => ln.s === d.you), '학습자 대사가 없음');
    assert.ok(d.lines.some(ln => ln.s !== d.you), '상대방 대사가 없음');
    for (const ln of d.lines) {
      assert.ok(d.roles[ln.s], `알 수 없는 화자 ${ln.s}`);
      assert.ok(ln.en && ln.ko, '대사 누락');
    }

    if (lesson.terms) {
      assert.ok(lesson.terms.length >= 4, '용어는 4개 이상');
      assert.equal(new Set(lesson.terms.map(t => t.en)).size, lesson.terms.length, '용어 중복');
      for (const t of lesson.terms) assert.ok(t.id && t.en && t.ko && t.def && t.ex, `${lesson.id} 용어 형식`);
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

  test(`[${lesson.id}] 표현마다 살짝 다른 오답 3개가 나오고 다수결로 정답이 드러나지 않는다`, () => {
    for (const e of lesson.expressions) {
      for (let seed = 1; seed <= 12; seed++) {
        let x = seed * 7919;
        const rng = () => { x = (x * 1103515245 + 12345) % 2147483648; return x / 2147483648; };
        const d = C.nearMisses(e.en, e.swaps, rng);
        assert.equal(d.length, 3, `${e.id}: 오답이 3개가 아님 ${JSON.stringify(d)}`);
        assert.equal(new Set(d.concat(e.en)).size, 4, `${e.id}: 보기 중복`);
        assert.ok(C.isFairSet(e.en, d), `${e.id}: 다수결로 정답이 드러남 ${JSON.stringify(d)}`);
      }
    }
  });

  test(`[${lesson.id}] 모범 답안을 그대로 말하면 롤플레이 100점`, () => {
    for (const ln of lesson.dialogue.lines) {
      assert.equal(C.compareSentence(ln.en, ln.en).score, 100, ln.en);
    }
  });
}
