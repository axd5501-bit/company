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

  // ---------- 비슷한 오답 ----------
  // 정답 문장에서 한두 곳만 바꾼 오답을 만든다. 보기끼리 내용이 너무 다르면 뜻을 몰라도 고를 수 있기 때문.
  // 레슨 표현은 data.js 의 swaps("바꿀 부분>오답1|오답2")를 쓰고, 그 밖의 문장(기술 용어, AI 회의에서 저장한 표현)은
  // 숫자 · 헷갈리는 짝 · 부정 규칙으로 자동으로 바꾼다.

  const CONFUSABLE = [
    ['increase', 'decrease'], ['increased', 'decreased'], ['higher', 'lower'], ['high', 'low'], ['more', 'less'],
    ['maximum', 'minimum'], ['peak', 'average'], ['above', 'below'], ['before', 'after'], ['within', 'outside'],
    ['first', 'last'], ['supply', 'return', 'exhaust'], ['sensible', 'latent'], ['superheat', 'subcooling'],
    ['condenser', 'evaporator'], ['heating', 'cooling'], ['inlet', 'outlet'], ['upsize', 'downsize'],
    ['oversize', 'undersize'], ['open', 'closed'], ['ahead', 'behind'], ['agree', 'disagree'], ['accept', 'reject'],
    ['daily', 'weekly', 'monthly', 'quarterly'], ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    ['morning', 'afternoon', 'evening'], ['always', 'never'], ['strong', 'weak'], ['large', 'small'],
    ['faster', 'slower'], ['better', 'worse'], ['early', 'late'], ['outdoor', 'indoor'], ['internal', 'external'],
    ['static', 'dynamic'], ['primary', 'secondary'], ['rated', 'measured'], ['nominal', 'actual'],
    ['probability', 'severity'], ['correlation', 'causation'], ['latency', 'bandwidth', 'throughput'],
    ['tolerance', 'clearance'], ['root', 'route'], ['upgrade', 'downgrade'], ['relative', 'absolute']
  ];
  const CONFUSABLE_OF = {};
  CONFUSABLE.forEach(function (g) { g.forEach(function (w) { CONFUSABLE_OF[w] = g; }); });

  const NEGATION = {
    is: "isn't", are: "aren't", was: "wasn't", can: "can't", will: "won't", should: "shouldn't",
    does: "doesn't", did: "didn't", do: "don't"
  };
  Object.keys(NEGATION).forEach(function (k) { NEGATION[NEGATION[k]] = k; });

  const NUMBER_RE = /^(\$|±)?(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?)(%|-[a-z]+)?$/i;

  function formatNumber(v, withCommas) {
    const s = String(Number(v.toPrecision(12)));
    return withCommas ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
  }

  /** 숫자 토큰(0.05, 2,000, 15%, $300)을 그럴듯하게 틀린 값으로 */
  function numberAlts(core) {
    const m = core.match(NUMBER_RE);
    if (!m) return [];
    const pre = m[1] || '', raw = m[2], suf = m[3] || '';
    const v = Number(raw.replace(/,/g, ''));
    let vals;
    if (raw.indexOf('.') !== -1) vals = [v * 10, v / 10, v * 2];
    else if (v <= 12) vals = [v + 1, v + 2, v - 1, v + 3];
    else {
      const d = String(v);
      vals = [d[1] !== '0' ? Number(d[1] + d[0] + d.slice(2)) : NaN, v * 10, Math.round(v / 10), v * 2];
    }
    const out = [];
    vals.forEach(function (x) {
      if (!(x > 0)) return;
      const s = pre + formatNumber(x, raw.indexOf(',') !== -1) + suf;
      if (s !== core && out.indexOf(s) === -1) out.push(s);
    });
    return out.slice(0, 3);
  }

  function matchCase(word, like) {
    if (like.length > 1 && like === like.toUpperCase()) return word.toUpperCase();
    if (like[0] !== like[0].toLowerCase()) return word[0].toUpperCase() + word.slice(1);
    return word;
  }

  function isWordChar(c) { return /[A-Za-z0-9]/.test(c || ''); }

  /** sentence 안에서 phrase 가 단어 경계로 처음 나오는 위치 (없으면 -1) */
  function findPhrase(sentence, phrase) {
    let i = sentence.indexOf(phrase);
    while (i !== -1) {
      const okStart = !isWordChar(phrase[0]) || !isWordChar(sentence[i - 1]);
      const okEnd = !isWordChar(phrase[phrase.length - 1]) || !isWordChar(sentence[i + phrase.length]);
      if (okStart && okEnd) return i;
      i = sentence.indexOf(phrase, i + 1);
    }
    return -1;
  }

  /** swaps 문자열 목록 → 바꿀 자리 [{start, end, alts}] */
  function swapSlots(sentence, swaps) {
    const slots = [];
    (swaps || []).forEach(function (sw) {
      const k = sw.indexOf('>');
      if (k < 1) return;
      const from = sw.slice(0, k);
      const start = findPhrase(sentence, from);
      if (start === -1) return;
      const alts = sw.slice(k + 1).split('|').filter(function (a) { return a && a !== from; });
      if (alts.length) slots.push({ start: start, end: start + from.length, alts: alts });
    });
    return slots;
  }

  /** 규칙으로 찾은 바꿀 자리: 숫자, 헷갈리는 짝, 부정(첫 단어 제외 — 의문문은 그대로) */
  function autoSlots(sentence) {
    const slots = [];
    const lower = ' ' + sentence.toLowerCase().replace(/[^a-z0-9']+/g, ' ') + ' ';
    const re = /\S+/g;
    let m, index = 0;
    while ((m = re.exec(sentence))) {
      const parts = m[0].match(/^([^A-Za-z0-9$±]*)(.*?)([^A-Za-z0-9%]*)$/);
      const core = parts[2].replace(/’/g, "'");
      const start = m.index + parts[1].length;
      const key = core.toLowerCase();
      let alts = numberAlts(core);
      if (!alts.length && CONFUSABLE_OF[key]) {
        alts = CONFUSABLE_OF[key].filter(function (w) { return w !== key && lower.indexOf(' ' + w + ' ') === -1; })
          .map(function (w) { return matchCase(w, core); });
      }
      if (!alts.length && index > 0 && NEGATION[key]) alts = [matchCase(NEGATION[key], core)];
      if (core && alts.length) slots.push({ start: start, end: start + parts[2].length, alts: alts });
      index++;
    }
    return slots;
  }

  function applySlots(sentence, picks) {
    return picks.slice().sort(function (a, b) { return b[0].start - a[0].start; }).reduce(function (s, p) {
      return s.slice(0, p[0].start) + p[1] + s.slice(p[0].end);
    }, sentence);
  }

  function pickOne(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }

  function wordKeys(text) { return String(text).split(/\s+/).filter(Boolean).map(wordKey); }

  /**
   * 보기 4개 중 '다른 보기들과 단어가 가장 많이 겹치는 것'을 고르는 요령으로 정답이 나오지 않는지.
   * (예: That's a good point / good point / a good points / a well point → 정답이 다수결로 드러남)
   */
  function isFairSet(correct, wrong) {
    const all = [correct].concat(wrong).map(wordKeys);
    const score = all.map(function (w, i) {
      return all.reduce(function (s, o, j) { return i === j ? s : s + lcsMatches(w, o).size; }, 0);
    });
    return score.slice(1).some(function (s) { return s >= score[0]; });
  }

  function combos3(arr) {
    const out = [];
    for (let i = 0; i < arr.length; i++) for (let j = i + 1; j < arr.length; j++) for (let k = j + 1; k < arr.length; k++) out.push([arr[i], arr[j], arr[k]]);
    return out;
  }

  /**
   * 정답 문장을 살짝 바꾼 오답 (최대 3개). 가능한 조합을 모두 만든 뒤 다수결 요령이 통하지 않는 것 중에서 고른다.
   * - 한 자리만 바꿀 때: 그 자리에 서로 다른 값 3개 (보기 4개가 모두 같은 곳만 다름)
   * - 두 자리 A·B 를 바꿀 때: A만 / B만 / A+B (2×2 — 어느 보기도 다수 쪽이 아님)
   */
  function nearMisses(sentence, swaps, rng) {
    rng = rng || Math.random;
    let slots = swapSlots(sentence, swaps);
    const enough = function (ss) { return ss.length >= 2 || ss.some(function (s) { return s.alts.length >= 3; }); };
    // "relative humidity (RH)" → "absolute humidity (RH)" 처럼 약어가 안 맞으면 오답이 티 나므로 자동 변형하지 않는다
    if (!enough(slots) && !/\([A-Z]/.test(sentence)) {
      const taken = slots;
      slots = slots.concat(shuffle(autoSlots(sentence), rng).slice(0, 6).filter(function (a) {
        return taken.every(function (h) { return a.end <= h.start || a.start >= h.end; });
      }));
    }
    const one = function (s, alt) { return applySlots(sentence, [[s, alt]]); };
    const clean = function (set) {
      return set.filter(function (x, i) { return x !== sentence && set.indexOf(x) === i; });
    };
    const singles = [], pairs = [];
    slots.forEach(function (s) {
      if (s.alts.length >= 3) combos3(s.alts.slice(0, 5)).forEach(function (c) { singles.push(clean(c.map(function (alt) { return one(s, alt); }))); });
    });
    for (let i = 0; i < slots.length; i++) {
      for (let j = i + 1; j < slots.length; j++) {
        slots[i].alts.forEach(function (a) {
          slots[j].alts.forEach(function (b) {
            pairs.push(clean([one(slots[i], a), one(slots[j], b), applySlots(sentence, [[slots[i], a], [slots[j], b]])]));
          });
        });
      }
    }
    const full = function (set) { return set.length === 3 && isFairSet(sentence, set); };
    const fairSingles = singles.filter(full), fairPairs = pairs.filter(full);
    let group = fairSingles.length && (!fairPairs.length || rng() < 0.5) ? fairSingles : fairPairs;
    if (!group.length) group = singles.concat(pairs).filter(function (set) { return set.length; });
    if (!group.length && slots.length) group = [clean(slots[0].alts.map(function (alt) { return one(slots[0], alt); }))];
    return group.length ? pickOne(group, rng) : [];
  }

  function uniqueTokens(text) {
    return tokenize(text).filter(function (t, i, a) { return a.indexOf(t) === i; });
  }

  /** 생김새가 얼마나 비슷한지 (단어 겹침 + 길이 + 같은 종류) 0~1 */
  function similarity(a, b) {
    const ta = uniqueTokens(a.en), tb = uniqueTokens(b.en);
    const inter = ta.filter(function (t) { return tb.indexOf(t) !== -1; }).length;
    const union = ta.length + tb.length - inter;
    const la = a.en.length, lb = b.en.length;
    return 0.6 * (union ? inter / union : 0) + 0.3 * (1 - Math.abs(la - lb) / Math.max(la, lb, 1)) +
      (!!a.term === !!b.term ? 0.1 : 0);
  }

  /** item({en, swaps?, term?}) 의 오답 n개: 비슷한 문장이 우선, 모자라면 pool 에서 생김새가 비슷한 표현 */
  function distractorsFor(item, pool, rng, n) {
    rng = rng || Math.random;
    n = n || 3;
    const out = [];
    const seen = {};
    const add = function (en) {
      const k = tokenize(en).join(' ');
      if (!k || seen[k] || out.length >= n) return;
      seen[k] = true;
      out.push(en);
    };
    seen[tokenize(item.en).join(' ')] = true;
    nearMisses(item.en, item.swaps, rng).forEach(add);
    if (out.length < n) {
      const ranked = pool.filter(function (p) { return p !== item && p.en; })
        .map(function (p) { return { en: p.en, score: similarity(item, p) }; })
        .sort(function (a, b) { return b.score - a.score; });
      const top = Math.max(6, (n - out.length) * 2);
      shuffle(ranked.slice(0, top), rng).concat(ranked.slice(top)).forEach(function (p) { add(p.en); });
    }
    return out;
  }

  function wordKey(w) {
    return w.toLowerCase().replace(/’/g, "'").replace(/^[^a-z0-9$±가-힣]+|[^a-z0-9%가-힣]+$/g, '');
  }

  /**
   * other 의 단어 중 base 와 다른 단어 표시. 보기끼리 차이를 눈으로 확인하게 한다.
   * 절반 넘게 다르면(완전히 다른 문장) 표시하지 않는다.
   */
  function diffWords(base, other) {
    const ow = String(other).split(/\s+/).filter(Boolean);
    const bw = String(base).split(/\s+/).filter(Boolean);
    const matched = lcsMatches(ow.map(wordKey), bw.map(wordKey));
    const changed = ow.length - matched.size;
    const show = changed > 0 && changed * 2 <= Math.max(ow.length, bw.length);
    return ow.map(function (w, i) { return { text: w, diff: show && !matched.has(i) }; });
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

    // 기술 용어가 있는 레슨은 용어 문제 2개 (뜻 → 용어, 용어 → 뜻)
    const terms = lesson.terms || [];
    if (terms.length >= 4) {
      const picked = shuffle(terms, rng).slice(0, 2);
      const others = shuffle(terms.filter(function (x) { return x !== picked[1]; }), rng).slice(0, 3);
      const q1 = choiceQuestion('다음 뜻의 기술 용어는?', picked[0].en, distractorsFor(picked[0], terms, rng), rng, picked[0].ex);
      q1.sub = picked[0].ko;
      const q2 = choiceQuestion('다음 기술 용어의 뜻은?', picked[1].ko, others.map(function (x) { return x.ko; }), rng, picked[1].ex);
      q2.sub = picked[1].en;
      qs.push(q1, q2);
    }

    const types = ['ko2en', 'blank', 'order'];
    const exprs = shuffle(lesson.expressions, rng);
    for (let i = 0; qs.length < count && i < exprs.length; i++) {
      const e = exprs[i];
      const type = types[i % types.length];
      if (type === 'ko2en') {
        const q = choiceQuestion('다음 뜻에 맞는 영어 표현은?', e.en, distractorsFor(e, lesson.expressions, rng), rng, e.tip);
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

  // ---------- 경험치 · 레벨 ----------

  const XP = {
    practice: 5,       // 표현 따라 말하기
    dialogue: 20,      // 대화 듣기 완료
    expressions: 20,   // 표현 학습 완료
    roleplayTurn: 10,  // 롤플레이 한 턴
    quizCorrect: 5,    // 퀴즈 정답
    quizPass: 30,      // 퀴즈 통과 보너스
    review: 3,         // 복습 카드 한 장
    simStep: 5,        // 시뮬레이션 선택 (등급 × 5)
    simDone: 30,       // 시뮬레이션 완료
    speedCorrect: 2,   // 스피드 챌린지 정답
    aiTurn: 10         // AI 회의 파트너와 한 턴
  };
  const DAILY_GOAL = 60;

  const LEVEL_TITLES = [
    ['Intern', '인턴'], ['Junior Associate', '주니어'], ['Associate', '어소시에이트'],
    ['Senior Associate', '시니어'], ['Team Lead', '팀 리드'], ['Manager', '매니저'],
    ['Senior Manager', '시니어 매니저'], ['Director', '디렉터'], ['Vice President', 'VP'], ['Global CEO', '글로벌 CEO']
  ];

  /** 레벨 n 에 도달하는 데 필요한 누적 XP (1레벨 0, 2레벨 100, 3레벨 300, ...) */
  function xpForLevel(n) { return 50 * (n - 1) * n; }

  function levelInfo(totalXp) {
    let level = 1;
    while (totalXp >= xpForLevel(level + 1)) level++;
    const base = xpForLevel(level), next = xpForLevel(level + 1);
    const t = LEVEL_TITLES[Math.min(level, LEVEL_TITLES.length) - 1];
    return {
      level: level, title: t[0], titleKo: t[1], xp: totalXp, base: base, next: next,
      pct: Math.round(((totalXp - base) / (next - base)) * 100)
    };
  }

  function sumValues(obj) {
    return Object.keys(obj || {}).reduce(function (s, k) { return s + (obj[k] || 0); }, 0);
  }

  /** 최근 weeks 주의 일별 XP 를 주(열) × 요일(행) 격자로. 각 칸 lv 0~4 */
  function heatmap(xpByDay, today, weeks) {
    weeks = weeks || 12;
    const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const start = new Date(end);
    start.setDate(end.getDate() - end.getDay() - (weeks - 1) * 7); // 일요일부터
    const cols = [];
    const d = new Date(start);
    for (let w = 0; w < weeks; w++) {
      const col = [];
      for (let i = 0; i < 7; i++) {
        const key = dateKey(d);
        const xp = (xpByDay && xpByDay[key]) || 0;
        const lv = d > end ? -1 : xp === 0 ? 0 : xp < 20 ? 1 : xp < DAILY_GOAL ? 2 : xp < DAILY_GOAL * 2 ? 3 : 4;
        col.push({ key: key, xp: xp, lv: lv });
        d.setDate(d.getDate() + 1);
      }
      cols.push(col);
    }
    return cols;
  }

  // ---------- 회의 시뮬레이션 ----------

  const SKILLS = { polite: '정중함', clear: '명확성', lead: '주도성' };

  /** grades: 단계별 선택 등급(0~2, 시간 초과는 0) */
  function simResult(steps, grades) {
    const per = {};
    Object.keys(SKILLS).forEach(function (k) { per[k] = { got: 0, max: 0 }; });
    let got = 0;
    steps.forEach(function (st, i) {
      const g = grades[i] || 0;
      got += g;
      per[st.skill].got += g;
      per[st.skill].max += 2;
    });
    const pct = steps.length ? Math.round((got / (steps.length * 2)) * 100) : 0;
    const skills = {};
    Object.keys(per).forEach(function (k) {
      if (per[k].max) skills[k] = Math.round((per[k].got / per[k].max) * 100);
    });
    const letter = pct >= 90 ? 'S' : pct >= 75 ? 'A' : pct >= 55 ? 'B' : 'C';
    return { pct: pct, letter: letter, skills: skills };
  }

  // ---------- 스피드 챌린지 ----------

  /** 표현 풀에서 한국어 → 영어 4지선다 한 문제 (오답은 정답을 살짝 바꾼 문장) */
  function speedQuestion(pool, rng, avoidId) {
    const candidates = pool.filter(function (e) { return e.id !== avoidId; });
    const target = candidates[Math.floor(rng() * candidates.length)];
    const wrong = distractorsFor(target, pool.filter(function (e) { return e.id !== target.id; }), rng);
    const options = shuffle([target.en].concat(wrong), rng);
    return { id: target.id, ko: target.ko, options: options, answer: options.indexOf(target.en) };
  }

  // ---------- 표현 사전 ----------

  function searchExpressions(lessons, query, opts) {
    opts = opts || {};
    const q = String(query || '').trim().toLowerCase();
    const out = [];
    lessons.forEach(function (l) {
      if (opts.track && l.track !== opts.track) return;
      const items = opts.termsOnly ? (l.terms || []) : l.expressions.concat(l.terms || []);
      items.forEach(function (e) {
        if (opts.favorites && opts.favorites.indexOf(e.id) === -1) return;
        if (q && (e.en + ' ' + e.ko + ' ' + (e.tip || '') + ' ' + (e.ex || '')).toLowerCase().indexOf(q) === -1) return;
        out.push({ expr: e, lesson: l });
      });
    });
    return out;
  }

  // ---------- 배지 ----------

  const BADGES = [
    { id: 'first-step', icon: '🌱', title: '첫 걸음', desc: '처음으로 학습을 시작했어요', test: function (s) { return s.totalXp > 0; } },
    { id: 'streak-3', icon: '🔥', title: '3일 연속', desc: '3일 연속 학습', test: function (s) { return s.bestStreak >= 3; } },
    { id: 'streak-7', icon: '🏅', title: '일주일 개근', desc: '7일 연속 학습', test: function (s) { return s.bestStreak >= 7; } },
    { id: 'lesson-1', icon: '📘', title: '첫 레슨 완료', desc: '레슨 하나의 4단계를 모두 마쳤어요', test: function (s) { return s.lessonsDone >= 1; } },
    { id: 'track-1', icon: '🧭', title: '트랙 완주', desc: '한 트랙의 레슨 3개를 모두 완료', test: function (s) { return s.tracksDone >= 1; } },
    { id: 'all-lessons', icon: '🏆', title: '전 과정 수료', desc: '모든 레슨 완료', test: function (s) { return s.lessonsDone >= s.lessonsTotal; } },
    { id: 'quiz-perfect', icon: '💯', title: '퀴즈 만점', desc: '퀴즈에서 100점', test: function (s) { return s.quizPerfect; } },
    { id: 'roleplay-90', icon: '🎭', title: '롤플레이 에이스', desc: '롤플레이 평균 90점 이상', test: function (s) { return s.roleplayBest >= 90; } },
    { id: 'sim-s', icon: '🎬', title: '회의의 신', desc: '회의 시뮬레이션 S등급', test: function (s) { return s.simBest >= 90; } },
    { id: 'speed-15', icon: '⚡', title: '순발력 왕', desc: '스피드 챌린지 15점 이상', test: function (s) { return s.speedBest >= 15; } },
    { id: 'reviews-50', icon: '🧠', title: '기억의 달인', desc: '복습 카드 50장', test: function (s) { return s.reviews >= 50; } },
    { id: 'ai-chat', icon: '🤖', title: 'AI와 첫 회의', desc: 'AI 회의 파트너와 대화', test: function (s) { return s.aiTurns >= 1; } }
  ];

  function maxValue(obj) {
    return Object.keys(obj || {}).reduce(function (m, k) { return Math.max(m, obj[k] || 0); }, 0);
  }

  /** 저장된 학습 상태에서 배지 판정에 필요한 수치 */
  function learnerStats(state, tracks) {
    const lessons = state.lessons || {};
    const done = Object.keys(lessons).filter(function (id) { return lessonProgress(lessons[id]) === 100; });
    const tracksDone = tracks.filter(function (t) {
      return t.lessons.every(function (id) { return done.indexOf(id) !== -1; });
    }).length;
    const st = state.stats || {};
    return {
      totalXp: sumValues(state.xp),
      bestStreak: Math.max(st.bestStreak || 0, streak(state.xp || {}, new Date())),
      lessonsDone: done.length,
      lessonsTotal: tracks.reduce(function (n, t) { return n + t.lessons.length; }, 0),
      tracksDone: tracksDone,
      quizPerfect: Object.keys(lessons).some(function (id) { return lessons[id].quizBest === 100; }),
      roleplayBest: Object.keys(lessons).reduce(function (m, id) { return Math.max(m, lessons[id].roleplayBest || 0); }, 0),
      simBest: maxValue(state.sim),
      speedBest: st.speedBest || 0,
      reviews: st.reviews || 0,
      aiTurns: st.aiTurns || 0
    };
  }

  function earnedBadges(state, tracks) {
    const s = learnerStats(state, tracks);
    return BADGES.filter(function (b) { return b.test(s); }).map(function (b) { return b.id; });
  }

  return {
    XP: XP,
    DAILY_GOAL: DAILY_GOAL,
    xpForLevel: xpForLevel,
    levelInfo: levelInfo,
    sumValues: sumValues,
    heatmap: heatmap,
    SKILLS: SKILLS,
    simResult: simResult,
    speedQuestion: speedQuestion,
    searchExpressions: searchExpressions,
    BADGES: BADGES,
    learnerStats: learnerStats,
    earnedBadges: earnedBadges,
    tokenize: tokenize,
    compareSentence: compareSentence,
    scoreLabel: scoreLabel,
    shuffle: shuffle,
    makeBlank: makeBlank,
    isBlankCorrect: isBlankCorrect,
    nearMisses: nearMisses,
    isFairSet: isFairSet,
    distractorsFor: distractorsFor,
    diffWords: diffWords,
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
