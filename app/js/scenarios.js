/*
 * 실전 회의 시뮬레이션 시나리오.
 * 단계(step)마다 상대방 대사가 나오고, 학습자는 제한 시간 안에 답변 3개 중 하나를 고른다.
 * - skill  : 이 단계가 평가하는 역량 (polite 정중함 / clear 명확성 / lead 주도성)
 * - grade  : 2 최선 · 1 무난 · 0 주의
 * - reply  : 그 답변을 골랐을 때 상대방의 반응 (s 는 roles 의 키)
 */
(function (root) {
  const SCENARIOS = [
    {
      id: 'price-negotiation',
      icon: '💰',
      title: '까다로운 고객과의 가격 협상',
      track: 'results',
      level: '고급',
      brief: '고객사 구매팀장이 경쟁사 견적을 들고 가격 인하를 강하게 요구합니다. 관계를 지키면서 조건을 조율하세요.',
      you: '공급사 영업 담당',
      roles: { P: 'Ms. Parker (고객사 구매팀장)' },
      steps: [
        {
          s: 'P', skill: 'polite',
          en: "Thanks for coming in. I'll be honest. Your price is about 15% higher than your competitor's.",
          ko: "와 주셔서 감사합니다. 솔직히 말씀드리면, 귀사 가격이 경쟁사보다 15% 정도 높아요.",
          choices: [
            { en: "I appreciate your honesty. Could you tell me more about what they're offering?", grade: 2,
              feedback: "상대의 솔직함을 인정하고 정보를 더 끌어내는 좋은 시작입니다.",
              reply: { en: "Sure. They offer the same volume with free shipping.", ko: "물론이죠. 같은 물량에 무료 배송을 제공해요." } },
            { en: "Our price is fair. Our quality is better.", grade: 1,
              feedback: "틀린 말은 아니지만 방어적으로 들릴 수 있습니다. 먼저 상대의 말을 인정해 보세요.",
              reply: { en: "Maybe, but my boss only looks at the numbers.", ko: "그럴 수도 있죠. 하지만 제 상사는 숫자만 봐요." } },
            { en: "That's impossible. Your information is wrong.", grade: 0,
              feedback: "상대 정보를 정면으로 부정하면 협상 분위기가 급격히 나빠집니다.",
              reply: { en: "Well, I have their quote right here.", ko: "글쎄요, 견적서가 바로 여기 있는데요." } }
          ]
        },
        {
          s: 'P', skill: 'clear',
          en: "So, can you match their price?",
          ko: "그럼 그 가격에 맞춰 주실 수 있나요?",
          choices: [
            { en: "We can't match it exactly, but we could offer a 5% discount if you sign a two-year contract.", grade: 2,
              feedback: "할 수 없는 것과 할 수 있는 것을 조건과 함께 명확히 제시했습니다.",
              reply: { en: "Two years is a long commitment, but I'm listening.", ko: "2년은 긴 약정이지만, 들어 볼게요." } },
            { en: "Maybe we can do something. Let me think.", grade: 1,
              feedback: "모호한 답은 상대에게 주도권을 넘깁니다. 구체적인 조건을 제시해 보세요.",
              reply: { en: "I need something more concrete than that.", ko: "그보다 좀 더 구체적인 게 필요해요." } },
            { en: "Yes, no problem. We will match it.", grade: 0,
              feedback: "즉시 전부 양보하면 마진을 잃고, 추가 요구를 부릅니다.",
              reply: { en: "Great! And can you include free shipping too?", ko: "좋아요! 그럼 무료 배송도 포함해 주실 수 있죠?" } }
          ]
        },
        {
          s: 'P', skill: 'lead',
          en: "Our team is also worried about the delivery delays last quarter.",
          ko: "저희 팀은 지난 분기 납품 지연도 걱정하고 있어요.",
          choices: [
            { en: "I understand your concern. To address it, we'll set up weekly delivery reports for your team.", grade: 2,
              feedback: "우려에 공감하고 구체적인 해결책으로 대화를 이끌었습니다.",
              reply: { en: "That would definitely help.", ko: "그건 확실히 도움이 되겠네요." } },
            { en: "Sorry about that. It won't happen again.", grade: 1,
              feedback: "사과는 좋지만 재발 방지책이 없으면 설득력이 약합니다.",
              reply: { en: "I hope so, but how can you guarantee that?", ko: "그러길 바라요. 하지만 어떻게 보장하죠?" } },
            { en: "That was not our fault. The shipping company was late.", grade: 0,
              feedback: "책임 전가는 신뢰를 떨어뜨립니다. 원인이 외부에 있더라도 해결책을 먼저 제시하세요.",
              reply: { en: "Our customers don't care whose fault it was.", ko: "저희 고객들은 누구 잘못인지 관심 없어요." } }
          ]
        },
        {
          s: 'P', skill: 'polite',
          en: "Honestly, I need to get approval from my director before I agree to anything.",
          ko: "솔직히 뭐든 동의하기 전에 이사님 승인을 받아야 해요.",
          choices: [
            { en: "Of course. Would it help if I prepared a one-page summary for your director?", grade: 2,
              feedback: "상대의 상황을 존중하면서 의사결정을 돕는 제안을 했습니다.",
              reply: { en: "That would be very helpful, thank you.", ko: "그러면 정말 도움이 되겠어요. 감사합니다." } },
            { en: "Okay. Please tell me the answer soon.", grade: 1,
              feedback: "무난하지만 재촉하는 느낌입니다. 'at your earliest convenience'처럼 부드럽게 말해 보세요.",
              reply: { en: "I'll do my best.", ko: "최선을 다해 볼게요." } },
            { en: "Why can't you decide by yourself?", grade: 0,
              feedback: "상대의 권한을 문제 삼는 질문은 무례하게 들립니다.",
              reply: { en: "That's just how our company works.", ko: "저희 회사는 원래 그렇게 일해요." } }
          ]
        },
        {
          s: 'P', skill: 'lead',
          en: "Okay. I think we've made some progress today.",
          ko: "좋아요. 오늘 꽤 진전이 있었던 것 같네요.",
          choices: [
            { en: "I agree. To sum up, a 5% discount for a two-year contract and weekly delivery reports. I'll send a proposal by Friday.", grade: 2,
              feedback: "합의 내용을 요약하고 다음 단계와 기한까지 정리한 완벽한 마무리입니다.",
              reply: { en: "Perfect. I look forward to it.", ko: "완벽해요. 기다리고 있을게요." } },
            { en: "Yes. Thank you for your time today.", grade: 1,
              feedback: "예의 바르지만 합의 사항과 다음 단계가 빠졌습니다.",
              reply: { en: "Thank you. Let's keep in touch.", ko: "감사합니다. 계속 연락해요." } },
            { en: "Good. So, we have a deal, right?", grade: 0,
              feedback: "아직 승인 전인데 성급하게 확정을 요구하면 부담을 줍니다.",
              reply: { en: "Not yet. As I said, I need approval first.", ko: "아직이요. 말씀드렸듯이 승인이 먼저예요." } }
          ]
        }
      ]
    },
    {
      id: 'delay-report',
      icon: '⏰',
      title: '본부장에게 프로젝트 지연 보고',
      track: 'results',
      level: '중급',
      brief: '핵심 프로젝트가 3주 지연될 상황입니다. 본부장에게 나쁜 소식을 명확하고 책임감 있게 전달하세요.',
      you: '프로젝트 매니저',
      roles: { W: 'Director Wong (본부장)' },
      steps: [
        {
          s: 'W', skill: 'clear',
          en: "You wanted to see me? What's going on with the Phoenix project?",
          ko: "저를 보자고 하셨죠? 피닉스 프로젝트는 어떻게 되고 있나요?",
          choices: [
            { en: "I wanted to give you an update. Unfortunately, we're about three weeks behind schedule.", grade: 2,
              feedback: "핵심(3주 지연)을 처음부터 명확하게 전달했습니다. 나쁜 소식은 돌려 말하지 않는 게 좋습니다.",
              reply: { en: "Three weeks? That's serious. What happened?", ko: "3주요? 심각하네요. 무슨 일이죠?" } },
            { en: "Well, there are some small issues, nothing too big.", grade: 1,
              feedback: "문제를 축소하면 나중에 신뢰를 잃습니다. 사실을 분명하게 말하세요.",
              reply: { en: "Small issues? Be specific, please.", ko: "작은 문제요? 구체적으로 말해 주세요." } },
            { en: "The project is a disaster.", grade: 0,
              feedback: "감정적인 표현은 상황을 과장하고 해결책 논의를 어렵게 만듭니다.",
              reply: { en: "A disaster? Calm down and explain.", ko: "재앙이라고요? 진정하고 설명해 봐요." } }
          ]
        },
        {
          s: 'W', skill: 'clear',
          en: "What's causing the delay?",
          ko: "지연 원인이 뭔가요?",
          choices: [
            { en: "The main reason is that our supplier changed the parts design, so we had to redo the testing.", grade: 2,
              feedback: "원인을 구체적이고 객관적으로 설명했습니다.",
              reply: { en: "I see. That's unfortunate.", ko: "그렇군요. 안타깝네요." } },
            { en: "There are many reasons. It's complicated.", grade: 1,
              feedback: "'복잡하다'로 넘기면 보고받는 사람이 판단할 수 없습니다.",
              reply: { en: "Try me. I need to understand it.", ko: "말해 봐요. 제가 이해해야 하니까." } },
            { en: "The engineering team is too slow.", grade: 0,
              feedback: "특정 팀 탓은 책임 회피로 보입니다. 원인을 사실 중심으로 말하세요.",
              reply: { en: "Blaming others won't fix anything.", ko: "남 탓을 해서는 아무것도 해결되지 않아요." } }
          ]
        },
        {
          s: 'W', skill: 'lead',
          en: "So, what's your plan?",
          ko: "그래서 계획이 뭔가요?",
          choices: [
            { en: "I'd like to propose two options: add two engineers, or reduce the scope of the first release.", grade: 2,
              feedback: "선택지를 제시해 상사가 결정하기 쉽게 만들었습니다. 훌륭한 리더십입니다.",
              reply: { en: "Good. Let's discuss the pros and cons of each.", ko: "좋아요. 각각의 장단점을 논의해 봅시다." } },
            { en: "We will try harder and work overtime.", grade: 1,
              feedback: "의지는 좋지만 구체적인 계획이 아닙니다.",
              reply: { en: "Overtime isn't a plan. I need real options.", ko: "야근은 계획이 아니에요. 실제 선택지가 필요해요." } },
            { en: "What do you think we should do?", grade: 0,
              feedback: "해결책 없이 상사에게 판단을 떠넘기는 인상을 줍니다.",
              reply: { en: "I was hoping you'd tell me.", ko: "그걸 당신이 말해 주길 바랐는데요." } }
          ]
        },
        {
          s: 'W', skill: 'polite',
          en: "This is going to upset the client. They're expecting a demo next month.",
          ko: "고객이 불쾌해할 거예요. 다음 달 데모를 기대하고 있거든요.",
          choices: [
            { en: "I understand. I'll take responsibility for informing the client, and I'd appreciate your support in that meeting.", grade: 2,
              feedback: "책임을 지면서 정중하게 지원을 요청했습니다.",
              reply: { en: "Alright, I'll join the call with you.", ko: "좋아요, 그 통화에 같이 들어갈게요." } },
            { en: "Yes, I think they will be angry.", grade: 1,
              feedback: "상황만 되풀이하고 대응 방안이 없습니다.",
              reply: { en: "So how do we handle it?", ko: "그래서 어떻게 대처하죠?" } },
            { en: "That's not my problem. Sales promised the demo date.", grade: 0,
              feedback: "'내 문제가 아니다'는 비즈니스에서 가장 피해야 할 말 중 하나입니다.",
              reply: { en: "It's everyone's problem now.", ko: "이제 모두의 문제예요." } }
          ]
        },
        {
          s: 'W', skill: 'lead',
          en: "Okay. When can I get a revised schedule?",
          ko: "좋아요. 수정된 일정은 언제 받을 수 있죠?",
          choices: [
            { en: "I'll send you a revised schedule by Wednesday, along with a risk analysis.", grade: 2,
              feedback: "명확한 기한과 산출물을 약속했습니다.",
              reply: { en: "Good. Thanks for being upfront about this.", ko: "좋아요. 솔직하게 말해 줘서 고마워요." } },
            { en: "As soon as possible.", grade: 1,
              feedback: "'ASAP'은 구체적인 기한이 아니어서 다시 질문받기 쉽습니다.",
              reply: { en: "Give me an actual date, please.", ko: "정확한 날짜를 주세요." } },
            { en: "I'm not sure. Maybe next month?", grade: 0,
              feedback: "불확실한 답변은 신뢰를 더 떨어뜨립니다.",
              reply: { en: "That's not acceptable. I need it this week.", ko: "그건 곤란해요. 이번 주 안에 필요해요." } }
          ]
        }
      ]
    },
    {
      id: 'team-conflict',
      icon: '⚡',
      title: '의견이 충돌하는 팀 회의 진행',
      track: 'discussion',
      level: '중급',
      brief: '마케팅 예산을 두고 두 팀원이 정면으로 부딪혔습니다. 진행자로서 감정을 가라앉히고 결론까지 이끄세요.',
      you: '회의 진행자',
      roles: { J: 'Jake (팀원)', M: 'Mina (팀원)' },
      steps: [
        {
          s: 'J', skill: 'lead',
          en: "I think we should cut the marketing budget. It's not working.",
          ko: "마케팅 예산을 줄여야 한다고 생각해요. 효과가 없어요.",
          choices: [
            { en: "Thanks, Jake. Before we decide, I'd like to hear from everyone. Mina, what are your thoughts?", grade: 2,
              feedback: "한 사람의 의견에 끌려가지 않고 다른 사람의 의견을 직접 구했습니다.",
              reply: { s: 'M', en: "Honestly, I disagree. The campaign just started.", ko: "솔직히 저는 반대예요. 캠페인이 막 시작했잖아요." } },
            { en: "Hmm. Does anyone have other opinions?", grade: 1,
              feedback: "나쁘지 않지만, 특정인에게 직접 물으면 논의가 더 활발해집니다.",
              reply: { s: 'M', en: "Well, I'm not sure it's the right time to cut it.", ko: "글쎄요, 지금 줄일 때인지는 잘 모르겠어요." } },
            { en: "Okay, good idea. Let's cut it.", grade: 0,
              feedback: "다른 의견을 듣지 않고 바로 결정하면 팀원들의 참여가 줄어듭니다.",
              reply: { s: 'M', en: "Wait, don't I get a say in this?", ko: "잠깐만요, 저는 의견 낼 기회도 없나요?" } }
          ]
        },
        {
          s: 'J', skill: 'polite',
          en: "Mina, that's ridiculous. The numbers are terrible!",
          ko: "미나 씨, 말도 안 돼요. 숫자가 형편없잖아요!",
          choices: [
            { en: "Jake, let's keep it constructive. Mina, could you explain your view on the numbers?", grade: 2,
              feedback: "감정을 가라앉히고 건설적인 방향으로 대화를 돌렸습니다.",
              reply: { s: 'M', en: "Sure. Let me explain.", ko: "네, 설명할게요." } },
            { en: "Okay, calm down, both of you.", grade: 1,
              feedback: "분위기는 진정시키지만 다소 위에서 내려다보는 말투입니다.",
              reply: { s: 'J', en: "I'm calm. I'm just frustrated.", ko: "저 침착해요. 그냥 답답할 뿐이에요." } },
            { en: "Jake, you're being rude.", grade: 0,
              feedback: "공개적으로 비난하면 상대가 방어적으로 변합니다.",
              reply: { s: 'J', en: "I'm just being honest!", ko: "저는 솔직하게 말한 것뿐이에요!" } }
          ]
        },
        {
          s: 'M', skill: 'clear',
          en: "The campaign needs at least three months to show results. We're only in week five.",
          ko: "캠페인 효과가 나타나려면 최소 3개월이 필요해요. 지금은 겨우 5주 차예요.",
          choices: [
            { en: "So, what you're saying is that it's too early to judge the results?", grade: 2,
              feedback: "상대의 말을 요약해 모두가 같은 이해를 갖게 했습니다.",
              reply: { s: 'M', en: "Exactly.", ko: "바로 그거예요." } },
            { en: "I see.", grade: 1,
              feedback: "듣고 있다는 신호지만, 논점을 정리해 주면 더 좋습니다.",
              reply: { s: 'J', en: "But we can't just wait and lose money.", ko: "그렇다고 그냥 기다리며 돈을 잃을 순 없어요." } },
            { en: "Three months is too long. No.", grade: 0,
              feedback: "진행자가 한쪽 편을 들면 공정성을 잃습니다.",
              reply: { s: 'M', en: "Then why did we approve the plan?", ko: "그럼 그 계획은 왜 승인했죠?" } }
          ]
        },
        {
          s: 'J', skill: 'lead',
          en: "But we can't keep spending money without results.",
          ko: "하지만 결과 없이 계속 돈을 쓸 수는 없어요.",
          choices: [
            { en: "You both have good points. What if we continue the campaign for one more month with clear targets?", grade: 2,
              feedback: "양측의 의견을 인정하고 절충안을 제시했습니다.",
              reply: { s: 'J', en: "That sounds fair, as long as we have clear numbers.", ko: "명확한 수치만 있다면 공정한 것 같네요." } },
            { en: "Let's vote on it.", grade: 1,
              feedback: "투표도 방법이지만, 먼저 절충안을 찾으면 갈등이 줄어듭니다.",
              reply: { s: 'M', en: "A vote won't solve the real problem.", ko: "투표로는 진짜 문제가 해결되지 않아요." } },
            { en: "Let's stop talking about this. It's going nowhere.", grade: 0,
              feedback: "논의를 일방적으로 끊으면 갈등이 해결되지 않고 남습니다.",
              reply: { s: 'J', en: "So nothing is decided? Great.", ko: "그럼 아무것도 결정 안 된 거네요? 좋네요." } }
          ]
        },
        {
          s: 'M', skill: 'clear',
          en: "So, what are the next steps?",
          ko: "그럼 다음 단계는 뭔가요?",
          choices: [
            { en: "Mina will set the targets by Friday, and Jake will track weekly spending. Let's review it next month.", grade: 2,
              feedback: "담당자, 업무, 기한을 명확히 정리했습니다.",
              reply: { s: 'J', en: "Works for me.", ko: "저는 좋아요." } },
            { en: "Let's all think about it more.", grade: 1,
              feedback: "모호한 마무리는 같은 회의를 반복하게 만듭니다.",
              reply: { s: 'M', en: "Think about what, exactly?", ko: "정확히 뭘 생각하자는 거죠?" } },
            { en: "I'll decide later and tell you.", grade: 0,
              feedback: "함께 논의한 내용을 혼자 결정하겠다고 하면 참여 의욕이 떨어집니다.",
              reply: { s: 'J', en: "Then why did we have this meeting?", ko: "그럼 이 회의는 왜 한 거죠?" } }
          ]
        }
      ]
    },
    {
      id: 'design-review-defense',
      icon: '🏗️',
      title: '설계 검토에서 수석 아키텍트의 반론 대응',
      track: 'engineering',
      level: '고급',
      brief: '내가 설계한 시스템을 검토하는 자리입니다. 수석 아키텍트가 구조, 장애 대응, 검증 계획을 날카롭게 파고듭니다. 근거와 수치로 설득하세요.',
      you: '설계 담당 엔지니어',
      roles: { N: 'Dr. Novak (수석 아키텍트)' },
      steps: [
        {
          s: 'N', skill: 'clear',
          en: "So, why did you choose a microservices architecture for this project?",
          ko: "이 프로젝트에 왜 마이크로서비스 아키텍처를 선택했나요?",
          choices: [
            { en: "The main reason is scalability. Each service can scale independently as traffic grows.", grade: 2,
              feedback: "결론(확장성)을 먼저 말하고 기술적 근거를 덧붙였습니다.",
              reply: { en: "Fair enough. But doesn't it add a lot of complexity?", ko: "일리 있네요. 하지만 복잡도가 많이 늘지 않나요?" } },
            { en: "Because it's popular these days and many companies use it.", grade: 1,
              feedback: "유행은 기술적 근거가 아닙니다. 요구사항과 연결해 설명하세요.",
              reply: { en: "Popularity isn't a technical reason.", ko: "인기는 기술적 이유가 아니에요." } },
            { en: "I just thought it was better.", grade: 0,
              feedback: "근거 없는 답변은 설계 검토에서 신뢰를 잃습니다.",
              reply: { en: "That's not very convincing.", ko: "그다지 설득력이 없네요." } }
          ]
        },
        {
          s: 'N', skill: 'polite',
          en: "Honestly, I think this design is over-engineered.",
          ko: "솔직히 이 설계는 필요 이상으로 복잡하다고 생각해요.",
          choices: [
            { en: "I see where you're coming from. Which parts do you think we could simplify?", grade: 2,
              feedback: "비판을 인정하고 구체적인 피드백을 요청했습니다.",
              reply: { en: "The message queue, for a start.", ko: "우선 메시지 큐부터요." } },
            { en: "I don't think so. It's fine.", grade: 1,
              feedback: "방어적으로 들립니다. 상대의 근거를 먼저 물어보세요.",
              reply: { en: "Well, let me explain why I disagree.", ko: "그럼 제가 왜 동의하지 않는지 설명하죠." } },
            { en: "You don't understand the design.", grade: 0,
              feedback: "상대의 이해력을 문제 삼으면 논의가 감정싸움이 됩니다.",
              reply: { en: "I've been designing systems for twenty years.", ko: "저는 20년 동안 시스템을 설계해 왔어요." } }
          ]
        },
        {
          s: 'N', skill: 'clear',
          en: "What happens if the message queue goes down?",
          ko: "메시지 큐가 다운되면 어떻게 되죠?",
          choices: [
            { en: "Good question. We have a failover setup, so a backup queue takes over within 30 seconds.", grade: 2,
              feedback: "장애 대응책을 구체적인 수치와 함께 명확하게 설명했습니다.",
              reply: { en: "Has that failover been tested?", ko: "그 페일오버는 테스트해 봤나요?" } },
            { en: "It should be okay, I think.", grade: 1,
              feedback: "추측성 답변은 리스크를 숨기는 것처럼 들립니다.",
              reply: { en: "'Should be' isn't good enough.", ko: "'괜찮을 것 같다'로는 부족해요." } },
            { en: "That will never happen.", grade: 0,
              feedback: "엔지니어링에서 '절대'는 금물입니다. 장애 시나리오에는 대비책을 제시하세요.",
              reply: { en: "Everything fails eventually.", ko: "모든 건 언젠가 고장 나요." } }
          ]
        },
        {
          s: 'N', skill: 'lead',
          en: "Has any of this been tested under real conditions?",
          ko: "이 중에 실제 조건에서 테스트해 본 게 있나요?",
          choices: [
            { en: "Not yet. I'll run a load test this week and share the results by Friday.", grade: 2,
              feedback: "부족한 점을 인정하고 검증 계획과 기한을 제시했습니다.",
              reply: { en: "Good. That's what I wanted to hear.", ko: "좋아요. 그 말을 듣고 싶었어요." } },
            { en: "Not yet, but we will test it sometime.", grade: 1,
              feedback: "'언젠가'는 계획이 아닙니다. 구체적인 일정을 말하세요.",
              reply: { en: "When exactly?", ko: "정확히 언제요?" } },
            { en: "Testing is the QA team's job.", grade: 0,
              feedback: "책임을 다른 팀에 넘기면 설계 담당자로서 신뢰를 잃습니다.",
              reply: { en: "You own this design, so you own the risk.", ko: "이 설계의 책임자니까 리스크도 당신 몫이에요." } }
          ]
        },
        {
          s: 'N', skill: 'lead',
          en: "Okay. So, what are the next steps?",
          ko: "좋아요. 그럼 다음 단계는요?",
          choices: [
            { en: "I'll simplify the queue design, run the load test, and update the design document before the next review.", grade: 2,
              feedback: "피드백 반영 사항과 다음 검토 전까지 할 일을 명확히 정리했습니다.",
              reply: { en: "Sounds like a plan. Good work.", ko: "좋은 계획이네요. 수고했어요." } },
            { en: "I'll think about your feedback.", grade: 1,
              feedback: "무엇을 바꿀지 구체적으로 말해야 합니다.",
              reply: { en: "Please be more specific next time.", ko: "다음에는 좀 더 구체적으로 말해 주세요." } },
            { en: "I think we can just go ahead as planned.", grade: 0,
              feedback: "검토에서 나온 지적을 무시하면 다음 회의가 더 어려워집니다.",
              reply: { en: "Not until these issues are resolved.", ko: "이 문제들이 해결되기 전에는 안 돼요." } }
          ]
        }
      ]
    },
    {
      id: 'spec-deviation',
      icon: '📐',
      title: '고객에게 공차 이탈 문제 설명하기',
      track: 'eng-deep',
      level: '고급',
      brief: '납품한 부품 일부가 공차를 벗어났습니다. 고객사 품질 담당자에게 데이터로 원인과 대책을 설명하고 신뢰를 지키세요.',
      you: '공급사 품질 엔지니어',
      roles: { T: 'Mr. Tanaka (고객사 품질 담당)' },
      steps: [
        {
          s: 'T', skill: 'clear',
          en: "We measured your last shipment. Some parts are out of tolerance. What happened?",
          ko: "지난 납품분을 측정해 보니 일부 부품이 공차를 벗어났어요. 무슨 일이죠?",
          choices: [
            { en: "Thank you for flagging this. About 3% of the parts exceed the tolerance by up to 0.02 millimeters.", grade: 2,
              feedback: "먼저 알려 준 것에 감사하고, 불량 비율과 편차를 수치로 정확히 말했습니다.",
              reply: { en: "Three percent is too high for us. What's the cause?", ko: "3%는 저희에겐 너무 높아요. 원인이 뭔가요?" } },
            { en: "Some parts are a little bit wrong, I think.", grade: 1,
              feedback: "'조금'은 엔지니어링 대화에서 정보가 없습니다. 비율과 수치로 말하세요.",
              reply: { en: "How many, and by how much?", ko: "몇 개가, 얼마나요?" } },
            { en: "Our measurements show everything is fine.", grade: 0,
              feedback: "고객의 데이터를 근거 없이 부정하면 신뢰를 잃습니다.",
              reply: { en: "Then why do our numbers say otherwise?", ko: "그럼 왜 저희 수치는 다르게 나오죠?" } }
          ]
        },
        {
          s: 'T', skill: 'clear',
          en: "What's the root cause?",
          ko: "근본 원인은 뭔가요?",
          choices: [
            { en: "A cutting tool wore out faster than expected, and our tool replacement schedule didn't catch it.", grade: 2,
              feedback: "기술적 원인(공구 마모)과 관리상의 허점(교체 주기)을 함께 설명했습니다.",
              reply: { en: "I see. So it's a process issue as well.", ko: "그렇군요. 공정 관리 문제이기도 하네요." } },
            { en: "Maybe the machine had a problem.", grade: 1,
              feedback: "추측은 원인 분석이 아닙니다. 확인된 사실을 말하세요.",
              reply: { en: "'Maybe' isn't good enough. Did you check?", ko: "'아마'로는 부족해요. 확인은 해 봤나요?" } },
            { en: "Your inspection gauge might be wrong.", grade: 0,
              feedback: "확인 없이 고객의 측정 장비를 의심하면 관계가 나빠집니다.",
              reply: { en: "Our gauge was calibrated last week.", ko: "저희 측정기는 지난주에 교정했어요." } }
          ]
        },
        {
          s: 'T', skill: 'lead',
          en: "What are you going to do about the parts we already have?",
          ko: "이미 받은 부품은 어떻게 하실 건가요?",
          choices: [
            { en: "We'll ship replacement parts this week and cover the cost of sorting your current stock.", grade: 2,
              feedback: "고객 손실을 줄이는 구체적인 조치와 일정을 먼저 제시했습니다.",
              reply: { en: "That would help a lot.", ko: "그러면 많이 도움이 되겠어요." } },
            { en: "You can send them back if you want.", grade: 1,
              feedback: "책임 있는 대응이라기보다 고객에게 일을 떠넘기는 말로 들립니다.",
              reply: { en: "That puts all the work on us.", ko: "그러면 일은 전부 저희가 하게 되네요." } },
            { en: "They're only slightly out of tolerance, so you can still use them.", grade: 0,
              feedback: "공차를 벗어난 부품 사용을 권하면 품질·안전 문제로 번질 수 있습니다. 판단은 고객이 합니다.",
              reply: { en: "That's not your decision to make.", ko: "그건 그쪽이 결정할 일이 아니에요." } }
          ]
        },
        {
          s: 'T', skill: 'polite',
          en: "This is the second quality issue this year. We're losing confidence.",
          ko: "올해 두 번째 품질 문제예요. 신뢰가 떨어지고 있어요.",
          choices: [
            { en: "I completely understand, and I apologize. We take this very seriously.", grade: 2,
              feedback: "상대의 우려를 인정하고 변명 없이 사과했습니다.",
              reply: { en: "Thank you. What will be different this time?", ko: "고마워요. 이번엔 무엇이 달라지나요?" } },
            { en: "Sorry, but problems happen sometimes.", grade: 1,
              feedback: "사과 뒤에 변명을 붙이면 사과의 효과가 사라집니다.",
              reply: { en: "That's not very reassuring.", ko: "별로 안심이 안 되네요." } },
            { en: "The first issue was not our fault.", grade: 0,
              feedback: "지난 문제를 따지는 것은 지금의 신뢰 회복에 도움이 되지 않습니다.",
              reply: { en: "We're talking about now.", ko: "지금 이야기를 하는 거예요." } }
          ]
        },
        {
          s: 'T', skill: 'lead',
          en: "What will you change to prevent this from happening again?",
          ko: "재발 방지를 위해 무엇을 바꾸실 건가요?",
          choices: [
            { en: "We'll shorten the tool replacement cycle, add in-line measurement, and share weekly SPC charts with you.", grade: 2,
              feedback: "측정 가능한 시정 조치와 데이터 공유(SPC = 통계적 공정 관리)를 약속했습니다.",
              reply: { en: "That's exactly what we need. Thank you.", ko: "바로 그게 저희가 원하던 거예요. 감사합니다." } },
            { en: "We'll be more careful from now on.", grade: 1,
              feedback: "'더 조심하겠다'는 확인할 수 없는 약속입니다. 무엇을 바꿀지 구체적으로 말하세요.",
              reply: { en: "Careful how, exactly?", ko: "정확히 어떻게 조심한다는 거죠?" } },
            { en: "It shouldn't happen again.", grade: 0,
              feedback: "근거 없는 약속은 신뢰를 회복하지 못합니다.",
              reply: { en: "You said that last time.", ko: "지난번에도 그렇게 말했어요." } }
          ]
        }
      ]
    },
    {
      id: 'hvac-hot-complaint',
      icon: '🥵',
      title: '준공 후 "너무 덥다" 건축주 민원 대응',
      track: 'hvac-field',
      level: '중급',
      brief: '입주 한 달 뒤, 서쪽 사무실이 매일 오후 너무 덥다는 민원이 들어왔습니다. 시설 책임자에게 데이터로 원인을 설명하고 비용이 적은 해결책과 검증 방법을 제시하세요.',
      you: 'HVAC 엔지니어 (시공·유지보수 측)',
      roles: { G: 'Ms. Grant (건물주 시설 책임자)' },
      steps: [
        {
          s: 'G', skill: 'polite',
          en: "Since we moved in, the west-side offices are way too hot every afternoon. This is unacceptable.",
          ko: "입주한 뒤로 서쪽 사무실이 매일 오후 너무 더워요. 받아들일 수 없어요.",
          choices: [
            { en: "I'm sorry for the discomfort. Let's find the cause together. Which rooms are affected, and when does it usually start?", grade: 2,
              feedback: "불편에 공감하고, 원인 파악에 필요한 정보(위치·시간대)를 구체적으로 물었습니다.",
              reply: { en: "Mostly rooms 410 to 415, from around 2 p.m.", ko: "주로 410호부터 415호까지, 오후 2시쯤부터요." } },
            { en: "Okay, we'll check the system.", grade: 1,
              feedback: "무난하지만 불편을 인정하는 말과 구체적인 질문이 빠졌습니다.",
              reply: { en: "You said that last week, too.", ko: "지난주에도 그렇게 말했잖아요." } },
            { en: "The system was designed correctly, so it shouldn't be hot.", grade: 0,
              feedback: "데이터를 확인하기 전에 설계만 근거로 반박하면 고객은 무시당한다고 느낍니다.",
              reply: { en: "Then come up and feel it yourself.", ko: "그럼 직접 올라와서 느껴 보세요." } }
          ]
        },
        {
          s: 'G', skill: 'clear',
          en: "So, what's causing it?",
          ko: "그래서 원인이 뭔가요?",
          choices: [
            { en: "The BMS trend data shows the west-side VAV boxes are already at maximum airflow, but they still can't keep up with the afternoon solar heat gain.", grade: 2,
              feedback: "트렌드 데이터와 공학적 원인(오후 일사 부하)을 연결해 명확하게 설명했습니다.",
              reply: { en: "So the system isn't big enough?", ko: "그럼 시스템 용량이 작다는 건가요?" } },
            { en: "It's probably the sun, I think.", grade: 1,
              feedback: "방향은 맞지만 근거 없는 추측처럼 들립니다. 데이터를 함께 말하세요.",
              reply: { en: "Probably? Don't you know?", ko: "아마요? 모르시는 거예요?" } },
            { en: "Your staff keep opening the windows.", grade: 0,
              feedback: "근거 없이 사용자 탓을 하면 갈등만 커집니다.",
              reply: { en: "That's simply not true.", ko: "전혀 사실이 아니에요." } }
          ]
        },
        {
          s: 'G', skill: 'clear',
          en: "Do we need to replace the units, then?",
          ko: "그럼 장비를 교체해야 하나요?",
          choices: [
            { en: "Not necessarily. The total capacity is fine, but the air isn't balanced. The east side gets more air than it needs, so rebalancing should fix most of it.", grade: 2,
              feedback: "전체 용량 문제와 분배(밸런싱) 문제를 구분해 비용이 적은 해결책을 제시했습니다.",
              reply: { en: "That sounds a lot cheaper. How long will it take?", ko: "훨씬 저렴하겠네요. 얼마나 걸리나요?" } },
            { en: "Maybe. We need to think about it.", grade: 1,
              feedback: "결정을 미루는 답은 불안을 키웁니다. 확인된 사실부터 말하세요.",
              reply: { en: "We can't wait forever.", ko: "마냥 기다릴 수는 없어요." } },
            { en: "Yes, you'll need bigger units.", grade: 0,
              feedback: "원인 분석 없이 장비 교체를 말하면 과도한 비용과 불신을 부릅니다.",
              reply: { en: "That's a huge cost. Are you sure?", ko: "엄청난 비용인데요. 확실해요?" } }
          ]
        },
        {
          s: 'G', skill: 'lead',
          en: "How long will it take?",
          ko: "얼마나 걸리나요?",
          choices: [
            { en: "We'll rebalance the west zones this Saturday, keep solar film as a backup option, and monitor the temperatures for two weeks.", grade: 2,
              feedback: "일정, 대안, 검증 방법까지 포함한 실행 계획을 제시했습니다.",
              reply: { en: "Good. Please keep me updated.", ko: "좋아요. 진행 상황을 계속 알려 주세요." } },
            { en: "As soon as possible.", grade: 1,
              feedback: "구체적인 날짜가 없으면 민원이 다시 들어옵니다.",
              reply: { en: "I need an actual date.", ko: "정확한 날짜가 필요해요." } },
            { en: "It depends on our other projects.", grade: 0,
              feedback: "고객 문제보다 내부 사정을 앞세우는 인상을 줍니다.",
              reply: { en: "This should be your priority.", ko: "이게 우선순위여야죠." } }
          ]
        },
        {
          s: 'G', skill: 'lead',
          en: "And how will we know it's actually fixed?",
          ko: "실제로 해결됐는지는 어떻게 알 수 있죠?",
          choices: [
            { en: "We'll share the BMS trend data every week. If any room stays above 26 degrees during occupied hours, we'll come back and adjust it.", grade: 2,
              feedback: "측정 가능한 합격 기준(재실 시간 26 °C)과 데이터 공유로 신뢰를 회복했습니다.",
              reply: { en: "That's fair. Thank you.", ko: "합리적이네요. 감사합니다." } },
            { en: "Your staff will feel the difference.", grade: 1,
              feedback: "체감만으로는 기준이 모호합니다. 측정 가능한 기준을 제시하세요.",
              reply: { en: "Feelings aren't data.", ko: "느낌은 데이터가 아니에요." } },
            { en: "If nobody complains, it's fixed.", grade: 0,
              feedback: "민원이 없을 때까지 기다리는 것은 수동적인 대응입니다.",
              reply: { en: "That's not how it works.", ko: "그런 식으로는 안 되죠." } }
          ]
        }
      ]
    }
  ];

  if (typeof module === 'object' && module.exports) module.exports = SCENARIOS;
  else root.SCENARIOS = SCENARIOS;
})(this);
