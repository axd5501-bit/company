/* 학습 화면: 홈, 코스, 레슨(핵심 표현 · 대화 듣기 · 롤플레이 · 퀴즈), 모바일 메뉴 */
(function () {
  'use strict';

  const App = window.App;
  const C = App.C;
  const esc = App.esc;
  const icon = App.icon;

  let showKo = false;

  const STEPS = [
    { id: 'expressions', label: '핵심 표현' },
    { id: 'dialogue', label: '대화 듣기' },
    { id: 'roleplay', label: '롤플레이' },
    { id: 'quiz', label: '퀴즈' }
  ];

  function stepDone(ls, id) {
    if (!ls) return false;
    if (id === 'expressions') return !!ls.expressions;
    if (id === 'dialogue') return !!ls.dialogue;
    if (id === 'roleplay') return ls.roleplayBest != null;
    return ls.quizBest != null && ls.quizBest >= C.QUIZ_PASS;
  }

  function trackProgress(t) {
    const sum = t.lessons.reduce(function (s, id) { return s + C.lessonProgress(App.state.lessons[id]); }, 0);
    return Math.round(sum / t.lessons.length);
  }

  function lessonNo(l) { return ('0' + (App.LESSONS.indexOf(l) + 1)).slice(-2); }

  function levelChip(level) {
    const cls = level === '기초' ? 'lv-basic' : level === '중급' ? 'lv-mid' : 'lv-adv';
    return '<span class="chip ' + cls + '">' + level + '</span>';
  }

  // ---------- 홈 ----------

  function nextLesson() {
    const lessons = App.orderedLessons();
    for (let i = 0; i < lessons.length; i++) {
      const l = lessons[i];
      const ls = App.state.lessons[l.id];
      const step = STEPS.find(function (s) { return !stepDone(ls, s.id); });
      if (step) return { lesson: l, step: step };
    }
    return null;
  }

  function greeting() {
    const h = new Date().getHours();
    if (h < 11) return '좋은 아침이에요';
    if (h < 17) return '좋은 오후예요';
    return '오늘 하루 수고 많으셨어요';
  }

  const DAYS_EN = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const MONTHS_EN = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  /** 오늘의 회의 안건: 이어서 학습 → 복습 → 실전 */
  function agendaItems() {
    const st = App.state;
    const next = nextLesson();
    const learned = Object.keys(st.srs).length;
    const due = C.dueCardIds(st.srs, Date.now()).length;
    const items = [];
    items.push(next
      ? { href: '#/lesson/' + next.lesson.id + '/' + next.step.id, title: next.lesson.icon + ' ' + next.lesson.title, sub: 'LESSON ' + lessonNo(next.lesson) + ' · 다음 단계 ' + next.step.label, mins: 10 }
      : { href: '#/practice', title: '🏆 모든 레슨 완료', sub: '실전 연습으로 감각을 유지하세요', mins: 5 });
    if (!learned) items.push({ href: next ? '#/lesson/' + next.lesson.id : '#/review', title: '🗂️ 복습 카드 만들기', sub: '핵심 표현 학습을 마치면 카드가 생겨요', mins: 2 });
    else if (due) items.push({ href: '#/review', title: '🔁 복습 카드 ' + due + '장', sub: '잊어버리기 직전에 다시 보기', mins: Math.max(2, Math.ceil(due / 4)) });
    else items.push({ href: '#/review', title: '🔁 오늘 복습 완료', sub: '다음 카드는 일정에 맞춰 돌아와요', mins: 0, done: true });
    const sim = App.orderedScenarios().find(function (s) { return !(st.sim[s.id] >= 90); });
    items.push(sim
      ? { href: '#/sim/' + sim.id, title: sim.icon + ' ' + sim.title, sub: '회의 시뮬레이션 · ' + (st.sim[sim.id] != null ? '최고 ' + st.sim[sim.id] + '점' : '첫 도전'), mins: 5 }
      : { href: '#/speed', title: '⚡ 스피드 챌린지', sub: '최고 기록 ' + (st.stats.speedBest || 0) + '점 깨기', mins: 1 });
    return items;
  }

  /** 최근 7일 XP 막대 (목표선 포함, 같은 척도로 그림) */
  function weekChart() {
    const st = App.state;
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
      days.push({ label: DAYS_EN[d.getDay()].charAt(0) + DAYS_EN[d.getDay()].slice(1).toLowerCase(), xp: st.xp[C.dateKey(d)] || 0, today: i === 0 });
    }
    const max = Math.max(C.DAILY_GOAL, days.reduce(function (m, d) { return Math.max(m, d.xp); }, 0));
    const goalPct = (C.DAILY_GOAL / max) * 100;
    const total = days.reduce(function (s, d) { return s + d.xp; }, 0);
    const bars = days.map(function (d) {
      const h = d.xp ? Math.max(4, (d.xp / max) * 100) : 0;
      return '<div class="week-bar' + (d.today ? ' today' : '') + (d.xp >= C.DAILY_GOAL ? ' hit' : '') + '" style="height:' + h.toFixed(1) + '%" title="' + d.xp + ' XP"></div>';
    }).join('');
    const labels = days.map(function (d) {
      return '<div class="week-lab' + (d.today ? ' today' : '') + '"><b>' + (d.xp || '·') + '</b><span>' + d.label + '</span></div>';
    }).join('');
    return '<div class="week-chart" role="img" aria-label="최근 7일 학습량, 합계 ' + total + ' XP">' +
      '<div class="week-plot"><div class="week-goal" style="bottom:' + goalPct.toFixed(1) + '%"></div>' + bars + '</div>' +
      '<div class="week-labels">' + labels + '</div></div>' +
      '<p class="muted small week-total">최근 7일 합계 <b class="mono">' + total + ' XP</b></p>';
  }

  App.views.home = {
    nav: 'home',
    render: function () {
      const st = App.state;
      const lv = C.levelInfo(App.totalXp());
      const today = App.todayXp();
      const days = C.streak(st.xp, new Date());
      const now = new Date();

      const pool = Object.keys(App.EXPRS);
      const dayNum = Math.floor(new Date(C.dateKey(now) + 'T00:00:00').getTime() / 86400000);
      const tod = App.EXPRS[pool[dayNum % pool.length]];

      const agenda = agendaItems().map(function (a, i) {
        return '<a class="agenda-item' + (a.done ? ' done' : '') + '" href="' + a.href + '">' +
          '<span class="agenda-no">' + (a.done ? icon('check') : '0' + (i + 1)) + '</span>' +
          '<span class="agenda-text"><b>' + esc(a.title) + '</b><small>' + esc(a.sub) + '</small></span>' +
          '<span class="agenda-time">' + (a.done ? 'DONE' : '~' + a.mins + ' MIN') + '</span></a>';
      }).join('');

      const tools = [
        { href: '#/practice', icon: 'film', title: '회의 시뮬레이션', sub: App.SCENARIOS.length + '개 시나리오' },
        { href: '#/speed', icon: 'bolt', title: '스피드 챌린지', sub: '최고 ' + (st.stats.speedBest || 0) + '점' },
        { href: '#/drill', icon: 'mic', title: '스피킹 드릴', sub: '따라 말하고 채점받기' },
        { href: '#/ai', icon: 'ai', title: 'AI 회의 파트너', sub: st.settings.apiKey ? '대화 시작' : 'API 키 필요' }
      ].map(function (q) {
        return '<a class="tool" href="' + q.href + '"><span class="tool-icon">' + icon(q.icon) + '</span><span><b>' + q.title + '</b><small>' + q.sub + '</small></span></a>';
      }).join('');

      const tracks = App.orderedTracks().map(function (t) {
        const pct = trackProgress(t);
        return '<a class="track-tile t-' + t.color + '" href="#/courses/' + t.id + '">' +
          '<div class="track-tile-top"><span class="track-emoji">' + t.icon + '</span>' + App.ring(pct, 46) + '</div>' +
          '<b>' + esc(t.title) + '</b><span class="track-en">' + esc(t.titleEn) + '</span>' +
          '<span class="track-meta"><span class="muted small">' + t.lessons.length + '개 레슨</span>' + App.focusTag(t.id) + '</span></a>';
      }).join('');

      return '<section class="hero">' +
        '<div class="hero-main">' +
        '<div class="hero-kicker"><span class="live-dot"></span>' + DAYS_EN[now.getDay()] + ' · ' + now.getDate() + ' ' + MONTHS_EN[now.getMonth()] + ' · DAILY STAND-UP</div>' +
        '<h1>' + (st.name ? esc(st.name) + '님, ' : '') + greeting() + '</h1>' +
        '<p class="hero-sub">오늘 회의에서 바로 꺼내 쓸 영어, 10분이면 충분해요.</p>' +
        '<div class="hero-stats">' +
        '<div class="hero-goal">' + App.ring(Math.round((today / C.DAILY_GOAL) * 100), 92, '<b>' + today + '</b><small>/ ' + C.DAILY_GOAL + ' XP</small>', 'on-dark') +
        '<div><span class="hero-label">오늘의 목표</span><span class="hero-streak">' + icon('flame') + days + '일 연속</span></div></div>' +
        '<div class="hero-level"><div class="hero-level-top"><span class="lv-chip">LV.' + lv.level + '</span><b>' + esc(lv.titleKo) + '</b><span class="mono small">' + lv.xp + ' XP</span></div>' +
        App.bar(lv.pct, 'on-dark') + '<span class="hero-label">다음 레벨까지 ' + (lv.next - lv.xp) + ' XP</span></div>' +
        '</div></div>' +
        '<div class="agenda"><div class="agenda-head"><span>TODAY’S AGENDA</span><span class="mono">오늘의 안건 3</span></div>' + agenda + '</div>' +
        '</section>' +
        '<div class="home-grid">' +
        '<section class="card today"><div class="eyebrow">오늘의 표현 · ' + esc(tod.lesson.title) + '</div>' +
        App.sentenceHtml(tod.expr.en, tod.expr.ipa, 'display-en') + '<p class="muted">' + esc(tod.expr.ko) + '</p>' +
        (tod.expr.tip ? '<p class="tip">💡 ' + esc(tod.expr.tip) + '</p>' : '') +
        '<div class="actions">' + App.speakButtons(tod.expr.en) + App.favButton(tod.expr.id) + '</div></section>' +
        '<section class="card week"><div class="card-head"><div class="eyebrow">최근 7일 학습량</div><span class="legend-goal">하루 목표 ' + C.DAILY_GOAL + ' XP</span></div>' + weekChart() + '</section>' +
        '</div>' +
        '<div class="tools">' + tools + '</div>' +
        '<div class="section-head"><h2>학습 트랙</h2><a href="#/courses">전체 코스 ' + icon('arrow') + '</a></div>' +
        '<div class="track-tiles-wrap"><div class="track-tiles">' + tracks + '</div></div>';
    }
  };

  // ---------- 코스 ----------

  App.views.courses = {
    nav: 'courses',
    render: function () {
      const sections = App.orderedTracks().map(function (t) {
        const ti = App.TRACKS.indexOf(t);
        const cards = t.lessons.map(function (id) {
          const l = App.findLesson(id);
          const ls = App.state.lessons[id];
          const pct = C.lessonProgress(ls);
          const steps = STEPS.map(function (s) {
            return '<span class="seg' + (stepDone(ls, s.id) ? ' done' : '') + '" title="' + s.label + '"></span>';
          }).join('');
          return '<a class="lesson-card" href="#/lesson/' + l.id + '">' +
            '<div class="lesson-top"><span class="lesson-code">L-' + lessonNo(l) + '</span>' + levelChip(l.level) +
            (l.terms ? '<span class="chip">용어 ' + l.terms.length + '</span>' : '') +
            (pct === 100 ? '<span class="chip done">' + icon('check') + '완료</span>' : '') + '</div>' +
            '<div class="lesson-title-row"><span class="lesson-icon">' + l.icon + '</span><div class="grow"><h3>' + esc(l.title) + '</h3>' +
            '<p class="lesson-en">' + esc(l.titleEn) + '</p></div></div>' +
            '<p class="lesson-goal">' + esc(l.goal) + '</p>' +
            '<div class="lesson-foot"><div class="segs">' + steps + '</div><span class="mono small">' + pct + '%</span></div></a>';
        }).join('');
        return '<section class="track-section t-' + t.color + '" id="track-' + t.id + '">' +
          '<header class="track-head"><span class="track-index mono">T' + (ti + 1) + '</span><span class="track-emoji big">' + t.icon + '</span><div class="grow">' +
          '<div class="eyebrow">' + esc(t.titleEn) + ' ' + App.focusTag(t.id) + '</div><h2>' + esc(t.title) + '</h2><p class="muted">' + esc(t.desc) + '</p></div>' +
          App.ring(trackProgress(t), 64) + '</header><div class="lesson-grid">' + cards + '</div></section>';
      }).join('');
      const totalExpr = App.LESSONS.reduce(function (n, l) { return n + l.expressions.length; }, 0);
      const totalTerms = Object.keys(App.TERMS).length;
      return '<header class="page-head"><h1>코스</h1><p class="muted">업무 상황별 ' + App.TRACKS.length + '개 트랙 · ' + App.LESSONS.length + '개 레슨 · 표현 ' + totalExpr +
        '개 · 기술 용어 ' + totalTerms + '개. 레슨마다 표현 → 대화 → 롤플레이 → 퀴즈 4단계로 진행합니다.</p>' +
        (App.state.settings.focusTrack ? '' : '<p class="hint small">설정 → <a href="#/settings">내 분야</a>에서 업무 분야(예: HVAC)를 고르면 그 트랙이 맨 앞에 오고, 홈의 오늘의 안건도 그 분야부터 추천합니다.</p>') +
        '</header>' + sections;
    },
    after: function (args) {
      // #/courses/<트랙 id> 로 들어오면 해당 트랙으로 스크롤
      const el = args[0] && document.getElementById('track-' + args[0]);
      if (el) el.scrollIntoView({ block: 'start' });
    }
  };

  // ---------- 레슨 ----------

  App.views.lesson = {
    nav: 'courses',
    render: function (args) {
      const l = App.findLesson(args[0]);
      if (!l) return '<p>레슨을 찾을 수 없습니다.</p>';
      const tab = STEPS.some(function (s) { return s.id === args[1]; }) ? args[1] : 'expressions';
      const ls = App.lessonState(l.id);
      const t = App.findTrack(l.track);
      const myLines = l.dialogue.lines.filter(function (ln) { return ln.s === l.dialogue.you; }).length;
      const subs = { expressions: l.expressions.length + '개 표현' + (l.terms ? ' · 용어 ' + l.terms.length : ''), dialogue: '대사 ' + l.dialogue.lines.length + '줄', roleplay: '내 차례 ' + myLines + '번', quiz: '10문제' };

      const stepper = STEPS.map(function (s, i) {
        const done = stepDone(ls, s.id);
        return '<a class="step' + (s.id === tab ? ' active' : '') + (done ? ' done' : '') + '" href="#/lesson/' + l.id + '/' + s.id + '">' +
          '<span class="step-num">' + (done ? icon('check') : '0' + (i + 1)) + '</span><span class="step-text"><b>' + s.label + '</b><small>' + subs[s.id] + '</small></span></a>';
      }).join('');

      let body;
      if (tab === 'dialogue') body = renderDialogue(l, ls);
      else if (tab === 'roleplay') body = renderRoleplay(l, ls);
      else if (tab === 'quiz') body = renderQuiz(l, ls);
      else body = renderExpressions(l, ls);

      const pct = C.lessonProgress(ls);
      return '<header class="lesson-hero t-' + t.color + '">' +
        '<a class="back" href="#/courses/' + t.id + '">' + icon('back') + esc(t.title) + '</a>' +
        '<div class="lesson-hero-row"><div class="lesson-icon big">' + l.icon + '</div><div class="grow">' +
        '<div class="hero-kicker">L-' + lessonNo(l) + ' · ' + esc(t.titleEn.toUpperCase()) + ' · ' + l.level + '</div>' +
        '<h1>' + esc(l.title) + '</h1><p class="lesson-hero-en">' + esc(l.titleEn) + '</p><p class="lesson-hero-goal">' + esc(l.goal) + '</p></div>' +
        App.ring(pct, 76, null, 'on-dark') + '</div></header>' +
        '<nav class="stepper">' + stepper + '</nav><section class="tab-body">' + body + '</section>';
    },
    after: function () {
      const rp = App.session.rp;
      if (rp && rp.phase === 'turn') {
        const input = document.getElementById('rp-input');
        if (input && document.activeElement !== input) input.focus({ preventScroll: true });
      }
      const chat = document.getElementById('rp-chat');
      if (chat) chat.scrollTop = chat.scrollHeight;
      if (rp && rp.phase !== 'intro') App.revealPanel();
      const quiz = App.session.quiz;
      if (quiz && quiz.phase === 'q' && !quiz.answered) {
        const bi = document.getElementById('blank-input');
        if (bi) bi.focus({ preventScroll: true });
      }
    },
    keydown: function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (e.target.id === 'rp-input') { e.preventDefault(); App.actions['rp-submit'](); }
        else if (e.target.id === 'blank-input') { e.preventDefault(); App.actions['quiz-blank'](); }
      }
    }
  };

  function currentLesson() { return App.findLesson(App.route.args[0]); }

  function nextStepLink(l, tab, label) {
    return '<a class="btn primary" href="#/lesson/' + l.id + '/' + tab + '">' + label + icon('arrow') + '</a>';
  }

  function renderTerms(l) {
    if (!l.terms) return '';
    return '<section class="terms"><div class="section-head"><h2>' + icon('key') + ' 핵심 기술 용어</h2>' +
      '<span class="muted small">회의에서 그대로 쓰이는 용어 ' + l.terms.length + '개와 공학 개념 · 학습 완료 시 복습 카드로 추가돼요</span></div>' +
      '<div class="term-grid">' + l.terms.map(function (t, i) {
        return '<article class="term"><div class="term-top"><span class="term-no mono">' + ('0' + (i + 1)).slice(-2) + '</span>' +
          '<span class="term-en">' + esc(t.en) + '</span>' +
          '<button class="btn icon-only small" data-action="speak" data-text="' + esc(t.en + '. ' + t.ex) + '" title="용어와 예문 듣기">' + icon('speaker') + '</button>' +
          App.favButton(t.id) + '</div>' + App.ipaHtml(t.ipa) + '<p class="term-ko">' + esc(t.ko) + '</p>' +
          (t.def ? '<p class="term-def"><b>개념</b> ' + esc(t.def) + '</p>' : '') +
          '<p class="term-ex">예문 · “' + esc(t.ex) + '”</p></article>';
      }).join('') + '</div></section>';
  }

  function renderExpressions(l, ls) {
    let howto = '표현을 듣고 소리 내어 따라 해 보세요.';
    if (App.CAN_RECORD) howto += ' <b>따라 말하기</b>로 내 발음을 녹음해 원어민 발음과 비교할 수 있어요.';
    if (App.SR) howto += ' <b>말하고 채점</b>을 누르면 발화를 인식해 점수를 매깁니다.';
    if (App.state.settings.showIpa !== false) howto += ' 단어 아래 발음기호는 미국식이며 <b class="ipa-sym">ˈ</b> 바로 뒤 음절을 세게, <b class="ipa-sym">ː</b> 앞 모음을 길게 읽습니다.';

    const list = l.expressions.map(function (e, i) {
      return '<article class="expr card">' +
        '<div class="expr-num mono">' + ('0' + (i + 1)).slice(-2) + '</div><div class="grow">' +
        '<div class="expr-top">' + App.sentenceHtml(e.en, e.ipa, 'en') + App.favButton(e.id) + '</div>' +
        '<p class="ko">' + esc(e.ko) + '</p>' +
        (e.tip ? '<p class="tip">💡 ' + esc(e.tip) + '</p>' : '') +
        '<div class="actions">' + App.speakButtons(e.en) + App.practiceButtons(e.id) + '</div>' +
        '<div class="practice-result">' + App.practiceResultHtml(e.id, e.en) + '</div></div></article>';
    }).join('');

    const count = l.expressions.length + (l.terms ? l.terms.length : 0);
    const footer = ls.expressions
      ? '<div class="done-box">' + icon('check') + '<span class="grow">표현 학습 완료 — 복습 카드에 추가되었습니다.</span>' + nextStepLink(l, 'dialogue', '대화 듣기') + '</div>'
      : '<div class="done-box"><span class="grow">모두 따라 해 봤다면 복습 카드 ' + count + '장으로 저장하세요.</span><button class="btn primary" data-action="expr-done">학습 완료 · 복습 카드에 추가</button></div>';

    const drill = '<a class="drill-cta card" href="#/drill/' + l.id + '"><span class="mode-icon">' + icon('mic') + '</span>' +
      '<span class="grow"><b>스피킹 드릴로 입에 붙이기</b><small>이 레슨 표현 ' + l.expressions.length + '개를 따라 말하고, 한국어만 보고 영어로 말해 보세요.</small></span>' + icon('arrow') + '</a>';
    return '<p class="hint">' + howto + '</p>' + renderTerms(l) +
      (l.terms ? '<div class="section-head"><h2>' + icon('speaker') + ' 핵심 표현</h2></div>' : '') + list + drill + footer;
  }

  function slotOf(d, s) { return Object.keys(d.roles).indexOf(s); }

  function initials(name) { return esc(name.replace(/\(.*\)/, '').trim().charAt(0)); }

  function bubble(d, ln, opts) {
    opts = opts || {};
    const mine = ln.s === d.you;
    return '<div class="line' + (mine ? ' me' : '') + '"' + (opts.id ? ' id="' + opts.id + '"' : '') + '>' +
      '<span class="avatar a' + slotOf(d, ln.s) + '">' + (mine ? '나' : initials(d.roles[ln.s])) + '</span>' +
      '<div class="bubble-wrap"><div class="who">' + esc(d.roles[ln.s]) + '</div><div class="bubble">' + opts.body + '</div></div>' +
      (opts.side || '') + '</div>';
  }

  function koToggle(label) {
    return '<label class="switch"><input type="checkbox" data-action="toggle-ko"' + (showKo ? ' checked' : '') + '><span class="track-sw"></span>' + label + '</label>';
  }

  function renderDialogue(l, ls) {
    const d = l.dialogue;
    const lines = d.lines.map(function (ln, i) {
      return bubble(d, ln, {
        id: 'ln-' + i,
        body: '<p class="en">' + esc(ln.en) + '</p><p class="ko' + (showKo ? '' : ' hidden') + '">' + esc(ln.ko) + '</p>',
        side: '<button class="btn icon-only" data-action="speak" data-text="' + esc(ln.en) + '" data-slot="' + slotOf(d, ln.s) + '" title="듣기">' + icon('speaker') + '</button>'
      });
    }).join('');

    const footer = ls.dialogue
      ? '<div class="done-box">' + icon('check') + '<span class="grow">대화 듣기 완료.</span>' + nextStepLink(l, 'roleplay', '롤플레이') + '</div>'
      : '<div class="done-box"><span class="grow muted">전체 듣기를 끝까지 들으면 자동으로 완료됩니다.</span><button class="btn" data-action="dialogue-done">완료로 표시</button></div>';

    return '<div class="scene card"><span class="scene-tag">🎬 장면</span>' + esc(d.setting) + '</div>' +
      '<div class="toolbar"><button class="btn primary" data-action="play-all">' + icon('play') + '전체 듣기</button>' +
      '<button class="btn" data-action="stop">' + icon('stop') + '정지</button>' + koToggle('한국어 해석') + '</div>' +
      '<div class="dialogue">' + lines + '</div>' + footer;
  }

  async function playAll(l) {
    const token = ++App.playSeq;
    const d = l.dialogue;
    for (let i = 0; i < d.lines.length; i++) {
      highlightLine(i);
      await App.tts.speak(d.lines[i].en, { slot: slotOf(d, d.lines[i].s) });
      if (token !== App.playSeq) return highlightLine(-1);
      await App.sleep(250);
      if (token !== App.playSeq) return highlightLine(-1);
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
    const ls = App.lessonState(l.id);
    if (ls.dialogue) return;
    ls.dialogue = true;
    App.save();
    App.toast('대화 듣기 완료!');
    App.award(C.XP.dialogue);
    App.render();
  }

  // ---------- 롤플레이 ----------

  function renderRoleplay(l, ls) {
    const d = l.dialogue;
    const s = App.session;
    if (!s.rp) s.rp = { phase: 'intro', idx: 0, log: [], scores: [], answer: '', hint: false, result: null };
    const rp = s.rp;

    if (rp.phase === 'intro') {
      const myLines = d.lines.filter(function (ln) { return ln.s === d.you; }).length;
      return '<div class="card intro-card">' +
        '<div class="intro-emoji">🎭</div><h3>내가 <b>' + esc(d.roles[d.you]) + '</b> 역할을 맡습니다</h3>' +
        '<p class="scene-inline">🎬 ' + esc(d.setting) + '</p>' +
        '<ul class="intro-list"><li>상대방의 말을 듣고, 한국어 뜻에 맞게 영어로 답하세요 (내 차례 ' + myLines + '번).</li>' +
        '<li>모범 답안과 단어 단위로 비교해 점수를 드려요. 똑같지 않아도 의미가 통하면 충분합니다.</li>' +
        (App.SR ? '<li>🎤 버튼으로 말해서 입력할 수도 있어요.</li>' : '') + '</ul>' +
        (ls.roleplayBest != null ? '<p>최고 점수 ' + App.scoreBadge(ls.roleplayBest) + '</p>' : '') +
        '<button class="btn primary large" data-action="rp-start">' + icon('play') + '롤플레이 시작</button></div>';
    }

    const chat = rp.log.map(function (m) {
      const mine = m.s === d.you;
      return bubble(d, m, mine
        ? { body: '<p class="en">' + esc(m.said || '(건너뜀)') + '</p><p class="model small">모범 답안 · ' + esc(m.en) + '</p>', side: App.scoreBadge(m.score) }
        : { body: '<p class="en">' + esc(m.en) + '</p><p class="ko' + (showKo ? '' : ' hidden') + '">' + esc(m.ko) + '</p>',
          side: '<button class="btn icon-only" data-action="speak" data-text="' + esc(m.en) + '" data-slot="' + slotOf(d, m.s) + '">' + icon('speaker') + '</button>' });
    }).join('');

    let panel = '';
    const line = d.lines[rp.idx];
    const key = 'rp-' + l.id + '-' + rp.idx;
    if (rp.phase === 'playing') {
      panel = '<div class="turn listening"><span class="pulse-dot"></span>상대방이 말하는 중... <button class="btn small" data-action="rp-skip-audio">건너뛰기</button></div>';
    } else if (rp.phase === 'turn') {
      const hint = line.en.split(/\s+/).slice(0, 3).join(' ') + ' ...';
      panel = '<div class="turn"><div class="eyebrow">내 차례 — 이렇게 말해 보세요</div>' +
        '<p class="ko big">' + esc(line.ko) + '</p>' +
        (rp.hint ? '<p class="hint-text">힌트 · ' + esc(hint) + '</p>' : '') +
        '<div class="composer"><textarea id="rp-input" rows="2" data-input="rp-input" placeholder="영어로 입력하세요 (Enter 제출)">' + esc(rp.answer) + '</textarea>' +
        (App.SR ? '<button class="btn icon-only mic" data-action="rp-listen" title="말해서 입력">' + icon('mic') + '</button>' : '') +
        '<button class="btn primary icon-only" data-action="rp-submit" title="제출">' + icon('send') + '</button></div>' +
        '<div class="actions">' + (App.CAN_RECORD ? App.practiceButtons(key) : '') +
        (rp.hint ? '' : '<button class="btn soft" data-action="rp-hint">💡 힌트</button>') +
        '<button class="btn ghost" data-action="rp-pass">모르겠어요</button></div>' +
        '<div class="practice-result">' + App.practiceResultHtml(key, line.en) + '</div></div>';
    } else if (rp.phase === 'feedback') {
      const r = rp.result;
      panel = '<div class="turn"><div class="feedback-head">' + App.scoreBadge(r.score) + ' <b>' + C.scoreLabel(r.score) + '</b></div>' +
        '<div class="eyebrow">모범 답안 · 빨간 단어가 빠졌거나 달랐어요</div><div class="diff-words big">' + App.diffHtml(r) + '</div>' +
        '<div class="actions">' + App.speakButtons(line.en) + '<button class="btn primary" data-action="rp-next">다음' + icon('arrow') + '</button></div>' +
        '<div class="practice-result">' + App.practiceResultHtml(key, line.en) + '</div></div>';
    } else if (rp.phase === 'done') {
      const avg = average(rp.scores);
      panel = '<div class="turn result-panel"><div class="result-big">' + App.ring(avg, 96, avg + '<small>점</small>') + '</div>' +
        '<h3>롤플레이 완료!</h3><p class="muted">최고 기록 ' + ls.roleplayBest + '점 · 점수가 낮은 문장은 핵심 표현에서 다시 연습해 보세요.</p>' +
        '<div class="actions centered"><button class="btn" data-action="rp-start">다시 하기</button>' + nextStepLink(l, 'quiz', '퀴즈 풀기') + '</div></div>';
    }

    return '<div class="toolbar">' + koToggle('상대방 말 해석') + '</div>' +
      '<div class="chat card" id="rp-chat">' + (chat || '<p class="muted center">대화가 곧 시작됩니다...</p>') + '</div>' + panel;
  }

  function average(arr) {
    return arr.length ? Math.round(arr.reduce(function (a, b) { return a + b; }, 0) / arr.length) : 0;
  }

  async function rpAdvance(l) {
    const d = l.dialogue;
    const token = ++App.playSeq;
    const rp = App.session.rp;
    while (rp.idx < d.lines.length && d.lines[rp.idx].s !== d.you) {
      const ln = d.lines[rp.idx];
      rp.log.push({ s: ln.s, en: ln.en, ko: ln.ko });
      rp.idx++;
      rp.phase = 'playing';
      App.render();
      await App.tts.speak(ln.en, { slot: slotOf(d, ln.s) });
      if (token !== App.playSeq || App.session.rp !== rp) return;
      await App.sleep(200);
    }
    if (rp.idx >= d.lines.length) {
      const ls = App.lessonState(l.id);
      ls.roleplayBest = Math.max(ls.roleplayBest || 0, average(rp.scores));
      App.save();
      rp.phase = 'done';
      App.checkBadges();
    } else {
      rp.phase = 'turn';
      rp.answer = '';
      rp.hint = false;
      rp.result = null;
    }
    App.render();
  }

  function rpSubmit(l, text) {
    const rp = App.session.rp;
    const line = l.dialogue.lines[rp.idx];
    const result = C.compareSentence(line.en, text);
    rp.result = result;
    rp.scores.push(result.score);
    rp.log.push({ s: line.s, en: line.en, said: text, score: result.score });
    rp.phase = 'feedback';
    App.render();
    if (text) App.award(Math.round(C.XP.roleplayTurn * (0.5 + result.score / 200)));
  }

  // ---------- 퀴즈 ----------

  function renderQuiz(l, ls) {
    const s = App.session;
    if (!s.quiz) s.quiz = { phase: 'intro' };
    const quiz = s.quiz;

    if (quiz.phase === 'intro') {
      return '<div class="card intro-card"><div class="intro-emoji">📝</div><h3>레슨 퀴즈 10문제</h3>' +
        '<ul class="intro-list"><li>상황 판단 · 뜻 고르기 · 빈칸 채우기 · 문장 배열이 섞여 나옵니다.</li>' +
        '<li>' + C.QUIZ_PASS + '점 이상이면 이 단계가 완료돼요. 정답마다 +' + C.XP.quizCorrect + ' XP.</li></ul>' +
        (ls.quizBest != null ? '<p>최고 점수 ' + App.scoreBadge(ls.quizBest) + '</p>' : '') +
        '<button class="btn primary large" data-action="quiz-start">' + icon('play') + '퀴즈 시작</button></div>';
    }

    if (quiz.phase === 'done') {
      const score = Math.round((quiz.correct / quiz.qs.length) * 100);
      const passed = score >= C.QUIZ_PASS;
      const wrong = quiz.wrong.map(function (q) {
        const full = q.full || q.options[q.answer];
        const mine = q.type === 'choice' && q.picked != null ? q.options[q.picked] : null;
        return '<li><span class="muted small">' + esc(q.sub || q.prompt) + '</span><div class="wrong-row"><b>' + App.markDiff(full, mine) + '</b>' +
          '<button class="btn icon-only" data-action="speak" data-text="' + esc(full) + '">' + icon('speaker') + '</button></div>' +
          (mine ? '<div class="my-pick">내 답 · ' + App.markDiff(mine, full) + '</div>' : '') + '</li>';
      }).join('');
      return '<div class="card result-panel"><div class="result-big">' + App.ring(score, 112, score + '<small>점</small>', passed ? 'ok' : 'warn') + '</div>' +
        '<h3>' + (passed ? '🎉 통과!' : '조금만 더 힘내요!') + '</h3>' +
        '<p class="muted">' + quiz.qs.length + '문제 중 ' + quiz.correct + '문제 정답 · 최고 기록 ' + ls.quizBest + '점</p>' +
        (wrong ? '<div class="wrong-list"><div class="eyebrow">틀린 문제 다시 보기</div><ul>' + wrong + '</ul></div>' : '') +
        '<div class="actions centered"><button class="btn" data-action="quiz-start">다시 풀기</button>' +
        (passed ? '<a class="btn primary" href="#/courses">다른 레슨 보기' + icon('arrow') + '</a>' : '') + '</div></div>';
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
        return '<button class="' + cls + '" data-action="quiz-choose" data-i="' + i + '"' + (a ? ' disabled' : '') + '>' +
          '<span class="opt-key">' + 'ABCD'.charAt(i) + '</span><span class="opt-text">' +
          (a ? App.optionText(q.options, i, q.answer, a.picked) : esc(opt)) + '</span></button>';
      }).join('') + '</div>' + (a && !a.correct ? '<p class="diff-hint">밑줄 친 단어가 정답과 다른 부분이에요</p>' : '');
    } else if (q.type === 'blank') {
      bodyHtml = '<p class="en big sentence">' + esc(q.sentence) + '</p>' +
        '<div class="composer narrow"><input id="blank-input" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="단어 입력"' +
        (a ? ' disabled value="' + esc(a.input) + '"' : '') + '>' +
        (a ? '' : '<button class="btn primary" data-action="quiz-blank">확인</button>') + '</div>';
    } else {
      const picked = quiz.picked;
      bodyHtml = '<div class="order-answer">' + (picked.length
        ? picked.map(function (wi, pi) {
          return '<button class="chip-btn picked" data-action="quiz-unpick" data-i="' + pi + '"' + (a ? ' disabled' : '') + '>' + esc(q.words[wi]) + '</button>';
        }).join('')
        : '<span class="muted">아래 단어를 순서대로 누르세요</span>') + '</div>' +
        '<div class="order-bank">' + q.words.map(function (w, wi) {
          return picked.indexOf(wi) === -1
            ? '<button class="chip-btn" data-action="quiz-pick" data-i="' + wi + '"' + (a ? ' disabled' : '') + '>' + esc(w) + '</button>' : '';
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
        (q.type !== 'choice' || !a.correct ? '<p class="en">' + esc(full) + ' <button class="btn icon-only small" data-action="speak" data-text="' + esc(full) + '">' + icon('speaker') + '</button></p>' : '') +
        App.ipaHtml(q.ipa) +
        (q.explain ? '<p class="muted">💡 ' + esc(q.explain) + '</p>' : '') +
        '<button class="btn primary" data-action="quiz-next">' + (quiz.i + 1 < quiz.qs.length ? '다음 문제' : '결과 보기') + icon('arrow') + '</button></div>';
    }

    return '<div class="progress-row"><span>' + (quiz.i + 1) + ' / ' + quiz.qs.length + '</span>' +
      App.bar(Math.round((quiz.i / quiz.qs.length) * 100)) + '<span>정답 ' + quiz.correct + '</span></div>' +
      '<div class="card quiz-card"><p class="q-prompt">' + esc(q.prompt) + '</p>' +
      (q.sub ? '<p class="q-sub">' + esc(q.sub) + '</p>' : '') + bodyHtml + feedback + '</div>';
  }

  function quizAnswer(correct, extra) {
    const quiz = App.session.quiz;
    const q = quiz.qs[quiz.i];
    quiz.answered = Object.assign({ correct: correct }, extra);
    if (correct) quiz.correct++;
    else quiz.wrong.push(Object.assign({}, q, { picked: extra && extra.picked }));
    App.render();
    if (correct) App.award(C.XP.quizCorrect);
  }

  // ---------- 모바일 메뉴 ----------

  App.views.more = {
    nav: 'home', tab: 'more',
    render: function () {
      const items = [
        ['#/ai', 'ai', 'AI 회의 파트너', 'AI와 자유롭게 회의하고 교정받기'],
        ['#/phrasebook', 'phrasebook', '표현 사전', '전체 표현 검색 · 즐겨찾기 · 인쇄'],
        ['#/stats', 'stats', '내 기록', '레벨 · 배지 · 학습 캘린더'],
        ['#/settings', 'settings', '설정', '음성 · AI 키 · 데이터 백업']
      ];
      return '<header class="page-head"><h1>메뉴</h1></header><div class="menu-list">' + items.map(function (it) {
        return '<a class="menu-item card" href="' + it[0] + '"><span class="menu-icon">' + icon(it[1]) + '</span>' +
          '<span class="grow"><b>' + it[2] + '</b><span class="muted small">' + it[3] + '</span></span>' + icon('arrow') + '</a>';
      }).join('') + '</div>';
    }
  };

  // ---------- 액션 ----------

  Object.assign(App.actions, {
    'expr-done': function () {
      const l = currentLesson();
      const now = Date.now();
      const cards = l.expressions.concat(l.terms || []);
      cards.forEach(function (e) { if (!App.state.srs[e.id]) App.state.srs[e.id] = C.newCard(now); });
      App.lessonState(l.id).expressions = true;
      App.save();
      App.toast('복습 카드 ' + cards.length + '장이 추가되었습니다.');
      App.award(C.XP.expressions);
      App.render();
    },
    'play-all': function () { playAll(currentLesson()); },
    'toggle-ko': function (el) {
      showKo = el.checked;
      document.querySelectorAll('.bubble .ko').forEach(function (k) { k.classList.toggle('hidden', !showKo); });
    },
    'dialogue-done': function () { markDialogueDone(currentLesson()); },

    'rp-start': function () {
      App.stopAll();
      App.session.rp = { phase: 'playing', idx: 0, log: [], scores: [], answer: '', hint: false, result: null };
      rpAdvance(currentLesson());
    },
    'rp-skip-audio': function () { App.tts.stop(); },
    'rp-hint': function () { App.session.rp.hint = true; App.render(); },
    'rp-submit': function () {
      const rp = App.session.rp;
      if (!rp || rp.phase !== 'turn') return;
      const text = rp.answer.trim();
      if (!text) { App.toast('답을 입력하거나 “모르겠어요”를 눌러 주세요.'); return; }
      rpSubmit(currentLesson(), text);
    },
    'rp-pass': function () { rpSubmit(currentLesson(), ''); },
    'rp-listen': function (el) {
      el.classList.add('recording');
      el.disabled = true;
      App.listenOnce().then(function (text) {
        App.session.rp.answer = text;
        App.render();
      }).catch(function () {
        App.toast('음성 인식에 실패했습니다. 직접 입력해 주세요.');
        App.render();
      });
    },
    'rp-next': function () {
      App.session.rp.idx++;
      rpAdvance(currentLesson());
    },

    'quiz-start': function () {
      App.session.quiz = { phase: 'q', qs: C.buildQuiz(currentLesson()), i: 0, correct: 0, wrong: [], answered: null, picked: [] };
      App.render();
    },
    'quiz-choose': function (el) {
      const i = Number(el.dataset.i);
      quizAnswer(i === App.session.quiz.qs[App.session.quiz.i].answer, { picked: i });
    },
    'quiz-blank': function () {
      const quiz = App.session.quiz;
      if (!quiz || quiz.answered) return;
      const input = document.getElementById('blank-input').value;
      if (!input.trim()) return;
      quizAnswer(C.isBlankCorrect(input, quiz.qs[quiz.i].answer), { input: input });
    },
    'quiz-pick': function (el) { App.session.quiz.picked.push(Number(el.dataset.i)); App.render(); },
    'quiz-unpick': function (el) { App.session.quiz.picked.splice(Number(el.dataset.i), 1); App.render(); },
    'quiz-reset-order': function () { App.session.quiz.picked = []; App.render(); },
    'quiz-order': function () {
      const quiz = App.session.quiz;
      const q = quiz.qs[quiz.i];
      const sentence = quiz.picked.map(function (wi) { return q.words[wi]; }).join(' ');
      quizAnswer(sentence === q.answer.join(' '), {});
    },
    'quiz-next': function () {
      const quiz = App.session.quiz;
      quiz.i++;
      quiz.answered = null;
      quiz.picked = [];
      if (quiz.i >= quiz.qs.length) {
        const score = Math.round((quiz.correct / quiz.qs.length) * 100);
        const ls = App.lessonState(currentLesson().id);
        const firstPass = score >= C.QUIZ_PASS && !(ls.quizBest >= C.QUIZ_PASS);
        ls.quizBest = Math.max(ls.quizBest || 0, score);
        App.save();
        quiz.phase = 'done';
        App.render();
        if (firstPass) App.award(C.XP.quizPass);
        else App.checkBadges();
      } else {
        App.render();
      }
      window.scrollTo(0, 0);
    }
  });

  Object.assign(App.changes, {
    'rp-input': function (el) { if (App.session.rp) App.session.rp.answer = el.value; }
  });
})();
