/*
 * 화면과 무관한 순수 로직 (채점, 퀴즈 생성, 간격 반복 복습, 학습 기록).
 * 브라우저에서는 window.BizCore, Node(테스트)에서는 require 로 사용.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.BizCore = api;
})(this, function () {
  'use strict';

  const DAY = 24 * 60 * 60 * 1000;

  // ---------- 문장 비교 ----------

  const NUMBER_WORDS = {
    zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7',
    eight: '8', nine: '9', ten: '10', eleven: '11', twelve: '12', thirteen: '13', fourteen: '14',
    fifteen: '15', sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20',
    thirty: '30', forty: '40', fifty: '50', hundred: '100'
  };
  const IS_CONTRACTIONS = ['it', 'that', 'what', 'who', 'there', 'here', 'he', 'she', 'where', 'how'];

  function expandWord(w) {
    if (w === "won't") return ['will', 'not'];
    if (w === "can't" || w === 'cannot') return ['can', 'not'];
    if (w === "let's") return ['let', 'us'];
    if (w === 'ok') return ['okay'];
    let m;
    if ((m = w.match(/^(\w+)n't$/))) return [m[1], 'not'];
    if ((m = w.match(/^(\w+)'m$/))) return [m[1], 'am'];
    if ((m = w.match(/^(\w+)'re$/))) return [m[1], 'are'];
    if ((m = w.match(/^(\w+)'ll$/))) return [m[1], 'will'];
    if ((m = w.match(/^(\w+)'d$/))) return [m[1], 'would'];
    if ((m = w.match(/^(\w+)'ve$/))) return [m[1], 'have'];
    if ((m = w.match(/^(\w+)'s$/)) && IS_CONTRACTIONS.indexOf(m[1]) !== -1) return [m[1], 'is'];
    if (NUMBER_WORDS[w]) return [NUMBER_WORDS[w]];
    return [w];
  }

  /** 비교용 토큰 배열. 축약형을 풀고 숫자 단어를 숫자로 바꿔 표기 차이를 무시한다. */
  function tokenize(text) {
    const cleaned = String(text || '')
      .toLowerCase()
      .replace(/[‘’]/g, "'")
      .replace(/%/g, ' percent ')
      .replace(/[^a-z0-9'\s]/g, ' ');
    const out = [];
    cleaned.split(/\s+/).forEach(function (raw) {
      const w = raw.replace(/^'+|'+$/g, '');
      if (w) expandWord(w).forEach(function (t) { out.push(t); });
    });
    return out;
  }

  /** 두 토큰 배열의 최장 공통 부분열에서 a 쪽 일치 인덱스 집합. */
  function lcsMatches(a, b) {
    const n = a.length, m = b.length;
    const dp = [];
    for (let i = 0; i <= n; i++) dp.push(new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const matched = new Set();
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i] === b[j]) { matched.add(i); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
      else j++;
    }
    return matched;
  }

  /**
   * 모범 답안과 학습자 답안 비교.
   * score: 0~100 (단어 일치 F1), words: 모범 답안 원문 단어별 일치 여부
   */
  function compareSentence(expected, actual) {
    const words = String(expected).split(/\s+/).filter(Boolean);
    const expTokens = [], owner = [];
    words.forEach(function (w, wi) {
      tokenize(w).forEach(function (t) { expTokens.push(t); owner.push(wi); });
    });
    const actTokens = tokenize(actual);
    const matched = lcsMatches(expTokens, actTokens);

    const okWords = words.map(function () { return true; });
    owner.forEach(function (wi, ti) { if (!matched.has(ti)) okWords[wi] = false; });

    const total = expTokens.length + actTokens.length;
    const score = total === 0 ? 0 : Math.round((200 * matched.size) / total);
    return {
      score: score,
      words: words.map(function (w, i) { return { text: w, ok: okWords[i] }; })
    };
  }

  function scoreLabel(score) {
    if (score >= 90) return '완벽해요!';
    if (score >= 70) return '좋아요!';
    if (score >= 50) return '조금만 더!';
    return '다시 도전해 보세요';
  }

  // ---------- 퀴즈 ----------

  function shuffle(arr, rng) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  /** 문장에서 word 첫 등장 위치를 빈칸으로. 없으면 null. */
  function makeBlank(sentence, word) {
    const re = new RegExp('\\b' + escapeRegExp(word) + '\\b', 'i');
    if (!re.test(sentence)) return null;
    return sentence.replace(re, '_____');
  }

  function isBlankCorrect(input, word) {
    const a = tokenize(input), b = tokenize(word);
    return a.length > 0 && a.join(' ') === b.join(' ');
  }

  function choiceQuestion(prompt, correct, distractors, rng, explain) {
    const options = shuffle([correct].concat(distractors), rng);
    return { type: 'choice', prompt: prompt, options: options, answer: options.indexOf(correct), explain: explain || '' };
  }

  /**
   * 레슨 하나로 퀴즈 생성. 상황 문제 + 표현 기반 문제(뜻 고르기 / 빈칸 / 어순)를 섞는다.
   */
  function buildQuiz(lesson, rng, count) {
    rng = rng || Math.random;
    count = count || 10;
    const qs = lesson.situations.map(function (s) {
      return choiceQuestion(s.q, s.options[s.answer],
        s.options.filter(function (_, i) { return i !== s.answer; }), rng, s.explain);
    });

    const types = ['ko2en', 'blank', 'order'];
    const exprs = shuffle(lesson.expressions, rng);
    for (let i = 0; qs.length < count && i < exprs.length; i++) {
      const e = exprs[i];
      const type = types[i % types.length];
      if (type === 'ko2en') {
        const others = shuffle(lesson.expressions.filter(function (x) { return x !== e; }), rng)
          .slice(0, 3).map(function (x) { return x.en; });
        const q = choiceQuestion('다음 뜻에 맞는 영어 표현은?', e.en, others, rng, e.tip);
        q.sub = e.ko;
        qs.push(q);
      } else if (type === 'blank') {
        qs.push({ type: 'blank', prompt: '빈칸에 들어갈 단어를 입력하세요.', sub: e.ko,
          sentence: makeBlank(e.en, e.blank), answer: e.blank, full: e.en, explain: e.tip || '' });
      } else {
        const words = e.en.split(/\s+/);
        let shuffled = shuffle(words, rng);
        for (let k = 0; k < 5 && shuffled.join(' ') === words.join(' '); k++) shuffled = shuffle(words, rng);
        qs.push({ type: 'order', prompt: '단어를 순서대로 눌러 문장을 완성하세요.', sub: e.ko,
          words: shuffled, answer: words, full: e.en, explain: e.tip || '' });
      }
    }
    return shuffle(qs, rng);
  }

  // ---------- 간격 반복 복습 (SM-2 간소화) ----------

  const GRADES = { AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 };

  function newCard(now) {
    return { ease: 2.5, interval: 0, reps: 0, due: now };
  }

  /** grade 에 따라 다음 복습 일정을 계산한 새 카드 반환 */
  function reviewCard(card, grade, now) {
    const c = Object.assign({}, card);
    if (grade === GRADES.AGAIN) {
      c.reps = 0;
      c.interval = 0;
      c.ease = Math.max(1.3, c.ease - 0.2);
      c.due = now + 10 * 60 * 1000;
      return c;
    }
    if (grade === GRADES.HARD) {
      c.interval = Math.max(1, Math.round(c.interval * 1.2));
      c.ease = Math.max(1.3, c.ease - 0.15);
    } else {
      let next = c.reps === 0 ? 1 : c.reps === 1 ? 3 : Math.round(c.interval * c.ease);
      if (grade === GRADES.EASY) {
        next = Math.round(next * 1.3) + 1;
        c.ease += 0.15;
      }
      c.interval = Math.max(1, next);
    }
    c.reps += 1;
    c.due = now + c.interval * DAY;
    return c;
  }

  /** 버튼에 보여줄 '다음 복습까지' 문구 */
  function describeNext(card, grade, now) {
    const ms = reviewCard(card, grade, now).due - now;
    if (ms < DAY) return Math.round(ms / 60000) + '분';
    return Math.round(ms / DAY) + '일';
  }

  function dueCardIds(srs, now) {
    return Object.keys(srs)
      .filter(function (id) { return srs[id].due <= now; })
      .sort(function (a, b) { return srs[a].due - srs[b].due; });
  }

  // ---------- 학습 기록 ----------

  function dateKey(d) {
    const pad = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  /** 오늘(또는 어제)까지 이어진 연속 학습일 수 */
  function streak(activity, today) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (!activity[dateKey(d)]) d.setDate(d.getDate() - 1);
    let n = 0;
    while (activity[dateKey(d)]) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  const QUIZ_PASS = 80;

  /** 레슨 진행률: 표현 학습 / 대화 듣기 / 롤플레이 / 퀴즈 80점 이상, 각 25% */
  function lessonProgress(ls) {
    if (!ls) return 0;
    let p = 0;
    if (ls.expressions) p += 25;
    if (ls.dialogue) p += 25;
    if (ls.roleplayBest != null) p += 25;
    if (ls.quizBest != null && ls.quizBest >= QUIZ_PASS) p += 25;
    return p;
  }

  return {
    tokenize: tokenize,
    compareSentence: compareSentence,
    scoreLabel: scoreLabel,
    shuffle: shuffle,
    makeBlank: makeBlank,
    isBlankCorrect: isBlankCorrect,
    buildQuiz: buildQuiz,
    GRADES: GRADES,
    newCard: newCard,
    reviewCard: reviewCard,
    describeNext: describeNext,
    dueCardIds: dueCardIds,
    dateKey: dateKey,
    streak: streak,
    QUIZ_PASS: QUIZ_PASS,
    lessonProgress: lessonProgress
  };
});
