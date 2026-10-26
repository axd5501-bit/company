/* 화면 렌더링과 사용자 상호작용 */
(function () {
  'use strict';

  const C = window.BizCore;
  const LESSONS = window.LESSONS;
  const STORE_KEY = 'biztalk.v1';
  const IS_ELECTRON = /Electron/i.test(navigator.userAgent);
  // 음성 인식은 Chrome/Edge 브라우저에서만 동작한다 (Electron 에는 인식 서버 키가 없음)
  const SR = IS_ELECTRON ? null : (window.SpeechRecognition || window.webkitSpeechRecognition || null);
  const CAN_RECORD = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

  const EXPRS = {};
  LESSONS.forEach(function (l) {
    l.expressions.forEach(function (e) { EXPRS[e.id] = { expr: e, lesson: l }; });
  });
  const TOTAL_EXPRS = Object.keys(EXPRS).length;

  const TABS = [
    { id: 'expressions', label: '① 핵심 표현' },
    { id: 'dialogue', label: '② 대화 듣기' },
    { id: 'roleplay', label: '③ 롤플레이' },
    { id: 'quiz', label: '④ 퀴즈' }
  ];

  const app = document.getElementById('app');

  // ---------- 저장 ----------

  function defaultState() {
    return { name: '', settings: { voice: '', rate: 0.95 }, lessons: {}, srs: {}, activity: {} };
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultState();
      const s = Object.assign(defaultState(), JSON.parse(raw));
      s.settings = Object.assign(defaultState().settings, s.settings);
      return s;
    } catch (e) {
      return defaultState();
    }
  }

  let state = loadState();

  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 저장 불가 환경 */ }
  }

  function lessonState(id) {
    if (!state.lessons[id]) state.lessons[id] = { expressions: false, dialogue: false, roleplayBest: null, quizBest: null };
    return state.lessons[id];
  }

  function logActivity() {
    const k = C.dateKey(new Date());
    state.activity[k] = (state.activity[k] || 0) + 1;
    save();
  }

  function findLesson(id) {
    return LESSONS.find(function (l) { return l.id === id; });
  }

  // ---------- 공통 유틸 ----------

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  let toastTimer = null;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }

  // ---------- 음성 (TTS / 녹음 / 인식) ----------

  // 재생 중인 연속 작업(전체 듣기, 롤플레이)을 끊기 위한 번호
  let playSeq = 0;
  let warnedNoVoice = false;

  const tts = {
    supported: 'speechSynthesis' in window,
    voices: [],
    init: function () {
      if (!this.supported) return;
      const self = this;
      const load = function () {
        self.voices = speechSynthesis.getVoices().filter(function (v) { return /^en([-_]|$)/i.test(v.lang); });
        if (view.name === 'settings') render();
      };
      load();
      speechSynthesis.addEventListener('voiceschanged', load);
    },
    // slot 0 = 기본 음성, 1 이상 = 대화 상대마다 다른 음성
    voiceFor: function (slot) {
      if (!this.voices.length) return null;
      const preferred = this.voices.find(function (v) { return v.name === state.settings.voice; }) ||
        this.voices.find(function (v) { return /en[-_]US/i.test(v.lang); }) || this.voices[0];
      if (!slot) return preferred;
      const others = this.voices.filter(function (v) { return v !== preferred; });
      return others.length ? others[(slot - 1) % others.length] : preferred;
    },
    speak: function (text, opts) {
      opts = opts || {};
      const self = this;
      return new Promise(function (resolve) {
        if (!self.supported) {
          toast('이 환경에서는 음성 재생을 지원하지 않습니다.');
          return resolve();
        }
        if (!self.voices.length && !warnedNoVoice) {
          warnedNoVoice = true;
          toast('영어 음성이 설치되어 있지 않습니다. 설정 화면의 안내를 확인하세요.');
        }
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'en-US';
        const v = self.voiceFor(opts.slot || 0);
        if (v) u.voice = v;
        u.rate = (opts.slow ? 0.7 : 1) * state.settings.rate;
        // 음성 엔진이 종료 이벤트를 보내지 않는 환경에서도 다음 대사로 넘어가도록
        const timer = setTimeout(resolve, 2000 + (text.length * 120) / u.rate);
        u.onend = u.onerror = function () { clearTimeout(timer); resolve(); };
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      });
    },
    stop: function () { if (this.supported) speechSynthesis.cancel(); }
  };

  const recorder = {
    active: null, // { key, mr, done }
    start: function (key) {
      const self = this;
      return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
        const mr = new MediaRecorder(stream);
        const chunks = [];
        mr.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); };
        const done = new Promise(function (resolve) {
          mr.onstop = function () {
            stream.getTracks().forEach(function (t) { t.stop(); });
            resolve(URL.createObjectURL(new Blob(chunks, { type: mr.mimeType })));
          };
        });
        mr.start();
        self.active = { key: key, mr: mr, done: done };
      });
    },
    stop: function () {
      const a = this.active;
      this.active = null;
      if (!a) return Promise.resolve(null);
      a.mr.stop();
      return a.done;
    },
    isRecording: function (key) { return !!this.active && this.active.key === key; }
  };

  function listenOnce() {
    return new Promise(function (resolve, reject) {
      const r = new SR();
      r.lang = 'en-US';
      r.interimResults = false;
      r.maxAlternatives = 1;
      let finished = false;
      r.onresult = function (e) { finished = true; resolve(e.results[0][0].transcript); };
      r.onerror = function (e) { finished = true; reject(e.error); };
      r.onend = function () { if (!finished) resolve(''); };
      r.start();
    });
  }

  // 표현/롤플레이 연습 결과 (화면을 다시 그려도 유지)
  const practice = {};

  function setRecording(key, url) {
    const p = practice[key] || (practice[key] = {});
    if (p.audio) URL.revokeObjectURL(p.audio);
    p.audio = url;
  }

  function stopAll() {
    playSeq++;
    tts.stop();
    if (recorder.active) recorder.stop().then(function (url) { if (url) URL.revokeObjectURL(url); });
  }

  // ---------- 라우팅 ----------

  let view = { name: 'home' };
  let rp = null;    // 롤플레이 진행 상태
  let quiz = null;  // 퀴즈 진행 상태
  let rv = null;    // 복습 진행 상태
  let showKo = false;

  function parseHash() {
    const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
    if (p[0] === 'lesson' && findLesson(p[1])) {
      const tab = TABS.some(function (t) { return t.id === p[2]; }) ? p[2] : 'expressions';
      return { name: 'lesson', lessonId: p[1], tab: tab };
    }
    if (p[0] === 'review') return { name: 'review' };
    if (p[0] === 'settings') return { name: 'settings' };
    return { name: 'home' };
  }

  function route() {
    stopAll();
    view = parseHash();
    rp = null;
    quiz = null;
    rv = null;
    render();
    window.scrollTo(0, 0);
  }

  function render() {
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      a.classList.toggle('active', a.dataset.nav === (view.name === 'lesson' ? 'home' : view.name));
    });
    if (view.name === 'lesson') app.innerHTML = renderLesson();
    else if (view.name === 'review') app.innerHTML = renderReview();
    else if (view.name === 'settings') app.innerHTML = renderSettings();
    else app.innerHTML = renderHome();
    afterRender();
  }

  function afterRender() {
    if (rp && rp.phase === 'turn') {
      const input = document.getElementById('rp-input');
      if (input && document.activeElement !== input) input.focus();
    }
    const chat = document.getElementById('rp-chat');
    if (chat) chat.scrollTop = chat.scrollHeight;
    if (quiz && quiz.phase === 'q' && !quiz.answered) {
      const bi = document.getElementById('blank-input');
      if (bi) bi.focus();
    }
  }

  // ---------- 공통 조각 ----------

  function speakButtons(text, slot) {
    const s = slot ? ' data-slot="' + slot + '"' : '';
    return '<button class="btn icon" data-action="speak" data-text="' + esc(text) + '"' + s + ' title="듣기">🔊 듣기</button>' +
      '<button class="btn icon" data-action="speak" data-slow="1" data-text="' + esc(text) + '" title="천천히 듣기">🐢 천천히</button>';
  }

  function practiceButtons(key) {
    let html = '';
    if (CAN_RECORD) {
      html += recorder.isRecording(key)
        ? '<button class="btn icon recording" data-action="record" data-key="' + key + '">⏹ 녹음 정지</button>'
        : '<button class="btn icon" data-action="record" data-key="' + key + '">🎙 따라 말하기 녹음</button>';
    }
    if (SR) html += '<button class="btn icon" data-action="listen-expr" data-key="' + key + '">🎤 말하고 채점</button>';
    return html;
  }

  function diffHtml(result) {
    return result.words.map(function (w) {
      return '<span class="' + (w.ok ? 'w-ok' : 'w-miss') + '">' + esc(w.text) + '</span>';
    }).join(' ');
  }

  function scoreBadge(score) {
    const cls = score >= 90 ? 'great' : score >= 70 ? 'good' : score >= 50 ? 'fair' : 'low';
    return '<span class="score ' + cls + '">' + score + '점</span>';
  }

  function practiceResultHtml(key, modelText) {
    const p = practice[key];
    if (!p) return '';
    let html = '';
    if (p.audio) {
      html += '<div class="rec-row"><span class="muted">내 녹음</span><audio controls src="' + p.audio + '"></audio>' +
        '<button class="btn small" data-action="speak" data-text="' + esc(modelText) + '">원어민 발음과 비교</button></div>';
    }
    if (p.result) {
      html += '<div class="said"><span class="muted">인식된 문장:</span> ' + esc(p.said || '(인식 실패)') + '</div>' +
        '<div class="diff">' + scoreBadge(p.result.score) + ' ' + C.scoreLabel(p.result.score) +
        ' <span class="muted">— 빨간 단어를 다시 연습해 보세요</span><div class="diff-words">' + diffHtml(p.result) + '</div></div>';
    }
    return html;
  }

  function progressBar(pct) {
    return '<div class="bar"><div class="bar-fill" style="width:' + pct + '%"></div></div>';
  }

  // ---------- 홈 ----------

  function renderHome() {
    const now = Date.now();
    const due = C.dueCardIds(state.srs, now).length;
    const learned = Object.keys(state.srs).length;
    const completed = LESSONS.filter(function (l) { return C.lessonProgress(state.lessons[l.id]) === 100; }).length;
    const days = C.streak(state.activity, new Date());

    const ids = Object.keys(EXPRS);
    const dayNum = Math.floor(new Date(C.dateKey(new Date()) + 'T00:00:00').getTime() / 86400000);
    const today = EXPRS[ids[dayNum % ids.length]];

    const stats = [
      ['🔥', days + '일', '연속 학습'],
      ['📘', completed + ' / ' + LESSONS.length, '완료한 레슨'],
      ['🧠', learned + ' / ' + TOTAL_EXPRS, '익힌 표현'],
      ['⏰', due + '장', '오늘 복습할 카드']
    ].map(function (s) {
      return '<div class="stat"><div class="stat-icon">' + s[0] + '</div><div><div class="stat-value">' + s[1] +
        '</div><div class="stat-label">' + s[2] + '</div></div></div>';
    }).join('');

    const cards = LESSONS.map(function (l, i) {
      const ls = state.lessons[l.id];
      const pct = C.lessonProgress(ls);
      const steps = [
        ['표현', ls && ls.expressions],
        ['대화', ls && ls.dialogue],
        ['롤플레이', ls && ls.roleplayBest != null],
        ['퀴즈', ls && ls.quizBest != null && ls.quizBest >= C.QUIZ_PASS]
      ].map(function (s) { return '<span class="step' + (s[1] ? ' done' : '') + '">' + (s[1] ? '✓ ' : '') + s[0] + '</span>'; }).join('');
      return '<a class="lesson-card" href="#/lesson/' + l.id + '">' +
        '<div class="lesson-top"><span class="lesson-icon">' + l.icon + '</span><span class="lesson-no">LESSON ' + (i + 1) + '</span>' +
        (pct === 100 ? '<span class="badge-done">완료</span>' : '') + '</div>' +
        '<h3>' + esc(l.title) + '</h3><p class="lesson-en">' + esc(l.titleEn) + '</p>' +
        '<p class="lesson-goal">' + esc(l.goal) + '</p>' + progressBar(pct) +
        '<div class="steps">' + steps + '</div></a>';
    }).join('');

    return '<section class="hero"><h1>' + (state.name ? esc(state.name) + '님, ' : '') + '오늘도 영어 회의 한 걸음 🚀</h1>' +
      '<p>비즈니스 미팅에서 바로 쓰는 표현을 듣고, 따라 말하고, 롤플레이로 연습하세요.</p></section>' +
      '<div class="stats">' + stats + '</div>' +
      '<div class="home-row">' +
      '<section class="card today"><div class="eyebrow">오늘의 표현 · ' + esc(today.lesson.title) + '</div>' +
      '<p class="en big">' + esc(today.expr.en) + '</p><p class="ko">' + esc(today.expr.ko) + '</p>' +
      '<div class="actions">' + speakButtons(today.expr.en) + '</div></section>' +
      '<a class="card review-cta' + (due ? '' : ' quiet') + '" href="#/review"><div class="eyebrow">간격 반복 복습</div>' +
      '<p class="big">' + (due ? '복습할 카드 ' + due + '장' : (learned ? '오늘 복습 완료 🎉' : '복습 카드 없음')) + '</p>' +
      '<p class="muted">' + (learned ? '잊어버릴 때쯤 다시 보여 줘서 오래 기억하게 도와줍니다.' : '레슨의 핵심 표현을 학습 완료하면 카드가 추가됩니다.') + '</p>' +
      '<span class="link">복습하러 가기 →</span></a></div>' +
      '<h2 class="section-title">레슨 <span class="muted">— 순서대로 진행하면 회의 한 번의 흐름을 따라갑니다</span></h2>' +
      '<div class="grid">' + cards + '</div>';
  }

  // ---------- 레슨 ----------

  function renderLesson() {
    const l = findLesson(view.lessonId);
    const ls = lessonState(l.id);
    const idx = LESSONS.indexOf(l);
    const doneFlags = {
      expressions: ls.expressions,
      dialogue: ls.dialogue,
      roleplay: ls.roleplayBest != null,
      quiz: ls.quizBest != null && ls.quizBest >= C.QUIZ_PASS
    };
    const tabs = TABS.map(function (t) {
      return '<a class="tab' + (t.id === view.tab ? ' active' : '') + '" href="#/lesson/' + l.id + '/' + t.id + '">' +
        t.label + (doneFlags[t.id] ? ' <span class="check">✓</span>' : '') + '</a>';
    }).join('');

    let body;
    if (view.tab === 'dialogue') body = renderDialogue(l, ls);
    else if (view.tab === 'roleplay') body = renderRoleplay(l, ls);
    else if (view.tab === 'quiz') body = renderQuiz(l, ls);
    else body = renderExpressions(l, ls);

    const pct = C.lessonProgress(ls);
    return '<a class="back" href="#/">← 전체 레슨</a>' +
      '<header class="lesson-head"><div class="lesson-icon big">' + l.icon + '</div><div class="grow">' +
      '<div class="eyebrow">LESSON ' + (idx + 1) + ' · ' + esc(l.titleEn) + '</div><h1>' + esc(l.title) + '</h1>' +
      '<p class="muted">🎯 ' + esc(l.goal) + '</p></div>' +
      '<div class="lesson-pct"><div class="pct">' + pct + '%</div>' + progressBar(pct) + '</div></header>' +
      '<nav class="tabs">' + tabs + '</nav><section class="tab-body">' + body + '</section>';
  }

  function nextTabLink(l, tab, label) {
    return '<a class="btn primary" href="#/lesson/' + l.id + '/' + tab + '">' + label + ' →</a>';
  }

  function renderExpressions(l, ls) {
    let howto = '표현을 듣고 소리 내어 따라 해 보세요.';
    if (CAN_RECORD) howto += ' 🎙 녹음으로 내 발음을 원어민 발음과 비교할 수 있습니다.';
    if (SR) howto += ' 🎤 말하고 채점을 누르면 발화를 인식해 점수를 매깁니다.';

    const list = l.expressions.map(function (e, i) {
      return '<article class="expr">' +
        '<div class="expr-num">' + (i + 1) + '</div><div class="grow">' +
        '<p class="en">' + esc(e.en) + '</p><p class="ko">' + esc(e.ko) + '</p>' +
        (e.tip ? '<p class="tip">💡 ' + esc(e.tip) + '</p>' : '') +
        '<div class="actions">' + speakButtons(e.en) + practiceButtons(e.id) + '</div>' +
        '<div class="practice-result">' + practiceResultHtml(e.id, e.en) + '</div></div></article>';
    }).join('');

    const footer = ls.expressions
      ? '<div class="done-box">✓ 표현 학습 완료 — 복습 카드에 추가되었습니다. ' + nextTabLink(l, 'dialogue', '대화 듣기') + '</div>'
      : '<div class="done-box"><button class="btn primary" data-action="expr-done">표현 학습 완료 · 복습 카드에 추가</button></div>';

    return '<p class="hint">' + howto + '</p>' + list + footer;
  }

  function slotOf(d, s) { return Object.keys(d.roles).indexOf(s); }

  function renderDialogue(l, ls) {
    const d = l.dialogue;
    const lines = d.lines.map(function (ln, i) {
      return '<div class="line' + (ln.s === d.you ? ' me' : '') + '" id="ln-' + i + '">' +
        '<div class="who">' + esc(d.roles[ln.s]) + '</div>' +
        '<div class="bubble"><p class="en">' + esc(ln.en) + '</p><p class="ko' + (showKo ? '' : ' hidden') + '">' + esc(ln.ko) + '</p></div>' +
        '<button class="btn icon round" data-action="speak" data-text="' + esc(ln.en) + '" data-slot="' + slotOf(d, ln.s) + '" title="듣기">🔊</button></div>';
    }).join('');

    const footer = ls.dialogue
      ? '<div class="done-box">✓ 대화 듣기 완료. ' + nextTabLink(l, 'roleplay', '롤플레이') + '</div>'
      : '<div class="done-box"><button class="btn" data-action="dialogue-done">대화 학습 완료로 표시</button> <span class="muted">전체 듣기를 끝까지 들어도 완료됩니다.</span></div>';

    return '<p class="setting">🎬 ' + esc(d.setting) + '</p>' +
      '<div class="toolbar"><button class="btn primary" data-action="play-all">▶ 전체 듣기</button>' +
      '<button class="btn" data-action="stop">⏹ 정지</button>' +
      '<label class="toggle"><input type="checkbox" data-action="toggle-ko"' + (showKo ? ' checked' : '') + '> 한국어 해석 보기</label></div>' +
      '<div class="dialogue">' + lines + '</div>' + footer;
  }

  async function playAll(l) {
    const token = ++playSeq;
    const d = l.dialogue;
    for (let i = 0; i < d.lines.length; i++) {
      highlightLine(i);
      await tts.speak(d.lines[i].en, { slot: slotOf(d, d.lines[i].s) });
      if (token !== playSeq) return highlightLine(-1);
      await sleep(250);
      if (token !== playSeq) return highlightLine(-1);
    }
    highlightLine(-1);
    markDialogueDone(l);
  }

  function highlightLine(i) {
    document.querySelectorAll('.line.playing').forEach(function (el) { el.classList.remove('playing'); });
    const el = document.getElementById('ln-' + i);
    if (el) {
      el.classList.add('playing');
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }

  function markDialogueDone(l) {
    const ls = lessonState(l.id);
    if (!ls.dialogue) {
      ls.dialogue = true;
      logActivity();
      toast('대화 듣기 완료!');
      render();
    }
  }

  // ---------- 롤플레이 ----------

  function renderRoleplay(l, ls) {
    const d = l.dialogue;
    if (!rp) rp = { phase: 'intro', idx: 0, log: [], scores: [], answer: '', hint: false, result: null };

    if (rp.phase === 'intro') {
      const myLines = d.lines.filter(function (ln) { return ln.s === d.you; }).length;
      return '<div class="card center">' +
        '<p class="setting">🎬 ' + esc(d.setting) + '</p>' +
        '<p>당신은 <b>' + esc(d.roles[d.you]) + '</b> 역할입니다. 상대방의 말을 듣고, 주어진 한국어 뜻에 맞게 영어로 말해 보세요.</p>' +
        '<p class="muted">내 차례 ' + myLines + '번 · 답을 입력하면 모범 답안과 비교해 점수를 알려 드립니다. ' +
        '꼭 똑같지 않아도 의미가 통하면 충분합니다.</p>' +
        (ls.roleplayBest != null ? '<p>최고 점수: ' + scoreBadge(ls.roleplayBest) + '</p>' : '') +
        '<button class="btn primary large" data-action="rp-start">롤플레이 시작</button></div>';
    }

    const chat = rp.log.map(function (m) {
      const mine = m.s === d.you;
      return '<div class="line' + (mine ? ' me' : '') + '"><div class="who">' + esc(d.roles[m.s]) + '</div>' +
        '<div class="bubble">' +
        (mine
          ? '<p class="en">' + esc(m.said || '(건너뜀)') + '</p>' + '<p class="muted small">모범 답안: ' + esc(m.en) + '</p>'
          : '<p class="en">' + esc(m.en) + '</p><p class="ko' + (showKo ? '' : ' hidden') + '">' + esc(m.ko) + '</p>') +
        '</div>' +
        (mine ? scoreBadge(m.score) : '<button class="btn icon round" data-action="speak" data-text="' + esc(m.en) + '" data-slot="' + slotOf(d, m.s) + '">🔊</button>') +
        '</div>';
    }).join('');

    let panel = '';
    const line = d.lines[rp.idx];
    if (rp.phase === 'playing') {
      panel = '<div class="turn muted">🎧 상대방이 말하는 중... <button class="btn small" data-action="rp-skip-audio">건너뛰기</button></div>';
    } else if (rp.phase === 'turn') {
      const key = 'rp-' + l.id + '-' + rp.idx;
      const hint = line.en.split(/\s+/).slice(0, 3).join(' ') + ' ...';
      panel = '<div class="turn"><div class="eyebrow">내 차례 — 이렇게 말해 보세요</div>' +
        '<p class="ko big">' + esc(line.ko) + '</p>' +
        (rp.hint ? '<p class="hint-text">힌트: ' + esc(hint) + '</p>' : '') +
        '<textarea id="rp-input" rows="2" placeholder="영어로 입력하세요 (Enter: 제출)">' + esc(rp.answer) + '</textarea>' +
        '<div class="actions">' +
        '<button class="btn primary" data-action="rp-submit">제출하고 채점</button>' +
        (SR ? '<button class="btn" data-action="rp-listen">🎤 말해서 입력</button>' : '') +
        (CAN_RECORD ? practiceButtons(key) : '') +
        (rp.hint ? '' : '<button class="btn" data-action="rp-hint">💡 힌트</button>') +
        '<button class="btn ghost" data-action="rp-pass">모르겠어요</button></div>' +
        '<div class="practice-result">' + practiceResultHtml(key, line.en) + '</div></div>';
    } else if (rp.phase === 'feedback') {
      const r = rp.result;
      const key = 'rp-' + l.id + '-' + rp.idx;
      panel = '<div class="turn"><div class="feedback-head">' + scoreBadge(r.score) + ' <b>' + C.scoreLabel(r.score) + '</b></div>' +
        '<div class="eyebrow">모범 답안 (빨간 단어가 빠지거나 달랐어요)</div><div class="diff-words big">' + diffHtml(r) + '</div>' +
        '<div class="actions">' + speakButtons(line.en) + '<button class="btn primary" data-action="rp-next">다음 →</button></div>' +
        '<div class="practice-result">' + practiceResultHtml(key, line.en) + '</div></div>';
    } else if (rp.phase === 'done') {
      const avg = rp.scores.length ? Math.round(rp.scores.reduce(function (a, b) { return a + b; }, 0) / rp.scores.length) : 0;
      panel = '<div class="turn center"><h3>롤플레이 완료! 평균 ' + scoreBadge(avg) + '</h3>' +
        '<p class="muted">최고 기록: ' + ls.roleplayBest + '점 · 점수가 낮은 문장은 핵심 표현 탭에서 다시 연습해 보세요.</p>' +
        '<div class="actions centered"><button class="btn" data-action="rp-start">다시 하기</button>' + nextTabLink(l, 'quiz', '퀴즈 풀기') + '</div></div>';
    }

    return '<div class="toolbar"><label class="toggle"><input type="checkbox" data-action="toggle-ko"' + (showKo ? ' checked' : '') +
      '> 상대방 말 해석 보기</label></div>' +
      '<div class="chat" id="rp-chat">' + (chat || '<p class="muted center">대화가 곧 시작됩니다...</p>') + '</div>' + panel;
  }

  async function rpAdvance(l) {
    const d = l.dialogue;
    const token = ++playSeq;
    while (rp && rp.idx < d.lines.length && d.lines[rp.idx].s !== d.you) {
      const ln = d.lines[rp.idx];
      rp.log.push({ s: ln.s, en: ln.en, ko: ln.ko });
      rp.idx++;
      rp.phase = 'playing';
      render();
      await tts.speak(ln.en, { slot: slotOf(d, ln.s) });
      if (token !== playSeq || !rp) return;
      await sleep(200);
    }
    if (!rp) return;
    if (rp.idx >= d.lines.length) {
      const avg = rp.scores.length ? Math.round(rp.scores.reduce(function (a, b) { return a + b; }, 0) / rp.scores.length) : 0;
      const ls = lessonState(l.id);
      ls.roleplayBest = Math.max(ls.roleplayBest || 0, avg);
      save();
      rp.phase = 'done';
    } else {
      rp.phase = 'turn';
      rp.answer = '';
      rp.hint = false;
      rp.result = null;
    }
    render();
  }

  function rpSubmit(l, text) {
    const line = l.dialogue.lines[rp.idx];
    const result = C.compareSentence(line.en, text);
    rp.result = result;
    rp.scores.push(result.score);
    rp.log.push({ s: line.s, en: line.en, said: text, score: result.score });
    rp.phase = 'feedback';
    logActivity();
    render();
  }

  // ---------- 퀴즈 ----------

  function renderQuiz(l, ls) {
    if (!quiz) quiz = { phase: 'intro' };

    if (quiz.phase === 'intro') {
      return '<div class="card center"><h3>레슨 퀴즈</h3>' +
        '<p>상황 판단 · 뜻 고르기 · 빈칸 채우기 · 문장 배열 문제가 섞여 나옵니다.</p>' +
        '<p class="muted">' + C.QUIZ_PASS + '점 이상이면 이 단계가 완료됩니다.</p>' +
        (ls.quizBest != null ? '<p>최고 점수: ' + scoreBadge(ls.quizBest) + '</p>' : '') +
        '<button class="btn primary large" data-action="quiz-start">퀴즈 시작</button></div>';
    }

    if (quiz.phase === 'done') {
      const score = Math.round((quiz.correct / quiz.qs.length) * 100);
      const passed = score >= C.QUIZ_PASS;
      const wrong = quiz.wrong.map(function (q) {
        return '<li><span class="muted">' + esc(q.sub || q.prompt) + '</span><br><b>' + esc(q.full || q.options[q.answer]) + '</b></li>';
      }).join('');
      return '<div class="card center"><h3>' + (passed ? '🎉 통과!' : '조금만 더 힘내요!') + ' ' + scoreBadge(score) + '</h3>' +
        '<p class="muted">' + quiz.qs.length + '문제 중 ' + quiz.correct + '문제 정답 · 최고 기록 ' + ls.quizBest + '점</p>' +
        (wrong ? '<div class="wrong-list"><div class="eyebrow">틀린 문제 다시 보기</div><ul>' + wrong + '</ul></div>' : '') +
        '<div class="actions centered"><button class="btn" data-action="quiz-start">다시 풀기</button>' +
        (passed ? '<a class="btn primary" href="#/">다른 레슨 보기 →</a>' : '') + '</div></div>';
    }

    const q = quiz.qs[quiz.i];
    const a = quiz.answered;
    let bodyHtml = '';

    if (q.type === 'choice') {
      bodyHtml = '<div class="options">' + q.options.map(function (opt, i) {
        let cls = 'option';
        if (a) {
          if (i === q.answer) cls += ' correct';
          else if (i === a.picked) cls += ' wrong';
        }
        return '<button class="' + cls + '" data-action="quiz-choose" data-i="' + i + '"' + (a ? ' disabled' : '') + '>' + esc(opt) + '</button>';
      }).join('') + '</div>';
    } else if (q.type === 'blank') {
      bodyHtml = '<p class="en big sentence">' + esc(q.sentence) + '</p>' +
        '<div class="blank-row"><input id="blank-input" type="text" autocomplete="off" spellcheck="false" placeholder="단어 입력"' +
        (a ? ' disabled value="' + esc(a.input) + '"' : '') + '>' +
        (a ? '' : '<button class="btn primary" data-action="quiz-blank">확인</button>') + '</div>';
    } else {
      const picked = quiz.picked;
      bodyHtml = '<div class="order-answer">' + (picked.length
        ? picked.map(function (wi, pi) {
          return '<button class="chip picked" data-action="quiz-unpick" data-i="' + pi + '"' + (a ? ' disabled' : '') + '>' + esc(q.words[wi]) + '</button>';
        }).join('')
        : '<span class="muted">아래 단어를 순서대로 누르세요</span>') + '</div>' +
        '<div class="order-bank">' + q.words.map(function (w, wi) {
          return picked.indexOf(wi) === -1
            ? '<button class="chip" data-action="quiz-pick" data-i="' + wi + '"' + (a ? ' disabled' : '') + '>' + esc(w) + '</button>' : '';
        }).join('') + '</div>' +
        (a ? '' : '<div class="actions"><button class="btn primary" data-action="quiz-order"' +
          (picked.length === q.words.length ? '' : ' disabled') + '>확인</button>' +
          '<button class="btn ghost" data-action="quiz-reset-order">처음부터</button></div>');
    }

    let feedback = '';
    if (a) {
      const full = q.full || q.options[q.answer];
      feedback = '<div class="feedback ' + (a.correct ? 'ok' : 'no') + '">' +
        '<b>' + (a.correct ? '✅ 정답입니다!' : '❌ 아쉬워요') + '</b>' +
        (q.type !== 'choice' || !a.correct ? '<p class="en">' + esc(full) + ' <button class="btn small" data-action="speak" data-text="' + esc(full) + '">🔊</button></p>' : '') +
        (q.explain ? '<p class="muted">💡 ' + esc(q.explain) + '</p>' : '') +
        '<button class="btn primary" data-action="quiz-next">' + (quiz.i + 1 < quiz.qs.length ? '다음 문제 →' : '결과 보기') + '</button></div>';
    }

    return '<div class="quiz-progress"><span>' + (quiz.i + 1) + ' / ' + quiz.qs.length + '</span>' +
      progressBar(Math.round((quiz.i / quiz.qs.length) * 100)) + '<span>정답 ' + quiz.correct + '</span></div>' +
      '<div class="card quiz-card"><p class="q-prompt">' + esc(q.prompt) + '</p>' +
      (q.sub ? '<p class="q-sub">' + esc(q.sub) + '</p>' : '') + bodyHtml + feedback + '</div>';
  }

  function quizAnswer(correct, extra) {
    const q = quiz.qs[quiz.i];
    quiz.answered = Object.assign({ correct: correct }, extra);
    if (correct) quiz.correct++;
    else quiz.wrong.push(q);
    logActivity();
    render();
  }

  // ---------- 복습 ----------

  function renderReview() {
    const ids = Object.keys(state.srs);
    if (!ids.length) {
      return '<h1>간격 반복 복습</h1><div class="card center"><p class="big">아직 복습 카드가 없어요.</p>' +
        '<p class="muted">레슨의 ‘핵심 표현’ 탭에서 학습 완료를 누르면 카드가 추가됩니다.</p>' +
        '<a class="btn primary" href="#/lesson/' + LESSONS[0].id + '">첫 레슨 시작하기 →</a></div>';
    }
    if (!rv) rv = { queue: C.dueCardIds(state.srs, Date.now()), i: 0, flipped: false, practice: false };

    if (rv.i >= rv.queue.length) {
      const upcoming = ids.map(function (id) { return state.srs[id].due; }).sort(function (a, b) { return a - b; })[0];
      const when = new Date(upcoming);
      return '<h1>간격 반복 복습</h1><div class="card center"><p class="big">🎉 ' + (rv.queue.length ? '복습 완료!' : '지금 복습할 카드가 없어요') + '</p>' +
        '<p class="muted">다음 복습 예정: ' + when.toLocaleDateString('ko-KR') + ' ' + when.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) + '</p>' +
        '<button class="btn" data-action="rv-practice">전체 카드 자유 연습 (' + ids.length + '장)</button></div>';
    }

    const id = rv.queue[rv.i];
    const item = EXPRS[id];
    if (!item) { rv.i++; return renderReview(); }
    const card = state.srs[id];
    const now = Date.now();
    const grades = [
      ['AGAIN', '다시', 'again'], ['HARD', '어려움', 'hard'], ['GOOD', '알맞음', 'good'], ['EASY', '쉬움', 'easy']
    ].map(function (g) {
      const val = C.GRADES[g[0]];
      return '<button class="btn grade ' + g[2] + '" data-action="rv-grade" data-g="' + val + '">' + g[1] +
        (rv.practice ? '' : '<small>' + C.describeNext(card, val, now) + ' 후</small>') + '</button>';
    }).join('');

    return '<h1>간격 반복 복습' + (rv.practice ? ' <span class="muted">(자유 연습 — 일정에 반영되지 않음)</span>' : '') + '</h1>' +
      '<div class="quiz-progress"><span>' + (rv.i + 1) + ' / ' + rv.queue.length + '</span>' +
      progressBar(Math.round((rv.i / rv.queue.length) * 100)) + '<span></span></div>' +
      '<div class="card flash"><div class="eyebrow">' + esc(item.lesson.icon + ' ' + item.lesson.title) + '</div>' +
      '<p class="ko big">' + esc(item.expr.ko) + '</p>' +
      (rv.flipped
        ? '<hr><p class="en big">' + esc(item.expr.en) + '</p>' + (item.expr.tip ? '<p class="tip">💡 ' + esc(item.expr.tip) + '</p>' : '') +
          '<div class="actions centered">' + speakButtons(item.expr.en) + '</div>' +
          '<p class="muted">얼마나 잘 떠올렸나요?</p><div class="grades">' + grades + '</div>'
        : '<p class="muted">영어로 어떻게 말할까요? 소리 내어 말해 본 뒤 정답을 확인하세요.</p>' +
          '<button class="btn primary large" data-action="rv-flip">정답 보기 <small>(Space)</small></button>') +
      '</div>';
  }

  // ---------- 설정 ----------

  function renderSettings() {
    let voiceHtml;
    if (!tts.supported) {
      voiceHtml = '<p class="warn">이 환경에서는 음성 재생(TTS)을 지원하지 않습니다.</p>';
    } else if (!tts.voices.length) {
      voiceHtml = '<div class="warn"><b>영어 음성이 설치되어 있지 않습니다.</b><br>' +
        'Windows: 설정 → 시간 및 언어 → 음성 → <b>음성 추가</b>에서 “English (United States)”를 설치한 뒤 앱을 다시 실행하세요.<br>' +
        'macOS: 시스템 설정 → 손쉬운 사용 → 읽기 및 말하기 → 시스템 음성에서 영어 음성을 추가하세요.</div>';
    } else {
      const current = tts.voiceFor(0);
      voiceHtml = '<label class="field"><span>기본 음성</span><select data-change="voice">' +
        tts.voices.map(function (v) {
          return '<option value="' + esc(v.name) + '"' + (current && v.name === current.name ? ' selected' : '') + '>' + esc(v.name + ' (' + v.lang + ')') + '</option>';
        }).join('') + '</select></label>' +
        '<p class="muted small">대화 듣기·롤플레이에서는 등장인물마다 다른 음성이 자동으로 배정됩니다.</p>';
    }

    return '<h1>설정</h1>' +
      '<section class="card"><h3>학습자</h3><label class="field"><span>이름</span>' +
      '<input id="name-input" type="text" value="' + esc(state.name) + '" placeholder="홈 화면 인사말에 표시됩니다"></label>' +
      '<button class="btn" data-action="save-name">저장</button></section>' +
      '<section class="card"><h3>음성</h3>' + voiceHtml +
      '<label class="field"><span>말하기 속도 <b id="rate-val">' + state.settings.rate.toFixed(2) + 'x</b></span>' +
      '<input type="range" min="0.6" max="1.3" step="0.05" value="' + state.settings.rate + '" data-change="rate"></label>' +
      '<button class="btn" data-action="speak" data-text="Good morning, everyone. Shall we get started?">🔊 음성 테스트</button></section>' +
      '<section class="card"><h3>학습 데이터</h3>' +
      '<p class="muted">학습 기록은 이 PC에만 저장됩니다. PC를 바꿀 때는 내보내기 → 가져오기를 이용하세요.</p>' +
      '<div class="actions"><button class="btn" data-action="export">📤 내보내기</button>' +
      '<label class="btn">📥 가져오기<input type="file" accept="application/json,.json" data-change="import" hidden></label>' +
      '<button class="btn danger" data-action="reset">학습 기록 초기화</button></div></section>';
  }

  // ---------- 이벤트 ----------

  const actions = {
    speak: function (el) {
      tts.speak(el.dataset.text, { slow: !!el.dataset.slow, slot: Number(el.dataset.slot || 0) });
    },
    stop: function () { stopAll(); highlightLine(-1); },

    record: function (el) {
      const key = el.dataset.key;
      if (recorder.isRecording(key)) {
        recorder.stop().then(function (url) {
          setRecording(key, url);
          logActivity();
          render();
        });
        return;
      }
      const startNew = function () {
        tts.stop();
        recorder.start(key).then(render).catch(function () {
          toast('마이크를 사용할 수 없습니다. 마이크 연결과 권한을 확인하세요.');
        });
      };
      if (recorder.active) recorder.stop().then(function (url) { if (url) URL.revokeObjectURL(url); startNew(); });
      else startNew();
    },

    'listen-expr': function (el) {
      const key = el.dataset.key;
      const expr = EXPRS[key].expr;
      el.textContent = '🎤 듣는 중...';
      el.disabled = true;
      listenOnce().then(function (text) {
        const p = practice[key] || (practice[key] = {});
        p.said = text;
        p.result = C.compareSentence(expr.en, text);
        logActivity();
        render();
      }).catch(function (err) {
        toast(err === 'not-allowed' ? '마이크 권한이 필요합니다.' : '음성 인식에 실패했습니다. 다시 시도하세요.');
        render();
      });
    },

    'expr-done': function () {
      const l = findLesson(view.lessonId);
      const now = Date.now();
      l.expressions.forEach(function (e) { if (!state.srs[e.id]) state.srs[e.id] = C.newCard(now); });
      lessonState(l.id).expressions = true;
      logActivity();
      toast('복습 카드 ' + l.expressions.length + '장이 추가되었습니다.');
      render();
    },
    'play-all': function () { playAll(findLesson(view.lessonId)); },
    'toggle-ko': function (el) {
      showKo = el.checked;
      document.querySelectorAll('.bubble .ko').forEach(function (k) { k.classList.toggle('hidden', !showKo); });
    },
    'dialogue-done': function () { markDialogueDone(findLesson(view.lessonId)); },

    'rp-start': function () {
      stopAll();
      rp = { phase: 'playing', idx: 0, log: [], scores: [], answer: '', hint: false, result: null };
      rpAdvance(findLesson(view.lessonId));
    },
    'rp-skip-audio': function () { tts.stop(); },
    'rp-hint': function () { rp.answer = readRpInput(); rp.hint = true; render(); },
    'rp-submit': function () {
      const text = readRpInput().trim();
      if (!text) { toast('답을 입력하거나 “모르겠어요”를 눌러 주세요.'); return; }
      rpSubmit(findLesson(view.lessonId), text);
    },
    'rp-pass': function () { rpSubmit(findLesson(view.lessonId), ''); },
    'rp-listen': function (el) {
      el.textContent = '🎤 듣는 중...';
      el.disabled = true;
      listenOnce().then(function (text) {
        rp.answer = text;
        render();
      }).catch(function () {
        toast('음성 인식에 실패했습니다. 직접 입력해 주세요.');
        render();
      });
    },
    'rp-next': function () {
      rp.idx++;
      rpAdvance(findLesson(view.lessonId));
    },

    'quiz-start': function () {
      quiz = { phase: 'q', qs: C.buildQuiz(findLesson(view.lessonId)), i: 0, correct: 0, wrong: [], answered: null, picked: [] };
      render();
    },
    'quiz-choose': function (el) {
      const i = Number(el.dataset.i);
      quizAnswer(i === quiz.qs[quiz.i].answer, { picked: i });
    },
    'quiz-blank': function () {
      const input = document.getElementById('blank-input').value;
      if (!input.trim()) return;
      quizAnswer(C.isBlankCorrect(input, quiz.qs[quiz.i].answer), { input: input });
    },
    'quiz-pick': function (el) { quiz.picked.push(Number(el.dataset.i)); render(); },
    'quiz-unpick': function (el) { quiz.picked.splice(Number(el.dataset.i), 1); render(); },
    'quiz-reset-order': function () { quiz.picked = []; render(); },
    'quiz-order': function () {
      const q = quiz.qs[quiz.i];
      const sentence = quiz.picked.map(function (wi) { return q.words[wi]; }).join(' ');
      quizAnswer(sentence === q.answer.join(' '), {});
    },
    'quiz-next': function () {
      quiz.i++;
      quiz.answered = null;
      quiz.picked = [];
      if (quiz.i >= quiz.qs.length) {
        const score = Math.round((quiz.correct / quiz.qs.length) * 100);
        const ls = lessonState(view.lessonId);
        ls.quizBest = Math.max(ls.quizBest || 0, score);
        save();
        quiz.phase = 'done';
      }
      render();
      window.scrollTo(0, 0);
    },

    'rv-flip': function () {
      rv.flipped = true;
      render();
      const item = EXPRS[rv.queue[rv.i]];
      if (item) tts.speak(item.expr.en);
    },
    'rv-grade': function (el) {
      const g = Number(el.dataset.g);
      const id = rv.queue[rv.i];
      if (!rv.practice) {
        state.srs[id] = C.reviewCard(state.srs[id], g, Date.now());
        if (g === C.GRADES.AGAIN) rv.queue.push(id);
      }
      logActivity();
      rv.i++;
      rv.flipped = false;
      render();
    },
    'rv-practice': function () {
      rv = { queue: C.shuffle(Object.keys(state.srs), Math.random), i: 0, flipped: false, practice: true };
      render();
    },

    'save-name': function () {
      state.name = document.getElementById('name-input').value.trim();
      save();
      toast('저장되었습니다.');
    },
    export: function () {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'biztalk-english-backup-' + C.dateKey(new Date()) + '.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    },
    reset: function () {
      if (!confirm('모든 학습 기록을 삭제할까요? 되돌릴 수 없습니다.')) return;
      state = defaultState();
      save();
      toast('초기화되었습니다.');
      render();
    }
  };

  const changes = {
    voice: function (el) { state.settings.voice = el.value; save(); },
    rate: function (el) {
      state.settings.rate = Number(el.value);
      document.getElementById('rate-val').textContent = state.settings.rate.toFixed(2) + 'x';
      save();
    },
    import: function (el) {
      const file = el.files[0];
      if (!file) return;
      file.text().then(function (text) {
        const data = JSON.parse(text);
        if (!data || typeof data !== 'object' || !data.lessons || !data.srs) throw new Error('invalid');
        state = Object.assign(defaultState(), data);
        state.settings = Object.assign(defaultState().settings, data.settings);
        save();
        toast('학습 기록을 불러왔습니다.');
        render();
      }).catch(function () { toast('올바른 백업 파일이 아닙니다.'); });
    }
  };

  function readRpInput() {
    const el = document.getElementById('rp-input');
    return el ? el.value : '';
  }

  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = actions[el.dataset.action];
    if (fn) fn(el, e);
  });

  document.addEventListener('change', function (e) {
    const el = e.target.closest('[data-change]');
    if (el && changes[el.dataset.change]) changes[el.dataset.change](el);
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'rp-input' && rp) rp.answer = e.target.value;
  });

  document.addEventListener('keydown', function (e) {
    if (e.isComposing) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.target.id === 'rp-input') { e.preventDefault(); actions['rp-submit'](); return; }
      if (e.target.id === 'blank-input') { e.preventDefault(); actions['quiz-blank'](); return; }
    }
    if (view.name === 'review' && rv && !/INPUT|TEXTAREA|BUTTON/.test(e.target.tagName)) {
      if (e.key === ' ' && !rv.flipped && rv.i < rv.queue.length) { e.preventDefault(); actions['rv-flip'](); }
    }
  });

  window.addEventListener('hashchange', route);
  tts.init();
  route();
})();
