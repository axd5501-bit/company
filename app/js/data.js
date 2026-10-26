/*
 * 레슨 콘텐츠.
 * - expressions[].blank : 빈칸 퀴즈에서 비워 둘 단어 (en 안에 반드시 포함)
 * - dialogue.you        : 롤플레이에서 학습자가 맡는 역할
 * - situations[].answer : options 의 정답 인덱스 (화면에서는 섞여서 나옴)
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
      desc: '숫자로 보고하고, 발표하고, 조건을 협상하기', lessons: ['reporting', 'presentation-qa', 'negotiation'] }
  ];

  const LEVELS = {
    'small-talk': '기초', opening: '기초', closing: '기초',
    opinions: '기초', 'agree-disagree': '중급', brainstorming: '중급',
    clarifying: '기초', online: '기초', scheduling: '기초',
    reporting: '중급', 'presentation-qa': '중급', negotiation: '고급'
  };

  LESSONS.forEach(function (lesson) {
    lesson.track = TRACKS.find(function (t) { return t.lessons.indexOf(lesson.id) !== -1; }).id;
    lesson.level = LEVELS[lesson.id];
    // 표현마다 고유 id 부여 (복습 카드 키로 사용)
    lesson.expressions.forEach(function (expr, i) {
      expr.id = lesson.id + '-' + (i + 1);
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
