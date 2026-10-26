/*
 * 앱 공통: 상태 저장, 음성(TTS·녹음·인식), 경험치·배지, 라우팅, 레이아웃.
 * 각 화면은 views-*.js 에서 App.views / App.actions / App.changes 에 등록하고,
 * 마지막에 start.js 가 App.start() 를 호출한다.
 */
(function () {
  'use strict';

  const C = window.BizCore;
  const LESSONS = window.LESSONS;
  const TRACKS = window.TRACKS;
  const STORE_KEY = 'biztalk.v1';
  const IS_ELECTRON = /Electron/i.test(navigator.userAgent);
  // 음성 인식은 Chrome·Edge·Safari(모바일 포함)에서 동작한다. Electron 에는 인식 서버 키가 없다.
  const SR = IS_ELECTRON ? null : (window.SpeechRecognition || window.webkitSpeechRecognition || null);
  const CAN_RECORD = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

  const EXPRS = {};
  LESSONS.forEach(function (l) {
    l.expressions.forEach(function (e) { EXPRS[e.id] = { expr: e, lesson: l }; });
  });

  const TERMS = {};
  LESSONS.forEach(function (l) {
    (l.terms || []).forEach(function (t) { TERMS[t.id] = { term: t, lesson: l }; });
  });

  const App = {
    C: C, LESSONS: LESSONS, TRACKS: TRACKS, SCENARIOS: window.SCENARIOS, EXPRS: EXPRS, TERMS: TERMS,
    IS_ELECTRON: IS_ELECTRON, SR: SR, CAN_RECORD: CAN_RECORD,
    views: {}, actions: {}, changes: {},
    route: { name: 'home', args: [] },
    session: {} // 화면 이동 시 초기화되는 임시 상태
  };
  window.App = App;

  // ---------- 저장 ----------

  function defaultState() {
    return {
      version: 2,
      name: '',
      settings: { voice: '', rate: 0.95, readKorean: true, apiKey: '', focusTrack: '', showIpa: true },
      lessons: {}, srs: {}, xp: {},
      stats: { reviews: 0, aiTurns: 0, speedBest: 0, bestStreak: 0 },
      sim: {}, favorites: [], custom: {}, badges: []
    };
  }

  function normalizeState(raw) {
    const d = defaultState();
    const s = Object.assign(d, raw || {});
    s.settings = Object.assign(defaultState().settings, raw && raw.settings);
    s.stats = Object.assign(defaultState().stats, raw && raw.stats);
    // v1: 일별 활동 횟수 → v2: 일별 XP
    if (raw && raw.activity && !raw.xp) {
      s.xp = {};
      Object.keys(raw.activity).forEach(function (k) { s.xp[k] = raw.activity[k] * 10; });
    }
    delete s.activity;
    s.version = 2;
    return s;
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return normalizeState(raw ? JSON.parse(raw) : null);
    } catch (e) {
      return defaultState();
    }
  }

  App.state = loadState();
  App.defaultState = defaultState;
  App.normalizeState = normalizeState;

  App.save = function () {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(App.state)); } catch (e) { /* 저장 불가 환경 */ }
  };

  App.lessonState = function (id) {
    const s = App.state.lessons;
    if (!s[id]) s[id] = { expressions: false, dialogue: false, roleplayBest: null, quizBest: null };
    return s[id];
  };

  App.findLesson = function (id) { return LESSONS.find(function (l) { return l.id === id; }); };

  /** '내 분야'로 고른 트랙을 맨 앞으로 */
  App.orderedTracks = function () {
    const f = App.state.settings.focusTrack;
    return TRACKS.filter(function (t) { return t.id === f; }).concat(TRACKS.filter(function (t) { return t.id !== f; }));
  };
  App.orderedLessons = function () {
    return App.orderedTracks().reduce(function (all, t) {
      return all.concat(t.lessons.map(App.findLesson));
    }, []);
  };
  App.orderedScenarios = function () {
    const f = App.state.settings.focusTrack;
    return App.SCENARIOS.filter(function (s) { return s.track === f; }).concat(App.SCENARIOS.filter(function (s) { return s.track !== f; }));
  };
  App.focusTag = function (trackId) {
    return trackId && trackId === App.state.settings.focusTrack ? '<span class="focus-tag">★ 내 분야</span>' : '';
  };
  App.findTrack = function (id) { return TRACKS.find(function (t) { return t.id === id; }); };

  /** 복습 카드·사전에서 쓰는 표현 조회 (레슨 표현 + 기술 용어 + AI 회의에서 저장한 표현) */
  App.phrase = function (id) {
    const item = EXPRS[id];
    if (item) return { id: id, en: item.expr.en, ko: item.expr.ko, ipa: item.expr.ipa, tip: item.expr.tip, swaps: item.expr.swaps, source: item.lesson.icon + ' ' + item.lesson.title };
    const t = TERMS[id];
    if (t) return { id: id, en: t.term.en, ko: t.term.ko, ipa: t.term.ipa, tip: (t.term.def ? t.term.def + '\n' : '') + '예문 · ' + t.term.ex, source: '🔧 기술 용어 · ' + t.lesson.title, term: true };
    const c = App.state.custom[id];
    if (c) return { id: id, en: c.en, ko: c.ko, ipa: c.ipa, tip: c.tip, source: '🤖 AI 회의에서 저장' };
    return null;
  };

  // ---------- 공통 유틸 ----------

  App.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  const esc = App.esc;

  App.sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };

  const toastQueue = [];
  let toastBusy = false;
  App.toast = function (msg, kind) {
    // 알림이 밀리면 오래된 일반 알림은 버리고 축하 알림만 남긴다
    for (let i = 0; i < toastQueue.length && toastQueue.length >= 2;) {
      if (toastQueue[i].kind !== 'celebrate') toastQueue.splice(i, 1);
      else i++;
    }
    toastQueue.push({ msg: msg, kind: kind || '' });
    if (!toastBusy) nextToast();
  };
  function nextToast() {
    const item = toastQueue.shift();
    if (!item) { toastBusy = false; return; }
    toastBusy = true;
    const el = document.getElementById('toast');
    el.textContent = item.msg;
    el.className = 'toast show ' + item.kind;
    setTimeout(function () {
      el.className = 'toast ' + item.kind;
      setTimeout(nextToast, 250);
    }, item.kind === 'celebrate' ? 2800 : 2200);
  }

  function xpPop(amount) {
    const el = document.createElement('div');
    el.className = 'xp-pop';
    el.textContent = '+' + amount + ' XP';
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 1300);
  }

  // ---------- 아이콘 ----------

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9v11h13V9"/><path d="M10 20v-5h4v5"/>',
    courses: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
    practice: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    review: '<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4.5V11h-6.5"/>',
    ai: '<path d="M12 3.5 13.9 9 19.5 11l-5.6 2-1.9 5.5-1.9-5.5L4.5 11 10.1 9z"/><path d="M19 15.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z"/>',
    phrasebook: '<path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"/><path d="M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"/><path d="M9 7.5h6M9 11h4"/>',
    stats: '<path d="M5 20V12M12 20V5M19 20v-6M3 20h18"/>',
    settings: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    menu: '<rect x="4" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.8"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.8"/><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.8"/>',
    speaker: '<path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5z"/><path d="M15.5 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
    stop: '<rect x="6" y="6" width="12" height="12" rx="2.5"/>',
    play: '<path d="M7.5 4.5v15l12-7.5z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    next: '<path d="M6 5l9 7-9 7z"/><path d="M18 5v14"/>',
    prev: '<path d="M18 5l-9 7 9 7z"/><path d="M6 5v14"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    star: '<path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"/>',
    flame: '<path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.8 3.1-6 4-9.8 2.9 1.6 4.3 4.3 4.5 6.5.9-.6 1.6-1.7 1.8-3 1.7 1.5 2.7 3.8 2.7 6.3 0 3.6-2.6 6.2-6.5 6.2z"/>',
    send: '<path d="M4 11.5 20 4l-6.5 16-2.5-6.5z"/><path d="M11 13.5 20 4"/>',
    print: '<path d="M7 9V3.5h10V9"/><path d="M7 17.5H4.5V10h15v7.5H17"/><path d="M7 14h10v6.5H7z"/>',
    bolt: '<path d="M13 3 5 13.5h6L10 21l8-10.5h-6z"/>',
    headphones: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3.5" y="14" width="4" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4" height="6.5" rx="1.5"/>',
    film: '<rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="M3.5 9.5h17M3.5 14.5h17M8 5v14M16 5v14"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l1.5 1.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4.5v1.5A3 3 0 0 0 8 10.5M16 6h3.5v1.5a3 3 0 0 1-3.5 3"/><path d="M12 13v4M8.5 20.5h7M9.5 17h5v3.5h-5z"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/>'
  };

  App.icon = function (name, cls) {
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  };
  const icon = App.icon;

  /** 원형 진행률 (SVG) */
  App.ring = function (pct, size, label, cls) {
    const r = (size - 8) / 2, c = 2 * Math.PI * r;
    const off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
    return '<div class="ring ' + (cls || '') + '" style="width:' + size + 'px;height:' + size + 'px">' +
      '<svg viewBox="0 0 ' + size + ' ' + size + '"><circle class="ring-bg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '"/>' +
      '<circle class="ring-fg" cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" stroke-dasharray="' + c.toFixed(2) +
      '" stroke-dashoffset="' + off.toFixed(2) + '"/></svg><span class="ring-label">' + (label != null ? label : pct + '%') + '</span></div>';
  };

  App.bar = function (pct, cls) {
    return '<div class="bar ' + (cls || '') + '"><div class="bar-fill" style="width:' + Math.max(0, Math.min(100, pct)) + '%"></div></div>';
  };

  App.scoreBadge = function (score) {
    const cls = score >= 90 ? 'great' : score >= 70 ? 'good' : score >= 50 ? 'fair' : 'low';
    return '<span class="score ' + cls + '">' + score + '점</span>';
  };

  App.diffHtml = function (result) {
    return result.words.map(function (w) {
      return '<span class="' + (w.ok ? 'w-ok' : 'w-miss') + '">' + esc(w.text) + '</span>';
    }).join(' ');
  };

  /** 발음기호 한 줄 (설정에서 끌 수 있음). ˈ 다음 음절에 강세 */
  App.ipaHtml = function (ipa, extra) {
    if (!ipa || App.state.settings.showIpa === false) return '';
    return '<p class="ipa' + (extra ? ' ' + extra : '') + '" lang="en-fonipa">/' + esc(ipa) + '/</p>';
  };

  /** text 에서 base 와 다른 단어에 밑줄 (비슷한 보기끼리 어디가 다른지 보여 줄 때) */
  App.markDiff = function (text, base) {
    if (base == null || base === text) return esc(text);
    return C.diffWords(base, text).map(function (w) {
      if (!w.diff) return esc(w.text);
      const m = w.text.match(/^(.*?)([.,!?;:]*)$/);
      return '<mark class="diff-mark">' + esc(m[1] || w.text) + '</mark>' + (m[1] ? esc(m[2]) : '');
    }).join(' ');
  };

  /** 정답 공개 후 보기 문구: 오답은 정답과 다른 곳, 정답은 내가 고른 오답과 다른 곳을 표시 */
  App.optionText = function (options, i, answer, picked) {
    if (i === answer) return App.markDiff(options[i], picked != null && picked !== answer ? options[picked] : null);
    return App.markDiff(options[i], options[answer]);
  };

  // ---------- 경험치 · 레벨 · 배지 ----------

  App.totalXp = function () { return C.sumValues(App.state.xp); };
  App.todayXp = function () { return App.state.xp[C.dateKey(new Date())] || 0; };

  App.award = function (amount) {
    if (!amount) return;
    const st = App.state;
    const key = C.dateKey(new Date());
    const before = C.levelInfo(App.totalXp()).level;
    const todayBefore = st.xp[key] || 0;
    st.xp[key] = todayBefore + amount;
    st.stats.bestStreak = Math.max(st.stats.bestStreak || 0, C.streak(st.xp, new Date()));
    App.save();
    xpPop(amount);
    const after = C.levelInfo(App.totalXp());
    if (after.level > before) App.toast('🎉 레벨 업! Lv.' + after.level + ' ' + after.titleKo, 'celebrate');
    if (todayBefore < C.DAILY_GOAL && st.xp[key] >= C.DAILY_GOAL) App.toast('🎯 오늘의 목표 달성!', 'celebrate');
    checkBadges();
    renderChrome();
  };

  function checkBadges() {
    const st = App.state;
    const fresh = C.earnedBadges(st, TRACKS).filter(function (id) { return st.badges.indexOf(id) === -1; });
    if (!fresh.length) return;
    st.badges = st.badges.concat(fresh);
    App.save();
    fresh.forEach(function (id) {
      const b = C.BADGES.find(function (x) { return x.id === id; });
      App.toast(b.icon + ' 배지 획득: ' + b.title, 'celebrate');
    });
  }
  App.checkBadges = checkBadges;

  // ---------- 음성 ----------

  // 재생 중인 연속 작업(전체 듣기, 롤플레이, 오디오 학습)을 끊기 위한 번호
  App.playSeq = 0;
  let warnedNoVoice = false;

  const tts = {
    supported: 'speechSynthesis' in window,
    voices: [],
    koVoices: [],
    init: function () {
      if (!this.supported) return;
      const self = this;
      const load = function () {
        const all = speechSynthesis.getVoices();
        self.voices = all.filter(function (v) { return /^en([-_]|$)/i.test(v.lang); });
        self.koVoices = all.filter(function (v) { return /^ko([-_]|$)/i.test(v.lang); });
        if (App.route.name === 'settings') App.render();
      };
      load();
      speechSynthesis.addEventListener('voiceschanged', load);
    },
    // slot 0 = 기본 음성, 1 이상 = 대화 상대마다 다른 음성
    voiceFor: function (slot) {
      if (!this.voices.length) return null;
      const preferred = this.voices.find(function (v) { return v.name === App.state.settings.voice; }) ||
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
          App.toast('이 환경에서는 음성 재생을 지원하지 않습니다.');
          return resolve();
        }
        const korean = opts.lang === 'ko';
        if (!korean && !self.voices.length && !warnedNoVoice) {
          warnedNoVoice = true;
          App.toast('영어 음성이 설치되어 있지 않습니다. 설정 화면의 안내를 확인하세요.');
        }
        const u = new SpeechSynthesisUtterance(text);
        u.lang = korean ? 'ko-KR' : 'en-US';
        const v = korean ? self.koVoices[0] : self.voiceFor(opts.slot || 0);
        if (v) u.voice = v;
        u.rate = (opts.slow ? 0.7 : 1) * (korean ? 1.05 : App.state.settings.rate);
        // 음성 엔진이 종료 이벤트를 보내지 않는 환경에서도 다음으로 넘어가도록
        const timer = setTimeout(resolve, 2000 + (text.length * 120) / u.rate);
        u.onend = u.onerror = function () { clearTimeout(timer); resolve(); };
        speechSynthesis.cancel();
        speechSynthesis.speak(u);
      });
    },
    stop: function () { if (this.supported) speechSynthesis.cancel(); }
  };
  App.tts = tts;

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
  App.recorder = recorder;

  /**
   * 한 번 말한 문장을 인식한다. onInterim 을 주면 말하는 동안 중간 결과(실시간 자막)를 넘겨준다.
   * 아무 말도 없으면 '' 로 끝나고, 마이크 권한 등 오류는 reject(오류 코드).
   */
  let recognition = null;
  App.listen = function (onInterim) {
    return new Promise(function (resolve, reject) {
      if (recognition) { try { recognition.abort(); } catch (e) { /* 이미 끝남 */ } }
      const r = new SR();
      r.lang = 'en-US';
      r.interimResults = !!onInterim;
      r.maxAlternatives = 1;
      let finalText = '';
      let settled = false;
      r.onresult = function (e) {
        let interim = '';
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
          else interim += e.results[i][0].transcript;
        }
        if (onInterim) onInterim((finalText + interim).trim());
      };
      r.onerror = function (e) {
        if (settled) return;
        settled = true;
        if (e.error === 'no-speech' || e.error === 'aborted') resolve(finalText.trim());
        else reject(e.error);
      };
      r.onend = function () {
        if (recognition === r) recognition = null;
        if (!settled) { settled = true; resolve(finalText.trim()); }
      };
      recognition = r;
      r.start();
    });
  };
  App.listenOnce = function () { return App.listen(); };
  App.isListening = function () { return !!recognition; };
  /** 지금까지 들은 데까지로 끝내기 (인식 결과는 그대로 전달됨) */
  App.stopListening = function () { if (recognition) { try { recognition.stop(); } catch (e) { /* 이미 끝남 */ } } };

  // 표현/롤플레이 연습 결과 (화면을 다시 그려도 유지)
  App.practice = {};

  App.setRecording = function (key, url) {
    const p = App.practice[key] || (App.practice[key] = {});
    if (p.audio) URL.revokeObjectURL(p.audio);
    p.audio = url;
  };

  App.stopAll = function () {
    App.playSeq++;
    tts.stop();
    if (recognition) { try { recognition.abort(); } catch (e) { /* 이미 끝남 */ } recognition = null; }
    if (recorder.active) recorder.stop().then(function (url) { if (url) URL.revokeObjectURL(url); });
  };

  App.speakButtons = function (text, opts) {
    opts = opts || {};
    const slot = opts.slot ? ' data-slot="' + opts.slot + '"' : '';
    return '<button class="btn soft" data-action="speak" data-text="' + esc(text) + '"' + slot + '>' + icon('speaker') + '<span>듣기</span></button>' +
      (opts.noSlow ? '' : '<button class="btn soft" data-action="speak" data-slow="1" data-text="' + esc(text) + '"' + slot + ' title="천천히 듣기">0.7×</button>');
  };

  App.practiceButtons = function (key) {
    let html = '';
    if (CAN_RECORD) {
      html += recorder.isRecording(key)
        ? '<button class="btn soft recording" data-action="record" data-key="' + key + '">' + icon('stop') + '<span>녹음 정지</span></button>'
        : '<button class="btn soft" data-action="record" data-key="' + key + '">' + icon('mic') + '<span>따라 말하기</span></button>';
    }
    if (SR) html += '<button class="btn soft" data-action="listen-expr" data-key="' + key + '">' + icon('target') + '<span>말하고 채점</span></button>';
    return html;
  };

  App.practiceResultHtml = function (key, modelText) {
    const p = App.practice[key];
    if (!p) return '';
    let html = '';
    if (p.audio) {
      html += '<div class="rec-row"><span class="muted small">내 녹음</span><audio controls src="' + p.audio + '"></audio>' +
        '<button class="btn small" data-action="speak" data-text="' + esc(modelText) + '">원어민 발음과 비교</button></div>';
    }
    if (p.result) {
      html += '<div class="said"><span class="muted small">인식된 문장</span> ' + esc(p.said || '(인식 실패)') + '</div>' +
        '<div class="diff">' + App.scoreBadge(p.result.score) + ' <b>' + C.scoreLabel(p.result.score) + '</b>' +
        (p.result.score < 90 ? '<span class="muted small"> 빨간 단어를 다시 연습해 보세요</span>' : '') + '<div class="diff-words">' + App.diffHtml(p.result) + '</div></div>';
    }
    return html;
  };

  // ---------- 레이아웃 ----------

  const NAV = [
    { group: '학습', items: [
      { id: 'home', label: '홈', icon: 'home', href: '#/' },
      { id: 'courses', label: '코스', icon: 'courses', href: '#/courses' },
      { id: 'review', label: '복습', icon: 'review', href: '#/review' }
    ] },
    { group: '실전', items: [
      { id: 'practice', label: '실전 연습', icon: 'practice', href: '#/practice' },
      { id: 'ai', label: 'AI 회의 파트너', icon: 'ai', href: '#/ai' }
    ] },
    { group: '도구', items: [
      { id: 'phrasebook', label: '표현 사전', icon: 'phrasebook', href: '#/phrasebook' },
      { id: 'stats', label: '내 기록', icon: 'stats', href: '#/stats' },
      { id: 'settings', label: '설정', icon: 'settings', href: '#/settings' }
    ] }
  ];

  const TABS = [
    { id: 'home', label: '홈', icon: 'home', href: '#/' },
    { id: 'courses', label: '코스', icon: 'courses', href: '#/courses' },
    { id: 'practice', label: '실전', icon: 'practice', href: '#/practice' },
    { id: 'review', label: '복습', icon: 'review', href: '#/review' },
    { id: 'more', label: '메뉴', icon: 'menu', href: '#/more' }
  ];

  function renderChrome() {
    const view = App.views[App.route.name] || App.views.home;
    const navId = view.nav || App.route.name;
    const tabId = view.tab || navId;
    const lv = C.levelInfo(App.totalXp());
    const due = C.dueCardIds(App.state.srs, Date.now()).length;

    document.getElementById('sidebar-nav').innerHTML = NAV.map(function (g) {
      return '<div class="nav-group"><div class="nav-label">' + g.group + '</div>' + g.items.map(function (it) {
        const badge = it.id === 'review' && due ? '<span class="nav-count">' + due + '</span>' : '';
        return '<a class="nav-item' + (it.id === navId ? ' active' : '') + '" href="' + it.href + '">' + icon(it.icon) +
          '<span>' + it.label + '</span>' + badge + '</a>';
      }).join('') + '</div>';
    }).join('');

    document.getElementById('sidebar-user').innerHTML =
      '<a class="user-card" href="#/stats"><div class="user-top"><span class="lv">Lv.' + lv.level + '</span>' +
      '<span class="user-title">' + esc(lv.titleKo) + '</span><span class="streak">' + icon('flame') + C.streak(App.state.xp, new Date()) + '</span></div>' +
      App.bar(lv.pct, 'thin') + '<div class="user-xp muted small">' + (lv.xp - lv.base) + ' / ' + (lv.next - lv.base) + ' XP</div></a>';

    document.getElementById('mobile-level').innerHTML =
      '<span class="lv">Lv.' + lv.level + '</span><span class="streak">' + icon('flame') + C.streak(App.state.xp, new Date()) + '</span>';

    document.getElementById('tabbar').innerHTML = TABS.map(function (t) {
      const badge = t.id === 'review' && due ? '<span class="tab-dot"></span>' : '';
      return '<a class="tab-item' + (t.id === tabId ? ' active' : '') + '" href="' + t.href + '">' + icon(t.icon) + '<span>' + t.label + '</span>' + badge + '</a>';
    }).join('');
  }
  App.renderChrome = renderChrome;

  // ---------- 라우팅 ----------

  function parseHash() {
    const p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
    const name = p[0] && App.views[p[0]] ? p[0] : 'home';
    return { name: name, args: p.slice(1) };
  }

  function route() {
    App.stopAll();
    if (App.session.cleanup) App.session.cleanup();
    App.route = parseHash();
    App.session = {};
    App.render();
    window.scrollTo(0, 0);
  }

  App.render = function () {
    const view = App.views[App.route.name] || App.views.home;
    const el = document.getElementById('view');
    el.innerHTML = view.render(App.route.args);
    el.dataset.view = App.route.name;
    renderChrome();
    if (view.after) view.after(App.route.args);
  };

  /** 롤플레이·시뮬레이션·AI 대화의 입력/피드백 패널이 화면(하단 탭 위)에 보이도록 */
  App.revealPanel = function () {
    const panels = document.querySelectorAll('#view .turn, #view .composer');
    const last = panels[panels.length - 1];
    if (last) last.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };

  App.go = function (hash) {
    if (location.hash === hash) route();
    else location.hash = hash;
  };

  // ---------- 공통 액션 ----------

  Object.assign(App.actions, {
    speak: function (el) {
      tts.speak(el.dataset.text, { slow: !!el.dataset.slow, slot: Number(el.dataset.slot || 0), lang: el.dataset.lang });
    },
    stop: function () { App.stopAll(); },

    record: function (el) {
      const key = el.dataset.key;
      if (recorder.isRecording(key)) {
        recorder.stop().then(function (url) {
          App.setRecording(key, url);
          App.award(C.XP.practice);
          App.render();
        });
        return;
      }
      const startNew = function () {
        tts.stop();
        recorder.start(key).then(App.render).catch(function () {
          App.toast('마이크를 사용할 수 없습니다. 마이크 연결과 권한을 확인하세요.');
        });
      };
      if (recorder.active) recorder.stop().then(function (url) { if (url) URL.revokeObjectURL(url); startNew(); });
      else startNew();
    },

    // 정해진 문장(data-text)을 따라 말하고 채점 — AI 대화의 '더 자연스럽게' 문장 등
    'say-target': function (el) {
      const key = el.dataset.key;
      const target = el.dataset.text;
      el.innerHTML = icon('mic') + '<span>듣는 중...</span>';
      el.classList.add('recording');
      el.disabled = true;
      App.listen().then(function (text) {
        const p = App.practice[key] || (App.practice[key] = {});
        p.said = text;
        p.result = C.compareSentence(target, text);
        if (text) App.award(C.XP.practice);
        App.render();
      }).catch(function (err) {
        App.toast(err === 'not-allowed' ? '마이크 권한이 필요합니다.' : '음성 인식에 실패했습니다. 다시 시도하세요.');
        App.render();
      });
    },

    'listen-expr': function (el) {
      const key = el.dataset.key;
      const target = App.phrase(key);
      el.innerHTML = icon('mic') + '<span>듣는 중...</span>';
      el.disabled = true;
      App.listenOnce().then(function (text) {
        const p = App.practice[key] || (App.practice[key] = {});
        p.said = text;
        p.result = C.compareSentence(target.en, text);
        App.award(C.XP.practice);
        App.render();
      }).catch(function (err) {
        App.toast(err === 'not-allowed' ? '마이크 권한이 필요합니다.' : '음성 인식에 실패했습니다. 다시 시도하세요.');
        App.render();
      });
    },

    favorite: function (el) {
      const id = el.dataset.id;
      const favs = App.state.favorites;
      const i = favs.indexOf(id);
      if (i === -1) favs.push(id); else favs.splice(i, 1);
      App.save();
      el.classList.toggle('on', i === -1);
      el.setAttribute('aria-pressed', String(i === -1));
      App.toast(i === -1 ? '즐겨찾기에 추가했어요' : '즐겨찾기에서 뺐어요');
    }
  });

  App.favButton = function (id) {
    const on = App.state.favorites.indexOf(id) !== -1;
    return '<button class="btn icon-only fav' + (on ? ' on' : '') + '" data-action="favorite" data-id="' + esc(id) +
      '" aria-pressed="' + on + '" title="즐겨찾기">' + icon('star') + '</button>';
  };

  // ---------- 이벤트 ----------

  document.addEventListener('click', function (e) {
    const el = e.target.closest('[data-action]');
    if (!el || el.disabled) return;
    const fn = App.actions[el.dataset.action];
    if (fn) fn(el, e);
  });

  document.addEventListener('change', function (e) {
    const el = e.target.closest('[data-change]');
    if (el && App.changes[el.dataset.change]) App.changes[el.dataset.change](el, e);
  });

  document.addEventListener('input', function (e) {
    const el = e.target.closest('[data-input]');
    if (el && App.changes[el.dataset.input]) App.changes[el.dataset.input](el, e);
  });

  document.addEventListener('keydown', function (e) {
    if (e.isComposing) return;
    const view = App.views[App.route.name];
    if (view && view.keydown) view.keydown(e);
  });

  App.start = function () {
    tts.init();
    window.addEventListener('hashchange', route);
    route();
    // 휴대폰에서 홈 화면에 추가해 오프라인으로 쓸 수 있도록 (웹으로 열었을 때만)
    if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register('sw.js').catch(function () { /* 오프라인 캐시 없이 동작 */ });
    }
  };
})();
