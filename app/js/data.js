/*
 * 레슨 콘텐츠.
 * - expressions[].blank : 빈칸 퀴즈에서 비워 둘 단어 (en 안에 반드시 포함)
 * - dialogue.you        : 롤플레이에서 학습자가 맡는 역할
 * - situations[].answer : options 의 정답 인덱스 (화면에서는 섞여서 나옴)
 * - terms (선택)        : 기술 용어 카드 { en, ko, def(개념 설명), ex(예문) }. 퀴즈·복습·사전·스피드 챌린지에 함께 나온다
 */
(function (root) {
  const LESSONS = [
    {
      id: 'small-talk',
      icon: '☕',
      title: '스몰토크 & 자기소개',
      titleEn: 'Small Talk & Introductions',
      goal: '회의 시작 전 자연스럽게 대화를 열고 자신을 소개할 수 있다.',
      expressions: [
        { en: "How was your weekend?", ko: "주말 어떻게 보내셨어요?", tip: "월요일 회의 전 가장 무난한 스몰토크 주제입니다.", blank: "weekend", swaps: ["was>were|did|does"] },
        { en: "Thanks for making the time today.", ko: "오늘 시간 내주셔서 감사합니다.", tip: "make time = (바쁜 중에) 시간을 내다", blank: "time", swaps: ["for>to", "making>make|made"] },
        { en: "Let me briefly introduce myself.", ko: "간단히 제 소개를 드리겠습니다.", blank: "introduce", swaps: ["Let me>Let's me|Let I", "myself>me|mine"] },
        { en: "I'm in charge of overseas sales at our company.", ko: "저는 저희 회사에서 해외 영업을 담당하고 있습니다.", tip: "be in charge of + 업무 = ~을 담당하다", blank: "charge", swaps: ["in charge of>in charge for|in charge with|on charge of", "overseas>domestic"] },
        { en: "I've heard a lot about your team.", ko: "팀에 대해 이야기 많이 들었습니다.", blank: "heard", swaps: ["heard>hear|hearing", "a lot about>a lot to|many about"] },
        { en: "It's great to finally meet you in person.", ko: "드디어 직접 뵙게 되어 반갑습니다.", tip: "이메일·화상으로만 연락하다 처음 대면할 때 씁니다.", blank: "person", swaps: ["in person>on person|by person|at person", "meet>met|meeting"] },
        { en: "Did you find the office okay?", ko: "사무실은 잘 찾아오셨어요?", blank: "find", swaps: ["find>found|look|see"] }
      ],
      dialogue: {
        setting: '해외 파트너사 담당자가 처음으로 우리 회사를 방문했습니다.',
        you: 'A',
        roles: { A: '나 (민지)', B: 'David' },
        lines: [
          { s: 'B', en: "Hi, you must be Minji. I'm David Miller from Brightline.", ko: "안녕하세요, 민지 씨 맞으시죠? 브라이트라인의 데이비드 밀러입니다." },
          { s: 'A', en: "Hi David, it's great to finally meet you in person.", ko: "안녕하세요 데이비드, 드디어 직접 뵙게 되어 반갑습니다." },
          { s: 'B', en: "Likewise. I've heard a lot about your team.", ko: "저도요. 팀에 대해 이야기 많이 들었어요." },
          { s: 'A', en: "Thanks for making the time today. Did you find the office okay?", ko: "오늘 시간 내주셔서 감사합니다. 사무실은 잘 찾아오셨어요?" },
          { s: 'B', en: "Yes, no problem. Traffic was light, actually.", ko: "네, 문제없었어요. 오히려 차가 별로 안 막히더라고요." },
          { s: 'A', en: "Glad to hear that. How was your weekend?", ko: "다행이네요. 주말은 어떻게 보내셨어요?" },
          { s: 'B', en: "Pretty relaxing, thanks. I went hiking with my family.", ko: "꽤 여유로웠어요. 가족들과 등산을 다녀왔어요." },
          { s: 'A', en: "That sounds nice. Let me briefly introduce myself. I'm in charge of overseas sales at our company.", ko: "좋았겠네요. 간단히 제 소개를 드릴게요. 저는 저희 회사에서 해외 영업을 담당하고 있습니다." },
          { s: 'B', en: "Great. I'm looking forward to working together.", ko: "좋습니다. 함께 일하게 되어 기대됩니다." }
        ]
      },
      situations: [
        { q: "이메일로만 연락하던 해외 파트너를 처음 만났을 때 '드디어 직접 뵙네요'라고 말하려면?", options: ["It's great to finally meet you in person.", "Finally you came to see me.", "Nice to meet you at last time.", "I am glad to see your face finally."], answer: 0, explain: "in person은 '직접, 대면으로'라는 뜻으로 비즈니스에서 자주 쓰입니다." },
        { q: "자신의 담당 업무를 소개할 때 가장 자연스러운 표현은?", options: ["I'm in charge of marketing.", "I'm charging marketing.", "My job is in marketing charge.", "I take charge marketing."], answer: 0, explain: "be in charge of + 업무 = ~을 담당하다." },
        { q: "회의 시작 전 시간을 내준 상대에게 감사 인사를 할 때 적절한 것은?", options: ["Thanks for making the time today.", "Thank you for your time spending.", "Thanks to give me time.", "I appreciate for your time."], answer: 0, explain: "appreciate는 for 없이 'I appreciate your time.'으로 씁니다." }
      ]
    },
    {
      id: 'opening',
      icon: '📋',
      title: '회의 시작 & 안건 소개',
      titleEn: 'Opening & Setting the Agenda',
      goal: '회의를 시작하고 목적과 안건, 진행 방식을 안내할 수 있다.',
      expressions: [
        { en: "Shall we get started?", ko: "시작할까요?", tip: "Shall we ~? 는 정중하게 제안하는 표현입니다.", blank: "started", swaps: ["get>getting", "started>start|starting|starts"] },
        { en: "The purpose of today's meeting is to review the Q3 budget.", ko: "오늘 회의의 목적은 3분기 예산을 검토하는 것입니다.", blank: "purpose", swaps: ["Q3>Q1|Q2|Q4", "is to review>is review|is to reviewing"] },
        { en: "We have three items on the agenda today.", ko: "오늘 안건은 세 가지입니다.", tip: "item = (안건 목록의) 항목", blank: "agenda", swaps: ["three>two|four|five", "on the agenda>at the agenda|to the agenda"] },
        { en: "Let's start with the first item.", ko: "첫 번째 안건부터 시작하죠.", blank: "item", swaps: ["start with>starting with|started with", "first>second|last|next"] },
        { en: "We need to wrap up by 3 o'clock.", ko: "3시까지는 마무리해야 합니다.", tip: "wrap up = 마무리하다. 마감 시점에는 until 이 아니라 by 를 씁니다.", blank: "wrap", swaps: ["by>until|on", "3 o'clock>4 o'clock|5 o'clock"] },
        { en: "Jenny will be taking the minutes today.", ko: "오늘 회의록은 제니 씨가 작성해 주실 겁니다.", tip: "take the minutes = 회의록을 작성하다", blank: "minutes", swaps: ["will be taking>will be take|will taking", "the minutes>the minute|the meeting"] },
        { en: "Has everyone received a copy of the agenda?", ko: "모두 안건 자료 받으셨나요?", blank: "received", swaps: ["Has everyone>Have everyone|Is everyone", "received>receive|receiving"] }
      ],
      dialogue: {
        setting: '내가 주재하는 3분기 예산 검토 회의를 시작합니다.',
        you: 'A',
        roles: { A: '나 (회의 주재자)', B: 'Tom', C: 'Jenny' },
        lines: [
          { s: 'A', en: "Good morning, everyone. Shall we get started?", ko: "안녕하세요, 여러분. 시작할까요?" },
          { s: 'B', en: "Sure. Sarah is running a few minutes late, though.", ko: "네. 그런데 사라 씨는 몇 분 늦는다고 하네요." },
          { s: 'A', en: "No problem. The purpose of today's meeting is to review the Q3 budget.", ko: "괜찮습니다. 오늘 회의의 목적은 3분기 예산을 검토하는 것입니다." },
          { s: 'A', en: "We have three items on the agenda today. Has everyone received a copy of the agenda?", ko: "오늘 안건은 세 가지입니다. 모두 안건 자료 받으셨나요?" },
          { s: 'C', en: "Yes, I got it this morning. And I'll be taking the minutes today.", ko: "네, 오늘 아침에 받았어요. 그리고 오늘 회의록은 제가 작성할게요." },
          { s: 'A', en: "Thanks, Jenny. We need to wrap up by 3 o'clock, so let's start with the first item.", ko: "고마워요, 제니. 3시까지는 마무리해야 하니 첫 번째 안건부터 시작하죠." },
          { s: 'B', en: "Okay. The first item is the marketing budget.", ko: "네. 첫 번째 안건은 마케팅 예산입니다." }
        ]
      },
      situations: [
        { q: "회의를 시작하자고 자연스럽게 제안하려면?", options: ["Shall we get started?", "Let's starting.", "Do we begin now or not?", "Start the meeting, please everyone."], answer: 0, explain: "'Let's get started.'도 많이 씁니다." },
        { q: "'회의록을 작성하다'를 영어로?", options: ["take the minutes", "write the meeting", "make the record", "do the notes of meeting"], answer: 0, explain: "minutes(복수형)는 '회의록'이라는 뜻입니다." },
        { q: "'3시까지 마무리해야 합니다'로 적절한 것은?", options: ["We need to wrap up by 3 o'clock.", "We need to wrap up until 3 o'clock.", "We must finish until 3.", "We wrap by 3 hours."], answer: 0, explain: "by는 '~까지 (완료)', until은 '~까지 (계속)'입니다. 마감 시점에는 by를 씁니다." }
      ]
    },
    {
      id: 'opinions',
      icon: '💬',
      title: '의견 제시하기',
      titleEn: 'Giving Opinions',
      goal: '자신의 의견을 논리적이고 부드럽게 말하고, 다른 사람의 의견을 물을 수 있다.',
      expressions: [
        { en: "In my opinion, we should focus on the domestic market first.", ko: "제 생각에는 국내 시장에 먼저 집중해야 합니다.", blank: "opinion", swaps: ["In my opinion>On my opinion|At my opinion|To my opinion", "domestic>overseas|global", "focus on>focus at"] },
        { en: "From my perspective, the timeline is a bit tight.", ko: "제 관점에서는 일정이 조금 빠듯합니다.", blank: "perspective", swaps: ["From my>For my|By my", "tight>loose|relaxed"] },
        { en: "I strongly believe this is the right direction.", ko: "저는 이것이 옳은 방향이라고 확신합니다.", blank: "believe", swaps: ["strongly>strong|hardly", "right>wrong"] },
        { en: "What are your thoughts on this?", ko: "이것에 대해 어떻게 생각하세요?", tip: "'How do you think?'는 흔한 실수입니다. What do you think? 로 물어보세요.", blank: "thoughts", swaps: ["What are your thoughts>What is your thoughts|How are your thoughts|What are your thought", "on this>at this"] },
        { en: "I'd like to hear from everyone before we decide.", ko: "결정하기 전에 모두의 의견을 듣고 싶습니다.", blank: "hear", swaps: ["hear from>hear to|listen from", "before>after|until"] },
        { en: "If I may add something, we also need to consider the cost.", ko: "한 가지 덧붙이자면, 비용도 고려해야 합니다.", blank: "add", swaps: ["consider the>consider about the|considering the", "cost>schedule|quality"] },
        { en: "It seems to me that customers want a simpler design.", ko: "제가 보기에는 고객들이 더 단순한 디자인을 원하는 것 같습니다.", tip: "단정 짓지 않고 부드럽게 의견을 낼 때 좋습니다.", blank: "seems", swaps: ["simpler>more simpler|simplest|more complex", "It seems to me>It seems me"] }
      ],
      dialogue: {
        setting: '내년 목표 시장을 정하는 팀 회의입니다.',
        you: 'A',
        roles: { A: '나', B: 'Kate (팀장)', C: 'Ryan' },
        lines: [
          { s: 'B', en: "We need to decide which market to target next year. What are your thoughts on this?", ko: "내년에 어느 시장을 목표로 할지 정해야 해요. 이것에 대해 어떻게 생각하세요?" },
          { s: 'A', en: "In my opinion, we should focus on the domestic market first.", ko: "제 생각에는 국내 시장에 먼저 집중해야 합니다." },
          { s: 'B', en: "Interesting. Why do you think so?", ko: "흥미롭네요. 왜 그렇게 생각하세요?" },
          { s: 'A', en: "It seems to me that our brand is still not well known overseas.", ko: "제가 보기에는 저희 브랜드가 아직 해외에 잘 알려지지 않은 것 같습니다." },
          { s: 'C', en: "I see your point. If I may add something, we also need to consider the cost of local marketing.", ko: "무슨 말씀인지 알겠어요. 한 가지 덧붙이자면, 현지 마케팅 비용도 고려해야 해요." },
          { s: 'A', en: "Exactly. From my perspective, the timeline is a bit tight as well.", ko: "맞아요. 제 관점에서는 일정도 조금 빠듯합니다." },
          { s: 'B', en: "Good points. I'd like to hear from everyone before we decide.", ko: "좋은 의견들이네요. 결정하기 전에 모두의 의견을 듣고 싶어요." }
        ]
      },
      situations: [
        { q: "단정적이지 않고 부드럽게 의견을 말하고 싶을 때 가장 적절한 것은?", options: ["It seems to me that customers want a simpler design.", "You are wrong about the design.", "Customers want simple design. That's it.", "Everybody knows the design is bad."], answer: 0, explain: "It seems to me that ~ / I feel that ~ 은 의견을 부드럽게 전달합니다." },
        { q: "회의 참석자들에게 의견을 물을 때 자연스러운 표현은?", options: ["What are your thoughts on this?", "How do you think about this?", "What do you think of about this?", "Tell me your think."], answer: 0, explain: "생각의 '내용'을 물을 땐 How가 아니라 What을 씁니다." },
        { q: "'한 가지 덧붙이자면'으로 발언을 시작할 때?", options: ["If I may add something, ...", "Let me plus something, ...", "Add one more, ...", "I will adding something, ..."], answer: 0, explain: "If I may ~ 는 발언 허락을 구하는 정중한 표현입니다." }
      ]
    },
    {
      id: 'agree-disagree',
      icon: '🤝',
      title: '동의와 반대',
      titleEn: 'Agreeing & Disagreeing',
      goal: '상대의 의견에 동의하거나, 관계를 해치지 않고 정중하게 반대할 수 있다.',
      expressions: [
        { en: "I completely agree with you.", ko: "전적으로 동의합니다.", blank: "agree", swaps: ["I completely>I'm completely", "agree with>agree to|agree on"] },
        { en: "That's a good point.", ko: "좋은 지적입니다.", blank: "point", swaps: ["a good>good|a well", "point>points"] },
        { en: "I see where you're coming from, but I have a different view.", ko: "무슨 말씀인지는 알겠지만, 저는 생각이 좀 다릅니다.", tip: "반대 의견 전에 상대 입장을 먼저 인정하는 쿠션 표현입니다.", blank: "coming", swaps: ["where you're coming from>where are you coming from|what you're coming from|where you're going", "a different view>the same view"] },
        { en: "I'm afraid I have to disagree.", ko: "죄송하지만 동의하기 어렵습니다.", tip: "I'm afraid ~ 는 부정적인 내용을 부드럽게 만들어 줍니다.", blank: "afraid", swaps: ["I'm afraid>I'm scary|I'm afraid of|I'm fear", "disagree>agree"] },
        { en: "I agree up to a point, but I have some concerns.", ko: "어느 정도는 동의하지만, 몇 가지 우려되는 점이 있습니다.", blank: "concerns", swaps: ["up to a point>up at a point|until a point", "some concerns>some concerning|any concerns"] },
        { en: "I'm not sure that's the best approach.", ko: "그게 최선의 방법인지는 잘 모르겠습니다.", blank: "approach", swaps: ["I'm not sure>I don't sure|I'm not surely|I'm sure", "best approach>best approaching"] },
        { en: "Let's find some middle ground.", ko: "서로 절충점을 찾아봅시다.", tip: "meet halfway 도 같은 의미로 자주 씁니다.", blank: "ground", swaps: ["middle>center|medium", "ground>land|floor"] }
      ],
      dialogue: {
        setting: '신규 앱 출시 시점을 두고 제품 책임자와 의견이 갈립니다.',
        you: 'A',
        roles: { A: '나', B: 'Mark (제품 책임자)' },
        lines: [
          { s: 'B', en: "I think we should launch the new app next month.", ko: "다음 달에 새 앱을 출시해야 한다고 생각해요." },
          { s: 'A', en: "I see where you're coming from, but I'm not sure that's the best approach.", ko: "무슨 말씀인지는 알겠지만, 그게 최선의 방법인지는 잘 모르겠습니다." },
          { s: 'B', en: "Why not? Our competitors are moving fast.", ko: "왜요? 경쟁사들이 빠르게 움직이고 있잖아요." },
          { s: 'A', en: "That's a good point. However, we still have some critical bugs to fix.", ko: "좋은 지적입니다. 하지만 아직 고쳐야 할 치명적인 버그가 있습니다." },
          { s: 'B', en: "Well, I agree up to a point, but a delay could cost us market share.", ko: "어느 정도는 동의하지만, 지연되면 시장 점유율을 잃을 수 있어요." },
          { s: 'A', en: "I understand. Let's find some middle ground. How about a beta launch next month?", ko: "이해합니다. 절충점을 찾아보죠. 다음 달에 베타 출시를 하는 건 어떨까요?" },
          { s: 'B', en: "That sounds reasonable. I completely agree with you on that.", ko: "합리적이네요. 그 부분은 전적으로 동의합니다." }
        ]
      },
      situations: [
        { q: "상사의 의견에 정중하게 반대하려면?", options: ["I'm afraid I have to disagree.", "No, you are wrong.", "I don't agree you.", "That's nonsense."], answer: 0, explain: "I'm afraid는 '유감이지만'이라는 쿠션어로, 반대 의견을 부드럽게 만들어 줍니다." },
        { q: "'좋은 지적입니다'를 영어로?", options: ["That's a good point.", "That's a good pointing.", "You point well.", "Good indicate."], answer: 0, explain: "point = 요점, 지적. 'Fair point.'도 자주 씁니다." },
        { q: "양측의 절충안을 찾자고 할 때?", options: ["Let's find some middle ground.", "Let's go to the middle.", "Let's half and half the problem.", "Let's meet in the center place."], answer: 0, explain: "middle ground = 중간 지점, 타협점" }
      ]
    },
    {
      id: 'clarifying',
      icon: '✋',
      title: '끼어들기 & 확인하기',
      titleEn: 'Interrupting & Clarifying',
      goal: '정중하게 끼어들어 질문하고, 이해가 안 된 부분을 확인할 수 있다.',
      expressions: [
        { en: "Sorry to interrupt, but could I ask a quick question?", ko: "말씀 중에 죄송하지만, 간단히 질문 하나 드려도 될까요?", blank: "interrupt", swaps: ["Sorry to interrupt>Sorry for interrupt|Sorry to interrupting|Sorry to interruption", "a quick question>a quick questions"] },
        { en: "Could you elaborate on that?", ko: "그 부분을 좀 더 자세히 설명해 주시겠어요?", blank: "elaborate", swaps: ["elaborate on>elaborate|elaborate in|elaborate at"] },
        { en: "Just to clarify, are we talking about the US or Europe?", ko: "확인차 여쭙자면, 미국 얘기인가요 유럽 얘기인가요?", blank: "clarify", swaps: ["are we talking>are we talk|do we talking|are we talked", "the US>the UK"] },
        { en: "Sorry, I didn't quite catch that.", ko: "죄송하지만, 잘 못 알아들었습니다.", tip: "catch = (말을) 알아듣다", blank: "catch", swaps: ["catch>caught|catching|catched"] },
        { en: "Could you say that again a bit more slowly?", ko: "조금만 더 천천히 다시 말씀해 주시겠어요?", blank: "slowly", swaps: ["a bit more slowly>a bit more slow|a bit slowlier|a bit more quickly"] },
        { en: "So, what you're saying is that we need more staff?", ko: "그러니까 인력이 더 필요하다는 말씀이시죠?", tip: "상대의 말을 요약해서 제대로 이해했는지 확인하는 표현입니다.", blank: "saying", swaps: ["what you're saying>what are you saying|what you saying|which you're saying", "more staff>more stuff|fewer staff"] },
        { en: "Could I just finish my point?", ko: "제 말을 마저 끝내도 될까요?", tip: "누군가 끼어들었을 때 정중하게 발언권을 지키는 표현입니다.", blank: "finish", swaps: ["finish my point>finish my pointing|finish to my point|finish of my point"] }
      ],
      dialogue: {
        setting: '동료 Lisa가 신규 지역 확장 계획을 발표하는 중입니다.',
        you: 'A',
        roles: { A: '나', B: 'Lisa (발표자)' },
        lines: [
          { s: 'B', en: "So, we expect sales to grow by twenty percent in the new region.", ko: "그래서 신규 지역에서 매출이 20% 성장할 것으로 예상합니다." },
          { s: 'A', en: "Sorry to interrupt, but could I ask a quick question?", ko: "말씀 중에 죄송하지만, 간단히 질문 하나 드려도 될까요?" },
          { s: 'B', en: "Of course, go ahead.", ko: "물론이죠, 말씀하세요." },
          { s: 'A', en: "Just to clarify, are we talking about the US or Europe?", ko: "확인차 여쭙자면, 미국 얘기인가요 유럽 얘기인가요?" },
          { s: 'B', en: "Europe. We're opening two new offices in Germany next year.", ko: "유럽이요. 내년에 독일에 사무소 두 곳을 새로 엽니다." },
          { s: 'A', en: "I see. Could you elaborate on the hiring plan?", ko: "그렇군요. 채용 계획에 대해 좀 더 자세히 설명해 주시겠어요?" },
          { s: 'B', en: "Sure. We plan to hire around fifteen local employees.", ko: "네. 현지 직원을 15명 정도 채용할 계획입니다." },
          { s: 'A', en: "So, what you're saying is that we need more staff before the launch?", ko: "그러니까 출범 전에 인력이 더 필요하다는 말씀이시죠?" },
          { s: 'B', en: "Exactly. That's the main reason I brought it up today.", ko: "맞아요. 그게 오늘 이 이야기를 꺼낸 주된 이유예요." }
        ]
      },
      situations: [
        { q: "상대의 말을 못 알아들었을 때 정중한 표현은?", options: ["Sorry, I didn't quite catch that.", "What? Again.", "I can't hear you, speak.", "Your English is hard."], answer: 0, explain: "'Sorry, could you repeat that?'도 정중한 표현입니다." },
        { q: "발표 중간에 질문하려고 끼어들 때?", options: ["Sorry to interrupt, but could I ask a quick question?", "Wait, wait. Question.", "Stop. I have a question.", "Excuse me, you must answer me."], answer: 0, explain: "Sorry to interrupt 로 먼저 양해를 구하세요." },
        { q: "상대의 말을 요약해서 내가 제대로 이해했는지 확인하려면?", options: ["So, what you're saying is ...", "So, you said it wrong ...", "Say it in one word, please.", "I know already what you say."], answer: 0, explain: "'If I understand correctly, ...'도 같은 상황에서 씁니다." }
      ]
    },
    {
      id: 'reporting',
      icon: '📊',
      title: '현황 보고 & 데이터 설명',
      titleEn: 'Updates & Presenting Data',
      goal: '프로젝트 진행 상황을 보고하고 수치와 그래프를 설명할 수 있다.',
      expressions: [
        { en: "Let me give you a quick update on the project.", ko: "프로젝트 현황을 간단히 말씀드리겠습니다.", blank: "update", swaps: ["give you a quick update>give to you a quick update|give you a quick updating|give you quick update"] },
        { en: "We're on track to meet the deadline.", ko: "마감일을 맞출 수 있도록 순조롭게 진행 중입니다.", tip: "on track = 계획대로 진행 중", blank: "track", swaps: ["on track>in track|on truck|at track", "meet the deadline>meet with the deadline|miss the deadline"] },
        { en: "We're running about two weeks behind schedule.", ko: "일정보다 2주 정도 늦어지고 있습니다.", tip: "반대로 일정보다 앞서 있으면 ahead of schedule", blank: "behind", swaps: ["behind>ahead of|behind of", "two weeks>two week|three weeks"] },
        { en: "As you can see from this chart, sales increased by 15%.", ko: "이 차트에서 보시다시피, 매출이 15% 증가했습니다.", tip: "증감의 폭은 by 로 나타냅니다.", blank: "chart", swaps: ["increased by>increased to|decreased by|increased for", "15%>50%|1.5%"] },
        { en: "Revenue dropped slightly in the second quarter.", ko: "2분기에 매출이 소폭 하락했습니다.", blank: "slightly", swaps: ["dropped slightly>dropped sharply|rose slightly|dropped slight", "second>third|first"] },
        { en: "This is mainly due to higher shipping costs.", ko: "이는 주로 배송비 상승 때문입니다.", blank: "due", swaps: ["mainly due to>main due to|mainly due for|mainly due of", "higher>lower"] },
        { en: "The key takeaway here is that customer retention is improving.", ko: "여기서 핵심은 고객 유지율이 개선되고 있다는 점입니다.", tip: "takeaway = 핵심 메시지, 시사점", blank: "takeaway", swaps: ["improving>declining|improve", "retention>attention|retaining"] }
      ],
      dialogue: {
        setting: '임원 회의에서 Atlas 프로젝트 현황을 보고합니다.',
        you: 'A',
        roles: { A: '나 (PM)', B: 'Director Chen' },
        lines: [
          { s: 'B', en: "Could you give us an update on the Atlas project?", ko: "Atlas 프로젝트 현황을 말씀해 주시겠어요?" },
          { s: 'A', en: "Sure. Overall, we're on track to meet the deadline.", ko: "네. 전반적으로 마감일을 맞출 수 있도록 순조롭게 진행 중입니다." },
          { s: 'B', en: "Good to hear. What about the budget?", ko: "다행이네요. 예산은요?" },
          { s: 'A', en: "As you can see from this chart, costs increased by fifteen percent in the second quarter.", ko: "이 차트에서 보시다시피, 2분기에 비용이 15% 증가했습니다." },
          { s: 'B', en: "That's quite a jump. What happened?", ko: "꽤 많이 올랐네요. 무슨 일이 있었죠?" },
          { s: 'A', en: "This is mainly due to higher shipping costs. We're already talking to new suppliers.", ko: "주로 배송비 상승 때문입니다. 이미 새 공급업체들과 협의 중입니다." },
          { s: 'B', en: "Okay. Anything else we should know?", ko: "알겠어요. 그 밖에 알아야 할 사항이 있나요?" },
          { s: 'A', en: "The key takeaway here is that the project is healthy, but we need to keep an eye on costs.", ko: "핵심은 프로젝트는 건전하지만, 비용은 주의 깊게 지켜봐야 한다는 점입니다." }
        ]
      },
      situations: [
        { q: "'프로젝트가 계획대로 진행되고 있다'를 영어로?", options: ["We're on track.", "We're on the road.", "We're in line.", "We're on rail."], answer: 0, explain: "on track = 계획대로, 순조롭게" },
        { q: "'15% 증가했다'로 올바른 것은?", options: ["increased by 15%", "increased with 15%", "increased at 15%", "increased for 15%"], answer: 0, explain: "증감의 폭은 by로 나타냅니다. (increased to 15%는 '15%까지' 증가했다는 뜻)" },
        { q: "'일정보다 늦어지고 있다'를 영어로?", options: ["We're behind schedule.", "We're after schedule.", "We're late of schedule.", "We're under schedule."], answer: 0, explain: "반대로 일정보다 앞서 있으면 ahead of schedule입니다." }
      ]
    },
    {
      id: 'negotiation',
      icon: '💼',
      title: '협상 & 문제 해결',
      titleEn: 'Negotiating & Problem Solving',
      goal: '조건을 제안·조율하고, 즉답이 어려울 때 정중하게 보류할 수 있다.',
      expressions: [
        { en: "What if we extended the contract to two years?", ko: "계약을 2년으로 연장하면 어떨까요?", tip: "What if + 과거형 = '~하면 어떨까요?' 하는 부드러운 가정 제안", blank: "extended", swaps: ["to two>until two|by two", "years>months"] },
        { en: "We'd be willing to lower the price if you increase the order volume.", ko: "주문량을 늘려 주신다면 가격을 낮출 의향이 있습니다.", blank: "willing", swaps: ["lower>raise|low", "increase>decrease|reduce"] },
        { en: "That's a bit beyond our budget.", ko: "그건 저희 예산을 조금 넘어섭니다.", blank: "budget", swaps: ["beyond>within|under", "a bit>a bit of|a few"] },
        { en: "Is there any flexibility on the delivery date?", ko: "납기일은 조정이 가능할까요?", blank: "flexibility", swaps: ["Is there>Are there", "flexibility>flexible", "delivery date>delivery data|payment date"] },
        { en: "Let's look at this from a different angle.", ko: "이 문제를 다른 각도에서 봅시다.", blank: "angle", swaps: ["from a different angle>from a different angel|in a different angle|at a different angle", "look at this>look this|see at this"] },
        { en: "I think we can both benefit from this deal.", ko: "이번 거래로 양측 모두 이익을 볼 수 있다고 생각합니다.", tip: "win-win 이라는 표현도 자주 씁니다.", blank: "benefit", swaps: ["benefit from>benefit to|benefit of|benefit with"] },
        { en: "I'll need to check with my manager before I can confirm.", ko: "확정하기 전에 상사와 확인해 봐야 합니다.", blank: "confirm", swaps: ["check with>check to|check at|check for", "before>after"] }
      ],
      dialogue: {
        setting: '고객사 구매 담당자와 공급 조건을 협상합니다. 나는 공급사 측입니다.',
        you: 'A',
        roles: { A: '나 (공급사)', B: 'Emma (고객사)' },
        lines: [
          { s: 'B', en: "We like your product, but the price is a bit beyond our budget.", ko: "제품은 마음에 드는데, 가격이 저희 예산을 조금 넘어서요." },
          { s: 'A', en: "I understand. Is there any flexibility on the order volume?", ko: "이해합니다. 주문량은 조정이 가능할까요?" },
          { s: 'B', en: "We could possibly increase it by thirty percent.", ko: "30% 정도는 늘릴 수 있을 것 같아요." },
          { s: 'A', en: "In that case, we'd be willing to lower the price by five percent.", ko: "그렇다면 가격을 5% 낮출 의향이 있습니다." },
          { s: 'B', en: "That helps. Is there any flexibility on the delivery date? We need everything by March.", ko: "도움이 되네요. 납기일도 조정이 가능할까요? 3월까지 전부 필요해서요." },
          { s: 'A', en: "Let's look at this from a different angle. What if we delivered half in March and the rest in April?", ko: "다른 각도에서 보죠. 3월에 절반, 나머지는 4월에 납품하면 어떨까요?" },
          { s: 'B', en: "That could work. I'll need to check with my manager before I can confirm.", ko: "괜찮을 것 같네요. 확정하기 전에 상사와 확인해 봐야 해요." },
          { s: 'A', en: "Of course. I think we can both benefit from this deal.", ko: "물론이죠. 이번 거래로 양측 모두 이익을 볼 수 있다고 생각합니다." }
        ]
      },
      situations: [
        { q: "상대 제안이 예산을 넘을 때 부드럽게 말하려면?", options: ["That's a bit beyond our budget.", "Too expensive! No way.", "Your price is crazy.", "We don't have money."], answer: 0, explain: "a bit 을 넣으면 거절의 강도가 부드러워집니다." },
        { q: "가정해서 새로운 조건을 제안할 때 자연스러운 것은?", options: ["What if we extended the contract to two years?", "If we extend contract two years how?", "Contract two years, okay?", "What about extend contract?"], answer: 0, explain: "What if + 과거형은 '~하면 어떨까요?' 하는 부드러운 제안입니다." },
        { q: "즉답을 피하고 상사 확인이 필요하다고 할 때?", options: ["I'll need to check with my manager before I can confirm.", "My boss decides, not me.", "I can't say anything.", "Ask my manager yourself."], answer: 0, explain: "'Let me get back to you on that.'도 즉답을 보류할 때 자주 씁니다." }
      ]
    },
    {
      id: 'online',
      icon: '💻',
      title: '화상회의',
      titleEn: 'Virtual Meetings',
      goal: '화상회의에서 자주 생기는 연결·음성·화면 공유 상황에 대처할 수 있다.',
      expressions: [
        { en: "Can everyone hear me okay?", ko: "제 목소리 잘 들리시나요?", blank: "hear", swaps: ["hear me>hears me|listen me|hear to me"] },
        { en: "I think you're on mute.", ko: "음소거 상태이신 것 같아요.", blank: "mute", swaps: ["on mute>in mute|at mute", "you're>your|you"] },
        { en: "Sorry, you're breaking up a little.", ko: "죄송하지만, 소리가 조금 끊겨요.", tip: "break up = (통화·영상이) 끊기다. break down(고장 나다)과 구분하세요.", blank: "breaking", swaps: ["breaking up>breaking down|breaking out|breaking off", "a little>a few"] },
        { en: "Let me share my screen.", ko: "제 화면을 공유하겠습니다.", blank: "share", swaps: ["Let me share>Let me sharing|Let me to share|Let's me share"] },
        { en: "Can you see my screen now?", ko: "이제 제 화면 보이시나요?", blank: "screen", swaps: ["see>look|seeing|saw"] },
        { en: "My connection is unstable, so I'll turn off my camera.", ko: "연결이 불안정해서 카메라를 끄겠습니다.", blank: "connection", swaps: ["turn off>turn on|turn out|turn down", "unstable>stable"] },
        { en: "I'll drop the link in the chat.", ko: "채팅창에 링크를 올려 드릴게요.", tip: "drop / post / share a link in the chat 모두 자연스럽습니다.", blank: "chat", swaps: ["drop>dropping|dropped|drops"] }
      ],
      dialogue: {
        setting: '내가 호스트인 화상회의가 시작되었습니다.',
        you: 'A',
        roles: { A: '나 (호스트)', B: 'Olivia', C: 'Ben' },
        lines: [
          { s: 'A', en: "Hi everyone. Can everyone hear me okay?", ko: "안녕하세요 여러분. 제 목소리 잘 들리시나요?" },
          { s: 'B', en: "Yes, loud and clear.", ko: "네, 아주 잘 들려요." },
          { s: 'A', en: "Ben, I think you're on mute.", ko: "벤, 음소거 상태이신 것 같아요." },
          { s: 'C', en: "Oh, sorry about that. Can you hear me now?", ko: "아, 죄송해요. 이제 들리세요?" },
          { s: 'A', en: "Yes, we can hear you now. Let me share my screen. Can you see my screen now?", ko: "네, 이제 들려요. 제 화면을 공유할게요. 이제 제 화면 보이시나요?" },
          { s: 'C', en: "Yes, but sorry, you're breaking up a little.", ko: "네, 그런데 죄송하지만 소리가 조금 끊겨요." },
          { s: 'A', en: "Sorry, my connection is unstable, so I'll turn off my camera.", ko: "죄송해요, 연결이 불안정해서 카메라를 끌게요." },
          { s: 'B', en: "Much better now, thanks.", ko: "이제 훨씬 낫네요, 고마워요." },
          { s: 'A', en: "Great. I'll drop the link to the slides in the chat after the meeting.", ko: "좋아요. 회의 끝나고 슬라이드 링크를 채팅창에 올려 드릴게요." }
        ]
      },
      situations: [
        { q: "상대가 음소거 상태일 때 알려주려면?", options: ["I think you're on mute.", "Your sound is dead.", "You are silence.", "Open your voice."], answer: 0, explain: "'You're muted.'라고도 합니다." },
        { q: "상대방 소리가 끊겨서 들릴 때?", options: ["You're breaking up a little.", "You're breaking down.", "Your voice is broken.", "You are cutting."], answer: 0, explain: "break down은 '고장 나다/무너지다'라는 뜻이라 다릅니다." },
        { q: "채팅창에 링크를 올리겠다고 할 때 자연스러운 것은?", options: ["I'll drop the link in the chat.", "I'll throw the link to the chat.", "I'll put down link chat.", "I'll fall the link in the chat."], answer: 0, explain: "drop / post / share a link in the chat 모두 자연스럽습니다." }
      ]
    },
    {
      id: 'closing',
      icon: '✅',
      title: '회의 마무리 & 후속 조치',
      titleEn: 'Wrapping Up & Action Items',
      goal: '논의 내용을 요약하고, 담당자와 기한을 정해 회의를 마무리할 수 있다.',
      expressions: [
        { en: "Let's wrap things up.", ko: "이제 마무리하죠.", blank: "wrap", swaps: ["up>down|over|off"] },
        { en: "To sum up, we've agreed to postpone the launch.", ko: "요약하자면, 출시를 연기하기로 합의했습니다.", tip: "To sum up / In summary / To summarize 모두 사용 가능합니다.", blank: "sum", swaps: ["To sum up>To sum|Sum up", "postpone>cancel|advance|speed up"] },
        { en: "Let's go over the action items.", ko: "실행 항목을 한번 정리해 봅시다.", tip: "action item = 회의 후 누가 무엇을 할지 정한 할 일", blank: "action", swaps: ["go over>go on|go out|go off"] },
        { en: "Who's going to take care of this?", ko: "이건 누가 맡아 주실 건가요?", blank: "care", swaps: ["take care of>take care for|take care with|take care about"] },
        { en: "Could you send me the report by Friday?", ko: "금요일까지 보고서를 보내 주시겠어요?", blank: "Friday", swaps: ["by>until|till", "Friday>Monday|Thursday"] },
        { en: "I'll send out the meeting notes this afternoon.", ko: "오늘 오후에 회의록을 공유하겠습니다.", blank: "notes", swaps: ["afternoon>morning|evening", "send out>sent out|sending out"] },
        { en: "Let's touch base next week.", ko: "다음 주에 다시 이야기 나눠요.", tip: "touch base = 간단히 다시 연락하거나 논의하다", blank: "base", swaps: ["touch base>touch the base|touch bases|touch a base"] }
      ],
      dialogue: {
        setting: '회의 시간이 거의 끝나갑니다. 내가 회의를 마무리합니다.',
        you: 'A',
        roles: { A: '나 (회의 주재자)', B: 'Daniel', C: 'Grace' },
        lines: [
          { s: 'A', en: "We're almost out of time, so let's wrap things up.", ko: "시간이 거의 다 됐으니 이제 마무리하죠." },
          { s: 'A', en: "To sum up, we've agreed to postpone the launch until May.", ko: "요약하자면, 출시를 5월로 연기하기로 합의했습니다." },
          { s: 'B', en: "That's right. So what are the next steps?", ko: "맞아요. 그럼 다음 단계는 뭔가요?" },
          { s: 'A', en: "Let's go over the action items. First, we need an updated marketing plan. Who's going to take care of this?", ko: "실행 항목을 정리해 봅시다. 먼저 수정된 마케팅 계획이 필요합니다. 이건 누가 맡아 주실 건가요?" },
          { s: 'C', en: "I can take care of that.", ko: "제가 맡을게요." },
          { s: 'A', en: "Thanks, Grace. Could you send me the plan by Friday?", ko: "고마워요, 그레이스. 금요일까지 계획을 보내 주시겠어요?" },
          { s: 'C', en: "Sure, no problem.", ko: "네, 문제없어요." },
          { s: 'B', en: "And I'll contact the suppliers about the new schedule.", ko: "그리고 저는 공급업체에 새 일정에 대해 연락할게요." },
          { s: 'A', en: "Perfect. I'll send out the meeting notes this afternoon. Let's touch base next week.", ko: "좋습니다. 오늘 오후에 회의록을 공유할게요. 다음 주에 다시 이야기 나눠요." }
        ]
      },
      situations: [
        { q: "회의 내용을 요약하며 말을 시작할 때?", options: ["To sum up, ...", "To sum, ...", "Summary is, ...", "For summarizing, ..."], answer: 0, explain: "To sum up / In summary / To summarize 모두 사용 가능합니다." },
        { q: "'다음 주에 다시 연락해서 이야기하자'는 뜻의 표현은?", options: ["Let's touch base next week.", "Let's touch the base next week.", "Let's hit the bottom next week.", "Let's basic contact next week."], answer: 0, explain: "touch base는 관사 없이 씁니다." },
        { q: "업무 담당자를 정할 때 자연스러운 질문은?", options: ["Who's going to take care of this?", "Who takes this care?", "Who is careful for this?", "This is whose?"], answer: 0, explain: "'Who can take the lead on this?'도 자주 씁니다." }
      ]
    },
    {
      id: 'brainstorming',
      icon: '💡',
      title: '브레인스토밍',
      titleEn: 'Brainstorming Ideas',
      goal: '자유롭게 아이디어를 끌어내고, 발전시키고, 좁혀 나가는 회의를 이끌 수 있다.',
      expressions: [
        { en: "Let's throw some ideas around.", ko: "아이디어를 자유롭게 던져 봅시다.", tip: "throw ideas around = 부담 없이 아이디어를 내다", blank: "ideas", swaps: ["around>away|off|down", "some ideas>some idea"] },
        { en: "There are no bad ideas at this stage.", ko: "지금 단계에서는 나쁜 아이디어란 없습니다.", blank: "stage", swaps: ["There are no>There is no|There aren't no", "bad>good"] },
        { en: "What if we tried a subscription model?", ko: "구독 모델을 시도해 보면 어떨까요?", blank: "tried", swaps: ["What if>How if|What about", "tried>trying"] },
        { en: "Building on what Sarah said, we could also offer a free trial.", ko: "사라 씨 말씀에 덧붙여, 무료 체험도 제공할 수 있겠어요.", tip: "Building on ~ = ~의 아이디어를 발전시켜서", blank: "Building", swaps: ["Building on>Building in|Build on|Building at", "free trial>paid trial|free trail"] },
        { en: "That's an interesting idea. Can you tell us more?", ko: "흥미로운 아이디어네요. 좀 더 말씀해 주시겠어요?", blank: "interesting", swaps: ["an interesting idea>a interesting idea|an interested idea|an interesting ideas", "tell us more>tell us much|say us more"] },
        { en: "Let's narrow it down to the top three ideas.", ko: "상위 세 개 아이디어로 좁혀 봅시다.", tip: "narrow down = 범위를 좁히다", blank: "narrow", swaps: ["narrow it down>narrow it up|narrow down it|narrow it out", "three>five|two"] },
        { en: "Let's park that idea for now and come back to it later.", ko: "그 아이디어는 일단 보류하고 나중에 다시 이야기하죠.", tip: "park = (논의를) 잠시 보류하다. put ~ on hold 와 같은 뜻", blank: "park", swaps: ["Let's park>Let's parking|Let's parked", "come back to it>come back it|come back at it"] }
      ],
      dialogue: {
        setting: '신규 고객 유치 방안을 찾는 브레인스토밍 회의를 내가 진행합니다.',
        you: 'A',
        roles: { A: '나 (진행자)', B: 'Sarah', C: 'Leo' },
        lines: [
          { s: 'A', en: "Okay, let's throw some ideas around. There are no bad ideas at this stage.", ko: "자, 아이디어를 자유롭게 던져 봅시다. 지금 단계에서는 나쁜 아이디어란 없어요." },
          { s: 'B', en: "What if we tried a subscription model?", ko: "구독 모델을 시도해 보면 어떨까요?" },
          { s: 'A', en: "That's an interesting idea. Can you tell us more?", ko: "흥미로운 아이디어네요. 좀 더 말씀해 주시겠어요?" },
          { s: 'B', en: "Customers could pay monthly instead of buying the full package upfront.", ko: "고객들이 전체 패키지를 한 번에 사는 대신 매달 결제하는 거예요." },
          { s: 'A', en: "Building on what Sarah said, we could also offer a free trial for the first month.", ko: "사라 씨 말씀에 덧붙여, 첫 달 무료 체험도 제공할 수 있겠어요." },
          { s: 'C', en: "I love that. We could also partner with influencers.", ko: "좋네요. 인플루언서와 협업할 수도 있고요." },
          { s: 'A', en: "Good thought, but let's park that idea for now and come back to it later.", ko: "좋은 생각이지만, 그 아이디어는 일단 보류하고 나중에 다시 이야기하죠." },
          { s: 'A', en: "We have a lot of options. Let's narrow it down to the top three ideas.", ko: "선택지가 많네요. 상위 세 개 아이디어로 좁혀 봅시다." }
        ]
      },
      situations: [
        { q: "브레인스토밍을 시작하며 참가자들이 부담 없이 말하도록 하려면?", options: ["There are no bad ideas at this stage.", "Only good ideas, please.", "Don't say stupid things.", "Your ideas must be perfect."], answer: 0, explain: "참가자들의 심리적 부담을 낮춰 주는 표현입니다." },
        { q: "논의가 길어지는 아이디어를 '일단 보류'하자고 할 때?", options: ["Let's park that idea for now.", "Let's stop that idea forever.", "Let's parking the idea.", "Let's put that idea in the garage."], answer: 0, explain: "'Let's put that on hold.'도 같은 뜻입니다." },
        { q: "다른 사람의 아이디어를 발전시켜 말할 때 자연스러운 시작은?", options: ["Building on what Sarah said, ...", "Sarah is wrong, so ...", "Different from Sarah, ...", "Sarah said, and I said ..."], answer: 0, explain: "Building on ~ / To add to ~ 는 협력적인 분위기를 만들어 줍니다." }
      ]
    },
    {
      id: 'presentation-qa',
      icon: '🎤',
      title: '발표 & 질의응답',
      titleEn: 'Presentations & Q&A',
      goal: '발표를 구조 있게 진행하고, 예상치 못한 질문에도 침착하게 답할 수 있다.',
      expressions: [
        { en: "Today, I'm going to walk you through our new marketing strategy.", ko: "오늘은 새로운 마케팅 전략을 차근차근 설명드리겠습니다.", tip: "walk ~ through = ~에게 단계별로 설명하다", blank: "walk", swaps: ["walk you through>walk you over|walk through you|walk you across", "new>old"] },
        { en: "I'll be happy to take questions at the end.", ko: "질문은 마지막에 기꺼이 받겠습니다.", blank: "questions", swaps: ["at the end>in the end|at the last|on the end", "questions>answers"] },
        { en: "Let's move on to the next slide.", ko: "다음 슬라이드로 넘어가겠습니다.", blank: "slide", swaps: ["move on to>move on at|move in to|move on of", "next>previous"] },
        { en: "That's a great question.", ko: "좋은 질문입니다.", tip: "답을 생각할 시간을 벌어 주는 표현이기도 합니다.", blank: "question", swaps: ["a great>great|a greatly", "question>questions"] },
        { en: "I don't have that information right now, but I'll get back to you.", ko: "지금은 그 정보가 없지만, 확인해서 다시 알려 드리겠습니다.", tip: "get back to ~ = 나중에 다시 연락하다", blank: "information", swaps: ["get back to you>get back you|get you back|get back at you"] },
        { en: "If I understand your question correctly, you're asking about the budget.", ko: "질문을 제대로 이해했다면, 예산에 대해 물으시는 거죠?", blank: "correctly", swaps: ["you're asking about>you're asking for|you're asked about|you're asking", "budget>schedule"] },
        { en: "Does that answer your question?", ko: "답변이 되었을까요?", blank: "answer", swaps: ["Does>Do|Is", "answer>answers"] }
      ],
      dialogue: {
        setting: '신규 마케팅 전략을 발표한 뒤 질의응답 시간입니다.',
        you: 'A',
        roles: { A: '나 (발표자)', B: 'Michael (임원)', C: 'Anna' },
        lines: [
          { s: 'A', en: "Today, I'm going to walk you through our new marketing strategy. I'll be happy to take questions at the end.", ko: "오늘은 새로운 마케팅 전략을 차근차근 설명드리겠습니다. 질문은 마지막에 기꺼이 받겠습니다." },
          { s: 'A', en: "So, that's the overview. Now, I'd be happy to take any questions.", ko: "이상으로 개요를 마치겠습니다. 이제 질문 받겠습니다." },
          { s: 'B', en: "How much will this campaign cost compared to last year?", ko: "이번 캠페인은 작년 대비 비용이 얼마나 드나요?" },
          { s: 'A', en: "That's a great question. If I understand your question correctly, you're asking about the total budget?", ko: "좋은 질문입니다. 제가 제대로 이해했다면, 전체 예산에 대해 물으시는 거죠?" },
          { s: 'B', en: "Yes, the total budget.", ko: "네, 전체 예산이요." },
          { s: 'A', en: "It's about ten percent higher, mainly due to digital advertising. Does that answer your question?", ko: "약 10% 더 높은데, 주로 디지털 광고 때문입니다. 답변이 되었을까요?" },
          { s: 'C', en: "What's the expected return on investment?", ko: "예상 투자 수익률은 어떻게 되나요?" },
          { s: 'A', en: "I don't have that information right now, but I'll get back to you by tomorrow.", ko: "지금은 그 정보가 없지만, 내일까지 확인해서 알려 드리겠습니다." }
        ]
      },
      situations: [
        { q: "발표 중 답을 모르는 질문을 받았을 때 가장 프로다운 답변은?", options: ["I don't have that information right now, but I'll get back to you.", "I don't know. Next question.", "That's not my job.", "Why do you ask that?"], answer: 0, explain: "모른다고 끝내지 말고 '확인 후 다시 알려 드리겠다'고 약속하세요." },
        { q: "답변을 마친 뒤 질문자가 만족했는지 확인하려면?", options: ["Does that answer your question?", "Do you understand me?", "Is it clear for you or not?", "You got it, right?"], answer: 0, explain: "'Do you understand?'는 상대를 가르치는 듯한 뉘앙스가 있어 피하는 게 좋습니다." },
        { q: "'단계별로 설명드리겠습니다'를 영어로?", options: ["I'm going to walk you through it.", "I'm going to run you about it.", "I will step you it.", "I explain you step."], answer: 0, explain: "walk ~ through는 발표에서 정말 자주 쓰는 표현입니다." }
      ]
    },
    {
      id: 'scheduling',
      icon: '📅',
      title: '일정 조율',
      titleEn: 'Scheduling & Rescheduling',
      goal: '회의 일정을 잡고, 변경이 필요할 때 정중하게 조율할 수 있다.',
      expressions: [
        { en: "Are you available next Tuesday afternoon?", ko: "다음 주 화요일 오후에 시간 괜찮으세요?", blank: "available", swaps: ["Are you available next>Are you possible next|Are you available at next", "Tuesday>Thursday|Monday", "afternoon>morning"] },
        { en: "Does 10 a.m. work for you?", ko: "오전 10시 괜찮으세요?", tip: "work for ~ = ~에게 (일정이) 괜찮다", blank: "work", swaps: ["Does>Do|Is", "a.m.>p.m.", "work for>works for|work to"] },
        { en: "I'm afraid I'm tied up on Monday.", ko: "죄송하지만 월요일은 일정이 꽉 차 있습니다.", tip: "be tied up = 바빠서 시간이 없다", blank: "tied", swaps: ["tied up>tied out|tying up|tied off", "on Monday>in Monday|at Monday"] },
        { en: "Could we push the meeting back to Thursday?", ko: "회의를 목요일로 미룰 수 있을까요?", tip: "push back = 미루다 / move up = 앞당기다", blank: "push", swaps: ["back>up|down", "Thursday>Tuesday"] },
        { en: "Something urgent has come up, so I need to reschedule.", ko: "급한 일이 생겨서 일정을 변경해야 합니다.", blank: "reschedule", swaps: ["Something urgent>Urgent something|Something urgently", "has come up>has came up|has come out"] },
        { en: "I'll send you a calendar invite.", ko: "캘린더 초대를 보내 드릴게요.", blank: "invite", swaps: ["send you a>send to you a|sending you a|send you an"] },
        { en: "Just a reminder that our meeting is tomorrow at 2.", ko: "내일 2시에 회의가 있다는 점 다시 알려 드립니다.", blank: "reminder", swaps: ["tomorrow>today|yesterday", "at 2>at 3|on 2"] }
      ],
      dialogue: {
        setting: '외부 파트너와 다음 회의 일정을 잡고, 며칠 뒤 일정을 변경합니다.',
        you: 'A',
        roles: { A: '나', B: 'Chris (파트너사)' },
        lines: [
          { s: 'B', en: "Hi, I'd like to set up a meeting to discuss the contract.", ko: "안녕하세요, 계약 논의를 위해 회의를 잡고 싶습니다." },
          { s: 'A', en: "Sure. Are you available next Tuesday afternoon?", ko: "좋습니다. 다음 주 화요일 오후에 시간 괜찮으세요?" },
          { s: 'B', en: "I'm afraid I'm tied up on Tuesday. How about Wednesday?", ko: "죄송하지만 화요일은 일정이 꽉 차 있어요. 수요일은 어떠세요?" },
          { s: 'A', en: "Wednesday is fine. Does 10 a.m. work for you?", ko: "수요일 좋습니다. 오전 10시 괜찮으세요?" },
          { s: 'B', en: "Ten works perfectly.", ko: "10시 아주 좋습니다." },
          { s: 'A', en: "Great. I'll send you a calendar invite.", ko: "좋아요. 캘린더 초대를 보내 드릴게요." },
          { s: 'A', en: "Hi Chris, something urgent has come up, so I need to reschedule. Could we push the meeting back to Thursday?", ko: "크리스 씨, 급한 일이 생겨서 일정을 변경해야 합니다. 회의를 목요일로 미룰 수 있을까요?" },
          { s: 'B', en: "No problem. Thursday at the same time?", ko: "문제없어요. 목요일 같은 시간에요?" },
          { s: 'A', en: "Yes, thank you for understanding.", ko: "네, 이해해 주셔서 감사합니다." }
        ]
      },
      situations: [
        { q: "회의를 '뒤로 미루자'고 할 때 맞는 표현은?", options: ["push the meeting back", "push the meeting up", "pull the meeting front", "move the meeting behind"], answer: 0, explain: "push back = 미루다, move up / bring forward = 앞당기다." },
        { q: "상대에게 그 시간이 괜찮은지 물을 때 가장 자연스러운 것은?", options: ["Does 10 a.m. work for you?", "Is 10 a.m. possible to you?", "Can you possible at 10?", "10 a.m. is okay to you?"], answer: 0, explain: "work for ~ 는 일정이 맞는지 물을 때 가장 많이 씁니다." },
        { q: "'그날은 일정이 꽉 차 있다'를 정중하게 말하려면?", options: ["I'm afraid I'm tied up that day.", "I'm busy. No.", "That day is impossible for me forever.", "I have no time for you."], answer: 0, explain: "be tied up = 바쁘다. I'm afraid 로 부드럽게 시작하세요." }
      ]
    },
    {
      id: 'design-review',
      icon: '📐',
      title: '설계 검토',
      titleEn: 'Design Review',
      goal: '시스템 구조와 설계 판단의 근거를 설명하고, 기술적 질문과 반론에 답할 수 있다.',
      expressions: [
        { en: "Let me walk you through the system architecture.", ko: "시스템 아키텍처를 단계별로 설명드리겠습니다.", blank: "architecture", swaps: ["through>thorough|threw|though"] },
        { en: "This design meets all the functional requirements.", ko: "이 설계는 모든 기능 요구사항을 충족합니다.", tip: "functional / non-functional requirements = 기능 / 비기능 요구사항", blank: "requirements", swaps: ["meets>meet|meets with", "all the>the all|all of", "functional>non-functional"] },
        { en: "The main trade-off here is performance versus cost.", ko: "여기서 핵심 트레이드오프는 성능 대 비용입니다.", tip: "trade-off = 하나를 얻으려면 다른 하나를 포기해야 하는 관계", blank: "trade-off", swaps: ["trade-off>trade-in|trade-out|trade-offs", "versus>plus"] },
        { en: "What are the design constraints we need to consider?", ko: "고려해야 할 설계 제약 조건은 무엇인가요?", blank: "constraints", swaps: ["constraints>constrains|restraints|contracts", "need to consider>need consider|need to considering"] },
        { en: "Have we considered how this will scale?", ko: "이 구조가 규모가 커질 때 어떻게 확장될지 검토해 봤나요?", tip: "scale = (사용량·규모가 늘어날 때) 감당하며 확장되다", blank: "scale", swaps: ["how this will>how will this", "scale>scales|scaling"] },
        { en: "I'd suggest building a prototype before we commit to this approach.", ko: "이 방식으로 확정하기 전에 프로토타입을 먼저 만들어 볼 것을 제안합니다.", tip: "commit to ~ = ~으로 확정하다, 전념하다", blank: "prototype", swaps: ["suggest building>suggest to build|suggest build|suggest built", "before>after"] },
        { en: "Can we freeze the spec by the end of this week?", ko: "이번 주 말까지 사양을 확정할 수 있을까요?", tip: "freeze the spec = 사양을 더 이상 바꾸지 않도록 동결하다", blank: "freeze", swaps: ["by the end>until the end|in the end|on the end", "freeze>free|unfreeze"] }
      ],
      terms: [
        { en: "architecture", ko: "아키텍처, 시스템 구조", ex: "The new architecture separates the data layer from the UI.", def: "시스템을 이루는 구성 요소와 그 관계·역할 분담을 정한 전체 구조. 나중에 바꾸기 가장 비싼 결정이라 초기에 검토한다." },
        { en: "requirement", ko: "요구사항", ex: "Low latency is a key requirement for this system.", def: "시스템이 해야 할 일(기능 요구사항)과 갖춰야 할 품질(성능·보안·신뢰성 등 비기능 요구사항). 검증 가능하게 수치로 적는 것이 원칙이다." },
        { en: "specification (spec)", ko: "사양, 스펙", ex: "Please check the spec before you start coding.", def: "요구사항을 수치·조건으로 구체화한 문서. 설계와 시험(검증)의 기준이 되며, 변경은 변경 관리 절차를 거친다." },
        { en: "constraint", ko: "제약 조건", ex: "Power consumption is our biggest design constraint.", def: "설계가 넘으면 안 되는 한계. 예: 예산, 전력, 무게, 크기, 규제. 요구사항과 달리 협상 여지가 거의 없다." },
        { en: "trade-off", ko: "트레이드오프, 상충 관계", ex: "There's a trade-off between accuracy and speed.", def: "한 성능을 높이면 다른 성능이 떨어지는 관계. 예: 정확도↑ ↔ 속도↓, 강도↑ ↔ 무게↑. 우선순위를 정해 선택한다." },
        { en: "scalability", ko: "확장성", ex: "Scalability will matter once we have more users.", def: "사용량·데이터가 늘어도 자원을 추가해 성능을 유지하는 능력. 서버를 늘리는 수평 확장(scale out)과 서버 성능을 높이는 수직 확장(scale up)이 있다." },
        { en: "prototype", ko: "시제품, 프로토타입", ex: "We'll test the prototype with real users next week.", def: "본격 개발 전에 핵심 가정이 맞는지 빠르게 검증하려고 만든 시제품. 실패해도 비용이 작을 때 실패하는 것이 목적이다." },
        { en: "dependency", ko: "의존성 (다른 부품·시스템에 의존하는 관계)", ex: "This module has a dependency on a third-party library.", def: "다른 모듈·부품·외부 라이브러리가 있어야 동작하는 관계. 의존성이 많을수록 변경·공급 리스크가 커진다." }
      ],
      dialogue: {
        setting: '새 센서 플랫폼의 설계를 수석 아키텍트와 PM 앞에서 발표합니다.',
        you: 'A',
        roles: { A: '나 (담당 엔지니어)', B: 'Dr. Novak (수석 아키텍트)', C: 'Hannah (PM)' },
        lines: [
          { s: 'A', en: "Let me walk you through the system architecture for the new sensor platform.", ko: "새 센서 플랫폼의 시스템 아키텍처를 단계별로 설명드리겠습니다." },
          { s: 'A', en: "This design meets all the functional requirements in the spec.", ko: "이 설계는 사양서의 모든 기능 요구사항을 충족합니다." },
          { s: 'B', en: "Have we considered how this will scale when we add more devices?", ko: "디바이스가 늘어나면 이 구조가 어떻게 확장될지 검토해 봤나요?" },
          { s: 'A', en: "Yes. The main trade-off here is performance versus cost, so we chose a modular design.", ko: "네. 여기서 핵심 트레이드오프는 성능 대 비용이라서 모듈형 설계를 택했습니다." },
          { s: 'B', en: "What about the dependency on the third-party library?", ko: "서드파티 라이브러리 의존성은 어떻게 하죠?" },
          { s: 'A', en: "That's a valid concern. I'd suggest building a prototype before we commit to this approach.", ko: "타당한 우려입니다. 이 방식으로 확정하기 전에 프로토타입을 먼저 만들어 볼 것을 제안합니다." },
          { s: 'C', en: "Agreed. Can we freeze the spec by the end of this week?", ko: "동의해요. 이번 주 말까지 사양을 확정할 수 있을까요?" },
          { s: 'A', en: "Yes, I'll update the design document by Thursday.", ko: "네, 목요일까지 설계 문서를 업데이트하겠습니다." }
        ]
      },
      situations: [
        { q: "'성능과 비용이 서로 상충한다'는 설계 판단을 설명할 때 가장 자연스러운 표현은?", options: ["The main trade-off is performance versus cost.", "Performance and cost are fighting.", "We exchange performance with cost.", "Cost wins performance."], answer: 0, explain: "trade-off는 엔지니어링 회의에서 가장 자주 쓰는 단어 중 하나입니다." },
        { q: "사양을 더 이상 바꾸지 않도록 확정하자고 할 때?", options: ["Can we freeze the spec?", "Can we ice the spec?", "Can we stop the spec moving?", "Can we close the spec door?"], answer: 0, explain: "freeze the spec / lock down the requirements 모두 자주 씁니다." },
        { q: "'확장성'을 뜻하는 단어는?", options: ["scalability", "scaling-ness", "expandity", "growability"], answer: 0, explain: "Will it scale? (확장 가능한가?) 형태로도 자주 묻습니다." }
      ]
    },
    {
      id: 'troubleshooting',
      icon: '🛠️',
      title: '장애 분석 & 근본 원인',
      titleEn: 'Troubleshooting & Root Cause',
      goal: '장애 상황과 원인, 임시 조치와 재발 방지책을 논리적으로 보고할 수 있다.',
      expressions: [
        { en: "We've identified the root cause of the failure.", ko: "고장의 근본 원인을 파악했습니다.", blank: "root", swaps: ["root cause>route cause|roots cause|root case", "identified>identify"] },
        { en: "Were you able to reproduce the issue?", ko: "그 문제를 재현할 수 있었나요?", tip: "reproduce = (버그·결함을) 같은 조건에서 다시 일으키다", blank: "reproduce", swaps: ["Were you able to>Were you able|Was you able to|Did you able to", "reproduce>produce|reduce"] },
        { en: "The defect only occurs under high load.", ko: "이 결함은 고부하 상황에서만 발생합니다.", blank: "defect", swaps: ["occurs>occur|is occurred", "high>low"] },
        { en: "As a temporary workaround, we rolled back to the previous version.", ko: "임시 해결책으로 이전 버전으로 롤백했습니다.", tip: "workaround = 임시방편 / roll back = 이전 상태로 되돌리다", blank: "workaround", swaps: ["rolled back>rolled up|rolled over|rolled out", "previous>next|latest", "temporary>permanent"] },
        { en: "The failure rate dropped from 3% to 0.5% after the fix.", ko: "수정 후 불량률이 3%에서 0.5%로 떨어졌습니다.", blank: "rate", swaps: ["0.5%>5%|0.05%", "3%>30%|0.3%", "after>before"] },
        { en: "We need to put corrective actions in place to prevent this from happening again.", ko: "재발 방지를 위한 시정 조치를 마련해야 합니다.", blank: "corrective", swaps: ["in place>in a place|on place|at place", "prevent this from happening>prevent this to happen|prevent from this happening"] },
        { en: "Let's do a quick post-mortem to see what we can learn.", ko: "무엇을 배울 수 있는지 간단히 사후 분석을 해 봅시다.", tip: "post-mortem = 장애·프로젝트 후 원인과 교훈을 정리하는 회의", blank: "post-mortem", swaps: ["post-mortem>pre-mortem|post-modern|post-motion", "what we can learn>what can we learn"] }
      ],
      terms: [
        { en: "root cause", ko: "근본 원인", ex: "A loose connector was the root cause of the outage.", def: "겉으로 드러난 증상이 아니라, 제거하면 문제가 재발하지 않는 근본 원인. '왜?'를 다섯 번 묻는 5 Whys 기법으로 파고든다." },
        { en: "reproduce", ko: "재현하다", ex: "We couldn't reproduce the bug on the test server.", def: "같은 조건에서 문제를 다시 일으키는 것. 재현이 돼야 원인 확인과 수정 효과 검증이 가능하다." },
        { en: "defect", ko: "결함", ex: "The defect was found during the final inspection.", def: "요구사항이나 사양을 만족하지 못하는 결함. 소프트웨어에서는 bug, 제조에서는 nonconformance(부적합)라고도 한다." },
        { en: "workaround", ko: "임시 해결책", ex: "Restarting the service is only a workaround.", def: "근본 원인은 그대로 두고 증상만 피하는 임시 조치. 반드시 영구 대책(permanent fix) 일정과 함께 관리해야 한다." },
        { en: "roll back", ko: "롤백하다 (이전 버전으로 되돌리다)", ex: "If the update fails, we'll roll back immediately.", def: "문제가 생긴 변경을 취소하고 이전의 안정된 상태로 되돌리는 것. 배포 전에 롤백 방법을 준비해 두는 것이 기본이다." },
        { en: "failure rate", ko: "고장률, 불량률", ex: "The failure rate is within the industry standard.", def: "일정 기간·수량 대비 고장 비율. 신뢰성 지표로 MTBF(평균 고장 간격, Mean Time Between Failures)도 함께 쓴다." },
        { en: "corrective action", ko: "시정 조치", ex: "The supplier submitted a corrective action plan.", def: "원인을 제거해 재발을 막는 조치. 사전 예방 조치(preventive action)와 묶어 CAPA라고 부른다." },
        { en: "post-mortem", ko: "사후 분석, 회고", ex: "The post-mortem showed we needed better monitoring.", def: "장애 후 타임라인·원인·영향·교훈·후속 조치를 정리하는 회고. 사람 탓보다 시스템 개선에 집중하는 blameless 방식이 표준이다." }
      ],
      dialogue: {
        setting: '어젯밤 생산 라인 제어 시스템에 장애가 발생했습니다. 다음 날 아침 원인 분석 회의입니다.',
        you: 'A',
        roles: { A: '나 (엔지니어링 리드)', B: 'Raj (운영 매니저)' },
        lines: [
          { s: 'B', en: "What happened with the control system last night?", ko: "어젯밤 제어 시스템에 무슨 일이 있었나요?" },
          { s: 'A', en: "We've identified the root cause of the failure. A memory leak caused the controller to crash.", ko: "고장의 근본 원인을 파악했습니다. 메모리 누수 때문에 컨트롤러가 다운됐습니다." },
          { s: 'B', en: "Were you able to reproduce the issue?", ko: "그 문제를 재현할 수 있었나요?" },
          { s: 'A', en: "Yes. The defect only occurs under high load, so it didn't show up in our tests.", ko: "네. 이 결함은 고부하 상황에서만 발생해서 테스트에서는 드러나지 않았습니다." },
          { s: 'B', en: "How did you get the line running again?", ko: "라인은 어떻게 다시 가동했죠?" },
          { s: 'A', en: "As a temporary workaround, we rolled back to the previous version.", ko: "임시 해결책으로 이전 버전으로 롤백했습니다." },
          { s: 'B', en: "Okay. How do we make sure this doesn't happen again?", ko: "좋아요. 재발하지 않게 하려면 어떻게 해야 하죠?" },
          { s: 'A', en: "We need to put corrective actions in place, including a load test. Let's do a quick post-mortem on Friday.", ko: "부하 테스트를 포함한 시정 조치를 마련해야 합니다. 금요일에 간단히 사후 분석을 하죠." }
        ]
      },
      situations: [
        { q: "'그 문제를 재현할 수 있었나요?'를 영어로?", options: ["Were you able to reproduce the issue?", "Could you remake the problem?", "Did the issue copy again?", "Can you replay the bug?"], answer: 0, explain: "reproduce는 버그나 결함을 같은 조건에서 다시 일으키는 것을 말합니다." },
        { q: "근본 해결 전에 쓰는 '임시 방편'을 뜻하는 단어는?", options: ["workaround", "workaway", "fix-up", "half-solution"], answer: 0, explain: "근본 해결책은 permanent fix 또는 long-term fix라고 합니다." },
        { q: "장애 후 원인과 교훈을 정리하는 회의를 무엇이라고 하나요?", options: ["post-mortem", "after-party", "death meeting", "back-check"], answer: 0, explain: "요즘은 blameless retrospective(비난 없는 회고)라고도 합니다." }
      ]
    },
    {
      id: 'testing-quality',
      icon: '🧪',
      title: '테스트 & 품질 보고',
      titleEn: 'Testing & Quality',
      goal: '테스트 결과와 품질 지표를 정확한 용어로 보고하고, 출시 여부를 논의할 수 있다.',
      expressions: [
        { en: "All test cases passed except for the stress test.", ko: "스트레스 테스트를 제외한 모든 테스트 케이스가 통과했습니다.", blank: "passed", swaps: ["except for>except of|expect for|accept for", "passed>past|failed"] },
        { en: "The measurement is within the tolerance range.", ko: "측정값이 허용 오차 범위 안에 있습니다.", tip: "tolerance = 허용 오차 / out of tolerance = 허용 오차 초과", blank: "tolerance", swaps: ["within>without|outside|beyond", "tolerance>tolerant"] },
        { en: "We found a regression in the latest build.", ko: "최신 빌드에서 회귀 결함을 발견했습니다.", tip: "regression = 수정 후 예전에 잘 되던 기능이 다시 고장 나는 것", blank: "regression", swaps: ["regression>progression|recession|digression", "latest>previous"] },
        { en: "What are the acceptance criteria for this feature?", ko: "이 기능의 인수 기준은 무엇인가요?", tip: "acceptance criteria = 완료·합격으로 인정하는 기준", blank: "criteria", swaps: ["acceptance criteria>access criteria|acceptance criterion|acceptable criteria", "feature>future"] },
        { en: "The yield improved to 98% this month.", ko: "이번 달 수율이 98%로 개선되었습니다.", tip: "yield = 수율 (전체 생산량 중 양품 비율)", blank: "yield", swaps: ["improved to>improved by|improved at", "98%>89%|9.8%"] },
        { en: "We can't release it until QA signs off.", ko: "QA 승인이 나기 전에는 출시할 수 없습니다.", tip: "sign off (on ~) = (~을) 공식 승인하다", blank: "signs", swaps: ["signs off>signs on|signs up|sign off", "can't>can"] },
        { en: "Let's prioritize the critical bugs before the release.", ko: "출시 전에 치명적인 버그부터 우선 처리합시다.", blank: "prioritize", swaps: ["critical>critic|minor|trivial", "before>after"] }
      ],
      terms: [
        { en: "test case", ko: "테스트 케이스", ex: "We added ten new test cases for the payment module.", def: "입력값, 실행 조건, 기대 결과를 정의한 하나의 테스트 시나리오. 기대 결과가 명확해야 합격·불합격을 판정할 수 있다." },
        { en: "tolerance", ko: "허용 오차", ex: "The part is 0.02 mm out of tolerance.", def: "허용되는 치수·값의 변동 범위. 예: 10 ± 0.05 mm면 9.95~10.05 mm가 합격. 공차가 좁을수록 가공 비용이 올라간다." },
        { en: "regression", ko: "회귀 (결함)", ex: "The regression was caused by last week's update.", def: "새 변경 때문에 기존에 잘 되던 기능이 다시 고장 나는 것. 변경할 때마다 기존 테스트를 다시 돌리는 회귀 테스트로 잡는다." },
        { en: "acceptance criteria", ko: "인수 기준", ex: "Let's agree on the acceptance criteria first.", def: "기능이 '완료'로 인정받기 위해 충족해야 하는 구체적이고 검증 가능한 조건. 개발 시작 전에 합의한다." },
        { en: "yield", ko: "수율", ex: "Low yield is increasing our production cost.", def: "전체 생산량 중 양품의 비율. 수율 95% = 100개 중 95개 양품. 수율이 1%만 올라도 원가에 큰 영향을 준다." },
        { en: "sign off", ko: "(공식) 승인하다", ex: "The client signed off on the final design.", def: "책임자가 결과를 검토하고 공식 승인하는 것. 설계·시험·출시 같은 다음 단계로 넘어가는 관문(gate)이다." },
        { en: "bottleneck", ko: "병목", ex: "The database has become our main bottleneck.", def: "전체 처리 속도를 제한하는 가장 느린 단계. 병목이 아닌 곳을 개선해도 전체 속도는 늘지 않는다(제약 이론)." },
        { en: "throughput", ko: "처리량", ex: "The new line doubled our throughput.", def: "단위 시간당 처리량. 예: 시간당 생산 대수, 초당 처리 요청 수. 지연 시간(latency)과 함께 성능을 나타내는 두 축이다." }
      ],
      dialogue: {
        setting: '출시 2주 전, 테스트 결과를 공유하는 품질 점검 회의입니다.',
        you: 'A',
        roles: { A: '나 (QA 엔지니어)', B: 'Laura (PM)', C: 'Ken (개발 리드)' },
        lines: [
          { s: 'B', en: "Where are we with testing?", ko: "테스트는 어디까지 진행됐나요?" },
          { s: 'A', en: "All test cases passed except for the stress test.", ko: "스트레스 테스트를 제외한 모든 테스트 케이스가 통과했습니다." },
          { s: 'C', en: "What went wrong in the stress test?", ko: "스트레스 테스트는 뭐가 문제였죠?" },
          { s: 'A', en: "Throughput dropped by 40% at peak load. We think the database is the bottleneck.", ko: "최대 부하에서 처리량이 40% 떨어졌습니다. 데이터베이스가 병목인 것 같습니다." },
          { s: 'C', en: "Is that the only issue?", ko: "그게 유일한 문제인가요?" },
          { s: 'A', en: "No, we also found a regression in the latest build. The login feature is broken again.", ko: "아니요, 최신 빌드에서 회귀 결함도 발견했습니다. 로그인 기능이 다시 고장 났어요." },
          { s: 'B', en: "Can we still release on schedule?", ko: "그래도 일정대로 출시할 수 있을까요?" },
          { s: 'A', en: "We can't release it until QA signs off. Let's prioritize the critical bugs before the release.", ko: "QA 승인 전에는 출시할 수 없습니다. 출시 전에 치명적인 버그부터 우선 처리합시다." },
          { s: 'B', en: "Agreed. Ken, can your team fix them by Friday?", ko: "동의해요. 켄, 팀에서 금요일까지 고칠 수 있나요?" }
        ]
      },
      situations: [
        { q: "'측정값이 허용 오차 안에 있다'를 영어로?", options: ["It's within the tolerance range.", "It's inside the allowing mistake.", "It's in the error permission.", "It's under the okay range."], answer: 0, explain: "out of tolerance(허용 오차 초과)도 함께 알아 두세요." },
        { q: "수정 후 예전에 잘 되던 기능이 다시 고장 났을 때 쓰는 말은?", options: ["regression", "regeneration", "recession", "repetition"], answer: 0, explain: "regression test는 이런 결함을 잡기 위한 테스트입니다." },
        { q: "'QA 승인이 나야 출시할 수 있다'를 영어로?", options: ["We can't release it until QA signs off.", "We can't release it until QA signs in.", "We can't release until QA writes name.", "QA must sign up before release."], answer: 0, explain: "sign off on ~ = ~을 최종 승인하다." }
      ]
    },
    {
      id: 'specs-units',
      icon: '📏',
      title: '사양·수치 말하기',
      titleEn: 'Specs, Units & Numbers',
      goal: '공차·정격·단위·유효숫자를 정확한 영어로 읽고, 사양을 수치로 설명할 수 있다.',
      expressions: [
        { en: "The tolerance is plus or minus 0.05 millimeters.", ko: "공차는 ±0.05mm입니다.", tip: "± 는 plus or minus 로 읽습니다. 0.05 는 'zero point zero five'", blank: "minus", swaps: ["0.05>0.5|0.005|5", "millimeters>centimeters|micrometers"] },
        { en: "The motor is rated at 3 kilowatts.", ko: "이 모터의 정격 출력은 3kW입니다.", tip: "be rated at ~ = 정격이 ~이다", blank: "rated", swaps: ["kilowatts>kilowatt-hours|kilovolts|kilojoules", "rated at>rated by|rated in"] },
        { en: "The maximum operating temperature is 85 degrees Celsius.", ko: "최대 동작 온도는 섭씨 85도입니다.", tip: "°C = degrees Celsius, °F = degrees Fahrenheit", blank: "operating", swaps: ["maximum>minimum|average", "85>58|95", "Celsius>Fahrenheit"] },
        { en: "This part weighs about 40% less than the previous design.", ko: "이 부품은 이전 설계보다 약 40% 가볍습니다.", blank: "weighs", swaps: ["less than>more than|less then", "weighs>weights|weight"] },
        { en: "The output is an order of magnitude higher than we expected.", ko: "출력이 예상보다 약 10배 높습니다.", tip: "order of magnitude = 10배 단위의 차이", blank: "magnitude", swaps: ["an order of magnitude>an order of magnitudes|a order of magnitude|two orders of magnitude", "higher>lower"] },
        { en: "Please convert all values to metric units.", ko: "모든 값을 미터법 단위로 변환해 주세요.", tip: "metric(미터법) ↔ imperial(인치·파운드 단위)", blank: "metric", swaps: ["metric>imperial|matrix|metrics"] },
        { en: "The measured value deviates from the nominal value by 2%.", ko: "측정값이 공칭값에서 2% 벗어납니다.", tip: "deviate from ~ = ~에서 벗어나다", blank: "nominal", swaps: ["nominal>normal|minimal|maximum", "deviates from>deviates to"] }
      ],
      terms: [
        { en: "nominal value", ko: "공칭값", def: "도면·사양서에 적힌 설계 기준값. 실제 제품은 공차 범위 안에서 이 값과 조금씩 다르다. 예: 공칭 두께 4 mm, 실측 3.98 mm.", ex: "The nominal thickness is 4 millimeters." },
        { en: "rated power", ko: "정격 출력", def: "장비가 연속으로 안전하게 낼 수 있도록 설계된 출력. 순간 최대 출력(peak power)보다 낮게 잡는다. 정격을 넘겨 쓰면 수명이 짧아진다.", ex: "Never run the pump above its rated power." },
        { en: "operating range", ko: "동작 범위", def: "제조사가 성능을 보장하는 온도·전압·습도 등의 범위. 이 범위를 벗어나면 고장 나지 않더라도 사양 성능을 보장하지 않는다.", ex: "The sensor's operating range is minus 40 to 85 degrees." },
        { en: "order of magnitude", ko: "자릿수 (10배 차이)", def: "값이 10배 단위로 차이 날 때 쓰는 표현. 두 자릿수(two orders of magnitude) 차이는 약 100배. 대략적인 규모를 빠르게 비교할 때 쓴다.", ex: "The new chip is two orders of magnitude faster." },
        { en: "significant figures", ko: "유효숫자", def: "측정 정밀도를 나타내는 의미 있는 자릿수. 3.20은 유효숫자 3개로 0.01 단위까지 측정했다는 뜻이다. 계산 결과는 가장 부정확한 입력값의 정밀도를 넘을 수 없다.", ex: "Report the result to three significant figures." },
        { en: "metric / imperial units", ko: "미터법 / 야드파운드법", def: "1 inch = 25.4 mm, 1 pound ≈ 0.454 kg, 1 psi ≈ 6.9 kPa. 해외 고객과는 도면에 단위를 반드시 함께 적는다. 단위 혼동은 실제 대형 사고의 원인이 되었다.", ex: "Our drawings use metric units, but the client uses imperial." },
        { en: "datasheet", ko: "데이터시트", def: "부품의 정격, 동작 범위, 치수, 특성 그래프를 정리한 제조사 문서. 'typical(대표값)'과 'max/min(보증값)'을 구분해 읽어야 한다.", ex: "According to the datasheet, the typical current is 20 milliamps." },
        { en: "calibration", ko: "교정", def: "측정 장비를 표준 기준값에 맞추고 오차를 확인하는 작업. 교정 주기가 지난 장비로 잰 값은 품질 증빙으로 인정받기 어렵다.", ex: "The gauge is due for calibration next month." }
      ],
      dialogue: {
        setting: '해외 고객사 품질 담당자와 새 부품의 사양을 확인하는 화상회의입니다.',
        you: 'A',
        roles: { A: '나 (설계 엔지니어)', B: 'Mr. Tanaka (고객사 품질 담당)' },
        lines: [
          { s: 'B', en: "Can you confirm the key dimensions of the new bracket?", ko: "새 브래킷의 주요 치수를 확인해 주시겠어요?" },
          { s: 'A', en: "Sure. The nominal thickness is 4 millimeters, and the tolerance is plus or minus 0.05 millimeters.", ko: "네. 공칭 두께는 4mm이고, 공차는 ±0.05mm입니다." },
          { s: 'B', en: "And how about the weight?", ko: "무게는요?" },
          { s: 'A', en: "This part weighs about 40% less than the previous design.", ko: "이 부품은 이전 설계보다 약 40% 가볍습니다." },
          { s: 'B', en: "Impressive. What's the maximum operating temperature?", ko: "인상적이네요. 최대 동작 온도는요?" },
          { s: 'A', en: "The maximum operating temperature is 85 degrees Celsius.", ko: "최대 동작 온도는 섭씨 85도입니다." },
          { s: 'B', en: "Our team works in inches. Could you send the drawing in imperial units as well?", ko: "저희 팀은 인치를 써요. 도면을 인치 단위로도 보내 주실 수 있나요?" },
          { s: 'A', en: "Of course. I'll send both versions, and all measurements come from calibrated equipment.", ko: "물론이죠. 두 버전 모두 보내 드리고, 모든 측정값은 교정된 장비로 잰 것입니다." }
        ]
      },
      situations: [
        { q: "'±0.05mm'를 영어로 읽으면?", options: ["plus or minus 0.05 millimeters", "more or less 0.05 millimeters", "up and down 0.05 millimeters", "around about 0.05 millimeters"], answer: 0, explain: "± 기호는 plus or minus 로 읽습니다." },
        { q: "'예상보다 약 10배 높다'를 엔지니어답게 말하면?", options: ["It's an order of magnitude higher than expected.", "It's a degree higher than expected.", "It's ten levels higher than expected.", "It's one size bigger than expected."], answer: 0, explain: "order of magnitude 는 10배 단위의 차이를 뜻합니다." },
        { q: "도면에 적힌 설계 기준값을 뜻하는 표현은?", options: ["nominal value", "normal value", "name value", "basic number"], answer: 0, explain: "nominal = 명목상의, 공칭의. 실제 측정값(measured value)과 구분합니다." }
      ]
    },
    {
      id: 'risk-safety',
      icon: '⚠️',
      title: '리스크 & 안전',
      titleEn: 'Risk & Safety',
      goal: 'FMEA·안전계수·이중화 같은 개념으로 위험을 평가하고 대책을 논의할 수 있다.',
      expressions: [
        { en: "We ran an FMEA to identify potential failure modes.", ko: "잠재적인 고장 모드를 찾기 위해 FMEA를 수행했습니다.", tip: "FMEA = Failure Mode and Effects Analysis (고장 모드 영향 분석)", blank: "potential", swaps: ["failure modes>failure models|failure modules|failure moods", "an FMEA>a FMEA"] },
        { en: "This risk has a high severity but a low probability.", ko: "이 리스크는 심각도는 높지만 발생 가능성은 낮습니다.", blank: "severity", swaps: ["a high severity>a low severity", "a low probability>a high probability"] },
        { en: "We designed it with a safety factor of two.", ko: "안전계수 2로 설계했습니다.", blank: "factor", swaps: ["safety factor>safe factor|safety fact", "two>three|twelve"] },
        { en: "Our mitigation plan is to add a redundant sensor.", ko: "완화 대책은 이중화 센서를 추가하는 것입니다.", tip: "redundant = 이중화된, 예비의", blank: "mitigation", swaps: ["mitigation>migration|litigation|motivation", "add>remove", "redundant>abundant"] },
        { en: "Is this design compliant with the ISO standard?", ko: "이 설계는 ISO 표준을 준수하나요?", blank: "compliant", swaps: ["compliant>complaint|compliance|complacent"] },
        { en: "That controller is a single point of failure.", ko: "그 컨트롤러는 단일 고장점입니다.", tip: "single point of failure = 그 하나가 고장 나면 전체가 멈추는 지점", blank: "single", swaps: ["single point of failure>single point of failures|single failure of point|single point for failure", "controller>contractor"] },
        { en: "Let's escalate this to the safety committee.", ko: "이 건은 안전위원회로 올립시다.", tip: "escalate = 상위 단계로 보고·이관하다", blank: "escalate", swaps: ["escalate>escape|escalator|accelerate", "committee>commitment"] }
      ],
      terms: [
        { en: "FMEA", ko: "고장 모드 영향 분석", def: "부품·공정별로 '어떻게 고장 나는지(모드), 그러면 무슨 일이 생기는지(영향), 왜 생기는지(원인)'를 표로 정리하는 기법. 심각도×발생도×검출도로 RPN(위험 우선순위)을 계산해 대책 순서를 정한다.", ex: "The FMEA showed that the seal is our biggest risk." },
        { en: "severity", ko: "심각도", def: "고장이 일어났을 때 영향이 얼마나 큰지. 보통 1~10 척도로 평가하며, 사람의 안전에 영향을 주면 최고 등급이다.", ex: "Any failure that could injure an operator has the highest severity." },
        { en: "probability", ko: "발생 가능성", def: "리스크가 실제로 일어날 가능성. 리스크는 흔히 '심각도 × 발생 가능성' 매트릭스로 평가하고, 둘 다 높은 칸부터 대책을 세운다.", ex: "We reduced the probability by changing the supplier." },
        { en: "safety factor", ko: "안전계수", def: "실제로 견딜 수 있는 하중 ÷ 설계(예상) 하중. 안전계수 2 = 예상 하중의 2배까지 견딘다. 사람이 다치는 구조물일수록, 하중을 정확히 모를수록 크게 잡는다.", ex: "Lifting equipment usually needs a safety factor of at least four." },
        { en: "redundancy", ko: "이중화", def: "핵심 부품·경로를 여러 개 두어 하나가 고장 나도 시스템이 계속 동작하게 하는 설계. 항공기 유압·서버 전원 등이 대표적이다.", ex: "We added redundancy to the power supply." },
        { en: "single point of failure", ko: "단일 고장점", def: "이 하나가 고장 나면 전체 시스템이 멈추는 지점(SPOF). 이중화로 제거하거나, 제거할 수 없으면 감시와 예비품으로 대비한다.", ex: "The single database server is a single point of failure." },
        { en: "mitigation", ko: "완화 (대책)", def: "리스크의 발생 가능성이나 영향을 줄이는 조치. 리스크 대응은 회피(avoid)·완화(mitigate)·전가(transfer)·수용(accept) 네 가지로 나뉜다.", ex: "Every high risk needs a mitigation plan and an owner." },
        { en: "compliance", ko: "규정 준수", def: "법규·표준(예: ISO 9001 품질, ISO 26262 자동차 기능안전, IEC 61508, CE 마킹)을 만족하는 것. 시험 성적서와 문서로 증명해야 한다.", ex: "We need a third-party test report to show compliance." }
      ],
      dialogue: {
        setting: '신규 자동화 설비의 위험성 평가 회의입니다.',
        you: 'A',
        roles: { A: '나 (안전 엔지니어)', B: 'Dr. Weber (프로젝트 책임자)', C: 'Sam (설계 엔지니어)' },
        lines: [
          { s: 'B', en: "Where are we with the risk assessment?", ko: "위험성 평가는 어디까지 진행됐나요?" },
          { s: 'A', en: "We ran an FMEA to identify potential failure modes. We found twelve, and one of them is critical.", ko: "잠재적인 고장 모드를 찾기 위해 FMEA를 수행했습니다. 12개를 찾았고, 그중 하나가 치명적입니다." },
          { s: 'C', en: "Which one is it?", ko: "어떤 거죠?" },
          { s: 'A', en: "The emergency stop relies on one controller. That controller is a single point of failure.", ko: "비상 정지가 컨트롤러 하나에 의존합니다. 그 컨트롤러는 단일 고장점입니다." },
          { s: 'B', en: "How serious is it?", ko: "얼마나 심각한가요?" },
          { s: 'A', en: "This risk has a high severity but a low probability. Our mitigation plan is to add a redundant sensor.", ko: "이 리스크는 심각도는 높지만 발생 가능성은 낮습니다. 완화 대책은 이중화 센서를 추가하는 것입니다." },
          { s: 'C', en: "And is the frame strong enough?", ko: "프레임은 충분히 튼튼한가요?" },
          { s: 'A', en: "Yes, we designed it with a safety factor of two.", ko: "네, 안전계수 2로 설계했습니다." },
          { s: 'B', en: "Good. Is this design compliant with the ISO standard?", ko: "좋아요. 이 설계는 ISO 표준을 준수하나요?" },
          { s: 'A', en: "Almost. Before we sign off, let's escalate this to the safety committee.", ko: "거의요. 승인하기 전에 이 건은 안전위원회로 올립시다." }
        ]
      },
      situations: [
        { q: "'안전계수 2로 설계했다'를 영어로?", options: ["We designed it with a safety factor of two.", "We designed it with two safeties.", "Our safety number is double.", "We made it two times safe factor."], answer: 0, explain: "safety factor = 견딜 수 있는 하중 ÷ 예상 하중" },
        { q: "하나만 고장 나도 전체가 멈추는 지점을 뜻하는 표현은?", options: ["single point of failure", "one broken point", "main failure spot", "unique fault place"], answer: 0, explain: "이중화(redundancy)로 제거합니다." },
        { q: "리스크를 줄이는 대책을 뜻하는 단어는?", options: ["mitigation", "migration", "meditation", "motivation"], answer: 0, explain: "철자가 비슷한 migration(이전)과 헷갈리지 마세요." }
      ]
    },
    {
      id: 'performance-data',
      icon: '🖥️',
      title: '성능 & 데이터 분석',
      titleEn: 'Performance & Data Analysis',
      goal: '지연 시간·백분위수·표준편차·상관관계 같은 개념으로 데이터를 해석하고 결론을 말할 수 있다.',
      expressions: [
        { en: "Average latency went up from 120 to 300 milliseconds.", ko: "평균 지연 시간이 120ms에서 300ms로 늘었습니다.", blank: "latency", swaps: ["milliseconds>microseconds|seconds|minutes", "went up>went down"] },
        { en: "The system can handle 5,000 requests per second.", ko: "이 시스템은 초당 5,000건의 요청을 처리할 수 있습니다.", tip: "requests per second (RPS) = 초당 요청 수", blank: "handle", swaps: ["5,000>500|50,000", "second>minute|hour", "can handle>can handles"] },
        { en: "Let's run a benchmark before and after the change.", ko: "변경 전후로 벤치마크를 돌려 봅시다.", blank: "benchmark", swaps: ["benchmark>bookmark|landmark", "before and after>before or after|only after"] },
        { en: "This data point looks like an outlier.", ko: "이 데이터는 이상치로 보입니다.", blank: "outlier", swaps: ["outlier>outline|outlet|outliner", "looks like>looks"] },
        { en: "The difference is statistically significant.", ko: "그 차이는 통계적으로 유의미합니다.", tip: "우연으로 생긴 차이가 아니라고 볼 수 있다는 뜻", blank: "significant", swaps: ["statistically>statistical", "significant>significance|insignificant"] },
        { en: "The standard deviation is large, so the process isn't stable.", ko: "표준편차가 커서 공정이 안정적이지 않습니다.", blank: "deviation", swaps: ["deviation>derivation|division", "large>small", "isn't>is"] },
        { en: "There's a strong correlation, but that doesn't prove causation.", ko: "강한 상관관계가 있지만, 그것이 인과관계를 증명하지는 않습니다.", blank: "correlation", swaps: ["strong correlation>strong causation", "prove causation>prove correlation", "doesn't>does"] }
      ],
      terms: [
        { en: "latency", ko: "지연 시간", def: "요청을 보낸 뒤 응답이 돌아오기까지 걸리는 시간. 낮을수록 좋다. 평균만 보면 일부 사용자의 느린 경험이 가려진다.", ex: "Network latency between the two data centers is 40 milliseconds." },
        { en: "percentile (p99)", ko: "백분위수", def: "p99 지연 시간 300 ms = 전체 요청의 99%가 300 ms 안에 끝났다는 뜻. 평균보다 사용자가 체감하는 '느린 순간'을 잘 보여 줘서 성능 목표(SLO)에 많이 쓴다.", ex: "Our target is a p99 latency under 500 milliseconds." },
        { en: "bandwidth", ko: "대역폭", def: "단위 시간에 전송할 수 있는 최대 데이터 양(예: 1 Gbps). 도로에 비유하면 대역폭은 차선 수, 지연 시간은 이동 시간이다. 대역폭을 늘려도 지연 시간이 줄지는 않는다.", ex: "Video calls need more bandwidth than voice calls." },
        { en: "benchmark", ko: "벤치마크", def: "같은 조건에서 성능을 측정해 비교하는 기준 테스트. 변경 전후를 같은 장비·같은 데이터로 여러 번 측정해야 공정하게 비교할 수 있다.", ex: "The benchmark shows a 15% improvement." },
        { en: "outlier", ko: "이상치", def: "다른 데이터와 크게 동떨어진 값. 측정 오류인지 실제 현상인지 먼저 확인하고, 이유 없이 지우면 안 된다.", ex: "We removed one outlier caused by a sensor error." },
        { en: "standard deviation", ko: "표준편차", def: "데이터가 평균에서 얼마나 흩어져 있는지 나타내는 값(σ). 정규분포에서 약 68%가 ±1σ, 99.7%가 ±3σ 안에 들어온다. 품질 관리의 '6시그마'도 이 개념에서 나왔다.", ex: "The standard deviation dropped after we replaced the tool." },
        { en: "statistical significance", ko: "통계적 유의성", def: "관찰된 차이가 우연히 생겼을 확률(p-value)이 충분히 낮은지(보통 0.05 미만). 표본이 작으면 큰 차이도 유의하지 않을 수 있다.", ex: "With only ten samples, the result isn't statistically significant." },
        { en: "correlation vs. causation", ko: "상관관계 vs 인과관계", def: "두 값이 함께 변하는 것(상관)이 곧 한쪽이 다른 쪽의 원인(인과)이라는 뜻은 아니다. 제3의 요인이 둘 다를 움직였을 수 있으니, 조건을 바꿔 보는 실험으로 확인한다.", ex: "Remember, correlation is not causation." }
      ],
      dialogue: {
        setting: '서비스 업데이트 후 앱이 느려졌다는 불만이 들어왔습니다. 데이터로 원인을 분석하는 회의입니다.',
        you: 'A',
        roles: { A: '나 (성능 엔지니어)', B: 'Olivia (엔지니어링 매니저)' },
        lines: [
          { s: 'B', en: "Customers say the app feels slower since the update. What does the data show?", ko: "업데이트 이후 앱이 느려졌다는 고객 의견이 있어요. 데이터는 어떻게 나왔나요?" },
          { s: 'A', en: "Average latency went up from 120 to 300 milliseconds.", ko: "평균 지연 시간이 120ms에서 300ms로 늘었습니다." },
          { s: 'B', en: "That's a big jump. Could it be just a few bad requests?", ko: "많이 늘었네요. 몇몇 이상한 요청 때문일 수도 있나요?" },
          { s: 'A', en: "We checked. This data point looks like an outlier, but the p99 latency went up as well.", ko: "확인했습니다. 이 데이터는 이상치로 보이지만, p99 지연 시간도 함께 늘었습니다." },
          { s: 'B', en: "The servers are also running hotter. Is that the cause?", ko: "서버 온도도 높아졌던데, 그게 원인인가요?" },
          { s: 'A', en: "There's a strong correlation, but that doesn't prove causation.", ko: "강한 상관관계가 있지만, 그것이 인과관계를 증명하지는 않습니다." },
          { s: 'B', en: "Fair enough. So how do we find out?", ko: "그렇네요. 그럼 어떻게 확인하죠?" },
          { s: 'A', en: "Let's run a benchmark before and after the change, and check if the difference is statistically significant.", ko: "변경 전후로 벤치마크를 돌려 보고, 그 차이가 통계적으로 유의미한지 확인해 봅시다." },
          { s: 'B', en: "Sounds good. And we still need 5,000 requests per second at peak, right?", ko: "좋아요. 그리고 피크 때는 여전히 초당 5,000건이 필요하죠?" },
          { s: 'A', en: "Yes. The system can handle 5,000 requests per second, but only with the old configuration.", ko: "네. 시스템은 초당 5,000건을 처리할 수 있지만, 이전 설정에서만 그렇습니다." }
        ]
      },
      situations: [
        { q: "다른 데이터와 크게 동떨어진 값을 뜻하는 단어는?", options: ["outlier", "outsider", "outline", "overflow"], answer: 0, explain: "측정 오류인지 실제 현상인지 먼저 확인해야 합니다." },
        { q: "'상관관계가 인과관계를 증명하지는 않는다'를 영어로?", options: ["Correlation doesn't prove causation.", "Relation doesn't make a reason.", "Together is not because.", "Connection isn't cause meaning."], answer: 0, explain: "데이터 분석 회의에서 정말 자주 나오는 문장입니다." },
        { q: "'그 차이는 통계적으로 유의미하다'를 영어로?", options: ["The difference is statistically significant.", "The difference is statistic important.", "The difference is numerically meaningful.", "The difference is data significant."], answer: 0, explain: "보통 p-value가 0.05 미만일 때 이렇게 말합니다." }
      ]
    },
    {
      id: 'hvac-load',
      icon: '🌡️',
      title: '부하 계산 & 장비 선정',
      titleEn: 'Load Calculation & Equipment Sizing',
      goal: '냉방 부하와 장비 용량을 현열·잠열, 냉동톤·kW 단위로 설명하고 과대 선정의 문제를 설득할 수 있다.',
      expressions: [
        { en: "The peak cooling load for this floor is about 120 kilowatts.", ko: "이 층의 최대 냉방 부하는 약 120kW입니다.", blank: "load", swaps: ["peak>average|minimum", "cooling>heating", "kilowatts>kilowatt-hours|kilovolts"] },
        { en: "We need to account for both sensible and latent heat.", ko: "현열과 잠열을 모두 고려해야 합니다.", tip: "sensible heat = 현열(온도) / latent heat = 잠열(습기)", blank: "latent", swaps: ["sensible>sensitive", "latent>latest", "account for>account to"] },
        { en: "The unit is rated at 10 tons, which is about 35 kilowatts.", ko: "이 장비는 10톤급으로, 약 35kW입니다.", tip: "1 ton(냉동톤) = 12,000 BTU/h ≈ 3.52 kW", blank: "tons", swaps: ["35>3.5|350|120"] },
        { en: "If we oversize the unit, it will short-cycle and won't dehumidify properly.", ko: "장비를 과대 선정하면 단속 운전(쇼트 사이클)이 생기고 제습이 제대로 안 됩니다.", blank: "oversize", swaps: ["oversize>undersize", "short-cycle>short-circuit", "dehumidify>humidify"] },
        { en: "What outdoor design conditions did you use?", ko: "어떤 외기 설계 조건을 사용하셨나요?", blank: "design", swaps: ["outdoor>indoor", "did you use>did you used|do you used"] },
        { en: "Internal heat gains from people and equipment are higher than we assumed.", ko: "인원과 기기에서 나오는 내부 발열이 가정보다 높습니다.", tip: "heat gain = 실내로 들어오는(발생하는) 열", blank: "gains", swaps: ["Internal heat gains>External heat gains|Internal heat losses", "higher than>lower than|higher then"] },
        { en: "Let's add a 10% safety margin, but no more than that.", ko: "여유율은 10%로 두되, 그 이상은 두지 맙시다.", blank: "margin", swaps: ["10%>1%|100%", "no more than>no less than"] }
      ],
      terms: [
        { en: "cooling load", ko: "냉방 부하", def: "실내를 설계 온·습도로 유지하려고 제거해야 하는 열량. 일사, 외피 전도, 인원, 조명, 기기, 침기, 외기 도입에서 생기며, 시간대별로 계산한 최대값(peak)으로 장비를 고른다.", ex: "The west-facing offices have the highest cooling load in the afternoon." },
        { en: "sensible heat", ko: "현열", def: "온도를 바꾸는 열. 건구온도계로 측정된다. 전체 냉방 부하 중 현열이 차지하는 비율을 SHR(현열비, sensible heat ratio)이라 한다.", ex: "Lighting and computers add mostly sensible heat." },
        { en: "latent heat", ko: "잠열", def: "온도 변화 없이 수분(습도)을 바꾸는 열. 사람의 호흡·땀, 조리, 습한 외기가 원인이다. 회의실처럼 사람이 많은 공간은 잠열 비율이 높아 제습 능력이 중요하다.", ex: "A crowded meeting room has a large latent load." },
        { en: "ton of refrigeration", ko: "냉동톤 (RT)", def: "냉방 능력 단위. 1 ton = 12,000 BTU/h ≈ 3.52 kW. 얼음 1톤(2,000 lb)을 24시간 동안 녹이는 열량에서 유래했다.", ex: "We need about 35 tons of cooling for this floor." },
        { en: "BTU/h", ko: "시간당 BTU (열량 단위)", def: "미국식 열량 단위로 1 kW ≈ 3,412 BTU/h. 미국 장비 카탈로그는 냉방 능력을 대부분 BTU/h나 ton으로 표기하므로 kW로 환산해 비교한다.", ex: "The catalog lists the capacity as 120,000 BTU per hour." },
        { en: "design conditions", ko: "설계 조건", def: "부하 계산의 기준이 되는 실내·외 온습도. 외기는 ASHRAE 기상 데이터의 0.4%·1% 값(1년 중 그 시간 비율만큼만 초과되는 온도)을 주로 쓴다.", ex: "We used the 0.4% cooling design conditions for Seoul." },
        { en: "short cycling", ko: "단속 운전 (쇼트 사이클)", def: "용량이 너무 큰 장비가 금방 설정 온도에 도달해 짧게 켜졌다 꺼지기를 반복하는 현상. 코일이 충분히 차가워지기 전에 멈춰 제습이 안 되고, 효율과 압축기 수명이 떨어진다.", ex: "Short cycling is a classic sign of an oversized unit." },
        { en: "diversity factor", ko: "동시 사용률 (부하 다양성 계수)", def: "모든 공간의 최대 부하가 동시에 생기지 않는다는 점을 반영하는 계수. 동쪽은 오전, 서쪽은 오후에 최대이므로 개별 최대 부하를 단순 합산하면 중앙 장비가 과대 선정된다.", ex: "With a diversity factor of 0.85, the central plant can be smaller." }
      ],
      dialogue: {
        setting: '사무동 신축 프로젝트에서 3층 공조 장비 용량을 정하는 설계 협의입니다.',
        you: 'A',
        roles: { A: '나 (HVAC 설계 엔지니어)', B: 'Mark (프로젝트 매니저)', C: 'Lisa (건축주 담당)' },
        lines: [
          { s: 'B', en: "What size of rooftop units are we looking at for the third floor?", ko: "3층 옥상형 공조기(RTU)는 어느 용량으로 보고 있나요?" },
          { s: 'A', en: "The peak cooling load for this floor is about 120 kilowatts, so we're looking at three 12.5-ton units.", ko: "이 층의 최대 냉방 부하가 약 120kW라서 12.5톤급 3대를 검토하고 있습니다." },
          { s: 'B', en: "Can't we just go bigger to be safe?", ko: "안전하게 그냥 더 큰 걸로 가면 안 되나요?" },
          { s: 'A', en: "If we oversize the unit, it will short-cycle and won't dehumidify properly.", ko: "장비를 과대 선정하면 단속 운전이 생기고 제습이 제대로 안 됩니다." },
          { s: 'C', en: "In our current building, the meeting rooms get really stuffy in summer.", ko: "지금 건물은 여름에 회의실이 정말 답답해요." },
          { s: 'A', en: "That's usually a latent load issue. We need to account for both sensible and latent heat.", ko: "보통 잠열 부하 문제입니다. 현열과 잠열을 모두 고려해야 합니다." },
          { s: 'B', en: "How did you calculate the load?", ko: "부하는 어떻게 계산하셨어요?" },
          { s: 'A', en: "We used the 0.4% outdoor design conditions for Seoul, plus internal heat gains from people, lighting, and equipment.", ko: "서울의 0.4% 외기 설계 조건에 인원·조명·기기의 내부 발열을 더했습니다." },
          { s: 'B', en: "Do we need a safety margin on top of that?", ko: "거기에 여유율도 둬야 하나요?" },
          { s: 'A', en: "Let's add a 10% safety margin, but no more than that.", ko: "여유율은 10%로 두되, 그 이상은 두지 맙시다." }
        ]
      },
      situations: [
        { q: "1 냉동톤(ton)을 kW로 바르게 말한 것은?", options: ["One ton is about 3.5 kilowatts.", "One ton is about 12 kilowatts.", "One ton is about 1,000 kilowatts.", "One ton is about 35 kilowatts."], answer: 0, explain: "1 ton = 12,000 BTU/h ≈ 3.52 kW 입니다." },
        { q: "온도 변화 없이 습도(수분)를 바꾸는 열을 뜻하는 단어는?", options: ["latent heat", "sensible heat", "hidden temperature", "wet heat"], answer: 0, explain: "온도를 바꾸는 열은 sensible heat(현열)입니다." },
        { q: "장비를 과대 선정했을 때의 문제를 정확히 설명한 문장은?", options: ["An oversized unit will short-cycle and dehumidify poorly.", "An oversized unit always saves energy.", "An oversized unit cools the room too slowly.", "An oversized unit never turns off."], answer: 0, explain: "짧게 켜졌다 꺼지기를 반복해 제습이 안 되고 효율·수명이 떨어집니다." }
      ]
    },
    {
      id: 'hvac-airflow',
      icon: '🌀',
      title: '풍량 & 덕트 설계',
      titleEn: 'Airflow & Duct Design',
      goal: '풍량·정압·압력 손실·환기 횟수를 영어로 설명하고 현장 간섭(clash)과 덕트 변경을 협의할 수 있다.',
      expressions: [
        { en: "The design airflow for this zone is 2,000 CFM.", ko: "이 존의 설계 풍량은 2,000 CFM입니다.", tip: "CFM = cubic feet per minute. 1 CFM ≈ 1.7 m³/h(CMH)", blank: "airflow", swaps: ["2,000>200|20,000", "CFM>CMH|FPM"] },
        { en: "The external static pressure is higher than the fan can handle.", ko: "외부 정압이 팬이 감당할 수 있는 수준보다 높습니다.", blank: "static", swaps: ["external>internal", "static>dynamic|statistic", "higher>lower"] },
        { en: "We need to upsize this duct to reduce the pressure drop.", ko: "압력 손실을 줄이려면 이 덕트 사이즈를 키워야 합니다.", blank: "upsize", swaps: ["upsize>downsize", "reduce>increase"] },
        { en: "The lab needs at least 10 air changes per hour.", ko: "실험실은 시간당 최소 10회의 환기가 필요합니다.", tip: "ACH = air changes per hour (환기 횟수)", blank: "changes", swaps: ["at least>at most|at last", "hour>minute|day"] },
        { en: "Each VAV box will control the airflow to its zone.", ko: "각 VAV 박스가 해당 존의 풍량을 제어합니다.", blank: "control", swaps: ["Each VAV box>Each VAV boxes|Each CAV box", "its zone>it's zone|it zone"] },
        { en: "Can we reroute the duct to avoid the beam?", ko: "보를 피하도록 덕트 경로를 바꿀 수 있을까요?", tip: "덕트가 구조물·배관과 부딪치는 것을 clash(간섭)라고 합니다", blank: "reroute", swaps: ["reroute>reboot|rebuild|remove", "avoid>void"] },
        { en: "The supply diffusers are causing drafts near the windows.", ko: "급기 디퓨저 때문에 창가에 드래프트(찬 기류)가 생깁니다.", blank: "drafts", swaps: ["supply>return|exhaust", "drafts>drifts|drafting"] }
      ],
      terms: [
        { en: "CFM / CMH", ko: "풍량 단위", def: "CFM = 분당 입방피트, CMH = 시간당 입방미터(m³/h). 1 CFM ≈ 1.7 CMH. 한국 도면은 CMH, 미국 장비 자료는 CFM을 쓰므로 환산해서 비교한다.", ex: "Please convert the airflow from CFM to cubic meters per hour." },
        { en: "static pressure", ko: "정압", def: "덕트 벽면을 미는 압력으로, 공기 흐름에 대한 저항을 나타낸다. 단위는 Pa 또는 in. w.c.(인치 수주, 1 in. w.c. ≈ 249 Pa).", ex: "The duct static pressure setpoint is 250 pascals." },
        { en: "external static pressure (ESP)", ko: "외부 정압", def: "공조기 밖의 덕트·필터·댐퍼·디퓨저에서 생기는 총 저항. 팬 선정의 기준이며, 과소 산정하면 현장에서 풍량이 부족해진다.", ex: "The fan was selected for an ESP of 1.5 inches of water." },
        { en: "pressure drop", ko: "압력 손실", def: "공기가 덕트·엘보·댐퍼·필터를 지나며 잃는 압력. 풍속의 제곱에 비례해 커지므로, 덕트를 키워 풍속을 낮추면 크게 줄어든다.", ex: "Each extra elbow adds pressure drop." },
        { en: "air changes per hour (ACH)", ko: "환기 횟수", def: "시간당 실 체적만큼의 공기가 몇 번 교체되는지 나타내는 값. ACH = 시간당 풍량 ÷ 실 체적. 실험실·병원처럼 오염 제어가 중요한 곳은 기준이 높다.", ex: "Operating rooms typically require at least 20 air changes per hour." },
        { en: "VAV (variable air volume)", ko: "변풍량 방식", def: "존별 부하에 따라 VAV 박스 댐퍼로 풍량을 조절하는 방식. 일정 풍량(CAV) 방식보다 팬 에너지가 적게 들어 사무용 건물에 널리 쓰인다.", ex: "The VAV boxes reduce airflow when the rooms are empty." },
        { en: "fan curve", ko: "팬 곡선", def: "팬이 낼 수 있는 풍량과 정압의 관계를 나타낸 그래프. 덕트 시스템의 저항 곡선과 만나는 점이 실제 운전점(operating point)이다.", ex: "Let's plot the system curve on the fan curve." },
        { en: "diffuser", ko: "디퓨저 (취출구)", def: "실내로 공기를 고르게 퍼뜨리는 급기구. 배치·풍속·도달 거리(throw)가 맞지 않으면 드래프트와 소음이 생긴다.", ex: "Linear slot diffusers work well along the windows." }
      ],
      dialogue: {
        setting: '시공 단계에서 기계 시공사 현장 소장과 덕트 간섭 문제를 협의하는 현장 회의입니다.',
        you: 'A',
        roles: { A: '나 (HVAC 엔지니어)', B: 'Daniel (기계 시공사 현장 소장)' },
        lines: [
          { s: 'B', en: "We have a clash on level two. The main duct runs into a concrete beam.", ko: "2층에 간섭이 있어요. 메인 덕트가 콘크리트 보에 부딪힙니다." },
          { s: 'A', en: "Can we reroute the duct to avoid the beam?", ko: "보를 피하도록 덕트 경로를 바꿀 수 있을까요?" },
          { s: 'B', en: "We can, but it adds four elbows.", ko: "가능하지만 엘보가 4개 늘어나요." },
          { s: 'A', en: "Then the external static pressure will be higher than the fan can handle.", ko: "그러면 외부 정압이 팬이 감당할 수 있는 수준보다 높아집니다." },
          { s: 'B', en: "So what do you suggest?", ko: "그럼 어떻게 하자는 거죠?" },
          { s: 'A', en: "We need to upsize this duct to reduce the pressure drop. I'll send the revised duct sizes tomorrow.", ko: "압력 손실을 줄이려면 이 덕트 사이즈를 키워야 합니다. 수정한 덕트 사이즈를 내일 보내 드릴게요." },
          { s: 'B', en: "Okay. And how much air does the lab on level three need?", ko: "알겠어요. 그리고 3층 실험실은 공기가 얼마나 필요하죠?" },
          { s: 'A', en: "The lab needs at least 10 air changes per hour. The design airflow for that zone is 2,000 CFM.", ko: "실험실은 시간당 최소 10회 환기가 필요합니다. 그 존의 설계 풍량은 2,000 CFM입니다." },
          { s: 'B', en: "Got it. Each zone gets its own VAV box, right?", ko: "알겠습니다. 존마다 VAV 박스가 따로 있는 거죠?" },
          { s: 'A', en: "Yes. Each VAV box will control the airflow to its zone.", ko: "네. 각 VAV 박스가 해당 존의 풍량을 제어합니다." }
        ]
      },
      situations: [
        { q: "덕트 시스템 전체의 저항으로, 팬 선정의 기준이 되는 값은?", options: ["external static pressure", "outside pressure", "static air", "duct strength"], answer: 0, explain: "ESP를 과소 산정하면 현장에서 풍량이 부족해집니다." },
        { q: "1 CFM을 시간당 입방미터로 바르게 말한 것은?", options: ["about 1.7 cubic meters per hour", "about 17 cubic meters per hour", "about 0.17 cubic meters per hour", "about 60 cubic meters per hour"], answer: 0, explain: "1 ft³ ≈ 0.0283 m³ 이고 × 60분 ≈ 1.7 m³/h 입니다." },
        { q: "덕트가 구조물과 부딪칠 때 경로 변경을 제안하는 표현은?", options: ["Can we reroute the duct?", "Can we rebreak the duct?", "Can we move out the beam?", "Can we redirect the beam?"], answer: 0, explain: "구조물(beam)은 보통 옮길 수 없으니 덕트 경로를 바꿉니다." }
      ]
    },
    {
      id: 'hvac-refrigeration',
      icon: '❄️',
      title: '냉동 사이클 & 장비',
      titleEn: 'Refrigeration Cycle & Equipment',
      goal: '냉동 사이클과 칠러·압축기 문제를 과열도·과냉각도·COP·GWP 같은 개념으로 진단하고 설명할 수 있다.',
      expressions: [
        { en: "The chiller is running at only 40% load most of the time.", ko: "칠러가 대부분의 시간 동안 40% 부하로만 운전됩니다.", blank: "chiller", swaps: ["40%>4%|14%|80%", "most of the time>most of time|the most of time"] },
        { en: "The compressor keeps tripping on high head pressure.", ko: "압축기가 고압(응축 압력) 이상으로 계속 트립됩니다.", tip: "trip = 보호 장치가 작동해 정지하다 / head pressure = 응축(고압) 측 압력", blank: "tripping", swaps: ["high head>low head|high suction|high heat", "keeps tripping>keeps to trip|keep tripping"] },
        { en: "Can you check the superheat and subcooling?", ko: "과열도와 과냉각도를 확인해 주시겠어요?", blank: "superheat", swaps: ["superheat>overheat|superheating", "subcooling>overcooling|subheating"] },
        { en: "The condenser coil is dirty, so heat rejection is poor.", ko: "응축기 코일이 오염돼서 방열이 잘 안 됩니다.", tip: "heat rejection = 응축기에서 열을 외부로 버리는 것", blank: "rejection", swaps: ["condenser>evaporator|condensation", "rejection>reflection|injection", "poor>good"] },
        { en: "This unit has a COP of 4.5 at full load.", ko: "이 장비는 정격 부하에서 COP가 4.5입니다.", blank: "COP", swaps: ["4.5>45|0.45|5.4", "full load>part load|no load"] },
        { en: "We're switching to a low-GWP refrigerant like R-32.", ko: "R-32 같은 저GWP 냉매로 전환하고 있습니다.", tip: "GWP = global warming potential (지구온난화지수)", blank: "refrigerant", swaps: ["low-GWP>high-GWP|low-GDP", "refrigerant>refrigerator", "R-32>R-22|R-410A"] },
        { en: "The cooling tower approach is 4 degrees, which is normal.", ko: "냉각탑 어프로치가 4도로 정상입니다.", tip: "approach = 냉각탑 출구 수온 − 외기 습구온도. 작을수록 성능이 좋다", blank: "approach", swaps: ["approach>range|approval", "4 degrees>40 degrees|0.4 degrees"] }
      ],
      terms: [
        { en: "refrigeration cycle", ko: "냉동 사이클", def: "압축 → 응축 → 팽창 → 증발을 반복하며 열을 옮기는 사이클. 증발기에서 실내(또는 냉수)의 열을 흡수하고, 응축기에서 그 열과 압축 일을 바깥으로 버린다.", ex: "Let's walk through the refrigeration cycle step by step." },
        { en: "compressor", ko: "압축기", def: "저압 냉매 가스를 고온·고압으로 압축하는 장비로 사이클 전력의 대부분을 쓴다. 용량에 따라 스크롤·스크류·원심식(터보)을 쓴다.", ex: "The centrifugal compressor is the heart of this chiller." },
        { en: "condenser / evaporator", ko: "응축기 / 증발기", def: "응축기는 냉매의 열을 외부로 버리며(heat rejection) 가스를 액체로 만드는 열교환기, 증발기는 냉매가 증발하며 공기·물에서 열을 흡수하는 열교환기다.", ex: "Frost on the evaporator coil usually means low airflow." },
        { en: "superheat", ko: "과열도", def: "증발기 출구 냉매 가스 온도가 포화(증발) 온도보다 얼마나 높은지. 너무 낮으면 액체가 압축기로 들어가는 액백 위험, 너무 높으면 냉매 부족을 의심한다.", ex: "The superheat is 15 degrees, so the system may be undercharged." },
        { en: "subcooling", ko: "과냉각도", def: "응축기 출구 액냉매 온도가 포화(응축) 온도보다 얼마나 낮은지. 팽창밸브 방식(TXV) 장비의 냉매 충전량을 진단하는 핵심 지표다.", ex: "High subcooling can mean the system is overcharged." },
        { en: "COP / EER", ko: "성적계수 / 에너지효율비", def: "COP = 냉방(또는 난방) 능력 ÷ 소비 전력(같은 단위). EER = BTU/h ÷ W ≈ COP × 3.412. 높을수록 효율적이며, 칠러는 kW/ton(낮을수록 좋음)으로도 표시한다.", ex: "A COP of 5 means five kilowatts of cooling for every kilowatt of power." },
        { en: "part-load efficiency (IPLV)", ko: "부분 부하 효율", def: "장비는 1년의 대부분을 부분 부하로 운전하므로, 정격 효율보다 IPLV·IEER 같은 부분 부하 지표가 실제 에너지 사용량을 더 잘 보여 준다.", ex: "Compare the chillers by IPLV, not just full-load efficiency." },
        { en: "GWP (global warming potential)", ko: "지구온난화지수", def: "냉매가 같은 양의 CO2 대비 온난화에 얼마나 영향을 주는지 나타내는 값. R-410A(약 2,088)에서 R-32(약 675)·R-454B 같은 저GWP 냉매로 전환 중이다(키갈리 개정의정서).", ex: "The new units use a refrigerant with a much lower GWP." }
      ],
      dialogue: {
        setting: '한여름 칠러 정지와 에너지 비용 문제로 설비 관리자와 점검 회의를 합니다.',
        you: 'A',
        roles: { A: '나 (HVAC 엔지니어)', B: 'Tom (설비 관리자)' },
        lines: [
          { s: 'B', en: "Chiller number two shut down again yesterday afternoon.", ko: "어제 오후에 2번 칠러가 또 멈췄어요." },
          { s: 'A', en: "I checked the log. The compressor keeps tripping on high head pressure.", ko: "로그를 확인했습니다. 압축기가 고압 이상으로 계속 트립되고 있습니다." },
          { s: 'B', en: "What could cause that?", ko: "원인이 뭘까요?" },
          { s: 'A', en: "The condenser coil is dirty, so heat rejection is poor. We should clean it this week.", ko: "응축기 코일이 오염돼서 방열이 잘 안 됩니다. 이번 주에 청소해야 합니다." },
          { s: 'B', en: "Should we also check the refrigerant charge?", ko: "냉매 충전량도 확인해야 할까요?" },
          { s: 'A', en: "Yes. After the cleaning, can you check the superheat and subcooling?", ko: "네. 청소한 뒤에 과열도와 과냉각도를 확인해 주시겠어요?" },
          { s: 'B', en: "Sure. Our energy bills are also very high this summer.", ko: "그럴게요. 올여름 전기 요금도 엄청 많이 나왔어요." },
          { s: 'A', en: "The chiller is running at only 40% load most of the time, so part-load efficiency matters more than the full-load rating.", ko: "칠러가 대부분 40% 부하로만 운전돼서, 정격 효율보다 부분 부하 효율이 더 중요합니다." },
          { s: 'B', en: "Should we just replace it, then?", ko: "그럼 그냥 교체해야 할까요?" },
          { s: 'A', en: "Let's compare options first. The new model has better part-load efficiency, and we're switching to a low-GWP refrigerant like R-32.", ko: "먼저 대안을 비교해 봅시다. 신형 모델은 부분 부하 효율이 더 좋고, R-32 같은 저GWP 냉매로 전환하고 있습니다." }
        ]
      },
      situations: [
        { q: "냉매 충전 상태를 진단할 때 확인하는 두 값은?", options: ["superheat and subcooling", "overheat and undercool", "hot point and cold point", "high heat and low heat"], answer: 0, explain: "증발기 출구 과열도와 응축기 출구 과냉각도를 함께 봅니다." },
        { q: "COP 4.5의 의미를 바르게 설명한 영어 문장은?", options: ["It delivers 4.5 kW of cooling per 1 kW of power.", "It uses 4.5 kW of power per 1 kW of cooling.", "It cools the room by 4.5 degrees per hour.", "It runs 4.5 hours per day."], answer: 0, explain: "COP = 냉방 능력 ÷ 소비 전력. 클수록 효율적입니다." },
        { q: "'보호 장치가 작동해 압축기가 멈췄다'를 영어로?", options: ["The compressor tripped.", "The compressor fell.", "The compressor slipped.", "The compressor dropped out."], answer: 0, explain: "trip on high pressure = 고압으로 트립되다" }
      ]
    },
    {
      id: 'hvac-commissioning',
      icon: '🧰',
      title: '시운전 & TAB',
      titleEn: 'Commissioning & TAB',
      goal: '시운전·TAB 결과를 설계값 대비 수치로 보고하고, 잔여 하자와 일정을 건축주와 협의할 수 있다.',
      expressions: [
        { en: "We're in the middle of testing, adjusting, and balancing.", ko: "지금 TAB(시험·조정·균형) 작업을 진행하고 있습니다.", blank: "balancing", swaps: ["balancing>bouncing|bargaining", "in the middle of>in the middle|at middle of"] },
        { en: "The measured airflow is within 10% of the design value.", ko: "측정 풍량이 설계값의 ±10% 이내입니다.", blank: "measured", swaps: ["within>without|outside", "10%>1%|50%"] },
        { en: "This room is short of air by about 15%.", ko: "이 실은 풍량이 약 15% 부족합니다.", tip: "be short of ~ = ~이 부족하다", blank: "short", swaps: ["short of>short for|shortage of|shorter", "15%>50%|5%"] },
        { en: "We'll add this item to the punch list.", ko: "이 항목을 펀치 리스트(잔여 하자 목록)에 추가하겠습니다.", blank: "punch", swaps: ["punch list>lunch list|bunch list|punch line", "add>remove"] },
        { en: "Has the functional performance test been completed?", ko: "기능 성능 시험은 완료됐나요?", blank: "functional", swaps: ["Has the>Have the|Is the", "been completed>been completing|be completed"] },
        { en: "The damper was stuck closed, so we've adjusted it.", ko: "댐퍼가 닫힌 채로 고착돼 있어서 조정했습니다.", blank: "damper", swaps: ["stuck closed>stuck open|stuck close|stock closed", "damper>dumper"] },
        { en: "Can we schedule a walkthrough with the owner next week?", ko: "다음 주에 건축주와 현장 점검 일정을 잡을 수 있을까요?", tip: "walkthrough = 현장을 함께 돌며 점검하는 것", blank: "walkthrough", swaps: ["walkthrough>walkout|breakthrough|workout", "next week>last week"] }
      ],
      terms: [
        { en: "commissioning (Cx)", ko: "커미셔닝", def: "설계부터 운영까지 시스템이 건축주 요구사항(OPR, owner's project requirements)대로 설치·작동하는지 검증하는 품질 관리 과정. 장비를 처음 돌려 보는 시운전(start-up)보다 넓은 개념이다.", ex: "The commissioning agent will review the test reports." },
        { en: "TAB (testing, adjusting, and balancing)", ko: "시험·조정·균형", def: "풍량·수량을 측정하고 댐퍼·밸브를 조정해 각 실과 장비가 설계값을 받도록 맞추는 작업. 보통 설계값의 ±10% 이내를 합격 기준으로 한다.", ex: "The TAB report shows three zones below design airflow." },
        { en: "design intent", ko: "설계 의도", def: "시스템이 무엇을 위해 어떻게 동작하도록 설계됐는지에 대한 설명. 현장에서 변경이 생기면 설계 의도를 해치지 않는지가 판단 기준이 된다.", ex: "This change doesn't meet the design intent for the lab." },
        { en: "punch list", ko: "펀치 리스트", def: "준공 전에 남은 미시공·하자 항목 목록. 항목마다 담당자와 기한을 정해 모두 해결(close out)해야 건축주가 인수한다.", ex: "We have twelve items left on the punch list." },
        { en: "functional performance test (FPT)", ko: "기능 성능 시험", def: "장비와 자동제어가 실제 운전 모드(정상·야간·화재·정전 복구 등)에서 제어 시퀀스대로 동작하는지 확인하는 시험.", ex: "The functional performance test for the AHU passed." },
        { en: "damper", ko: "댐퍼", def: "덕트 안에서 풍량을 조절하거나 차단하는 판. 풍량 조절용 밸런싱 댐퍼, 화재 시 닫히는 방화 댐퍼(fire damper), 모터로 움직이는 전동 댐퍼 등이 있다.", ex: "Check that the fire damper is accessible for inspection." },
        { en: "setpoint", ko: "설정값", def: "자동제어가 유지하려는 목표값. 예: 실온 24 °C, 급기 온도 13 °C, 덕트 정압 250 Pa. 측정값과 설정값의 차이를 보고 제어가 동작한다.", ex: "The room setpoint is 24 degrees Celsius." },
        { en: "as-built drawings", ko: "준공 도면", def: "실제로 시공된 상태를 반영한 최종 도면. 설계 도면과 다른 현장 변경을 모두 반영해야 하며, 유지보수와 향후 개보수의 기준이 된다.", ex: "Please update the as-built drawings with the new duct route." }
      ],
      dialogue: {
        setting: '준공 2주 전, 건축주 대리인과 공조 시운전 결과를 점검하는 회의입니다.',
        you: 'A',
        roles: { A: '나 (TAB 엔지니어)', B: 'Ms. Park (건축주 대리인)', C: 'Ken (시공사)' },
        lines: [
          { s: 'B', en: "How is the commissioning going?", ko: "커미셔닝은 어떻게 진행되고 있나요?" },
          { s: 'A', en: "We're in the middle of testing, adjusting, and balancing. Most zones are fine.", ko: "지금 TAB 작업을 진행하고 있습니다. 대부분의 존은 문제없습니다." },
          { s: 'B', en: "What exactly do you mean by fine?", ko: "문제없다는 게 정확히 무슨 뜻이죠?" },
          { s: 'A', en: "The measured airflow is within 10% of the design value.", ko: "측정 풍량이 설계값의 ±10% 이내라는 뜻입니다." },
          { s: 'B', en: "And the zones that aren't?", ko: "그렇지 않은 존은요?" },
          { s: 'A', en: "Meeting room 302 is short of air by about 15%. The damper was stuck closed, so we've adjusted it.", ko: "302호 회의실이 풍량이 약 15% 부족합니다. 댐퍼가 닫힌 채로 고착돼 있어서 조정했습니다." },
          { s: 'C', en: "Do we need to retest it?", ko: "재측정해야 하나요?" },
          { s: 'A', en: "Yes. We'll add this item to the punch list until the retest confirms it.", ko: "네. 재측정으로 확인될 때까지 이 항목을 펀치 리스트에 올려 두겠습니다." },
          { s: 'B', en: "Has the functional performance test been completed?", ko: "기능 성능 시험은 완료됐나요?" },
          { s: 'A', en: "Not yet, it's scheduled for Thursday. Can we schedule a walkthrough with the owner next week?", ko: "아직이요, 목요일에 예정돼 있습니다. 다음 주에 건축주와 현장 점검 일정을 잡을 수 있을까요?" }
        ]
      },
      situations: [
        { q: "준공 전에 남은 하자·미시공 항목 목록을 뭐라고 하나요?", options: ["punch list", "punching paper", "defect bag", "finish sheet"], answer: 0, explain: "항목을 모두 해결하는 것을 close out 이라고 합니다." },
        { q: "'이 실은 풍량이 15% 부족하다'를 영어로?", options: ["This room is short of air by 15%.", "This room is lack air 15%.", "This room is less air of 15%.", "This room is minus air 15 percent."], answer: 0, explain: "be short of ~ by 수치 = ~만큼 부족하다" },
        { q: "TAB 의 T, A, B 는?", options: ["testing, adjusting, and balancing", "test, approve, and build", "temperature, air, and balance", "tune, adjust, and blow"], answer: 0, explain: "측정(testing)·조정(adjusting)·균형 맞추기(balancing)입니다." }
      ]
    },
    {
      id: 'hvac-controls',
      icon: '🎛️',
      title: '에너지 절감 & 자동제어',
      titleEn: 'Energy Savings & Controls',
      goal: 'BMS 트렌드 데이터로 문제를 찾고 VFD·이코노마이저·DCV 같은 절감 방안을 근거와 함께 제안할 수 있다.',
      expressions: [
        { en: "Let's check the trend data in the BMS.", ko: "BMS의 트렌드 데이터를 확인해 봅시다.", tip: "BMS = building management system (건물 자동제어 시스템)", blank: "trend", swaps: ["trend>trendy|trained", "data>date"] },
        { en: "Adding a VFD to the supply fan will save a lot of energy.", ko: "급기팬에 VFD(인버터)를 달면 에너지를 많이 절약할 수 있습니다.", blank: "save", swaps: ["save>safe|waste", "supply>exhaust|return", "a lot of>a lots of"] },
        { en: "The economizer lets us use outdoor air for free cooling.", ko: "이코노마이저로 외기를 이용한 프리쿨링을 할 수 있습니다.", blank: "economizer", swaps: ["lets us use>lets us to use|lets us using|lets us used", "outdoor>indoor|return"] },
        { en: "We can reset the supply air temperature setpoint based on demand.", ko: "부하에 따라 급기 온도 설정값을 리셋할 수 있습니다.", blank: "setpoint", swaps: ["based on>based in|base on|based with", "supply>return"] },
        { en: "Demand-controlled ventilation adjusts outdoor air based on CO2 levels.", ko: "수요 제어 환기는 CO2 농도에 따라 외기량을 조절합니다.", blank: "ventilation", swaps: ["CO2>CO|O2|NO2", "adjusts outdoor>adjust outdoor|adjusts indoor"] },
        { en: "Can you send me the sequence of operations?", ko: "제어 시퀀스 문서를 보내 주시겠어요?", blank: "sequence", swaps: ["sequence>frequency|consequence", "operations>operators|options"] },
        { en: "The heating and cooling valves are fighting each other.", ko: "난방 밸브와 냉방 밸브가 동시에 열려 서로 싸우고 있습니다.", tip: "동시 냉난방(simultaneous heating and cooling)은 대표적인 에너지 낭비입니다", blank: "fighting", swaps: ["fighting each other>fighting to each other|fighting each others|fitting each other", "valves>values"] }
      ],
      terms: [
        { en: "BMS / BAS", ko: "건물 자동제어 시스템", def: "공조·조명·설비를 감시하고 제어하는 시스템(building management/automation system). 트렌드(trend) 기록으로 운전 이상을 찾는 것이 에너지 진단의 출발점이다.", ex: "The BMS shows the fan running all night." },
        { en: "VFD (variable frequency drive)", ko: "인버터 (가변속 드라이브)", def: "모터 회전수를 바꿔 풍량·유량을 조절하는 장치. 팬·펌프 상사 법칙상 동력은 회전수의 세제곱에 비례해, 속도를 20% 줄이면 동력이 약 절반(0.8³ ≈ 0.51)으로 줄어든다.", ex: "With a VFD, the pump runs at 70% speed most of the day." },
        { en: "economizer", ko: "이코노마이저", def: "외기가 실내보다 시원하고 건조할 때 외기를 많이 들여 기계 냉방 없이 냉방(free cooling)하는 제어. 댐퍼·센서 고장이 잦아 주기적인 점검이 필요하다.", ex: "The economizer damper was stuck at minimum position." },
        { en: "setpoint reset", ko: "설정값 리셋", def: "부하에 따라 급기 온도·덕트 정압·냉수 온도 등의 설정값을 자동으로 조정하는 전략. 고정 설정값보다 팬과 냉동기 에너지를 줄인다.", ex: "Static pressure reset cut our fan energy by 30%." },
        { en: "demand-controlled ventilation (DCV)", ko: "수요 제어 환기", def: "CO2 센서나 재실 인원에 따라 외기 도입량을 조절하는 방식. 사람이 없을 때 외기를 덜 들여 외기를 냉난방하는 에너지를 줄인다.", ex: "DCV is ideal for meeting rooms and auditoriums." },
        { en: "energy recovery ventilator (ERV)", ko: "전열교환기", def: "배기와 급기 사이에서 열과 습기를 교환해 외기 부하를 줄이는 환기 장치. 열(현열)만 교환하면 HRV(heat recovery ventilator)라고 한다.", ex: "The ERV preheats the incoming air in winter." },
        { en: "sequence of operations", ko: "제어 시퀀스", def: "장비가 언제, 어떤 조건에서, 어떻게 동작해야 하는지 적은 제어 논리 문서. 시운전·기능 시험·고장 진단의 기준이 된다.", ex: "The sequence of operations doesn't mention night setback." },
        { en: "simultaneous heating and cooling", ko: "동시 냉난방", def: "같은 공기를 냉각한 뒤 다시 가열하는 등 냉·난방이 서로 상쇄되는 운전. 제어 설정 오류나 밸브 누설로 흔히 생기는 큰 에너지 낭비다.", ex: "Our analysis found simultaneous heating and cooling in six zones." }
      ],
      dialogue: {
        setting: '사옥의 에너지 비용을 줄이기 위한 공조 제어 개선 회의입니다.',
        you: 'A',
        roles: { A: '나 (에너지·제어 엔지니어)', B: 'Rachel (시설 총괄)' },
        lines: [
          { s: 'B', en: "Our energy costs went up 18% this year. Where should we start?", ko: "올해 에너지 비용이 18% 올랐어요. 어디서부터 시작해야 할까요?" },
          { s: 'A', en: "Let's check the trend data in the BMS first. I've already found one problem.", ko: "먼저 BMS의 트렌드 데이터를 확인해 봅시다. 이미 문제 하나를 찾았습니다." },
          { s: 'B', en: "What is it?", ko: "뭔데요?" },
          { s: 'A', en: "In several zones, the heating and cooling valves are fighting each other.", ko: "몇몇 존에서 난방 밸브와 냉방 밸브가 동시에 열려 서로 싸우고 있습니다." },
          { s: 'B', en: "That sounds expensive.", ko: "돈이 많이 새고 있겠네요." },
          { s: 'A', en: "It is. Can you send me the sequence of operations? I'll correct the control logic.", ko: "맞습니다. 제어 시퀀스 문서를 보내 주시겠어요? 제어 로직을 고치겠습니다." },
          { s: 'B', en: "Sure. What else can we do?", ko: "물론이죠. 또 뭘 할 수 있을까요?" },
          { s: 'A', en: "Adding a VFD to the supply fan will save a lot of energy. Also, the economizer lets us use outdoor air for free cooling in spring and fall.", ko: "급기팬에 VFD를 달면 에너지를 많이 절약할 수 있습니다. 또 봄·가을에는 이코노마이저로 외기를 이용한 프리쿨링을 할 수 있습니다." },
          { s: 'B', en: "What about the meeting rooms? They're empty half the time.", ko: "회의실은요? 절반은 비어 있거든요." },
          { s: 'A', en: "Demand-controlled ventilation adjusts outdoor air based on CO2 levels, so it's perfect for those rooms.", ko: "수요 제어 환기는 CO2 농도에 따라 외기량을 조절하기 때문에 그런 방에 딱 맞습니다." }
        ]
      },
      situations: [
        { q: "팬 회전수를 20% 줄이면 소비 동력은 대략 어떻게 되나요?", options: ["It drops by about half.", "It drops by 20%.", "It stays the same.", "It goes up slightly."], answer: 0, explain: "상사 법칙: 동력 ∝ 회전수³ → 0.8³ ≈ 0.51" },
        { q: "외기를 이용해 기계 냉방 없이 냉방하는 것을 뭐라고 하나요?", options: ["free cooling", "open cooling", "natural AC", "wind cooling"], answer: 0, explain: "이코노마이저가 free cooling 을 담당합니다." },
        { q: "'제어 시퀀스 문서를 보내 주세요'를 영어로?", options: ["Can you send me the sequence of operations?", "Can you send me the control order paper?", "Can you send me the operating line?", "Can you send me the step program?"], answer: 0, explain: "줄여서 SOO 라고도 합니다." }
      ]
    },
    {
      id: 'hvac-iaq',
      icon: '🍃',
      title: '실내 공기질 & 민원 대응',
      titleEn: 'Indoor Air Quality & Comfort',
      goal: '덥다·춥다·답답하다는 민원을 CO2·습도·외기량 데이터로 설명하고 개선 계획을 제시할 수 있다.',
      expressions: [
        { en: "We've been getting a lot of hot and cold complaints on the fifth floor.", ko: "5층에서 덥다, 춥다는 민원이 많이 들어오고 있습니다.", tip: "hot and cold calls = 냉난방 민원", blank: "complaints", swaps: ["fifth>fifteenth|sixth", "complaints>compliments|complains"] },
        { en: "The CO2 levels in the meeting room exceed 1,500 ppm in the afternoon.", ko: "오후에 회의실 CO2 농도가 1,500ppm을 넘습니다.", tip: "실내 CO2 는 보통 1,000ppm 이하로 관리합니다", blank: "exceed", swaps: ["1,500>150|15,000", "exceed>exceeds|excess", "afternoon>morning"] },
        { en: "We should increase the outdoor air rate to meet ASHRAE 62.1.", ko: "ASHRAE 62.1 기준을 충족하려면 외기 도입량을 늘려야 합니다.", blank: "outdoor", swaps: ["increase>decrease", "62.1>90.1|55"] },
        { en: "Relative humidity should stay between 40 and 60 percent.", ko: "상대습도는 40~60%로 유지해야 합니다.", blank: "humidity", swaps: ["40 and 60>40 to 60|40 and 80|20 and 60", "Relative>Absolute"] },
        { en: "Let's upgrade the filters to MERV 13.", ko: "필터를 MERV 13 등급으로 올립시다.", blank: "filters", swaps: ["upgrade>downgrade|upgrading", "13>8|3"] },
        { en: "There's condensation on the ductwork because it isn't insulated.", ko: "덕트가 보온되지 않아서 표면에 결로가 생겼습니다.", blank: "condensation", swaps: ["condensation>compensation|condemnation", "isn't insulated>is insulated|isn't isolated"] },
        { en: "We'll replace the filters on a quarterly maintenance schedule.", ko: "분기별 유지보수 일정에 맞춰 필터를 교체하겠습니다.", blank: "quarterly", swaps: ["quarterly>monthly|yearly|quarter", "replace>repair|replay"] }
      ],
      terms: [
        { en: "indoor air quality (IAQ)", ko: "실내 공기질", def: "CO2, 미세먼지(PM2.5), 휘발성 유기화합물(VOC), 온습도 등으로 평가하는 실내 공기 상태. 업무 집중도와 건강에 직접 영향을 준다.", ex: "Poor IAQ can cause headaches and fatigue." },
        { en: "CO2 concentration (ppm)", ko: "이산화탄소 농도", def: "환기가 충분한지 보여 주는 대표 지표. 외기는 약 420 ppm이고 실내는 보통 1,000 ppm 이하로 관리한다. 사람이 많은데 환기가 부족하면 빠르게 올라간다.", ex: "CO2 rose to 1,800 ppm during the all-hands meeting." },
        { en: "outdoor air (OA)", ko: "외기", def: "환기를 위해 들이는 바깥 공기. 필요량은 ASHRAE 62.1에서 재실 인원과 바닥 면적으로 계산한다. 많을수록 공기질은 좋아지지만 냉난방 부하가 커진다.", ex: "The outdoor air damper should be at least 20% open." },
        { en: "relative humidity (RH)", ko: "상대습도", def: "그 온도에서 공기가 머금을 수 있는 최대 수증기량 대비 현재 수증기량의 비율. 보통 40~60%가 쾌적하며, 너무 높으면 곰팡이, 너무 낮으면 건조함과 정전기가 생긴다.", ex: "The relative humidity reached 70% after the rain." },
        { en: "dew point", ko: "이슬점", def: "공기를 냉각할 때 결로가 시작되는 온도. 덕트·배관 표면 온도가 주변 공기의 이슬점보다 낮으면 결로가 생기므로 보온재로 막는다.", ex: "The chilled water pipe is below the dew point, so it needs insulation." },
        { en: "MERV rating", ko: "MERV 등급", def: "필터의 미세입자 포집 성능 등급(1~16). 높을수록 고성능이지만 압력 손실도 커지므로 팬 용량을 함께 확인해야 한다. 상업 건물은 MERV 13 이상을 권장한다.", ex: "Switching to MERV 13 increased the filter pressure drop." },
        { en: "thermal comfort", ko: "열쾌적", def: "온도·습도·기류·복사 온도·착의량·활동량이 함께 결정하는 쾌적감. ASHRAE 55가 기준이며, 같은 온도라도 기류(드래프트)가 있거나 창가 복사 냉기가 있으면 춥게 느낀다.", ex: "Thermal comfort depends on more than air temperature." },
        { en: "preventive maintenance (PM)", ko: "예방 정비", def: "고장 전에 정해진 주기로 필터 교체·코일 청소·벨트 점검 등을 하는 정비. 고장 후에 고치는 사후 정비(reactive maintenance)보다 비용과 민원이 적다.", ex: "Coil cleaning is part of our preventive maintenance plan." }
      ],
      dialogue: {
        setting: '입주사 사무 관리자와 냉난방·공기질 민원을 협의하는 회의입니다.',
        you: 'A',
        roles: { A: '나 (HVAC 서비스 엔지니어)', B: 'Jenny (입주사 사무 관리자)' },
        lines: [
          { s: 'B', en: "We've been getting a lot of hot and cold complaints on the fifth floor.", ko: "5층에서 덥다, 춥다는 민원이 많이 들어오고 있어요." },
          { s: 'A', en: "I understand. We installed sensors last week, and the CO2 levels in the meeting room exceed 1,500 ppm in the afternoon.", ko: "알겠습니다. 지난주에 센서를 설치했는데, 오후에 회의실 CO2 농도가 1,500ppm을 넘습니다." },
          { s: 'B', en: "Is that bad?", ko: "그게 나쁜 건가요?" },
          { s: 'A', en: "Yes, it means the room isn't getting enough fresh air. We should increase the outdoor air rate to meet ASHRAE 62.1.", ko: "네, 신선한 공기가 충분히 들어오지 않는다는 뜻입니다. ASHRAE 62.1 기준을 충족하려면 외기 도입량을 늘려야 합니다." },
          { s: 'B', en: "People also say the air feels damp.", ko: "공기가 눅눅하다는 말도 있어요." },
          { s: 'A', en: "Relative humidity should stay between 40 and 60 percent. We measured 68%, so we'll adjust the dehumidification.", ko: "상대습도는 40~60%로 유지해야 합니다. 68%가 측정돼서 제습 운전을 조정하겠습니다." },
          { s: 'B', en: "And what about the water stains on the ceiling?", ko: "천장의 물 얼룩은요?" },
          { s: 'A', en: "There's condensation on the ductwork because it isn't insulated. We'll insulate it next week.", ko: "덕트가 보온되지 않아서 표면에 결로가 생겼습니다. 다음 주에 보온 작업을 하겠습니다." },
          { s: 'B', en: "Is there anything else we can do?", ko: "그 밖에 할 수 있는 게 있을까요?" },
          { s: 'A', en: "Let's upgrade the filters to MERV 13, and we'll replace them on a quarterly maintenance schedule.", ko: "필터를 MERV 13 등급으로 올리고, 분기별 유지보수 일정에 맞춰 교체하겠습니다." }
        ]
      },
      situations: [
        { q: "덕트 표면에 물방울이 맺히는 현상을 뭐라고 하나요?", options: ["condensation", "evaporation", "conduction", "precipitation"], answer: 0, explain: "표면 온도가 이슬점(dew point)보다 낮을 때 생깁니다." },
        { q: "환기가 부족한지 판단하는 대표 지표는?", options: ["CO2 concentration", "lighting level", "noise level", "floor area"], answer: 0, explain: "외기 약 420ppm, 실내는 보통 1,000ppm 이하로 관리합니다." },
        { q: "'필터를 MERV 13으로 올리자'를 영어로?", options: ["Let's upgrade the filters to MERV 13.", "Let's raise up filter MERV 13.", "Let's filter more to 13.", "Let's change MERV filter level up 13."], answer: 0, explain: "필터 등급을 올리면 압력 손실도 커지니 팬 용량을 확인하세요." }
      ]
    }
  ];

  // 학습 트랙: 레슨을 업무 상황별로 묶는다
  const TRACKS = [
    { id: 'meeting', icon: '🧭', title: '회의 진행', titleEn: 'Running Meetings', color: 'blue',
      desc: '회의를 열고, 이끌고, 깔끔하게 마무리하기', lessons: ['small-talk', 'opening', 'closing'] },
    { id: 'discussion', icon: '💬', title: '토론 & 아이디어', titleEn: 'Discussion', color: 'violet',
      desc: '의견을 말하고, 반대하고, 아이디어를 모으기', lessons: ['opinions', 'agree-disagree', 'brainstorming'] },
    { id: 'communication', icon: '🌐', title: '소통 & 원격 협업', titleEn: 'Communication', color: 'teal',
      desc: '되묻고 확인하고, 화상회의와 일정 조율하기', lessons: ['clarifying', 'online', 'scheduling'] },
    { id: 'results', icon: '📈', title: '보고 & 협상', titleEn: 'Reporting & Negotiation', color: 'amber',
      desc: '숫자로 보고하고, 발표하고, 조건을 협상하기', lessons: ['reporting', 'presentation-qa', 'negotiation'] },
    { id: 'engineering', icon: '🔧', title: '엔지니어링 미팅', titleEn: 'Engineering Meetings', color: 'rose',
      desc: '설계 검토, 장애 분석, 테스트 결과를 기술 용어로 말하기', lessons: ['design-review', 'troubleshooting', 'testing-quality'] },
    { id: 'eng-deep', icon: '⚙️', title: '엔지니어링 심화', titleEn: 'Engineering Deep Dive', color: 'cyan',
      desc: '수치·단위, 리스크·안전, 성능 데이터를 공학 개념과 함께 말하기', lessons: ['specs-units', 'risk-safety', 'performance-data'] },
    { id: 'hvac-design', icon: '🌬️', title: 'HVAC 설계', titleEn: 'HVAC Design', color: 'indigo',
      desc: '부하 계산, 풍량·덕트, 냉동 사이클을 영어로 설명하기', lessons: ['hvac-load', 'hvac-airflow', 'hvac-refrigeration'] },
    { id: 'hvac-field', icon: '🏢', title: 'HVAC 현장 & 운영', titleEn: 'HVAC Field & Operations', color: 'green',
      desc: '시운전·TAB, 에너지 제어, 실내 공기질 민원을 영어로 협의하기', lessons: ['hvac-commissioning', 'hvac-controls', 'hvac-iaq'] }
  ];

  const LEVELS = {
    'small-talk': '기초', opening: '기초', closing: '기초',
    opinions: '기초', 'agree-disagree': '중급', brainstorming: '중급',
    clarifying: '기초', online: '기초', scheduling: '기초',
    reporting: '중급', 'presentation-qa': '중급', negotiation: '고급',
    'design-review': '중급', troubleshooting: '중급', 'testing-quality': '중급',
    'specs-units': '중급', 'risk-safety': '고급', 'performance-data': '고급',
    'hvac-load': '중급', 'hvac-airflow': '중급', 'hvac-refrigeration': '고급',
    'hvac-commissioning': '중급', 'hvac-controls': '고급', 'hvac-iaq': '중급'
  };

  LESSONS.forEach(function (lesson) {
    lesson.track = TRACKS.find(function (t) { return t.lessons.indexOf(lesson.id) !== -1; }).id;
    lesson.level = LEVELS[lesson.id];
    // 표현마다 고유 id 부여 (복습 카드 키로 사용)
    lesson.expressions.forEach(function (expr, i) {
      expr.id = lesson.id + '-' + (i + 1);
    });
    // 기술 용어 카드 (엔지니어링 레슨)
    (lesson.terms || []).forEach(function (term, i) {
      term.id = lesson.id + '-t' + (i + 1);
      term.term = true;
    });
  });

  // 트랙 순서대로 정렬 (화면의 레슨 번호 기준)
  LESSONS.sort(function (a, b) {
    const ta = TRACKS.findIndex(function (t) { return t.id === a.track; });
    const tb = TRACKS.findIndex(function (t) { return t.id === b.track; });
    if (ta !== tb) return ta - tb;
    return TRACKS[ta].lessons.indexOf(a.id) - TRACKS[tb].lessons.indexOf(b.id);
  });

  const DATA = { TRACKS: TRACKS, LESSONS: LESSONS };
  if (typeof module === 'object' && module.exports) module.exports = DATA;
  else { root.TRACKS = TRACKS; root.LESSONS = LESSONS; }
})(this);
