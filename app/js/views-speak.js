/*
 * 스피킹 드릴: 말하기 중심 훈련.
 * 표현마다 ① 듣고 따라 말하기 → ② 한국어만 보고 영어로 말하기. 말하면 바로 단어 단위로 채점하고
 * 80점을 넘으면 다음 단계로 넘어간다. 핸즈프리는 원어민 음성이 끝나면 마이크를 자동으로 켠다.
 * 음성 인식이 없는 환경(PC 설치판, 일부 브라우저)에서는 녹음 비교와 입력으로 연습한다.
 */
(function () {
  'use strict';

  const App = window.App;
  const C = App.C;
  const esc = App.esc;
  const icon = App.icon;

  const PASS = 80;
  const SIZE = 6;
  const STAGES = [
    { id: 'repeat', no: '01', label: '듣고 따라 말하기' },
    { id: 'recall', no: '02', label: '한국어 보고 영어로' }
  ];

  let handsFree = true;

  // ---------- 출제 범위 ----------

  function findLesson(id) { return App.LESSONS.find(function (l) { return l.id === id; }); }

  function itemsFor(source) {
    const lesson = findLesson(source);
    if (lesson) return lesson.expressions.map(function (e) { return e.id; });
    if (source === 'review') {
      const srs = App.state.srs;
      return Object.keys(srs).filter(function (id) { return App.phrase(id); })
        .sort(function (a, b) { return srs[a].due - srs[b].due; });
    }
    if (source === 'favorites') return App.state.favorites.filter(function (id) { return App.phrase(id); });
    return Object.keys(App.EXPRS).filter(function (id) { return source === 'all' || App.EXPRS[id].lesson.track === source; });
  }

  function pickQueue(source) {
    const ids = itemsFor(source);
    if (findLesson(source)) return ids;
    if (source === 'review') return ids.slice(0, SIZE); // 복습 기한이 가까운 것부터
    return C.shuffle(ids, Math.random).slice(0, SIZE);
  }

  function sources(current) {
    const lesson = findLesson(current);
    return (lesson ? [[lesson.id, lesson.icon + ' ' + lesson.title]] : [])
      .concat([['all', '전체 표현']])
      .concat(App.orderedTracks().map(function (t) { return [t.id, t.icon + ' ' + t.title]; }))
      .concat([['review', '복습 카드'], ['favorites', '⭐ 즐겨찾기']]);
  }

  // ---------- 화면 ----------

  App.views.drill = {
    nav: 'practice', tab: 'practice',
    render: function (args) {
      const s = App.session;
      if (!s.dr) s.dr = { phase: 'intro', source: args[0] || 'all' };
      const dr = s.dr;
      if (dr.phase === 'intro') return renderIntro(dr);
      if (dr.phase === 'done') return renderDone(dr);
      return renderPlay(dr);
    },
    after: function () {
      const input = document.getElementById('drill-input');
      if (input) input.focus({ preventScroll: true });
      const dr = App.session.dr;
      if (dr && dr.phase === 'play') App.revealPanel();
    },
    keydown: function (e) {
      const dr = App.session.dr;
      if (!dr || dr.phase !== 'play') return;
      if (e.target.id === 'drill-input') {
        if (e.key === 'Enter') { e.preventDefault(); App.actions['drill-check'](); }
        return;
      }
      if (e.key === ' ' && !/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName)) {
        e.preventDefault();
        if (dr.att && dr.att.result.score >= PASS) next(dr);
        else if (dr.att) retry(dr);
        else if (App.SR) toggleMic(dr);
      }
    }
  };

  function backLink(dr) {
    const lesson = findLesson(dr.source);
    return lesson
      ? '<a class="back" href="#/lesson/' + lesson.id + '">' + icon('back') + esc(lesson.title) + '</a>'
      : '<a class="back" href="#/practice">' + icon('back') + '실전 연습</a>';
  }

  function renderIntro(dr) {
    const chips = sources(dr.source).map(function (src) {
      const n = itemsFor(src[0]).length;
      return '<button class="chip-btn' + (dr.source === src[0] ? ' picked' : '') + '" data-action="drill-source" data-src="' + esc(src[0]) + '"' +
        (n ? '' : ' disabled') + '>' + esc(src[1]) + ' <small>' + n + '</small></button>';
    }).join('');
    const count = findLesson(dr.source) ? itemsFor(dr.source).length : SIZE;
    return backLink(dr) + '<div class="card intro-card"><div class="intro-emoji">🗣️</div><h2>스피킹 드릴</h2>' +
      '<p>표현 ' + count + '개를 두 단계로 소리 내어 연습해요.</p>' +
      '<ol class="drill-flow"><li><b>듣고 따라 말하기</b> 원어민 음성을 듣고 그대로 말해요.</li>' +
      '<li><b>한국어 보고 영어로</b> 뜻만 보고 영어 문장을 떠올려 말해요. 막히면 힌트를 보세요.</li></ol>' +
      (App.SR
        ? '<p class="muted small">말하면 바로 단어별로 채점해요. ' + PASS + '점을 넘으면 다음으로 넘어갑니다.</p>' +
          '<label class="switch"><input type="checkbox" data-change="drill-handsfree"' + (handsFree ? ' checked' : '') + '><span class="track-sw"></span>핸즈프리 — 원어민 음성이 끝나면 마이크 자동으로 켜기</label>'
        : '<p class="warn">이 환경에서는 음성 인식을 쓸 수 없어 <b>녹음 비교</b>와 <b>입력</b>으로 연습해요. ' +
          '말하기 채점은 휴대폰이나 PC의 Chrome·Edge에서 웹 주소로 열면 쓸 수 있어요.</p>') +
      '<div class="eyebrow">연습할 표현</div><div class="chip-row">' + chips + '</div>' +
      '<button class="btn primary large" data-action="drill-start">' + icon('mic') + '시작</button></div>';
  }

  function stepsHtml(dr) {
    return '<div class="drill-steps">' + STAGES.map(function (st, k) {
      return '<span class="drill-step' + (k === dr.stage ? ' on' : k < dr.stage ? ' done' : '') + '"><b>' + st.no + '</b>' + st.label + '</span>';
    }).join('') + '</div>';
  }

  function hintText(en, level) {
    if (!level) return '';
    if (level >= 2) return en;
    const words = en.split(/\s+/);
    return words.slice(0, Math.max(1, Math.ceil(words.length / 3))).join(' ') + ' …';
  }

  function renderPlay(dr) {
    const id = dr.queue[dr.i];
    const p = App.phrase(id);
    const stage = STAGES[dr.stage];
    const progress = '<div class="progress-row"><span>' + (dr.i + 1) + ' / ' + dr.queue.length + '</span>' +
      App.bar(Math.round(((dr.i * 2 + dr.stage) / (dr.queue.length * 2)) * 100)) + '</div>';

    let prompt;
    if (stage.id === 'repeat') {
      prompt = '<div class="eyebrow">듣고 따라 말하세요</div>' + App.sentenceHtml(p.en, p.ipa, 'drill-en') +
        '<p class="muted">' + esc(p.ko) + '</p><div class="actions centered">' + App.speakButtons(p.en) + '</div>';
    } else {
      const hint = hintText(p.en, dr.hint);
      prompt = '<div class="eyebrow">영어로 말해 보세요</div><p class="drill-ko">' + esc(p.ko) + '</p>' +
        (hint ? '<p class="drill-hint">' + esc(hint) + '</p>' : '') +
        (dr.hint < 2 && !dr.att ? '<button class="btn ghost small" data-action="drill-hint">💡 ' + (dr.hint ? '문장 전체 보기' : '힌트') + '</button>' : '');
    }

    let answer;
    if (dr.att) {
      answer = resultHtml(dr, p);
    } else if (App.SR) {
      answer = '<div class="drill-mic"><button class="mic-big' + (dr.listening ? ' on' : '') + '" data-action="drill-mic" aria-label="' + (dr.listening ? '그만 듣기' : '말하기') + '">' + icon('mic') + '</button>' +
        '<p class="mic-status" id="drill-interim">' + (dr.listening ? esc(dr.interim || '듣고 있어요… 말해 보세요') : '마이크를 누르고 말하세요 <kbd>Space</kbd>') + '</p></div>';
    } else if (stage.id === 'repeat') {
      const key = 'drill-' + id;
      answer = '<div class="actions centered">' + App.practiceButtons(key) + '</div>' +
        '<div class="practice-result">' + App.practiceResultHtml(key, p.en) + '</div>' +
        '<div class="actions centered"><button class="btn primary" data-action="drill-next">다음 단계' + icon('arrow') + '</button></div>';
    } else {
      answer = '<div class="composer narrow"><input id="drill-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
        'placeholder="영어로 입력하세요" data-input="drill-typed" value="' + esc(dr.typed || '') + '">' +
        '<button class="btn primary" data-action="drill-check">확인</button></div>';
    }

    return backLink(dr) + progress + '<div class="card drill-card">' + stepsHtml(dr) + prompt + answer + '</div>';
  }

  function resultHtml(dr, p) {
    const r = dr.att.result;
    const pass = r.score >= PASS;
    return '<div class="drill-result ' + (pass ? 'ok' : 'no') + '">' +
      '<div class="drill-score">' + App.scoreBadge(r.score) + '<b>' + (pass ? (r.score >= 95 ? '완벽해요!' : '통과!') : C.scoreLabel(r.score)) + '</b></div>' +
      '<div class="said"><span class="muted small">' + (App.SR ? '내가 말한 문장' : '내가 쓴 문장') + '</span> ' + esc(dr.att.said) + '</div>' +
      '<div class="diff-words">' + App.diffHtml(r) + '</div>' + App.ipaHtml(p.ipa) +
      (pass ? '' : '<p class="muted small">빨간 단어를 다시 들어 보고 말해 보세요.</p>') +
      '<div class="actions">' +
      (pass
        ? '<button class="btn primary" data-action="drill-next">' + (dr.stage === 0 ? '다음 단계' : dr.i + 1 < dr.queue.length ? '다음 표현' : '결과 보기') + icon('arrow') + '</button>' +
          '<button class="btn ghost" data-action="drill-retry">한 번 더</button>'
        : '<button class="btn primary" data-action="drill-retry">' + icon('mic') + (App.SR ? '다시 말하기' : '다시 입력') + '</button>' +
          App.speakButtons(p.en) + '<button class="btn ghost" data-action="drill-next">건너뛰기</button>') +
      '</div></div>';
  }

  function scoreCell(v) {
    if (v == null) return '<span class="muted small">—</span>';
    if (v === 'self') return '<span class="chip">녹음</span>';
    return App.scoreBadge(v);
  }

  function renderDone(dr) {
    const recalls = dr.results.map(function (r) { return typeof r.recall === 'number' ? r.recall : 0; });
    const avg = Math.round(recalls.reduce(function (a, b) { return a + b; }, 0) / Math.max(1, recalls.length));
    const weak = weakIds(dr);
    const rows = dr.results.map(function (r) {
      const p = App.phrase(r.id);
      return '<li class="drill-row"><div class="grow"><p class="en">' + esc(p.en) + '</p><p class="muted small">' + esc(p.ko) + (r.hint ? ' · 힌트 사용' : '') + '</p></div>' +
        '<div class="drill-row-scores"><span class="muted small">따라</span>' + scoreCell(r.repeat) + '<span class="muted small">영어로</span>' + scoreCell(r.recall) + '</div></li>';
    }).join('');
    return backLink(dr) + '<div class="card result-panel"><div class="result-big">' +
      App.ring(avg, 112, avg + '<small>점</small>', avg >= PASS ? 'ok' : 'warn') + '</div>' +
      '<h3>' + (avg >= PASS ? '🎉 입에 붙었어요!' : '조금만 더 소리 내 볼까요?') + '</h3>' +
      '<p class="muted">한국어 보고 영어로 말하기 평균 점수</p>' +
      '<div class="wrong-list"><ul class="plain">' + rows + '</ul>' +
      (weak.length
        ? (dr.saved ? '<p class="muted small">' + icon('check') + ' 복습 카드에 추가했어요</p>'
          : '<button class="btn soft" data-action="drill-save">' + PASS + '점 미만 ' + weak.length + '개 복습 카드에 추가</button>')
        : '') + '</div>' +
      '<div class="actions centered"><button class="btn primary" data-action="drill-start">' + icon('mic') + '다시 하기</button>' +
      '<button class="btn" data-action="drill-intro">범위 바꾸기</button></div></div>';
  }

  function weakIds(dr) {
    return dr.results.filter(function (r) { return !(typeof r.recall === 'number' && r.recall >= PASS); })
      .map(function (r) { return r.id; });
  }

  // ---------- 진행 ----------

  function alive(dr, token) { return App.session.dr === dr && dr.phase === 'play' && (token == null || dr.token === token); }

  function enterStage(dr) {
    const token = dr.token = (dr.token || 0) + 1;
    const p = App.phrase(dr.queue[dr.i]);
    const auto = handsFree && App.SR;
    if (dr.stage === 0) {
      App.tts.speak(p.en).then(function () { if (auto && alive(dr, token) && !dr.att) startListening(dr); });
    } else if (auto) {
      setTimeout(function () { if (alive(dr, token) && !dr.att) startListening(dr); }, 700);
    }
  }

  function startListening(dr) {
    if (!App.SR || dr.listening) return;
    App.tts.stop();
    const token = dr.token = (dr.token || 0) + 1;
    dr.listening = true;
    dr.interim = '';
    App.render();
    App.listen(function (text) {
      if (!alive(dr, token)) return;
      dr.interim = text;
      const el = document.getElementById('drill-interim');
      if (el) el.textContent = text || '듣고 있어요… 말해 보세요';
    }).then(function (text) {
      if (!alive(dr, token)) return;
      dr.listening = false;
      if (!text) {
        App.toast('잘 안 들렸어요. 마이크를 누르고 다시 말해 보세요.');
        App.render();
        return;
      }
      grade(dr, text);
    }).catch(function (err) {
      if (!alive(dr, token)) return;
      dr.listening = false;
      App.toast(err === 'not-allowed' || err === 'service-not-allowed'
        ? '마이크 권한이 필요해요. 브라우저 주소창의 권한 설정을 확인하세요.'
        : '음성 인식에 실패했어요. 다시 시도하세요.');
      App.render();
    });
  }

  function toggleMic(dr) {
    if (dr.listening) App.stopListening();
    else startListening(dr);
  }

  function grade(dr, said) {
    const p = App.phrase(dr.queue[dr.i]);
    const result = C.compareSentence(p.en, said);
    const rec = dr.results[dr.i];
    const key = STAGES[dr.stage].id;
    dr.att = { said: said, result: result };
    rec[key] = Math.max(typeof rec[key] === 'number' ? rec[key] : 0, result.score);
    if (dr.stage === 1 && dr.hint) rec.hint = true;
    App.render();
    if (result.score < PASS) return;
    if (!rec['passed-' + key]) {
      rec['passed-' + key] = true;
      App.award(C.XP.practice);
    }
    if (handsFree && App.SR) {
      const token = dr.token;
      setTimeout(function () { if (alive(dr, token) && dr.att) next(dr); }, 1600);
    }
  }

  function retry(dr) {
    dr.att = null;
    dr.typed = '';
    App.render();
    if (App.SR) startListening(dr);
  }

  function next(dr) {
    dr.token = (dr.token || 0) + 1;
    App.stopAll();
    dr.listening = false;
    dr.att = null;
    dr.typed = '';
    dr.interim = '';
    if (dr.stage === 0) dr.stage = 1;
    else { dr.stage = 0; dr.hint = 0; dr.i++; }
    if (dr.i >= dr.queue.length) return finish(dr);
    App.render();
    enterStage(dr);
  }

  function finish(dr) {
    dr.phase = 'done';
    App.state.stats.drills = (App.state.stats.drills || 0) + 1;
    App.save();
    App.render();
    App.award(C.XP.drillDone);
  }

  // ---------- 액션 ----------

  Object.assign(App.actions, {
    'drill-source': function (el) { App.session.dr.source = el.dataset.src; App.render(); },
    'drill-intro': function () { App.stopAll(); App.session.dr.phase = 'intro'; App.render(); },
    'drill-start': function () {
      const prev = App.session.dr || { source: 'all' };
      const queue = pickQueue(prev.source);
      if (!queue.length) { App.toast('연습할 표현이 없어요. 다른 범위를 골라 주세요.'); return; }
      const dr = {
        phase: 'play', source: prev.source, queue: queue, i: 0, stage: 0, hint: 0,
        results: queue.map(function (id) { return { id: id, repeat: null, recall: null }; }),
        att: null, listening: false, interim: '', typed: '', token: 0
      };
      App.session.dr = dr;
      App.render();
      enterStage(dr);
    },
    'drill-mic': function () { toggleMic(App.session.dr); },
    'drill-retry': function () { retry(App.session.dr); },
    'drill-next': function () {
      const dr = App.session.dr;
      // 음성 인식 없이 녹음으로 따라 해 본 단계는 '녹음'으로 기록
      if (!App.SR && dr.stage === 0 && dr.results[dr.i].repeat == null && App.practice['drill-' + dr.queue[dr.i]]) dr.results[dr.i].repeat = 'self';
      next(dr);
    },
    'drill-hint': function () { const dr = App.session.dr; dr.hint = Math.min(2, dr.hint + 1); App.render(); },
    'drill-check': function () {
      const dr = App.session.dr;
      const input = document.getElementById('drill-input');
      const text = (input ? input.value : dr.typed || '').trim();
      if (!text) return;
      grade(dr, text);
    },
    'drill-save': function () {
      const dr = App.session.dr;
      const now = Date.now();
      weakIds(dr).forEach(function (id) { if (!App.state.srs[id]) App.state.srs[id] = C.newCard(now); });
      dr.saved = true;
      App.save();
      App.toast('복습 카드에 추가했어요.');
      App.render();
    }
  });

  Object.assign(App.changes, {
    'drill-handsfree': function (el) { handsFree = el.checked; },
    'drill-typed': function (el) { App.session.dr.typed = el.value; }
  });

  App.drill = { PASS: PASS, itemsFor: itemsFor, hintText: hintText };
})();
