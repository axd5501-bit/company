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
        { en: "How was your weekend?", ko: "주말 어떻게 보내셨어요?", tip: "월요일 회의 전 가장 무난한 스몰토크 주제입니다.", blank: "weekend" },
        { en: "Thanks for making the time today.", ko: "오늘 시간 내주셔서 감사합니다.", tip: "make time = (바쁜 중에) 시간을 내다", blank: "time" },
        { en: "Let me briefly introduce myself.", ko: "간단히 제 소개를 드리겠습니다.", blank: "introduce" },
        { en: "I'm in charge of overseas sales at our company.", ko: "저는 저희 회사에서 해외 영업을 담당하고 있습니다.", tip: "be in charge of + 업무 = ~을 담당하다", blank: "charge" },
        { en: "I've heard a lot about your team.", ko: "팀에 대해 이야기 많이 들었습니다.", blank: "heard" },
        { en: "It's great to finally meet you in person.", ko: "드디어 직접 뵙게 되어 반갑습니다.", tip: "이메일·화상으로만 연락하다 처음 대면할 때 씁니다.", blank: "person" },
        { en: "Did you find the office okay?", ko: "사무실은 잘 찾아오셨어요?", blank: "find" }
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
        { en: "Shall we get started?", ko: "시작할까요?", tip: "Shall we ~? 는 정중하게 제안하는 표현입니다.", blank: "started" },
        { en: "The purpose of today's meeting is to review the Q3 budget.", ko: "오늘 회의의 목적은 3분기 예산을 검토하는 것입니다.", blank: "purpose" },
        { en: "We have three items on the agenda today.", ko: "오늘 안건은 세 가지입니다.", tip: "item = (안건 목록의) 항목", blank: "agenda" },
        { en: "Let's start with the first item.", ko: "첫 번째 안건부터 시작하죠.", blank: "item" },
        { en: "We need to wrap up by 3 o'clock.", ko: "3시까지는 마무리해야 합니다.", tip: "wrap up = 마무리하다. 마감 시점에는 until 이 아니라 by 를 씁니다.", blank: "wrap" },
        { en: "Jenny will be taking the minutes today.", ko: "오늘 회의록은 제니 씨가 작성해 주실 겁니다.", tip: "take the minutes = 회의록을 작성하다", blank: "minutes" },
        { en: "Has everyone received a copy of the agenda?", ko: "모두 안건 자료 받으셨나요?", blank: "received" }
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
        { en: "In my opinion, we should focus on the domestic market first.", ko: "제 생각에는 국내 시장에 먼저 집중해야 합니다.", blank: "opinion" },
        { en: "From my perspective, the timeline is a bit tight.", ko: "제 관점에서는 일정이 조금 빠듯합니다.", blank: "perspective" },
        { en: "I strongly believe this is the right direction.", ko: "저는 이것이 옳은 방향이라고 확신합니다.", blank: "believe" },
        { en: "What are your thoughts on this?", ko: "이것에 대해 어떻게 생각하세요?", tip: "'How do you think?'는 흔한 실수입니다. What do you think? 로 물어보세요.", blank: "thoughts" },
        { en: "I'd like to hear from everyone before we decide.", ko: "결정하기 전에 모두의 의견을 듣고 싶습니다.", blank: "hear" },
        { en: "If I may add something, we also need to consider the cost.", ko: "한 가지 덧붙이자면, 비용도 고려해야 합니다.", blank: "add" },
        { en: "It seems to me that customers want a simpler design.", ko: "제가 보기에는 고객들이 더 단순한 디자인을 원하는 것 같습니다.", tip: "단정 짓지 않고 부드럽게 의견을 낼 때 좋습니다.", blank: "seems" }
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
        { en: "I completely agree with you.", ko: "전적으로 동의합니다.", blank: "agree" },
        { en: "That's a good point.", ko: "좋은 지적입니다.", blank: "point" },
        { en: "I see where you're coming from, but I have a different view.", ko: "무슨 말씀인지는 알겠지만, 저는 생각이 좀 다릅니다.", tip: "반대 의견 전에 상대 입장을 먼저 인정하는 쿠션 표현입니다.", blank: "coming" },
        { en: "I'm afraid I have to disagree.", ko: "죄송하지만 동의하기 어렵습니다.", tip: "I'm afraid ~ 는 부정적인 내용을 부드럽게 만들어 줍니다.", blank: "afraid" },
        { en: "I agree up to a point, but I have some concerns.", ko: "어느 정도는 동의하지만, 몇 가지 우려되는 점이 있습니다.", blank: "concerns" },
        { en: "I'm not sure that's the best approach.", ko: "그게 최선의 방법인지는 잘 모르겠습니다.", blank: "approach" },
        { en: "Let's find some middle ground.", ko: "서로 절충점을 찾아봅시다.", tip: "meet halfway 도 같은 의미로 자주 씁니다.", blank: "ground" }
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
        { en: "Sorry to interrupt, but could I ask a quick question?", ko: "말씀 중에 죄송하지만, 간단히 질문 하나 드려도 될까요?", blank: "interrupt" },
        { en: "Could you elaborate on that?", ko: "그 부분을 좀 더 자세히 설명해 주시겠어요?", blank: "elaborate" },
        { en: "Just to clarify, are we talking about the US or Europe?", ko: "확인차 여쭙자면, 미국 얘기인가요 유럽 얘기인가요?", blank: "clarify" },
        { en: "Sorry, I didn't quite catch that.", ko: "죄송하지만, 잘 못 알아들었습니다.", tip: "catch = (말을) 알아듣다", blank: "catch" },
        { en: "Could you say that again a bit more slowly?", ko: "조금만 더 천천히 다시 말씀해 주시겠어요?", blank: "slowly" },
        { en: "So, what you're saying is that we need more staff?", ko: "그러니까 인력이 더 필요하다는 말씀이시죠?", tip: "상대의 말을 요약해서 제대로 이해했는지 확인하는 표현입니다.", blank: "saying" },
        { en: "Could I just finish my point?", ko: "제 말을 마저 끝내도 될까요?", tip: "누군가 끼어들었을 때 정중하게 발언권을 지키는 표현입니다.", blank: "finish" }
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
        { en: "Let me give you a quick update on the project.", ko: "프로젝트 현황을 간단히 말씀드리겠습니다.", blank: "update" },
        { en: "We're on track to meet the deadline.", ko: "마감일을 맞출 수 있도록 순조롭게 진행 중입니다.", tip: "on track = 계획대로 진행 중", blank: "track" },
        { en: "We're running about two weeks behind schedule.", ko: "일정보다 2주 정도 늦어지고 있습니다.", tip: "반대로 일정보다 앞서 있으면 ahead of schedule", blank: "behind" },
        { en: "As you can see from this chart, sales increased by 15%.", ko: "이 차트에서 보시다시피, 매출이 15% 증가했습니다.", tip: "증감의 폭은 by 로 나타냅니다.", blank: "chart" },
        { en: "Revenue dropped slightly in the second quarter.", ko: "2분기에 매출이 소폭 하락했습니다.", blank: "slightly" },
        { en: "This is mainly due to higher shipping costs.", ko: "이는 주로 배송비 상승 때문입니다.", blank: "due" },
        { en: "The key takeaway here is that customer retention is improving.", ko: "여기서 핵심은 고객 유지율이 개선되고 있다는 점입니다.", tip: "takeaway = 핵심 메시지, 시사점", blank: "takeaway" }
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
        { en: "What if we extended the contract to two years?", ko: "계약을 2년으로 연장하면 어떨까요?", tip: "What if + 과거형 = '~하면 어떨까요?' 하는 부드러운 가정 제안", blank: "extended" },
        { en: "We'd be willing to lower the price if you increase the order volume.", ko: "주문량을 늘려 주신다면 가격을 낮출 의향이 있습니다.", blank: "willing" },
        { en: "That's a bit beyond our budget.", ko: "그건 저희 예산을 조금 넘어섭니다.", blank: "budget" },
        { en: "Is there any flexibility on the delivery date?", ko: "납기일은 조정이 가능할까요?", blank: "flexibility" },
        { en: "Let's look at this from a different angle.", ko: "이 문제를 다른 각도에서 봅시다.", blank: "angle" },
        { en: "I think we can both benefit from this deal.", ko: "이번 거래로 양측 모두 이익을 볼 수 있다고 생각합니다.", tip: "win-win 이라는 표현도 자주 씁니다.", blank: "benefit" },
        { en: "I'll need to check with my manager before I can confirm.", ko: "확정하기 전에 상사와 확인해 봐야 합니다.", blank: "confirm" }
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
        { en: "Can everyone hear me okay?", ko: "제 목소리 잘 들리시나요?", blank: "hear" },
        { en: "I think you're on mute.", ko: "음소거 상태이신 것 같아요.", blank: "mute" },
        { en: "Sorry, you're breaking up a little.", ko: "죄송하지만, 소리가 조금 끊겨요.", tip: "break up = (통화·영상이) 끊기다. break down(고장 나다)과 구분하세요.", blank: "breaking" },
        { en: "Let me share my screen.", ko: "제 화면을 공유하겠습니다.", blank: "share" },
        { en: "Can you see my screen now?", ko: "이제 제 화면 보이시나요?", blank: "screen" },
        { en: "My connection is unstable, so I'll turn off my camera.", ko: "연결이 불안정해서 카메라를 끄겠습니다.", blank: "connection" },
        { en: "I'll drop the link in the chat.", ko: "채팅창에 링크를 올려 드릴게요.", tip: "drop / post / share a link in the chat 모두 자연스럽습니다.", blank: "chat" }
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
        { en: "Let's wrap things up.", ko: "이제 마무리하죠.", blank: "wrap" },
        { en: "To sum up, we've agreed to postpone the launch.", ko: "요약하자면, 출시를 연기하기로 합의했습니다.", tip: "To sum up / In summary / To summarize 모두 사용 가능합니다.", blank: "sum" },
        { en: "Let's go over the action items.", ko: "실행 항목을 한번 정리해 봅시다.", tip: "action item = 회의 후 누가 무엇을 할지 정한 할 일", blank: "action" },
        { en: "Who's going to take care of this?", ko: "이건 누가 맡아 주실 건가요?", blank: "care" },
        { en: "Could you send me the report by Friday?", ko: "금요일까지 보고서를 보내 주시겠어요?", blank: "Friday" },
        { en: "I'll send out the meeting notes this afternoon.", ko: "오늘 오후에 회의록을 공유하겠습니다.", blank: "notes" },
        { en: "Let's touch base next week.", ko: "다음 주에 다시 이야기 나눠요.", tip: "touch base = 간단히 다시 연락하거나 논의하다", blank: "base" }
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
        { en: "Let's throw some ideas around.", ko: "아이디어를 자유롭게 던져 봅시다.", tip: "throw ideas around = 부담 없이 아이디어를 내다", blank: "ideas" },
        { en: "There are no bad ideas at this stage.", ko: "지금 단계에서는 나쁜 아이디어란 없습니다.", blank: "stage" },
        { en: "What if we tried a subscription model?", ko: "구독 모델을 시도해 보면 어떨까요?", blank: "tried" },
        { en: "Building on what Sarah said, we could also offer a free trial.", ko: "사라 씨 말씀에 덧붙여, 무료 체험도 제공할 수 있겠어요.", tip: "Building on ~ = ~의 아이디어를 발전시켜서", blank: "Building" },
        { en: "That's an interesting idea. Can you tell us more?", ko: "흥미로운 아이디어네요. 좀 더 말씀해 주시겠어요?", blank: "interesting" },
        { en: "Let's narrow it down to the top three ideas.", ko: "상위 세 개 아이디어로 좁혀 봅시다.", tip: "narrow down = 범위를 좁히다", blank: "narrow" },
        { en: "Let's park that idea for now and come back to it later.", ko: "그 아이디어는 일단 보류하고 나중에 다시 이야기하죠.", tip: "park = (논의를) 잠시 보류하다. put ~ on hold 와 같은 뜻", blank: "park" }
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
        { en: "Today, I'm going to walk you through our new marketing strategy.", ko: "오늘은 새로운 마케팅 전략을 차근차근 설명드리겠습니다.", tip: "walk ~ through = ~에게 단계별로 설명하다", blank: "walk" },
        { en: "I'll be happy to take questions at the end.", ko: "질문은 마지막에 기꺼이 받겠습니다.", blank: "questions" },
        { en: "Let's move on to the next slide.", ko: "다음 슬라이드로 넘어가겠습니다.", blank: "slide" },
        { en: "That's a great question.", ko: "좋은 질문입니다.", tip: "답을 생각할 시간을 벌어 주는 표현이기도 합니다.", blank: "question" },
        { en: "I don't have that information right now, but I'll get back to you.", ko: "지금은 그 정보가 없지만, 확인해서 다시 알려 드리겠습니다.", tip: "get back to ~ = 나중에 다시 연락하다", blank: "information" },
        { en: "If I understand your question correctly, you're asking about the budget.", ko: "질문을 제대로 이해했다면, 예산에 대해 물으시는 거죠?", blank: "correctly" },
        { en: "Does that answer your question?", ko: "답변이 되었을까요?", blank: "answer" }
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
        { en: "Are you available next Tuesday afternoon?", ko: "다음 주 화요일 오후에 시간 괜찮으세요?", blank: "available" },
        { en: "Does 10 a.m. work for you?", ko: "오전 10시 괜찮으세요?", tip: "work for ~ = ~에게 (일정이) 괜찮다", blank: "work" },
        { en: "I'm afraid I'm tied up on Monday.", ko: "죄송하지만 월요일은 일정이 꽉 차 있습니다.", tip: "be tied up = 바빠서 시간이 없다", blank: "tied" },
        { en: "Could we push the meeting back to Thursday?", ko: "회의를 목요일로 미룰 수 있을까요?", tip: "push back = 미루다 / move up = 앞당기다", blank: "push" },
        { en: "Something urgent has come up, so I need to reschedule.", ko: "급한 일이 생겨서 일정을 변경해야 합니다.", blank: "reschedule" },
        { en: "I'll send you a calendar invite.", ko: "캘린더 초대를 보내 드릴게요.", blank: "invite" },
        { en: "Just a reminder that our meeting is tomorrow at 2.", ko: "내일 2시에 회의가 있다는 점 다시 알려 드립니다.", blank: "reminder" }
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
        { en: "Let me walk you through the system architecture.", ko: "시스템 아키텍처를 단계별로 설명드리겠습니다.", blank: "architecture" },
        { en: "This design meets all the functional requirements.", ko: "이 설계는 모든 기능 요구사항을 충족합니다.", tip: "functional / non-functional requirements = 기능 / 비기능 요구사항", blank: "requirements" },
        { en: "The main trade-off here is performance versus cost.", ko: "여기서 핵심 트레이드오프는 성능 대 비용입니다.", tip: "trade-off = 하나를 얻으려면 다른 하나를 포기해야 하는 관계", blank: "trade-off" },
        { en: "What are the design constraints we need to consider?", ko: "고려해야 할 설계 제약 조건은 무엇인가요?", blank: "constraints" },
        { en: "Have we considered how this will scale?", ko: "이 구조가 규모가 커질 때 어떻게 확장될지 검토해 봤나요?", tip: "scale = (사용량·규모가 늘어날 때) 감당하며 확장되다", blank: "scale" },
        { en: "I'd suggest building a prototype before we commit to this approach.", ko: "이 방식으로 확정하기 전에 프로토타입을 먼저 만들어 볼 것을 제안합니다.", tip: "commit to ~ = ~으로 확정하다, 전념하다", blank: "prototype" },
        { en: "Can we freeze the spec by the end of this week?", ko: "이번 주 말까지 사양을 확정할 수 있을까요?", tip: "freeze the spec = 사양을 더 이상 바꾸지 않도록 동결하다", blank: "freeze" }
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
        { en: "We've identified the root cause of the failure.", ko: "고장의 근본 원인을 파악했습니다.", blank: "root" },
        { en: "Were you able to reproduce the issue?", ko: "그 문제를 재현할 수 있었나요?", tip: "reproduce = (버그·결함을) 같은 조건에서 다시 일으키다", blank: "reproduce" },
        { en: "The defect only occurs under high load.", ko: "이 결함은 고부하 상황에서만 발생합니다.", blank: "defect" },
        { en: "As a temporary workaround, we rolled back to the previous version.", ko: "임시 해결책으로 이전 버전으로 롤백했습니다.", tip: "workaround = 임시방편 / roll back = 이전 상태로 되돌리다", blank: "workaround" },
        { en: "The failure rate dropped from 3% to 0.5% after the fix.", ko: "수정 후 불량률이 3%에서 0.5%로 떨어졌습니다.", blank: "rate" },
        { en: "We need to put corrective actions in place to prevent this from happening again.", ko: "재발 방지를 위한 시정 조치를 마련해야 합니다.", blank: "corrective" },
        { en: "Let's do a quick post-mortem to see what we can learn.", ko: "무엇을 배울 수 있는지 간단히 사후 분석을 해 봅시다.", tip: "post-mortem = 장애·프로젝트 후 원인과 교훈을 정리하는 회의", blank: "post-mortem" }
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
        { en: "All test cases passed except for the stress test.", ko: "스트레스 테스트를 제외한 모든 테스트 케이스가 통과했습니다.", blank: "passed" },
        { en: "The measurement is within the tolerance range.", ko: "측정값이 허용 오차 범위 안에 있습니다.", tip: "tolerance = 허용 오차 / out of tolerance = 허용 오차 초과", blank: "tolerance" },
        { en: "We found a regression in the latest build.", ko: "최신 빌드에서 회귀 결함을 발견했습니다.", tip: "regression = 수정 후 예전에 잘 되던 기능이 다시 고장 나는 것", blank: "regression" },
        { en: "What are the acceptance criteria for this feature?", ko: "이 기능의 인수 기준은 무엇인가요?", tip: "acceptance criteria = 완료·합격으로 인정하는 기준", blank: "criteria" },
        { en: "The yield improved to 98% this month.", ko: "이번 달 수율이 98%로 개선되었습니다.", tip: "yield = 수율 (전체 생산량 중 양품 비율)", blank: "yield" },
        { en: "We can't release it until QA signs off.", ko: "QA 승인이 나기 전에는 출시할 수 없습니다.", tip: "sign off (on ~) = (~을) 공식 승인하다", blank: "signs" },
        { en: "Let's prioritize the critical bugs before the release.", ko: "출시 전에 치명적인 버그부터 우선 처리합시다.", blank: "prioritize" }
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
        { en: "The tolerance is plus or minus 0.05 millimeters.", ko: "공차는 ±0.05mm입니다.", tip: "± 는 plus or minus 로 읽습니다. 0.05 는 'zero point zero five'", blank: "minus" },
        { en: "The motor is rated at 3 kilowatts.", ko: "이 모터의 정격 출력은 3kW입니다.", tip: "be rated at ~ = 정격이 ~이다", blank: "rated" },
        { en: "The maximum operating temperature is 85 degrees Celsius.", ko: "최대 동작 온도는 섭씨 85도입니다.", tip: "°C = degrees Celsius, °F = degrees Fahrenheit", blank: "operating" },
        { en: "This part weighs about 40% less than the previous design.", ko: "이 부품은 이전 설계보다 약 40% 가볍습니다.", blank: "weighs" },
        { en: "The output is an order of magnitude higher than we expected.", ko: "출력이 예상보다 약 10배 높습니다.", tip: "order of magnitude = 10배 단위의 차이", blank: "magnitude" },
        { en: "Please convert all values to metric units.", ko: "모든 값을 미터법 단위로 변환해 주세요.", tip: "metric(미터법) ↔ imperial(인치·파운드 단위)", blank: "metric" },
        { en: "The measured value deviates from the nominal value by 2%.", ko: "측정값이 공칭값에서 2% 벗어납니다.", tip: "deviate from ~ = ~에서 벗어나다", blank: "nominal" }
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
        { en: "We ran an FMEA to identify potential failure modes.", ko: "잠재적인 고장 모드를 찾기 위해 FMEA를 수행했습니다.", tip: "FMEA = Failure Mode and Effects Analysis (고장 모드 영향 분석)", blank: "potential" },
        { en: "This risk has a high severity but a low probability.", ko: "이 리스크는 심각도는 높지만 발생 가능성은 낮습니다.", blank: "severity" },
        { en: "We designed it with a safety factor of two.", ko: "안전계수 2로 설계했습니다.", blank: "factor" },
        { en: "Our mitigation plan is to add a redundant sensor.", ko: "완화 대책은 이중화 센서를 추가하는 것입니다.", tip: "redundant = 이중화된, 예비의", blank: "mitigation" },
        { en: "Is this design compliant with the ISO standard?", ko: "이 설계는 ISO 표준을 준수하나요?", blank: "compliant" },
        { en: "That controller is a single point of failure.", ko: "그 컨트롤러는 단일 고장점입니다.", tip: "single point of failure = 그 하나가 고장 나면 전체가 멈추는 지점", blank: "single" },
        { en: "Let's escalate this to the safety committee.", ko: "이 건은 안전위원회로 올립시다.", tip: "escalate = 상위 단계로 보고·이관하다", blank: "escalate" }
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
        { en: "Average latency went up from 120 to 300 milliseconds.", ko: "평균 지연 시간이 120ms에서 300ms로 늘었습니다.", blank: "latency" },
        { en: "The system can handle 5,000 requests per second.", ko: "이 시스템은 초당 5,000건의 요청을 처리할 수 있습니다.", tip: "requests per second (RPS) = 초당 요청 수", blank: "handle" },
        { en: "Let's run a benchmark before and after the change.", ko: "변경 전후로 벤치마크를 돌려 봅시다.", blank: "benchmark" },
        { en: "This data point looks like an outlier.", ko: "이 데이터는 이상치로 보입니다.", blank: "outlier" },
        { en: "The difference is statistically significant.", ko: "그 차이는 통계적으로 유의미합니다.", tip: "우연으로 생긴 차이가 아니라고 볼 수 있다는 뜻", blank: "significant" },
        { en: "The standard deviation is large, so the process isn't stable.", ko: "표준편차가 커서 공정이 안정적이지 않습니다.", blank: "deviation" },
        { en: "There's a strong correlation, but that doesn't prove causation.", ko: "강한 상관관계가 있지만, 그것이 인과관계를 증명하지는 않습니다.", blank: "correlation" }
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
      desc: '수치·단위, 리스크·안전, 성능 데이터를 공학 개념과 함께 말하기', lessons: ['specs-units', 'risk-safety', 'performance-data'] }
  ];

  const LEVELS = {
    'small-talk': '기초', opening: '기초', closing: '기초',
    opinions: '기초', 'agree-disagree': '중급', brainstorming: '중급',
    clarifying: '기초', online: '기초', scheduling: '기초',
    reporting: '중급', 'presentation-qa': '중급', negotiation: '고급',
    'design-review': '중급', troubleshooting: '중급', 'testing-quality': '중급',
    'specs-units': '중급', 'risk-safety': '고급', 'performance-data': '고급'
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
