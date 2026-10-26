/* 도구 화면: 복습, 표현 사전, 내 기록, 설정 */
(function () {
  'use strict';

  const App = window.App;
  const C = App.C;
  const esc = App.esc;
  const icon = App.icon;

  // ---------- 복습 ----------

  App.views.review = {
    nav: 'review',
    render: function () {
      const st = App.state;
      const ids = Object.keys(st.srs).filter(function (id) { return App.phrase(id); });
      const head = '<header class="page-head"><h1>간격 반복 복습</h1><p class="muted">잊어버릴 때쯤 다시 보여 줘서 오래 기억하게 도와줍니다.</p></header>';
      if (!ids.length) {
        return head + '<div class="card intro-card"><div class="intro-emoji">🗂️</div><h3>아직 복습 카드가 없어요</h3>' +
          '<p class="muted">레슨의 ‘핵심 표현’에서 학습 완료를 누르면 카드가 추가됩니다.</p>' +
          '<a class="btn primary" href="#/lesson/' + App.LESSONS[0].id + '">첫 레슨 시작하기' + icon('arrow') + '</a></div>';
      }
      const s = App.session;
      if (!s.rv) s.rv = { queue: C.dueCardIds(st.srs, Date.now()).filter(function (id) { return App.phrase(id); }), i: 0, flipped: false, practice: false, done: 0 };
      const rv = s.rv;

      if (rv.i >= rv.queue.length) {
        const upcoming = ids.map(function (id) { return st.srs[id].due; }).sort(function (a, b) { return a - b; })[0];
        const when = new Date(upcoming);
        return head + '<div class="card intro-card"><div class="intro-emoji">🎉</div><h3>' + (rv.done ? rv.done + '장 복습 완료!' : '지금 복습할 카드가 없어요') + '</h3>' +
          '<p class="muted">다음 복습 예정 · ' + when.toLocaleDateString('ko-KR') + ' ' + when.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) + '</p>' +
          '<div class="actions centered"><button class="btn" data-action="rv-practice">전체 카드 자유 연습 (' + ids.length + '장)</button>' +
          '<a class="btn primary" href="#/speed">스피드 챌린지' + icon('arrow') + '</a></div></div>';
      }

      const id = rv.queue[rv.i];
      const p = App.phrase(id);
      const card = st.srs[id];
      const now = Date.now();
      const grades = [
        ['AGAIN', '다시', 'again'], ['HARD', '어려움', 'hard'], ['GOOD', '알맞음', 'good'], ['EASY', '쉬움', 'easy']
      ].map(function (g) {
        const val = C.GRADES[g[0]];
        return '<button class="btn grade ' + g[2] + '" data-action="rv-grade" data-g="' + val + '"><b>' + g[1] + '</b>' +
          (rv.practice ? '' : '<small>' + C.describeNext(card, val, now) + ' 후</small>') + '</button>';
      }).join('');

      return head + (rv.practice ? '<p class="hint">자유 연습 모드 — 복습 일정에는 반영되지 않아요.</p>' : '') +
        '<div class="progress-row"><span>' + (rv.i + 1) + ' / ' + rv.queue.length + '</span>' +
        App.bar(Math.round((rv.i / rv.queue.length) * 100)) + '</div>' +
        '<div class="card flash' + (rv.flipped ? ' flipped' : '') + '"><div class="eyebrow">' + esc(p.source) + '</div>' +
        '<p class="flash-ko">' + esc(p.ko) + '</p>' +
        (rv.flipped
          ? '<div class="flash-answer"><p class="en flash-en">' + esc(p.en) + '</p>' + (p.tip ? '<p class="tip">💡 ' + esc(p.tip) + '</p>' : '') +
            '<div class="actions centered">' + App.speakButtons(p.en) + App.favButton(id) + '</div></div>' +
            '<p class="muted small">얼마나 잘 떠올렸나요?</p><div class="grades">' + grades + '</div>'
          : '<p class="muted">영어로 어떻게 말할까요? 소리 내어 말해 본 뒤 정답을 확인하세요.</p>' +
            '<button class="btn primary large" data-action="rv-flip">정답 보기 <kbd>Space</kbd></button>') +
        '</div>';
    },
    keydown: function (e) {
      const rv = App.session.rv;
      if (!rv || /INPUT|TEXTAREA|BUTTON|SELECT/.test(e.target.tagName)) return;
      if (e.key === ' ' && !rv.flipped && rv.i < rv.queue.length) { e.preventDefault(); App.actions['rv-flip'](); }
      else if (rv.flipped && /^[1-4]$/.test(e.key)) { e.preventDefault(); grade(Number(e.key) - 1); }
    }
  };

  function grade(g) {
    const rv = App.session.rv;
    const id = rv.queue[rv.i];
    if (!rv.practice) {
      App.state.srs[id] = C.reviewCard(App.state.srs[id], g, Date.now());
      if (g === C.GRADES.AGAIN) rv.queue.push(id);
    }
    App.state.stats.reviews = (App.state.stats.reviews || 0) + 1;
    rv.done++;
    rv.i++;
    rv.flipped = false;
    App.render();
    App.award(C.XP.review);
  }

  // ---------- 표현 사전 ----------

  function phrasebookResults(pb) {
    const results = pb.filter === 'custom' ? [] : C.searchExpressions(App.LESSONS, pb.q, {
      track: App.TRACKS.some(function (t) { return t.id === pb.filter; }) ? pb.filter : null,
      favorites: pb.filter === 'favorites' ? App.state.favorites : null
    });
    let customs = [];
    if (pb.filter === 'custom' || pb.filter === 'favorites' || pb.filter === 'all') {
      const q = pb.q.trim().toLowerCase();
      customs = Object.keys(App.state.custom).filter(function (id) {
        const c = App.state.custom[id];
        if (pb.filter === 'favorites' && App.state.favorites.indexOf(id) === -1) return false;
        return !q || (c.en + ' ' + c.ko).toLowerCase().indexOf(q) !== -1;
      });
    }
    const rows = results.map(function (r) { return { id: r.expr.id, en: r.expr.en, ko: r.expr.ko, tip: r.expr.tip, source: r.lesson.icon + ' ' + r.lesson.title, href: '#/lesson/' + r.lesson.id }; })
      .concat(customs.map(function (id) { const p = App.phrase(id); return { id: id, en: p.en, ko: p.ko, tip: p.tip, source: p.source }; }));
    if (!rows.length) return '<div class="card center muted">' + (pb.filter === 'favorites' ? '아직 즐겨찾기한 표현이 없어요. ☆ 를 눌러 추가해 보세요.' : '검색 결과가 없어요.') + '</div>';
    return '<p class="muted small result-count">' + rows.length + '개 표현</p>' + rows.map(function (r) {
      return '<article class="pb-row card"><div class="grow"><p class="en">' + esc(r.en) + '</p><p class="muted">' + esc(r.ko) + '</p>' +
        (r.tip ? '<p class="tip small">💡 ' + esc(r.tip) + '</p>' : '') +
        (r.href ? '<a class="pb-source" href="' + r.href + '">' + esc(r.source) + '</a>' : '<span class="pb-source">' + esc(r.source) + '</span>') + '</div>' +
        '<div class="pb-actions"><button class="btn icon-only" data-action="speak" data-text="' + esc(r.en) + '" title="듣기">' + icon('speaker') + '</button>' +
        App.favButton(r.id) + '</div></article>';
    }).join('');
  }

  App.views.phrasebook = {
    nav: 'phrasebook', tab: 'more',
    render: function () {
      const s = App.session;
      if (!s.pb) s.pb = { q: '', filter: 'all' };
      const pb = s.pb;
      const filters = [['all', '전체']].concat(App.TRACKS.map(function (t) { return [t.id, t.icon + ' ' + t.title]; }))
        .concat([['favorites', '⭐ 즐겨찾기']]);
      if (Object.keys(App.state.custom).length) filters.push(['custom', '🤖 AI 회의 표현']);
      return '<header class="page-head"><h1>표현 사전</h1><p class="muted">회의 직전 빠르게 찾아보고, 필요한 표현만 모아 인쇄하세요.</p></header>' +
        '<div class="search-bar"><input type="search" id="pb-search" data-input="pb-search" placeholder="영어나 한국어로 검색 (예: 일정, agree)" value="' + esc(pb.q) + '">' +
        '<button class="btn" data-action="print">' + icon('print') + '<span>인쇄</span></button></div>' +
        '<div class="chip-row">' + filters.map(function (f) {
          return '<button class="chip-btn' + (pb.filter === f[0] ? ' picked' : '') + '" data-action="pb-filter" data-f="' + f[0] + '">' + esc(f[1]) + '</button>';
        }).join('') + '</div>' +
        '<div id="pb-results" class="pb-list">' + phrasebookResults(pb) + '</div>';
    }
  };

  // ---------- 내 기록 ----------

  App.views.stats = {
    nav: 'stats', tab: 'more',
    render: function () {
      const st = App.state;
      const lv = C.levelInfo(App.totalXp());
      const s = C.learnerStats(st, App.TRACKS);
      const streakNow = C.streak(st.xp, new Date());
      const grid = C.heatmap(st.xp, new Date(), 16);

      const nums = [
        ['🔥', streakNow + '일', '연속 학습'],
        ['🏅', s.bestStreak + '일', '최장 연속'],
        ['📘', s.lessonsDone + ' / ' + s.lessonsTotal, '완료한 레슨'],
        ['🧠', Object.keys(st.srs).length + '개', '익힌 표현'],
        ['🔁', s.reviews + '회', '복습한 카드'],
        ['🎬', Object.keys(st.sim).length + ' / ' + App.SCENARIOS.length, '도전한 시뮬레이션']
      ].map(function (n) {
        return '<div class="stat"><span class="stat-icon">' + n[0] + '</span><div><div class="stat-value">' + n[1] + '</div><div class="stat-label">' + n[2] + '</div></div></div>';
      }).join('');

      const days = ['일', '월', '화', '수', '목', '금', '토'];
      const heat = '<div class="heatmap"><div class="heat-days">' + days.map(function (d, i) { return '<span>' + (i % 2 ? d : '') + '</span>'; }).join('') + '</div>' +
        grid.map(function (col) {
          return '<div class="heat-col">' + col.map(function (c) {
            return '<span class="heat l' + c.lv + '" title="' + c.key + (c.lv >= 0 ? ' · ' + c.xp + ' XP' : '') + '"></span>';
          }).join('') + '</div>';
        }).join('') + '</div><div class="heat-legend muted small">적음 <span class="heat l0"></span><span class="heat l1"></span><span class="heat l2"></span><span class="heat l3"></span><span class="heat l4"></span> 많음</div>';

      const tracks = App.TRACKS.map(function (t) {
        const pct = Math.round(t.lessons.reduce(function (sum, id) { return sum + C.lessonProgress(st.lessons[id]); }, 0) / t.lessons.length);
        return '<div class="skill-row t-' + t.color + '"><span>' + t.icon + ' ' + esc(t.title) + '</span>' + App.bar(pct) + '<b>' + pct + '%</b></div>';
      }).join('');

      const earned = st.badges;
      const badges = C.BADGES.map(function (b) {
        const on = earned.indexOf(b.id) !== -1;
        return '<div class="badge-item' + (on ? ' on' : '') + '"><span class="badge-icon">' + b.icon + '</span><b>' + esc(b.title) + '</b><span class="muted small">' + esc(b.desc) + '</span></div>';
      }).join('');

      return '<header class="page-head"><h1>내 기록</h1></header>' +
        '<section class="card level-card"><div class="level-badge">Lv.' + lv.level + '</div><div class="grow">' +
        '<div class="eyebrow">' + esc(lv.title) + '</div><h2>' + esc(lv.titleKo) + '</h2>' + App.bar(lv.pct) +
        '<p class="muted small">누적 ' + lv.xp + ' XP · 다음 레벨까지 ' + (lv.next - lv.xp) + ' XP</p></div>' +
        App.ring(Math.round((App.todayXp() / C.DAILY_GOAL) * 100), 84, App.todayXp() + '<small>오늘 XP</small>') + '</section>' +
        '<div class="stats">' + nums + '</div>' +
        '<div class="two-col"><section class="card"><h3>학습 캘린더</h3>' + heat + '</section>' +
        '<section class="card"><h3>트랙별 진행률</h3><div class="skills">' + tracks + '</div></section></div>' +
        '<section class="card"><h3>배지 <span class="muted small">' + earned.length + ' / ' + C.BADGES.length + '</span></h3><div class="badge-grid">' + badges + '</div></section>';
    }
  };

  // ---------- 설정 ----------

  App.views.settings = {
    nav: 'settings', tab: 'more',
    render: function () {
      const st = App.state;
      const tts = App.tts;
      let voiceHtml;
      if (!tts.supported) {
        voiceHtml = '<p class="warn">이 환경에서는 음성 재생(TTS)을 지원하지 않습니다.</p>';
      } else if (!tts.voices.length) {
        voiceHtml = '<div class="warn"><b>영어 음성이 설치되어 있지 않습니다.</b><br>' +
          'Windows: 설정 → 시간 및 언어 → 음성 → <b>음성 추가</b>에서 “English (United States)”를 설치한 뒤 앱을 다시 실행하세요.<br>' +
          'macOS: 시스템 설정 → 손쉬운 사용 → 읽기 및 말하기 → 시스템 음성에서 영어 음성을 추가하세요.<br>' +
          '휴대폰: 기기 설정의 텍스트 음성 변환(TTS)에서 영어 음성 데이터를 내려받으세요.</div>';
      } else {
        const current = tts.voiceFor(0);
        voiceHtml = '<label class="field"><span>기본 음성</span><select data-change="voice">' +
          tts.voices.map(function (v) {
            return '<option value="' + esc(v.name) + '"' + (current && v.name === current.name ? ' selected' : '') + '>' + esc(v.name + ' (' + v.lang + ')') + '</option>';
          }).join('') + '</select></label>' +
          '<p class="muted small">대화 듣기 · 롤플레이 · 시뮬레이션에서는 등장인물마다 다른 음성이 자동으로 배정됩니다.</p>';
      }

      const hasKey = !!st.settings.apiKey;
      const keyHtml = '<p class="muted small">AI 회의 파트너는 Anthropic의 Claude API를 사용합니다. ' +
        '<b>console.anthropic.com</b>에서 API 키를 발급받아 입력하세요. 키는 이 기기에만 저장되고, 사용한 만큼 요금이 부과됩니다.</p>' +
        (hasKey
          ? '<div class="key-row"><span class="chip done">' + icon('check') + '키 저장됨 · …' + esc(st.settings.apiKey.slice(-4)) + '</span><button class="btn danger" data-action="key-clear">키 삭제</button></div>'
          : '<div class="composer"><input type="password" id="key-input" autocomplete="off" placeholder="sk-ant-..."><button class="btn primary" data-action="key-save">저장</button></div>');

      return '<header class="page-head"><h1>설정</h1></header>' +
        '<section class="card"><h3>학습자</h3><div class="composer narrow"><input id="name-input" type="text" value="' + esc(st.name) + '" placeholder="이름 (홈 화면 인사말에 표시)">' +
        '<button class="btn" data-action="save-name">저장</button></div></section>' +
        '<section class="card"><h3>음성</h3>' + voiceHtml +
        '<label class="field"><span>말하기 속도 <b id="rate-val">' + st.settings.rate.toFixed(2) + '×</b></span>' +
        '<input type="range" min="0.6" max="1.3" step="0.05" value="' + st.settings.rate + '" data-input="rate"></label>' +
        '<button class="btn soft" data-action="speak" data-text="Good morning, everyone. Shall we get started?">' + icon('speaker') + '음성 테스트</button></section>' +
        '<section class="card"><h3>' + icon('key') + ' AI 회의 파트너</h3>' + keyHtml + '</section>' +
        '<section class="card"><h3>학습 데이터</h3>' +
        '<p class="muted small">학습 기록은 이 기기에만 저장됩니다. PC와 휴대폰을 함께 쓰거나 기기를 바꿀 때는 내보내기 → 가져오기를 이용하세요. (API 키는 내보내지 않습니다)</p>' +
        '<div class="actions"><button class="btn" data-action="export">내보내기</button>' +
        '<label class="btn">가져오기<input type="file" accept="application/json,.json" data-change="import" hidden></label>' +
        '<button class="btn danger" data-action="reset">학습 기록 초기화</button></div></section>' +
        '<section class="card"><h3>휴대폰에서 쓰기</h3><p class="muted small">웹 주소로 열었다면 브라우저 메뉴의 <b>홈 화면에 추가</b>를 누르세요. 앱처럼 아이콘이 생기고 오프라인에서도 열립니다.<br>' +
        'iPhone(Safari): 공유 버튼 → 홈 화면에 추가 · Android(Chrome): ⋮ 메뉴 → 홈 화면에 추가</p></section>' +
        '<p class="muted small center">BizTalk English · 폰트: Pretendard (SIL OFL 1.1)</p>';
    }
  };

  // ---------- 액션 ----------

  Object.assign(App.actions, {
    'rv-flip': function () {
      const rv = App.session.rv;
      rv.flipped = true;
      App.render();
      const p = App.phrase(rv.queue[rv.i]);
      if (p) App.tts.speak(p.en);
    },
    'rv-grade': function (el) { grade(Number(el.dataset.g)); },
    'rv-practice': function () {
      App.session.rv = { queue: C.shuffle(Object.keys(App.state.srs).filter(function (id) { return App.phrase(id); }), Math.random), i: 0, flipped: false, practice: true, done: 0 };
      App.render();
    },

    'pb-filter': function (el) { App.session.pb.filter = el.dataset.f; App.render(); },
    print: function () { window.print(); },

    'save-name': function () {
      App.state.name = document.getElementById('name-input').value.trim();
      App.save();
      App.toast('저장되었습니다.');
    },
    'key-save': function () {
      const v = document.getElementById('key-input').value.trim();
      if (!v) return;
      App.state.settings.apiKey = v;
      App.save();
      App.toast('API 키를 저장했어요.');
      App.render();
    },
    'key-clear': function () {
      App.state.settings.apiKey = '';
      App.save();
      App.toast('API 키를 삭제했어요.');
      App.render();
    },
    export: function () {
      const data = JSON.parse(JSON.stringify(App.state));
      data.settings.apiKey = '';
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'biztalk-english-backup-' + C.dateKey(new Date()) + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
    },
    reset: function () {
      if (!confirm('모든 학습 기록을 삭제할까요? 되돌릴 수 없습니다.')) return;
      const key = App.state.settings.apiKey;
      App.state = App.defaultState();
      App.state.settings.apiKey = key;
      App.save();
      App.toast('초기화되었습니다.');
      App.render();
    }
  });

  Object.assign(App.changes, {
    'pb-search': function (el) {
      App.session.pb.q = el.value;
      document.getElementById('pb-results').innerHTML = phrasebookResults(App.session.pb);
    },
    voice: function (el) { App.state.settings.voice = el.value; App.save(); },
    rate: function (el) {
      App.state.settings.rate = Number(el.value);
      document.getElementById('rate-val').textContent = App.state.settings.rate.toFixed(2) + '×';
      App.save();
    },
    import: function (el) {
      const file = el.files[0];
      if (!file) return;
      file.text().then(function (text) {
        const data = JSON.parse(text);
        if (!data || typeof data !== 'object' || !data.lessons || !data.srs) throw new Error('invalid');
        const key = App.state.settings.apiKey;
        App.state = App.normalizeState(data);
        if (!App.state.settings.apiKey) App.state.settings.apiKey = key;
        App.save();
        App.toast('학습 기록을 불러왔습니다.');
        App.render();
      }).catch(function () { App.toast('올바른 백업 파일이 아닙니다.'); });
    }
  });
})();
