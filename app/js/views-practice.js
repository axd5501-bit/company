/* 실전 연습: 허브, 회의 시뮬레이션, 스피드 챌린지, 오디오 학습 */
(function () {
  'use strict';

  const App = window.App;
  const C = App.C;
  const esc = App.esc;
  const icon = App.icon;

  const SIM_SECONDS = 25;
  const SPEED_SECONDS = 60;

  let showKo = false;

  function findScenario(id) { return App.SCENARIOS.find(function (s) { return s.id === id; }); }

  function gradeLetter(pct) { return pct >= 90 ? 'S' : pct >= 75 ? 'A' : pct >= 55 ? 'B' : 'C'; }

  // ---------- 허브 ----------

  App.views.practice = {
    nav: 'practice',
    render: function () {
      const st = App.state;
      const sims = App.SCENARIOS.map(function (sc) {
        const best = st.sim[sc.id];
        const t = App.findTrack(sc.track);
        return '<a class="sim-card card t-' + t.color + '" href="#/sim/' + sc.id + '">' +
          '<div class="sim-top"><span class="sim-icon">' + sc.icon + '</span>' +
          (best != null ? '<span class="grade-badge g-' + gradeLetter(best) + '">' + gradeLetter(best) + '</span>' : '<span class="chip">NEW</span>') + '</div>' +
          '<h3>' + esc(sc.title) + '</h3><p class="muted small">' + esc(sc.brief) + '</p>' +
          '<div class="sim-meta"><span class="chip">' + sc.level + '</span><span class="chip">' + sc.steps.length + '번의 결정</span>' +
          '<span class="chip">나: ' + esc(sc.you) + '</span></div></a>';
      }).join('');

      const modes = [
        { href: '#/speed', icon: 'bolt', cls: 'm-amber', title: '스피드 챌린지', desc: '60초 동안 한국어 뜻에 맞는 영어 표현을 최대한 많이 맞혀 보세요.', meta: '최고 기록 ' + (st.stats.speedBest || 0) + '점' },
        { href: '#/audio', icon: 'headphones', cls: 'm-teal', title: '오디오 학습', desc: '출퇴근길에 듣기만 하세요. 영어 → 한국어 뜻 → 천천히 영어 순서로 자동 재생합니다.', meta: '핸즈프리' },
        { href: '#/ai', icon: 'ai', cls: 'm-violet', title: 'AI 회의 파트너', desc: 'AI가 상대역을 맡아 자유롭게 대화하고, 내 문장을 바로 교정해 줍니다.', meta: st.settings.apiKey ? '바로 시작' : 'API 키 필요' }
      ].map(function (m) {
        return '<a class="mode-card card ' + m.cls + '" href="' + m.href + '"><span class="mode-icon">' + icon(m.icon) + '</span>' +
          '<h3>' + m.title + '</h3><p class="muted small">' + m.desc + '</p><span class="mode-meta">' + m.meta + icon('arrow') + '</span></a>';
      }).join('');

      return '<header class="page-head"><h1>실전 연습</h1><p class="muted">레슨에서 익힌 표현을 실제 회의처럼 써 보세요.</p></header>' +
        '<div class="section-head"><h2>' + icon('film') + ' 회의 시뮬레이션</h2><span class="muted small">제한 시간 안에 최선의 답을 고르고 정중함 · 명확성 · 주도성을 평가받아요</span></div>' +
        '<div class="sim-grid">' + sims + '</div>' +
        '<div class="section-head"><h2>트레이닝 모드</h2></div><div class="mode-grid">' + modes + '</div>';
    }
  };

  // ---------- 회의 시뮬레이션 ----------

  function simBubble(sc, s, en, ko, extra) {
    const mine = s === 'me';
    const name = mine ? '나 (' + sc.you + ')' : sc.roles[s];
    const idx = mine ? 0 : Object.keys(sc.roles).indexOf(s) + 1;
    return '<div class="line' + (mine ? ' me' : '') + '"><span class="avatar a' + idx + '">' + (mine ? '나' : esc(name.charAt(0))) + '</span>' +
      '<div class="bubble-wrap"><div class="who">' + esc(name) + '</div><div class="bubble"><p class="en">' + esc(en) + '</p>' +
      (ko ? '<p class="ko' + (showKo ? '' : ' hidden') + '">' + esc(ko) + '</p>' : '') + '</div></div>' + (extra || '') + '</div>';
  }

  const GRADE_INFO = [
    { label: '주의가 필요해요', icon: '⚠️', cls: 'g0' },
    { label: '무난해요', icon: '👍', cls: 'g1' },
    { label: '최고의 답변!', icon: '🌟', cls: 'g2' }
  ];

  App.views.sim = {
    nav: 'practice', tab: 'practice',
    render: function (args) {
      const sc = findScenario(args[0]);
      if (!sc) return '<p>시나리오를 찾을 수 없습니다.</p>';
      const s = App.session;
      if (!s.sim) s.sim = { phase: 'intro', timed: true };
      const sim = s.sim;
      const back = '<a class="back" href="#/practice">' + icon('back') + '실전 연습</a>';

      if (sim.phase === 'intro') {
        const roles = Object.keys(sc.roles).map(function (k) { return '<li>' + esc(sc.roles[k]) + '</li>'; }).join('');
        const best = App.state.sim[sc.id];
        return back + '<div class="card intro-card sim-intro"><div class="intro-emoji">' + sc.icon + '</div>' +
          '<div class="eyebrow">회의 시뮬레이션 · ' + sc.level + '</div><h2>' + esc(sc.title) + '</h2>' +
          '<p>' + esc(sc.brief) + '</p>' +
          '<div class="sim-roles"><div><span class="muted small">나의 역할</span><b>' + esc(sc.you) + '</b></div>' +
          '<div><span class="muted small">상대방</span><ul>' + roles + '</ul></div></div>' +
          '<div class="skill-chips">' + Object.keys(C.SKILLS).map(function (k) { return '<span class="chip">' + C.SKILLS[k] + '</span>'; }).join('') + '</div>' +
          '<label class="switch"><input type="checkbox" data-change="sim-timed"' + (sim.timed ? ' checked' : '') + '><span class="track-sw"></span>제한 시간 ' + SIM_SECONDS + '초 (실전 모드)</label>' +
          (best != null ? '<p>최고 기록 <span class="grade-badge g-' + gradeLetter(best) + '">' + gradeLetter(best) + '</span> ' + best + '점</p>' : '') +
          '<button class="btn primary large" data-action="sim-start">' + icon('play') + '회의 시작</button></div>';
      }

      if (sim.phase === 'done') {
        const r = C.simResult(sc.steps, sim.grades);
        const bars = Object.keys(r.skills).map(function (k) {
          return '<div class="skill-row"><span>' + C.SKILLS[k] + '</span>' + App.bar(r.skills[k]) + '<b>' + r.skills[k] + '</b></div>';
        }).join('');
        const review = sc.steps.map(function (st, i) {
          const picked = sim.picks[i];
          const best = st.choices.find(function (c) { return c.grade === 2; });
          const g = sim.grades[i] || 0;
          return '<li class="review-item"><div class="muted small">' + esc(sc.roles[st.s]) + ': “' + esc(st.en) + '”</div>' +
            '<div class="pick ' + GRADE_INFO[g].cls + '">' + GRADE_INFO[g].icon + ' ' + (picked ? esc(picked.en) : '(시간 초과)') + '</div>' +
            (g < 2 ? '<div class="best-line">🌟 ' + esc(best.en) + ' <button class="btn icon-only small" data-action="speak" data-text="' + esc(best.en) + '">' + icon('speaker') + '</button></div>' : '') + '</li>';
        }).join('');
        return back + '<div class="card result-panel sim-result">' +
          '<div class="grade-hero g-' + r.letter + '"><span class="grade-letter">' + r.letter + '</span><span>' + r.pct + '점</span></div>' +
          '<h3>' + (r.letter === 'S' ? '완벽한 회의 진행이었어요!' : r.letter === 'A' ? '훌륭해요! 실전에서도 통할 거예요.' : r.letter === 'B' ? '좋아요. 아쉬웠던 순간을 다시 봐요.' : '다시 도전해 볼까요?') + '</h3>' +
          '<div class="skills">' + bars + '</div>' +
          '<div class="wrong-list"><div class="eyebrow">결정 다시 보기</div><ol>' + review + '</ol></div>' +
          '<div class="actions centered"><button class="btn" data-action="sim-start">다시 도전</button><a class="btn primary" href="#/practice">다른 시나리오' + icon('arrow') + '</a></div></div>';
      }

      // 진행 중
      const step = sc.steps[sim.i];
      const transcript = sim.log.map(function (m) { return simBubble(sc, m.s, m.en, m.ko); }).join('');
      let panel;
      if (sim.phase === 'listening') {
        panel = '<div class="turn listening"><span class="pulse-dot"></span>' + esc(sc.roles[step.s]) + ' 님이 말하는 중... ' +
          '<button class="btn small" data-action="sim-skip-audio">건너뛰기</button></div>';
      } else if (sim.phase === 'choose') {
        const remain = sim.deadline ? Math.max(0, sim.deadline - Date.now()) : 0;
        panel = '<div class="turn"><div class="choose-head"><div class="eyebrow">어떻게 답할까요?</div>' +
          (sim.deadline ? '<span class="timer-num" id="sim-timer">' + Math.ceil(remain / 1000) + '초</span>' : '') + '</div>' +
          (sim.deadline ? '<div class="timer"><div class="timer-fill" style="--from:' + (remain / (SIM_SECONDS * 10)).toFixed(1) + '%;animation-duration:' + (remain / 1000).toFixed(1) + 's"></div></div>' : '') +
          '<div class="options">' + sim.order.map(function (ci, n) {
            return '<button class="option" data-action="sim-choose" data-i="' + ci + '"><span class="opt-key">' + 'ABC'.charAt(n) + '</span><span>' + esc(step.choices[ci].en) + '</span></button>';
          }).join('') + '</div></div>';
      } else {
        const picked = sim.answered;
        const g = picked ? picked.grade : 0;
        const best = step.choices.find(function (c) { return c.grade === 2; });
        panel = '<div class="turn feedback-card ' + GRADE_INFO[g].cls + '"><div class="feedback-head"><span class="grade-icon">' + GRADE_INFO[g].icon + '</span><b>' +
          (picked ? GRADE_INFO[g].label : '시간 초과!') + '</b><span class="muted small">' + C.SKILLS[step.skill] + ' 평가</span></div>' +
          '<p>' + esc(picked ? picked.feedback : '회의에서 침묵이 길어지면 자신감이 없어 보여요. 완벽하지 않아도 먼저 말해 보세요.') + '</p>' +
          (g < 2 ? '<div class="best-line">🌟 더 좋은 답변 · <b>' + esc(best.en) + '</b> <button class="btn icon-only small" data-action="speak" data-text="' + esc(best.en) + '">' + icon('speaker') + '</button></div>' : '') +
          '<div class="actions"><button class="btn primary" data-action="sim-next">' + (sim.i + 1 < sc.steps.length ? '계속' : '결과 보기') + icon('arrow') + '</button></div></div>';
      }

      return back + '<div class="sim-head"><div><div class="eyebrow">' + sc.icon + ' ' + esc(sc.title) + '</div>' +
        '<div class="progress-row"><span>' + (sim.i + 1) + ' / ' + sc.steps.length + '</span>' + App.bar(Math.round((sim.i / sc.steps.length) * 100)) + '</div></div>' +
        '<label class="switch"><input type="checkbox" data-action="sim-ko"' + (showKo ? ' checked' : '') + '><span class="track-sw"></span>해석</label></div>' +
        '<div class="chat card" id="sim-chat">' + transcript + '</div>' + panel;
    },
    after: function () {
      const chat = document.getElementById('sim-chat');
      if (chat) chat.scrollTop = chat.scrollHeight;
      const sim = App.session.sim;
      if (sim && sim.phase !== 'intro' && sim.phase !== 'done') App.revealPanel();
    }
  };

  function currentScenario() { return findScenario(App.route.args[0]); }

  async function simStep() {
    const sc = currentScenario();
    const sim = App.session.sim;
    const step = sc.steps[sim.i];
    const token = ++App.playSeq;
    sim.log.push({ s: step.s, en: step.en, ko: step.ko });
    sim.phase = 'listening';
    sim.answered = null;
    sim.order = C.shuffle([0, 1, 2], Math.random);
    App.render();
    await App.tts.speak(step.en, { slot: Object.keys(sc.roles).indexOf(step.s) + 1 });
    if (token !== App.playSeq || App.session.sim !== sim) return;
    sim.phase = 'choose';
    if (sim.timed) {
      sim.deadline = Date.now() + SIM_SECONDS * 1000;
      clearInterval(sim.tick);
      sim.tick = setInterval(function () {
        const left = sim.deadline - Date.now();
        const el = document.getElementById('sim-timer');
        if (el) el.textContent = Math.max(0, Math.ceil(left / 1000)) + '초';
        if (left <= 0) simAnswer(null);
      }, 250);
    } else {
      sim.deadline = 0;
    }
    App.render();
  }

  async function simAnswer(choice) {
    const sc = currentScenario();
    const sim = App.session.sim;
    if (!sim || sim.phase !== 'choose') return;
    clearInterval(sim.tick);
    const step = sc.steps[sim.i];
    sim.answered = choice;
    sim.picks[sim.i] = choice;
    sim.grades[sim.i] = choice ? choice.grade : 0;
    sim.phase = 'feedback';
    if (choice) sim.log.push({ s: 'me', en: choice.en });
    const reply = choice ? choice.reply : { en: "Hello? Are you still with us?", ko: "여보세요? 듣고 계세요?" };
    const replyS = reply.s || step.s;
    sim.log.push({ s: replyS, en: reply.en, ko: reply.ko });
    App.render();
    if (choice) App.award(C.XP.simStep * choice.grade);
    const token = ++App.playSeq;
    await App.tts.speak(reply.en, { slot: Object.keys(sc.roles).indexOf(replyS) + 1 });
    if (token !== App.playSeq) return;
  }

  // ---------- 스피드 챌린지 ----------

  function speedPool(source) {
    let ids;
    if (source === 'learned') ids = Object.keys(App.state.srs).filter(function (id) { return App.EXPRS[id]; });
    else if (source === 'favorites') ids = App.state.favorites.filter(function (id) { return App.EXPRS[id]; });
    else if (source && source !== 'all') ids = Object.keys(App.EXPRS).filter(function (id) { return App.EXPRS[id].lesson.track === source; });
    else ids = Object.keys(App.EXPRS);
    return ids.map(function (id) { return App.EXPRS[id].expr; });
  }

  App.views.speed = {
    nav: 'practice', tab: 'practice',
    render: function () {
      const s = App.session;
      if (!s.sp) s.sp = { phase: 'intro', source: 'all' };
      const sp = s.sp;
      const back = '<a class="back" href="#/practice">' + icon('back') + '실전 연습</a>';
      const best = App.state.stats.speedBest || 0;

      if (sp.phase === 'intro') {
        const sources = [['all', '전체 표현']].concat(App.TRACKS.map(function (t) { return [t.id, t.icon + ' ' + t.title]; }))
          .concat([['learned', '복습 카드'], ['favorites', '⭐ 즐겨찾기']]);
        const chips = sources.map(function (src) {
          const n = speedPool(src[0]).length;
          const ok = n >= 4;
          return '<button class="chip-btn' + (sp.source === src[0] ? ' picked' : '') + '" data-action="speed-source" data-src="' + src[0] + '"' + (ok ? '' : ' disabled') + '>' +
            esc(src[1]) + ' <small>' + n + '</small></button>';
        }).join('');
        return back + '<div class="card intro-card"><div class="intro-emoji">⚡</div><h2>스피드 챌린지</h2>' +
          '<p>' + SPEED_SECONDS + '초 동안 한국어 뜻에 맞는 영어 표현을 고르세요. 연속으로 맞히면 콤보! 틀리면 3초가 줄어듭니다.</p>' +
          '<div class="eyebrow">출제 범위</div><div class="chip-row">' + chips + '</div>' +
          '<p>최고 기록 <b>' + best + '점</b></p>' +
          '<button class="btn primary large" data-action="speed-start">' + icon('bolt') + '시작</button></div>';
      }

      if (sp.phase === 'done') {
        const missed = sp.missed.map(function (id) {
          const e = App.EXPRS[id].expr;
          return '<li><span class="muted small">' + esc(e.ko) + '</span><div class="wrong-row"><b>' + esc(e.en) + '</b>' +
            '<button class="btn icon-only" data-action="speak" data-text="' + esc(e.en) + '">' + icon('speaker') + '</button></div></li>';
        }).join('');
        return back + '<div class="card result-panel"><div class="speed-score">' + sp.score + '<small>점</small></div>' +
          '<h3>' + (sp.newBest ? '🏆 최고 기록 경신!' : '수고했어요!') + '</h3>' +
          '<p class="muted">최대 콤보 ' + sp.bestCombo + ' · 최고 기록 ' + best + '점</p>' +
          (missed ? '<div class="wrong-list"><div class="eyebrow">놓친 표현</div><ul>' + missed + '</ul></div>' : '') +
          '<div class="actions centered"><button class="btn primary" data-action="speed-start">다시 도전</button><button class="btn" data-action="speed-intro">범위 바꾸기</button></div></div>';
      }

      const q = sp.q;
      const remain = Math.max(0, sp.deadline - Date.now());
      return back + '<div class="speed-hud"><span class="speed-time" id="speed-time">' + Math.ceil(remain / 1000) + '</span>' +
        '<div class="grow">' + '<div class="timer"><div class="timer-fill" id="speed-bar" style="width:' + (remain / (SPEED_SECONDS * 10)) + '%"></div></div></div>' +
        '<span class="speed-points">' + sp.score + '점</span>' + (sp.combo >= 2 ? '<span class="combo">🔥 ' + sp.combo + ' 콤보</span>' : '') + '</div>' +
        '<div class="card speed-card' + (sp.flash ? ' flash-' + sp.flash : '') + '"><div class="eyebrow">이 뜻의 영어 표현은?</div>' +
        '<p class="speed-ko">' + esc(q.ko) + '</p><div class="options">' + q.options.map(function (o, i) {
          let cls = 'option';
          if (sp.reveal != null) { if (i === q.answer) cls += ' correct'; else if (i === sp.reveal) cls += ' wrong'; }
          return '<button class="' + cls + '" data-action="speed-answer" data-i="' + i + '"' + (sp.reveal != null ? ' disabled' : '') + '>' +
            '<span class="opt-key">' + (i + 1) + '</span><span>' + esc(o) + '</span></button>';
        }).join('') + '</div></div><p class="muted small center">키보드 1~4 로도 답할 수 있어요</p>';
    },
    keydown: function (e) {
      const sp = App.session.sp;
      if (!sp || sp.phase !== 'play' || sp.reveal != null) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4) { e.preventDefault(); speedAnswer(n - 1); }
    }
  };

  function speedNext() {
    const sp = App.session.sp;
    sp.q = C.speedQuestion(sp.pool, Math.random, sp.q && sp.q.id);
    sp.reveal = null;
  }

  function speedAnswer(i) {
    const sp = App.session.sp;
    if (sp.phase !== 'play' || sp.reveal != null) return;
    if (i === sp.q.answer) {
      sp.combo++;
      sp.bestCombo = Math.max(sp.bestCombo, sp.combo);
      sp.score += 1 + (sp.combo >= 5 ? 1 : 0);
      sp.flash = 'ok';
      speedNext();
      App.render();
    } else {
      sp.combo = 0;
      sp.deadline -= 3000;
      sp.flash = 'no';
      sp.reveal = i;
      if (sp.missed.indexOf(sp.q.id) === -1) sp.missed.push(sp.q.id);
      App.render();
      setTimeout(function () {
        if (App.session.sp !== sp || sp.phase !== 'play') return;
        sp.flash = null;
        speedNext();
        App.render();
      }, 700);
    }
  }

  function speedFinish() {
    const sp = App.session.sp;
    clearInterval(sp.tick);
    sp.phase = 'done';
    const stats = App.state.stats;
    sp.newBest = sp.score > (stats.speedBest || 0);
    if (sp.newBest) stats.speedBest = sp.score;
    App.save();
    App.render();
    if (sp.score) App.award(sp.score * C.XP.speedCorrect);
    else App.checkBadges();
  }

  // ---------- 오디오 학습 ----------

  function audioItems(source) {
    if (source === 'favorites') return App.state.favorites.filter(function (id) { return App.phrase(id); });
    if (source === 'review') return Object.keys(App.state.srs).filter(function (id) { return App.phrase(id); });
    if (source && source !== 'all') {
      return Object.keys(App.EXPRS).filter(function (id) { return App.EXPRS[id].lesson.track === source; });
    }
    return Object.keys(App.EXPRS);
  }

  App.views.audio = {
    nav: 'practice', tab: 'practice',
    render: function () {
      const s = App.session;
      if (!s.au) s.au = { source: 'all', items: audioItems('all'), i: 0, playing: false };
      const au = s.au;
      const back = '<a class="back" href="#/practice">' + icon('back') + '실전 연습</a>';
      const sources = [['all', '전체']].concat(App.TRACKS.map(function (t) { return [t.id, t.icon + ' ' + t.title]; }))
        .concat([['review', '복습 카드'], ['favorites', '⭐ 즐겨찾기']]);
      const chips = sources.map(function (src) {
        const n = audioItems(src[0]).length;
        return '<button class="chip-btn' + (au.source === src[0] ? ' picked' : '') + '" data-action="audio-source" data-src="' + src[0] + '"' + (n ? '' : ' disabled') + '>' +
          esc(src[1]) + ' <small>' + n + '</small></button>';
      }).join('');

      const p = au.items.length ? App.phrase(au.items[au.i]) : null;
      const readKo = App.state.settings.readKorean;
      const noKoVoice = readKo && App.tts.supported && !App.tts.koVoices.length;

      return back + '<header class="page-head"><h1>' + icon('headphones') + ' 오디오 학습</h1>' +
        '<p class="muted">영어 → ' + (readKo ? '한국어 뜻 → ' : '') + '천천히 영어 순서로 자동 재생합니다. 이동 중에 들으며 따라 말해 보세요.</p></header>' +
        '<div class="chip-row">' + chips + '</div>' +
        (p ? '<div class="card player' + (au.playing ? ' playing' : '') + '">' +
          '<div class="player-meta"><span class="eyebrow">' + esc(p.source) + '</span><span class="muted small">' + (au.i + 1) + ' / ' + au.items.length + '</span></div>' +
          '<p class="en player-en">' + esc(p.en) + '</p><p class="player-ko">' + esc(p.ko) + '</p>' +
          '<div class="eq' + (au.playing ? ' on' : '') + '"><i></i><i></i><i></i><i></i><i></i></div>' +
          App.bar(Math.round(((au.i + 1) / au.items.length) * 100)) +
          '<div class="player-controls"><button class="btn icon-only round" data-action="audio-prev" title="이전">' + icon('prev') + '</button>' +
          '<button class="btn primary round big" data-action="audio-toggle" title="' + (au.playing ? '일시정지' : '재생') + '">' + icon(au.playing ? 'pause' : 'play') + '</button>' +
          '<button class="btn icon-only round" data-action="audio-next" title="다음">' + icon('next') + '</button></div></div>'
          : '<div class="card center muted">재생할 표현이 없어요.</div>') +
        '<div class="card settings-inline"><label class="switch"><input type="checkbox" data-change="audio-ko"' + (readKo ? ' checked' : '') + '><span class="track-sw"></span>한국어 뜻도 읽어 주기</label>' +
        '<button class="btn soft" data-action="audio-shuffle">순서 섞기</button></div>' +
        (noKoVoice ? '<p class="warn small">이 기기에는 한국어 음성이 없어 한국어 뜻은 화면에만 표시됩니다.</p>' : '') +
        '<p class="muted small">휴대폰 화면이 꺼지면 재생이 멈출 수 있어요. 화면을 켜 두고 들어 주세요.</p>';
    }
  };

  async function audioLoop() {
    const au = App.session.au;
    const token = ++App.playSeq;
    const alive = function () { return token === App.playSeq && App.session.au === au && au.playing; };
    au.playing = true;
    App.render();
    while (au.i < au.items.length) {
      const p = App.phrase(au.items[au.i]);
      await App.tts.speak(p.en);
      if (!alive()) return;
      await App.sleep(900);
      if (!alive()) return;
      if (App.state.settings.readKorean && App.tts.koVoices.length) {
        await App.tts.speak(p.ko, { lang: 'ko' });
        if (!alive()) return;
        await App.sleep(600);
        if (!alive()) return;
      }
      await App.tts.speak(p.en, { slow: true });
      if (!alive()) return;
      await App.sleep(1600);
      if (!alive()) return;
      App.award(1);
      if (au.i + 1 >= au.items.length) break;
      au.i++;
      App.render();
    }
    au.playing = false;
    App.toast('목록을 끝까지 들었어요 🎧');
    App.render();
  }

  function audioPause() {
    const au = App.session.au;
    au.playing = false;
    App.playSeq++;
    App.tts.stop();
  }

  // ---------- 액션 ----------

  Object.assign(App.actions, {
    'sim-start': function () {
      const sim = App.session.sim || {};
      App.session.sim = { phase: 'listening', timed: sim.timed !== false, i: 0, log: [], grades: [], picks: [] };
      App.session.cleanup = function () { if (App.session.sim) clearInterval(App.session.sim.tick); };
      simStep();
    },
    'sim-skip-audio': function () { App.tts.stop(); },
    'sim-choose': function (el) {
      const step = currentScenario().steps[App.session.sim.i];
      simAnswer(step.choices[Number(el.dataset.i)]);
    },
    'sim-next': function () {
      const sc = currentScenario();
      const sim = App.session.sim;
      App.stopAll();
      if (sim.i + 1 >= sc.steps.length) {
        const r = C.simResult(sc.steps, sim.grades);
        App.state.sim[sc.id] = Math.max(App.state.sim[sc.id] || 0, r.pct);
        App.save();
        sim.phase = 'done';
        App.render();
        App.award(C.XP.simDone);
        window.scrollTo(0, 0);
        return;
      }
      sim.i++;
      simStep();
    },
    'sim-ko': function (el) {
      showKo = el.checked;
      document.querySelectorAll('.bubble .ko').forEach(function (k) { k.classList.toggle('hidden', !showKo); });
    },

    'speed-source': function (el) { App.session.sp.source = el.dataset.src; App.render(); },
    'speed-intro': function () { App.session.sp.phase = 'intro'; App.render(); },
    'speed-start': function () {
      const prev = App.session.sp || {};
      const sp = { phase: 'play', source: prev.source || 'all', score: 0, combo: 0, bestCombo: 0, missed: [], q: null };
      sp.pool = speedPool(sp.source);
      if (sp.pool.length < 4) sp.pool = speedPool('all');
      sp.deadline = Date.now() + SPEED_SECONDS * 1000;
      App.session.sp = sp;
      speedNext();
      sp.tick = setInterval(function () {
        const left = sp.deadline - Date.now();
        if (left <= 0) return speedFinish();
        const t = document.getElementById('speed-time');
        const b = document.getElementById('speed-bar');
        if (t) t.textContent = Math.ceil(left / 1000);
        if (b) b.style.width = (left / (SPEED_SECONDS * 10)) + '%';
      }, 100);
      App.session.cleanup = function () { clearInterval(sp.tick); };
      App.render();
    },
    'speed-answer': function (el) { speedAnswer(Number(el.dataset.i)); },

    'audio-source': function (el) {
      audioPause();
      const au = App.session.au;
      au.source = el.dataset.src;
      au.items = audioItems(au.source);
      au.i = 0;
      App.render();
    },
    'audio-toggle': function () {
      if (App.session.au.playing) { audioPause(); App.render(); } else audioLoop();
    },
    'audio-next': function () {
      const au = App.session.au;
      const wasPlaying = au.playing;
      audioPause();
      au.i = (au.i + 1) % au.items.length;
      if (wasPlaying) audioLoop(); else App.render();
    },
    'audio-prev': function () {
      const au = App.session.au;
      const wasPlaying = au.playing;
      audioPause();
      au.i = (au.i - 1 + au.items.length) % au.items.length;
      if (wasPlaying) audioLoop(); else App.render();
    },
    'audio-shuffle': function () {
      const au = App.session.au;
      audioPause();
      au.items = C.shuffle(au.items, Math.random);
      au.i = 0;
      App.toast('순서를 섞었어요');
      App.render();
    }
  });

  Object.assign(App.changes, {
    'sim-timed': function (el) { App.session.sim.timed = el.checked; },
    'audio-ko': function (el) { App.state.settings.readKorean = el.checked; App.save(); App.render(); }
  });
})();
