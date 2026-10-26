/*
 * AI 회의 파트너: Claude 가 회의 상대역을 맡아 대화하고, 학습자의 문장을 턴마다 교정한다.
 * Anthropic SDK 는 app/vendor/anthropic-sdk.js (npm run build:vendor) 를 처음 사용할 때 불러온다.
 */
(function () {
  'use strict';

  const App = window.App;
  const C = App.C;
  const esc = App.esc;
  const icon = App.icon;

  const MODEL = 'claude-opus-5-5';

  const PRESETS = [
    { id: 'first-meeting', icon: '🤝', title: '해외 파트너와 첫 미팅', you: '우리 회사 해외사업 담당',
      partner: 'Emily Carter, Head of Partnerships at a US software company',
      situation: 'A first video meeting with a potential overseas partner: small talk, introductions, then exploring how the two companies could work together.' },
    { id: 'negotiation', icon: '💰', title: '납품 단가 협상', you: '공급사 영업 담당',
      partner: 'David Miller, Procurement Manager at a client company',
      situation: "The client wants a 15% price cut on next year's supply contract. The learner represents the supplier and needs to protect the margin while keeping the client." },
    { id: 'status-report', icon: '📊', title: '프로젝트 현황 보고', you: '프로젝트 매니저',
      partner: "Sarah Lee, VP of Operations and the learner's senior manager",
      situation: 'A weekly status meeting. The project is slightly behind schedule and over budget, and the VP asks probing questions about causes and next steps.' },
    { id: 'team-meeting', icon: '💬', title: '팀 회의에서 의견 조율', you: '제품팀 담당자',
      partner: 'Mark Brown, a colleague from the marketing team',
      situation: "A team meeting to decide next quarter's campaign. Mark strongly prefers a different approach from the learner, and they need to agree on a plan." },
    { id: 'presentation-qa', icon: '🎤', title: '발표 후 질의응답', you: '발표자',
      partner: 'Tom Wilson, a skeptical senior executive',
      situation: 'The learner has just presented a plan to enter a new market. The executive asks tough questions about risks, costs and the timeline.' },
    { id: 'design-review', icon: '📐', title: '기술 설계 검토', you: '설계 담당 엔지니어',
      partner: 'Dr. Alex Novak, Principal Architect',
      situation: 'A design review. The learner presents the technical design of a new system, and the architect asks about the architecture, requirements, scalability, failure modes, trade-offs and test plans. Use realistic engineering vocabulary.' },
    { id: 'incident-review', icon: '🚨', title: '장애 회고 (포스트모템)', you: '엔지니어링 리드',
      partner: 'Rachel Kim, Head of Operations',
      situation: 'The morning after a production outage. The meeting covers what happened, the timeline, customer impact, the root cause, the temporary workaround and corrective actions. Keep it blameless but demanding.' },
    { id: 'custom', icon: '✏️', title: '직접 상황 만들기', custom: true }
  ];

  const LEVELS = {
    easy: { label: '쉽게', prompt: 'Use short, simple sentences and common vocabulary (CEFR A2-B1). Be patient and encouraging.' },
    normal: { label: '보통', prompt: 'Use natural, everyday business English (CEFR B2).' },
    hard: { label: '어렵게', prompt: 'Use fluent, idiomatic native-level business English (CEFR C1) and push back when the learner is vague.' }
  };

  const TURN_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['reply_en', 'reply_ko', 'feedback', 'meeting_over'],
    properties: {
      reply_en: { type: 'string' },
      reply_ko: { type: 'string' },
      feedback: {
        type: 'object',
        additionalProperties: false,
        required: ['score', 'corrected', 'natural', 'tip_ko'],
        properties: {
          score: { type: 'integer' },
          corrected: { type: 'string' },
          natural: { type: 'string' },
          tip_ko: { type: 'string' }
        }
      },
      meeting_over: { type: 'boolean' }
    }
  };

  const REPORT_SCHEMA = {
    type: 'object',
    additionalProperties: false,
    required: ['score', 'summary_ko', 'strengths_ko', 'improvements_ko', 'key_phrases'],
    properties: {
      score: { type: 'integer' },
      summary_ko: { type: 'string' },
      strengths_ko: { type: 'array', items: { type: 'string' } },
      improvements_ko: { type: 'array', items: { type: 'string' } },
      key_phrases: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['en', 'ko'],
          properties: { en: { type: 'string' }, ko: { type: 'string' } }
        }
      }
    }
  };

  const OPENING = '[The meeting starts now. Open the meeting with your first line.]';
  const CLOSING = '[The meeting has ended. Step out of the role-play and evaluate the learner\'s English across the whole meeting. ' +
    'score is 0-100. Write summary_ko, strengths_ko and improvements_ko in Korean (2-3 items each), and give 3-5 key_phrases: ' +
    'useful English expressions for this situation that the learner should memorize, with Korean translations.]';

  function systemPrompt(setup) {
    const p = setup.preset;
    const partner = p.custom ? 'the meeting counterpart that best fits the scenario below (give yourself a realistic name and job title)' : p.partner;
    const situation = p.custom ? 'The learner described the meeting in Korean as follows: "' + setup.customText + '"' : p.situation;
    const learnerRole = p.custom ? 'as described in the scenario' : p.you + ' (the learner\'s role, described in Korean)';
    return [
      'You are a role-play partner in an English-learning app that helps Korean office workers practice business meetings.',
      '',
      'Scenario: ' + situation,
      'Your role: ' + partner + '. Stay in character for the whole meeting.',
      'The learner\'s role: ' + learnerRole + '.',
      'Language level: ' + LEVELS[setup.level].prompt,
      '',
      'On every turn, fill in the response fields like this:',
      '- reply_en: your next line in the meeting, 1-3 sentences of natural spoken business English. Keep the meeting moving and ask the learner questions so that they have to speak.',
      '- reply_ko: a natural Korean translation of reply_en.',
      '- feedback: about the learner\'s most recent message only.',
      '  - corrected: the learner\'s message with grammar and word-choice errors fixed, keeping their meaning. If it was already correct, repeat it unchanged.',
      '  - natural: how a fluent professional would say the same thing in this meeting.',
      '  - tip_ko: one short sentence in Korean with the most useful improvement, or what they did well.',
      '  - score: 0-100 for how clear, correct and appropriate the message was for this business situation.',
      '  On the opening turn, before the learner has spoken, use empty strings and a score of 0.',
      '- meeting_over: true only when the meeting has reached a natural close, usually after 8 to 10 learner turns or when the learner wraps it up; otherwise false.',
      '',
      'If the learner writes in Korean or mixes languages, stay in character and reply in English, and use feedback.natural to show how to say their message in English.'
    ].join('\n');
  }

  // 화면을 이동해도 대화가 유지되도록 모듈 변수에 보관
  let ai = null;
  let autoSpeak = true;
  let showKo = false;

  let sdkPromise = null;
  function loadSdk() {
    if (window.Anthropic) return Promise.resolve(window.Anthropic);
    if (!sdkPromise) {
      sdkPromise = new Promise(function (resolve, reject) {
        const s = document.createElement('script');
        s.src = 'vendor/anthropic-sdk.js';
        s.onload = function () { resolve(window.Anthropic); };
        s.onerror = function () { sdkPromise = null; reject(new Error('sdk-load')); };
        document.head.appendChild(s);
      });
    }
    return sdkPromise;
  }

  async function callClaude(messages, schema, effort) {
    const Anthropic = await loadSdk();
    const client = new Anthropic({ apiKey: App.state.settings.apiKey, dangerouslyAllowBrowser: true });
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      // 안전 분류기가 거절하면 서버가 권장 모델로 자동 재시도
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system: systemPrompt(ai.setup),
      output_config: { effort: effort, format: { type: 'json_schema', schema: schema } },
      messages: messages
    });
    if (response.stop_reason === 'refusal') throw new Error('refusal');
    if (response.stop_reason === 'max_tokens') throw new Error('max_tokens');
    const text = response.content.find(function (b) { return b.type === 'text'; });
    if (!text) throw new Error('empty');
    return { content: response.content, data: JSON.parse(text.text) };
  }

  function errorMessage(err) {
    const A = window.Anthropic;
    if (err && err.message === 'sdk-load') return 'AI 모듈을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.';
    if (err && err.message === 'refusal') return 'AI가 이 요청에는 답하지 않았어요. 다른 표현으로 다시 시도해 주세요.';
    if (A) {
      if (err instanceof A.AuthenticationError) return 'API 키가 올바르지 않아요. 설정에서 다시 입력해 주세요.';
      if (err instanceof A.PermissionDeniedError) return '이 API 키로는 AI 회의 파트너를 사용할 수 없어요. 키의 권한을 확인해 주세요.';
      if (err instanceof A.RateLimitError) return '요청이 많아 잠시 막혔어요. 잠시 후 다시 시도해 주세요.';
      if (err instanceof A.APIConnectionError) return 'AI 서버에 연결할 수 없어요. 인터넷 연결을 확인해 주세요.';
      if (err instanceof A.APIError) return 'AI 서버 오류가 발생했어요 (' + (err.status || '알 수 없음') + '). 잠시 후 다시 시도해 주세요.';
    }
    return 'AI 응답을 처리하지 못했어요. 다시 시도해 주세요.';
  }

  // ---------- 화면 ----------

  App.views.ai = {
    nav: 'ai', tab: 'practice',
    render: function () {
      if (!App.state.settings.apiKey) return renderNoKey();
      if (!ai || ai.phase === 'setup') return renderSetup();
      if (ai.phase === 'report') return renderReport();
      return renderChat();
    },
    after: function () {
      const chat = document.getElementById('ai-chat');
      if (chat) chat.scrollTop = chat.scrollHeight;
      if (ai && ai.phase === 'chat') App.revealPanel();
      const input = document.getElementById('ai-input');
      if (input && ai && !ai.busy && window.matchMedia('(min-width: 820px)').matches) input.focus({ preventScroll: true });
    },
    keydown: function (e) {
      if (e.key === 'Enter' && !e.shiftKey && e.target.id === 'ai-input') { e.preventDefault(); App.actions['ai-send'](); }
    }
  };

  function head() {
    return '<header class="page-head"><h1>' + icon('ai') + ' AI 회의 파트너</h1>' +
      '<p class="muted">AI가 회의 상대역을 맡아 자유롭게 대화합니다. 내가 한 말은 턴마다 교정해 드려요.</p></header>';
  }

  function renderNoKey() {
    return head() + '<div class="card intro-card"><div class="intro-emoji">🔑</div><h3>Claude API 키가 필요해요</h3>' +
      '<ol class="intro-list"><li><b>console.anthropic.com</b>에 로그인해 API 키를 발급받으세요. (회사에서 공용 키를 받을 수도 있어요)</li>' +
      '<li>설정 → AI 회의 파트너에 키를 저장하세요. 키는 이 기기에만 저장됩니다.</li>' +
      '<li>대화한 만큼 API 사용 요금이 부과됩니다.</li></ol>' +
      '<a class="btn primary" href="#/settings">설정으로 이동' + icon('arrow') + '</a></div>';
  }

  function renderSetup() {
    const sel = (ai && ai.setup) || { presetId: 'first-meeting', level: 'normal', customText: '' };
    const cards = PRESETS.map(function (p) {
      return '<button class="preset card' + (sel.presetId === p.id ? ' picked' : '') + '" data-action="ai-preset" data-id="' + p.id + '">' +
        '<span class="preset-icon">' + p.icon + '</span><b>' + esc(p.title) + '</b>' +
        (p.custom ? '<span class="muted small">원하는 회의 상황을 한국어로 설명하세요</span>' : '<span class="muted small">나: ' + esc(p.you) + '</span>') + '</button>';
    }).join('');
    const levels = Object.keys(LEVELS).map(function (k) {
      return '<button class="chip-btn' + (sel.level === k ? ' picked' : '') + '" data-action="ai-level" data-l="' + k + '">' + LEVELS[k].label + '</button>';
    }).join('');
    const custom = sel.presetId === 'custom'
      ? '<label class="field wide"><span>어떤 회의인가요?</span><textarea id="ai-custom" rows="3" data-input="ai-custom" placeholder="예) 일본 거래처와 신제품 출시 일정을 조율하는 화상회의. 나는 마케팅 담당이고 상대는 깐깐한 구매 담당자.">' + esc(sel.customText) + '</textarea></label>'
      : '';
    return head() + '<div class="eyebrow">1. 상황 고르기</div><div class="preset-grid">' + cards + '</div>' + custom +
      '<div class="eyebrow">2. 난이도</div><div class="chip-row">' + levels + '</div>' +
      '<div class="actions"><button class="btn primary large" data-action="ai-start">' + icon('play') + '회의 시작</button></div>';
  }

  function feedbackCard(fb) {
    if (!fb) return '';
    if (fb.pending) return '<div class="ai-feedback muted small">교정 중...</div>';
    const same = fb.corrected && fb.corrected.trim() === (fb.said || '').trim();
    return '<div class="ai-feedback">' + App.scoreBadge(fb.score) +
      (fb.corrected && !same ? '<p><span class="fb-label">교정</span>' + esc(fb.corrected) + '</p>' : '<p><span class="fb-label ok">문법</span>정확해요!</p>') +
      (fb.natural ? '<p><span class="fb-label alt">더 자연스럽게</span>' + esc(fb.natural) +
        ' <button class="btn icon-only small" data-action="speak" data-text="' + esc(fb.natural) + '">' + icon('speaker') + '</button></p>' : '') +
      (fb.tip_ko ? '<p class="muted small">💡 ' + esc(fb.tip_ko) + '</p>' : '') + '</div>';
  }

  function renderChat() {
    const p = ai.setup.preset;
    const turns = ai.turns.map(function (t) {
      if (t.role === 'ai') {
        return '<div class="line"><span class="avatar a1">AI</span><div class="bubble-wrap"><div class="who">' + esc(ai.partnerName) + '</div>' +
          '<div class="bubble"><p class="en">' + esc(t.en) + '</p><p class="ko' + (showKo ? '' : ' hidden') + '">' + esc(t.ko) + '</p></div></div>' +
          '<button class="btn icon-only" data-action="speak" data-text="' + esc(t.en) + '" data-slot="1">' + icon('speaker') + '</button></div>';
      }
      return '<div class="line me"><span class="avatar a0">나</span><div class="bubble-wrap"><div class="who">나</div>' +
        '<div class="bubble"><p class="en">' + esc(t.text) + '</p></div>' + feedbackCard(t.feedback) + '</div></div>';
    }).join('');

    let footer;
    if (ai.error) {
      footer = '<div class="turn error-box"><p>' + esc(ai.error) + '</p><div class="actions"><button class="btn primary" data-action="ai-retry">다시 시도</button>' +
        (/API 키/.test(ai.error) ? '<a class="btn" href="#/settings">설정</a>' : '') + '</div></div>';
    } else if (ai.busy) {
      footer = '<div class="turn listening"><span class="typing"><i></i><i></i><i></i></span>' + esc(ai.partnerName) + ' 님이 생각 중...</div>';
    } else if (ai.over) {
      footer = '<div class="turn center"><p><b>회의가 마무리되었어요.</b> 전체 대화에 대한 리포트를 받아 보세요.</p>' +
        '<button class="btn primary" data-action="ai-report">' + icon('stats') + '리포트 받기</button></div>';
    } else {
      footer = '<div class="composer"><textarea id="ai-input" rows="2" data-input="ai-input" placeholder="영어로 답해 보세요 (Enter 전송 · 한국어로 써도 영어 표현을 알려 드려요)">' + esc(ai.input || '') + '</textarea>' +
        (App.SR ? '<button class="btn icon-only mic" data-action="ai-listen" title="말해서 입력">' + icon('mic') + '</button>' : '') +
        '<button class="btn primary icon-only" data-action="ai-send" title="전송">' + icon('send') + '</button></div>';
    }

    return '<div class="ai-head"><div><div class="eyebrow">' + p.icon + ' ' + esc(p.title) + ' · ' + LEVELS[ai.setup.level].label + '</div>' +
      '<h2>' + esc(ai.partnerName) + '</h2></div><div class="actions">' +
      '<label class="switch"><input type="checkbox" data-action="ai-ko"' + (showKo ? ' checked' : '') + '><span class="track-sw"></span>해석</label>' +
      '<label class="switch"><input type="checkbox" data-action="ai-autospeak"' + (autoSpeak ? ' checked' : '') + '><span class="track-sw"></span>자동 음성</label>' +
      (ai.turns.some(function (t) { return t.role === 'me'; }) && !ai.busy ? '<button class="btn soft" data-action="ai-report">회의 종료 · 리포트</button>' : '') +
      '<button class="btn ghost" data-action="ai-new">새 회의</button></div></div>' +
      '<div class="chat card ai-chat" id="ai-chat">' + (turns || '<p class="muted center">회의를 준비하고 있어요...</p>') + '</div>' + footer;
  }

  function renderReport() {
    const r = ai.report;
    if (!r) {
      return head() + '<div class="card intro-card"><span class="typing big"><i></i><i></i><i></i></span><h3>회의 내용을 분석하고 있어요</h3><p class="muted">잠시만 기다려 주세요.</p>' +
        (ai.error ? '<p class="warn">' + esc(ai.error) + '</p><button class="btn primary" data-action="ai-report">다시 시도</button>' : '') + '</div>';
    }
    const list = function (arr) { return '<ul>' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };
    const phrases = r.key_phrases.map(function (k) {
      return '<li class="pb-row"><div class="grow"><p class="en">' + esc(k.en) + '</p><p class="muted">' + esc(k.ko) + '</p></div>' +
        '<button class="btn icon-only" data-action="speak" data-text="' + esc(k.en) + '">' + icon('speaker') + '</button></li>';
    }).join('');
    return head() + '<div class="card result-panel ai-report"><div class="result-big">' + App.ring(r.score, 112, r.score + '<small>점</small>') + '</div>' +
      '<h3>' + esc(ai.setup.preset.title) + ' 리포트</h3><p>' + esc(r.summary_ko) + '</p>' +
      '<div class="two-col left"><div><div class="eyebrow">잘한 점</div>' + list(r.strengths_ko) + '</div>' +
      '<div><div class="eyebrow">개선할 점</div>' + list(r.improvements_ko) + '</div></div>' +
      '<div class="wrong-list"><div class="eyebrow">이 상황에서 외워 둘 표현</div><ul class="plain">' + phrases + '</ul>' +
      (ai.saved ? '<p class="muted small">' + icon('check') + ' 복습 카드에 추가했어요</p>' : '<button class="btn soft" data-action="ai-save-phrases">복습 카드에 추가</button>') + '</div>' +
      '<div class="actions centered"><button class="btn primary" data-action="ai-new">새 회의 시작</button><button class="btn" data-action="ai-back-chat">대화 다시 보기</button></div></div>';
  }

  // ---------- 대화 진행 ----------

  async function requestTurn() {
    ai.busy = true;
    ai.error = null;
    App.render();
    const session = ai;
    try {
      const res = await callClaude(ai.messages, TURN_SCHEMA, 'low');
      if (ai !== session) return;
      ai.messages.push({ role: 'assistant', content: res.content });
      const d = res.data;
      const lastMe = ai.turns.slice().reverse().find(function (t) { return t.role === 'me'; });
      if (lastMe && lastMe.feedback && lastMe.feedback.pending) {
        lastMe.feedback = Object.assign({ said: lastMe.text }, d.feedback);
        App.state.stats.aiTurns = (App.state.stats.aiTurns || 0) + 1;
        App.award(C.XP.aiTurn);
      }
      ai.turns.push({ role: 'ai', en: d.reply_en, ko: d.reply_ko });
      ai.over = !!d.meeting_over;
      ai.busy = false;
      App.render();
      if (autoSpeak) App.tts.speak(d.reply_en, { slot: 1 });
    } catch (err) {
      if (ai !== session) return;
      ai.busy = false;
      ai.error = errorMessage(err);
      App.render();
    }
  }

  async function requestReport() {
    ai.phase = 'report';
    ai.error = null;
    App.render();
    const session = ai;
    try {
      const res = await callClaude(ai.messages.concat([{ role: 'user', content: CLOSING }]), REPORT_SCHEMA, 'medium');
      if (ai !== session) return;
      ai.report = res.data;
      App.render();
    } catch (err) {
      if (ai !== session) return;
      ai.error = errorMessage(err);
      App.render();
    }
  }

  function partnerName(preset) {
    if (preset.custom) return '회의 상대';
    return preset.partner.split(',')[0];
  }

  // ---------- 액션 ----------

  function setupState() {
    if (!ai) ai = { phase: 'setup', setup: { presetId: 'first-meeting', level: 'normal', customText: '' } };
    return ai.setup;
  }

  Object.assign(App.actions, {
    'ai-preset': function (el) { setupState().presetId = el.dataset.id; App.render(); },
    'ai-level': function (el) { setupState().level = el.dataset.l; App.render(); },
    'ai-start': function () {
      const setup = setupState();
      const preset = PRESETS.find(function (p) { return p.id === setup.presetId; });
      if (preset.custom && !setup.customText.trim()) { App.toast('어떤 회의인지 먼저 적어 주세요.'); return; }
      ai = {
        phase: 'chat',
        setup: { presetId: setup.presetId, preset: preset, level: setup.level, customText: setup.customText.trim() },
        partnerName: partnerName(preset),
        messages: [{ role: 'user', content: OPENING }],
        turns: [], busy: false, error: null, over: false, report: null, input: ''
      };
      requestTurn();
    },
    'ai-send': function () {
      if (!ai || ai.busy || ai.over) return;
      const text = (ai.input || '').trim();
      if (!text) return;
      App.tts.stop();
      ai.input = '';
      ai.turns.push({ role: 'me', text: text, feedback: { pending: true } });
      ai.messages.push({ role: 'user', content: text });
      requestTurn();
    },
    'ai-retry': function () { requestTurn(); },
    'ai-listen': function (el) {
      el.classList.add('recording');
      el.disabled = true;
      App.listenOnce().then(function (text) {
        ai.input = text;
        App.render();
      }).catch(function () {
        App.toast('음성 인식에 실패했습니다. 직접 입력해 주세요.');
        App.render();
      });
    },
    'ai-report': function () { App.tts.stop(); requestReport(); },
    'ai-back-chat': function () { ai.phase = 'chat'; App.render(); },
    'ai-new': function () {
      App.tts.stop();
      const setup = ai ? { presetId: ai.setup.presetId, level: ai.setup.level, customText: ai.setup.customText || '' } : null;
      ai = { phase: 'setup', setup: setup || { presetId: 'first-meeting', level: 'normal', customText: '' } };
      App.render();
    },
    'ai-ko': function (el) {
      showKo = el.checked;
      document.querySelectorAll('.bubble .ko').forEach(function (k) { k.classList.toggle('hidden', !showKo); });
    },
    'ai-autospeak': function (el) { autoSpeak = el.checked; },
    'ai-save-phrases': function () {
      const now = Date.now();
      ai.report.key_phrases.forEach(function (k, i) {
        const id = 'ai-' + now + '-' + i;
        App.state.custom[id] = { en: k.en, ko: k.ko };
        App.state.srs[id] = C.newCard(now);
      });
      ai.saved = true;
      App.save();
      App.toast('복습 카드 ' + ai.report.key_phrases.length + '장을 추가했어요.');
      App.render();
    }
  });

  Object.assign(App.changes, {
    'ai-input': function (el) { if (ai) ai.input = el.value; },
    'ai-custom': function (el) { setupState().customText = el.value; }
  });

  // 테스트에서 프롬프트를 확인할 수 있도록 노출
  App.ai = { PRESETS: PRESETS, systemPrompt: systemPrompt, MODEL: MODEL };
})();
