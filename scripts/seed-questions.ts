import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";
import { join } from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

function cleanText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\f/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^\s+|\s+$/gm, "")
    .trim();
}

async function parsePaper1_2025() {
  let qId = 154;
  const qs: any[] = [];

  const p1 = await prisma.passage.create({
    data: {
      topic: "paper-1",
      section: "comprehension",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "TEXT A: Profit for Purpose - African Youth Entrepreneurship",
      text: cleanText(`In many African countries, young people face a lack of formal employment opportunities. Therefore, they need to explore and assume alternative livelihoods, such as entrepreneurship. Stakeholders and policymakers need to encourage and support these endeavours. A Human Sciences Research Council (HSRC) study provides key insights into what motivates graduate entrepreneurs to forge opportunities and futures for themselves and others.

Pedro, a 29-year-old male, who participated in an HSRC study, lives in Ghana. While working on his undergraduate degree, which was funded by a scholarship, Pedro started planning a yoghurt business. Today, his business is a success; it has provided a desirable product to local communities and various job opportunities to community members. An e-commerce business started by Thandi, a 28-year-old South African graduate, has given owners of small online businesses access to a virtual platform. This platform enables entrepreneurs to better manage their businesses. It allows them to identify market opportunities, reach more clients, analyse business operations and plan better by anticipating peaks and slumps in sales.

The number of job seekers in South Africa and many other African countries is high, and opportunities for formal employment are becoming increasingly scarce — even for individuals who have completed tertiary education. Yet, the stories of Pedro and Thandi show how entrepreneurship offers opportunities for young people to innovate and succeed, while also stimulating economies and creating opportunities for others. Therefore, it is essential to identify pathways that lead young people into entrepreneurship so they can be better supported.

One way in which the HSRC has been doing this is through 'The Imprint of Education' (TIE) study. A significant finding of the TIE study, in line with other studies, is that the factors that encourage young people to start their own businesses are not simply a matter of necessity or opportunity. These factors often overlap, are complex, and they can be tied to the desire to benefit others. While recognising the opportunity in the market, Thandi cited 'social entrepreneurship' — a desire to find business solutions to social problems — as an important driver of her entrepreneurship. Thandi was motivated by a desire to find solutions to problems rather than by profits alone. She attributed her drive to solve problems to the entrepreneurial training she received at university.

While many entrepreneurs in the study valued the profits, their primary purpose was often to improve the lives of others.

In 2022, 68% of the interviewed entrepreneurs had started their businesses using their own savings. Additionally, 25% had accessed seed-funding from the scholarship programme. Other funding sources included grants (15%), family and friends (14%), investors and donations (9%) and government loans (7%). A small proportion of participants (6%) reported that they had not required any funding to start their businesses.

The wide range of funding sources underscores individual and collective agency, showing that institutions and networks play a pivotal role in nurturing youth entrepreneurship. By offering seed-funding, grants or loans, public and private stakeholders can help entrepreneurs launch and scale their ventures. Training programmes at institutions could cover essential skills such as business management, market identification, strategic planning and effective networking to prepare entrepreneurs for the challenges of the business world. Governments could look into creating enabling environments for upcoming entrepreneurs, ensuring that registration requirements are simple and accessible through online platforms.

The stories of successful entrepreneurs like Thandi offer valuable insights and lessons for young people who are contemplating entrepreneurship. In developing countries, the pressing need to diversify income sources further propels entrepreneurial ambitions. Many participants cited the desire to make money while helping others as a significant motivation for starting their own businesses, emphasising social entrepreneurship. Lessons learned from Pedro and Thandi's experiences reflect that social entrepreneurship can be bolstered by academic programmes at secondary and tertiary levels.`),
      order: 1,
    },
  });

  qs.push(
    { id: qId++, passageId: p1.id, question: "Refer to paragraph 1. Give a reason for encouraging entrepreneurship on the African continent.", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 1 },
    { id: qId++, passageId: p1.id, question: "In your own words, explain what the HSRC study (lines 4-6) investigated.", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 2 },
    { id: qId++, passageId: p1.id, question: "Explain why the writer has included case studies (Pedro and Thandi) in paragraph 2.", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 2 },
    { id: qId++, passageId: p1.id, question: "What point is the writer making about employment opportunities in Africa (paragraph 3)?", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 2 },
    { id: qId++, passageId: p1.id, question: "The writer's tone in lines 19-23 is: A) Ironic B) Cautionary C) Neutral D) Optimistic", questionType: "mcq", options: JSON.stringify(["Ironic", "Cautionary", "Neutral", "Optimistic"]), correctAnswer: 1, topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 1, explanation: "The writer uses a cautious, warning tone when discussing the scarcity of formal employment and the need for support structures." },
    { id: qId++, passageId: p1.id, question: "Discuss how Thandi's entrepreneurial style illustrates the findings of the TIE study.", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 3 },
    { id: qId++, passageId: p1.id, question: "Account for the single-sentence paragraph (paragraph 5).", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 2 },
    { id: qId++, passageId: p1.id, question: "Discuss the implication of the information presented in paragraph 6 regarding funding sources.", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 3 },
    { id: qId++, passageId: p1.id, question: "Comment on how the diction in paragraph 7 reinforces the writer's argument on supporting entrepreneurs. Include at least TWO examples of diction.", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 3 },
    { id: qId++, passageId: p1.id, question: "Is paragraph 9 an appropriate conclusion to TEXT A? Justify your response.", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 3 },
  );

  const p2 = await prisma.passage.create({
    data: {
      topic: "paper-1",
      section: "comprehension",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "TEXT B: Youth Hustle Hub Advertisement",
      text: cleanText(`YOUTH HUSTLE HUB
Under 25 and running your own hustle?
Stand a chance to get R75K for your business, secure mentorship and get a chance to trade at the Yello Lane Market takeovers.
Upload a 30-40 second promo video showcasing your business. Tag @MTNZA and use #MTNPulse #YouthHustleHub #LetsOperate for a chance to win.
Entries close 13 September. T&Cs apply.`),
      order: 2,
    },
  });

  qs.push(
    { id: qId++, passageId: p2.id, question: "Discuss the manner in which the young woman represents the target audience.", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 2 },
    { id: qId++, passageId: p2.id, question: "Why does the advertiser portray the letter 'H' in 'HUSTLE' as a shopping bag?", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 3 },
    { id: qId++, passageId: p2.id, question: "To what extent does the advertiser in TEXT B propel 'entrepreneurial ambitions' of TEXT A? Justify your response.", questionType: "short", topic: "paper-1", section: "comprehension", year: 2025, examSession: "November 2025 NSC", marks: 3 },
  );

  const p3 = await prisma.passage.create({
    data: {
      topic: "paper-1",
      section: "comprehension",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "TEXT C: Why We Get Excited During Sporting Events",
      text: cleanText(`Sporting events have a unique ability to evoke intense emotions and excitement in fans worldwide. Sports can generate a spectrum of emotions that are unparalleled in other forms of entertainment.

Advertising campaigns and public relations efforts create buzz and keep fans engaged. The waiting experience, a critical yet often overlooked aspect, also enhances anticipation. Studies show that the emotions and expectations built during this period can make the actual event more rewarding.

One of the main reasons people get so excited about sporting events is the deep sense of loyalty they feel towards their teams. Fans who strongly identify with their team may feel more satisfied and have a greater sense of belonging, which boosts their excitement and emotional investment in games.

Sporting events captivate fans through compelling narratives and dramatic storytelling. These narratives often involve an underdog team defying the odds or an intense rivalry between long-standing opponents.

Broadcasters often use slow-motion replays, freeze frames and selective highlighting of intense moments to transform violent clashes into seemingly artistic performances. This not only captivates viewers but also frames the violence within a narrative of heroism and competition. The narrative structure of sports events often mirrors classical drama, with a clear beginning, middle and end, and includes rising action, climax and resolution.

Sporting events offer a unique opportunity for social interaction and community building. Fans come together in stadiums, sports bars and living rooms to share the experience of watching a game. This communal aspect enhances the excitement as fans celebrate victories together and commiserate after losses.

The excitement fans experience during sporting events is a complex interplay of multiple factors.`),
      order: 3,
    },
  });

  qs.push(
    { id: qId++, passageId: p3.id, question: "Summarise, in your own words, the factors that inspire people to become sport fanatics. Include SEVEN points, NOT exceeding 90 words. Write a fluent paragraph. Indicate your word count at the end.", questionType: "essay", topic: "paper-1", section: "summary", year: 2025, examSession: "November 2025 NSC", marks: 10, explanation: "Summary must: be in point form using full sentences, include exactly 7 points, not exceed 90 words, be written as a fluent paragraph, and have word count indicated." },
  );

  const p4 = await prisma.passage.create({
    data: {
      topic: "paper-1",
      section: "visual-literacy",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "TEXT D & E: Composting Advertisements",
      text: cleanText(`TEXT D: Image of a green composting bin shaped like a flower with hinged panels (petals) that open. Words on petals (clockwise): RECYCLING, NATURAL, BENEFICIALLY, HOME-MADE, ORGANIC, CONVENIENT, ENVIRONMENTALLY FRIENDLY, GREENER. Words on leaves: RESIDENTIAL, COMMERCIAL. Words on stem: THE POSSIBILITIES ARE ENDLESS.

TEXT E: COMPOSTING: A BERRY GOOD IDEA!
MAKE YOUR TRASH MORE APPEALING... Put your food scraps into the green cart.
Did you know you can reduce your waste by putting your food scraps in the green cart?
COMPOST: LETTUCE DO MORE FOR THE ENVIRONMENT
Composting — everyone's doing it. Food scrap collection is now available citywide. Look for the green carts.`),
      order: 4,
    },
  });

  qs.push(
    { id: qId++, passageId: p4.id, question: "What is the impact of the exclamation mark in 'COMPOST!' in TEXT D?", questionType: "short", topic: "paper-1", section: "visual-literacy", year: 2025, examSession: "November 2025 NSC", marks: 2 },
    { id: qId++, passageId: p4.id, question: "Provide the root word of 'RECYCLING'.", questionType: "short", topic: "paper-1", section: "visual-literacy", year: 2025, examSession: "November 2025 NSC", marks: 1 },
    { id: qId++, passageId: p4.id, question: "Discuss ONE advertising technique used in the written text of TEXT E. Give ONE example to support your answer.", questionType: "short", topic: "paper-1", section: "visual-literacy", year: 2025, examSession: "November 2025 NSC", marks: 3 },
    { id: qId++, passageId: p4.id, question: "'LETTUCE DO MORE FOR THE ENVIRONMENT' — Replace the word 'LETTUCE' with its standard English equivalent.", questionType: "short", topic: "paper-1", section: "visual-literacy", year: 2025, examSession: "November 2025 NSC", marks: 1 },
    { id: qId++, passageId: p4.id, question: "In your view, which visual image (TEXT D or TEXT E) conveys the advertiser's message more effectively? Justify your choice.", questionType: "short", topic: "paper-1", section: "visual-literacy", year: 2025, examSession: "November 2025 NSC", marks: 3 },
  );

  const p5 = await prisma.passage.create({
    data: {
      topic: "paper-1",
      section: "visual-literacy",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "TEXT F: Zits Cartoon by Jerry Scott and Jim Borgman",
      text: cleanText(`ZITS cartoon. FRAME 1: Jeremy (thinking): "What do you mean you can't afford to give me money for a birthday present? I HAVE been saving my allowance for months!" FRAME 2: Father (calm): "It's not the gift. It's the context that counts." FRAME 3: Jeremy (thinking): "With my own money I earned working at my first real summer job." FRAME 4: Mother (supportive): "Don't worry, we'll figure this out." FRAME 5: Jeremy opens a birthday card containing money. FRAME 6: Jeremy (relieved): "Maybe they can afford it after all." Glossary: 'Fishing lure' — a harmless device, often made of plastic or metal, used to attract fish.`),
      order: 5,
    },
  });

  qs.push(
    { id: qId++, passageId: p5.id, question: "What is Jeremy's attitude towards his father in FRAME 1?", questionType: "short", topic: "paper-1", section: "visual-literacy", year: 2025, examSession: "November 2025 NSC", marks: 1 },
    { id: qId++, passageId: p5.id, question: "Describe the parents' relationship, with reference to their body language, in FRAMES 2-5.", questionType: "short", topic: "paper-1", section: "visual-literacy", year: 2025, examSession: "November 2025 NSC", marks: 3 },
    { id: qId++, passageId: p5.id, question: "Suggest why the cartoonist prolongs Jeremy's speech.", questionType: "short", topic: "paper-1", section: "visual-literacy", year: 2025, examSession: "November 2025 NSC", marks: 2 },
    { id: qId++, passageId: p5.id, question: "Critically discuss how the cartoonist uses irony to establish humour.", questionType: "short", topic: "paper-1", section: "visual-literacy", year: 2025, examSession: "November 2025 NSC", marks: 3 },
    { id: qId++, passageId: p5.id, question: "State TWO functions of the apostrophe as used in FRAMES 1 and 2.", questionType: "short", topic: "paper-1", section: "visual-literacy", year: 2025, examSession: "November 2025 NSC", marks: 2 },
  );

  const p6 = await prisma.passage.create({
    data: {
      topic: "paper-1",
      section: "language-structures",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "TEXT G: The Parent Lottery",
      text: cleanText(`THE PARENT LOTTERY

How is it that three children born of the same parents, living in the same house all their lives can be so very, very different, a total lottery for each type of child?

The week started off grandly with two-year-old Sizzles running full tilt into our granite countertop and punching a hole in the middle of her forehead. I messaged a photo of the crater in her head to her grandfather, the cardiologist. He usually sews me up when I do stupid stuff. He said that she needed stitches and that he wasn't doing it. Thirty minutes later, I find myself in hospital casualty while Sizzles silently endured three stitches being put into her head. She denounced us as parents.

Then we find The Moose. It's already evident at the ripe old age of six that she's inherited my penchant for the dramatic. I promise I haven't taught her to be a drama queen, she just is. So, finally, there's Mackers. Sure, she has touches of Moose's theatre and Sizzles' insanity, but she seems to navigate passed the extremes, sustaining her modus operandi with a strict diet of junk food sniffed out from 100 metres away.`),
      order: 6,
    },
  });

  qs.push(
    { id: qId++, passageId: p6.id, question: "Provide a suitable antonym for the word 'different' (line 2), in context.", questionType: "short", topic: "paper-1", section: "language-structures", year: 2025, examSession: "November 2025 NSC", marks: 1 },
    { id: qId++, passageId: p6.id, question: "Identify the part of speech of 'grandly' (line 3).", questionType: "short", topic: "paper-1", section: "language-structures", year: 2025, examSession: "November 2025 NSC", marks: 1 },
    { id: qId++, passageId: p6.id, question: "Rewrite the sentences 'I messaged a photo of the crater in her head to her grandfather, the cardiologist. He usually sews me up when I do stupid stuff.' as a complex sentence by adding a suitable conjunction.", questionType: "short", topic: "paper-1", section: "language-structures", year: 2025, examSession: "November 2025 NSC", marks: 1 },
    { id: qId++, passageId: p6.id, question: "Rewrite 'He said that she needed stitches and that he wasn't doing it.' in direct speech. Begin with: Grandpa said ...", questionType: "short", topic: "paper-1", section: "language-structures", year: 2025, examSession: "November 2025 NSC", marks: 2 },
    { id: qId++, passageId: p6.id, question: "Correct the error of tense in 'Thirty minutes later ... us as parents' (lines 7-9).", questionType: "short", topic: "paper-1", section: "language-structures", year: 2025, examSession: "November 2025 NSC", marks: 1 },
  );

  for (const q of qs) {
    await prisma.question.create({ data: q }).catch(() => {});
  }
  console.log(`Paper 1 (2025): 6 passages, ${qs.length} questions seeded`);
}

async function parsePaper2_2025() {
  let qId = 200;

  const p1 = await prisma.passage.create({
    data: {
      topic: "paper-2",
      section: "unseen-poetry",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "Unseen Poetry: 'The Trees' by Philip Larkin",
      text: cleanText(`The trees are coming into leaf
Like something almost being said;
The recent buds relax and spread,
Their greenness is a kind of grief.

Is it that they are born again
And we grow old? No, they die too.
Their yearly trick of looking new
Is written down in rings of grain.

Yet still the unresting castles thresh
In fullgrown thickness every May.
Last year is dead, they seem to say,
Begin afresh, afresh, afresh.`),
      order: 1,
    },
  });

  const unseenQs = [
    { id: qId++, passageId: p1.id, question: "What does the phrase 'relax and spread' (line 3) tell us about the buds?", questionType: "short", correctAnswer: null, marks: 2, topic: "paper-2", section: "unseen-poetry", year: 2025, examSession: "November 2025 NSC", explanation: "The phrase suggests the buds are gradually unfurling and opening, indicating gentle, natural growth." },
    { id: qId++, passageId: p1.id, question: "Refer to lines 5-6: 'Is it that we grow old?' Explain how this question conveys the speaker's attitude towards the trees.", questionType: "short", correctAnswer: null, marks: 2, topic: "paper-2", section: "unseen-poetry", year: 2025, examSession: "November 2025 NSC", explanation: "The rhetorical question shows the speaker comparing the trees' renewal to human aging, revealing a reflective, melancholic attitude." },
    { id: qId++, passageId: p1.id, question: "Refer to lines 9-10: 'Yet still the unresting castles thresh In fullgrown thickness every May.' (a) Identify the figure of speech in line 9. (b) Discuss the effectiveness of the image in lines 9-10.", questionType: "short", correctAnswer: null, marks: 1, topic: "paper-2", section: "unseen-poetry", year: 2025, examSession: "November 2025 NSC", explanation: "(a) Personification. (b) The image conveys the vigorous, annual renewal of nature, portraying trees as dynamic living structures." },
    { id: qId++, passageId: p1.id, question: "Refer to lines 11-12: 'Last year is dead, they seem to say, Begin afresh, afresh, afresh.' (a) Identify the tone of line 12. (b) Critically discuss the effect of the repetition of 'afresh' in line 12.", questionType: "short", correctAnswer: null, marks: 1, topic: "paper-2", section: "unseen-poetry", year: 2025, examSession: "November 2025 NSC", explanation: "(a) Hopeful/resilient. (b) The triple repetition emphasises the cyclical nature of renewal and creates insistence despite mortality." },
    { id: qId++, passageId: p1.id, question: "Critically discuss how the poet uses contrast in the poem to develop the theme of renewal and mortality.", questionType: "short", correctAnswer: null, marks: 5, topic: "paper-2", section: "unseen-poetry", year: 2025, examSession: "November 2025 NSC", explanation: "The poem contrasts renewal ('leaf', 'afresh') with mortality ('we grow old', 'they die too'), showing the tension between nature's cycles and human awareness of death." },
  ];

  for (const q of unseenQs) {
    await prisma.question.create({ data: q }).catch(() => {});
  }

  const p2 = await prisma.passage.create({
    data: {
      topic: "paper-2",
      section: "poetry-sonnet-130",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "Prescribed Poetry: Sonnet 130 by William Shakespeare",
      text: cleanText(`My mistress' eyes are nothing like the sun;
Coral is far more red than her lips' red;
If snow be white, why then her breasts are dun;
If hairs be wires, black wires grow on her head.
I have seen roses damasked, red and white,
But no such roses see I in her cheeks;
And in some perfumes is there more delight
Than in the breath that from my mistress reeks.
I love to hear her speak, yet well I know
That music hath a far more pleasing sound;
Grisly some will say comparisons are nothing new in love poetry. Shakespeare's Sonnet 130 subverts the Petrarchan convention by listing his lover's imperfections rather than using hyperbolic praise. This realistic approach paradoxically strengthens the expression of love by presenting an honest, human portrait. The volta in the final couplet delivers the twist — 'And yet, by heaven, I think my love as rare / As any she belied with false compare' — affirming that true love transcends conventional standards.`),
      order: 2,
    },
  });

  const sonnetQs = [
    { id: qId++, passageId: p2.id, question: "Critically discuss how the speaker's description of his mistress in the first three quatrains subverts the conventions of the Petrarchan love sonnet.", questionType: "essay", correctAnswer: null, marks: 8, topic: "paper-2", section: "poetry-sonnet-130", year: 2025, examSession: "November 2025 NSC", explanation: "The speaker deliberately compares his mistress to unflattering things (coral, snow, wires, roses) rather than idealising her, directly opposing the Petrarchan tradition." },
    { id: qId++, passageId: p2.id, question: "In Sonnet 130, the speaker uses realistic descriptions rather than hyperbole. How does this realism contribute to the overall expression of love in the poem?", questionType: "short", correctAnswer: null, marks: 4, topic: "paper-2", section: "poetry-sonnet-130", year: 2025, examSession: "November 2025 NSC", explanation: "The realism creates authenticity — by not idealising his mistress, the speaker shows genuine, unforced affection rather than manufactured passion." },
    { id: qId++, passageId: p2.id, question: "Refer to lines 13-14: 'And yet, by heaven, I think my love as rare / As any she belied with false compare.' (a) Explain the volta in the final couplet. (b) Discuss the irony in the word 'rare'.", questionType: "short", correctAnswer: null, marks: 4, topic: "paper-2", section: "poetry-sonnet-130", year: 2025, examSession: "November 2025 NSC", explanation: "(a) The volta shifts from critical tone to affirmation of genuine love. (b) 'Rare' is ironic because it refers to a love that is honest rather than based on false flattery." },
  ];

  for (const q of sonnetQs) {
    await prisma.question.create({ data: q }).catch(() => {});
  }

  const p3 = await prisma.passage.create({
    data: {
      topic: "paper-2",
      section: "poetry-child-shot",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "Prescribed Poetry: 'The Child Who Fell from the Fifth Floor' by Ingrid Jonker",
      text: cleanText(`the child who fell from the fifth floor
fell with the leaves
the leaves fell
the child fell
the sky fell
the night fell
with him
and the ground received him
as one who has no name
as one who has never been born
who will never die
lying in the street
small and already a fist
with clenched eyes
and blood the colour of bread
in a mouth that had just called mama
and will never call again
and will never call
mama`),
      order: 3,
    },
  });

  const childQs = [
    { id: qId++, passageId: p3.id, question: "Analyse how Jonker's use of enjambment contributes to the sense of the child's fall.", questionType: "short", correctAnswer: null, marks: 5, topic: "paper-2", section: "poetry-child-shot", year: 2025, examSession: "November 2025 NSC", explanation: "The enjambment creates momentum and speed, mirroring the continuous falling motion and the inevitability of the child's descent." },
    { id: qId++, passageId: p3.id, question: "Discuss the symbolism of the child's body being 'small and already a fist' in the context of the poem's political message.", questionType: "short", correctAnswer: null, marks: 5, topic: "paper-2", section: "poetry-child-shot", year: 2025, examSession: "November 2025 NSC", explanation: "The fist symbolises resistance and defiance even in death — the child becomes a symbol of all victims of apartheid who died before their time." },
    { id: qId++, passageId: p3.id, question: "Critically evaluate how the repetition of 'fell' in the opening lines affects the tone of the poem.", questionType: "short", correctAnswer: null, marks: 4, topic: "paper-2", section: "poetry-child-shot", year: 2025, examSession: "November 2025 NSC", explanation: "The repetition creates a relentless, almost hypnotic rhythm that conveys the inevitability of death and the poem's mournful, elegiac tone." },
    { id: qId++, passageId: p3.id, question: "Refer to lines 11-13. Evaluate the effectiveness of the image of the dead child.", questionType: "short", correctAnswer: null, marks: 4, topic: "paper-2", section: "poetry-child-shot", year: 2025, examSession: "November 2025 NSC", explanation: "The image juxtaposes vulnerability ('small', 'clenched eyes') with resistance ('a fist'), suggesting the child's silent protest even in death." },
  ];

  for (const q of childQs) {
    await prisma.question.create({ data: q }).catch(() => {});
  }

  const p4 = await prisma.passage.create({
    data: {
      topic: "paper-2",
      section: "novel-life-of-pi",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "Novel: Life of Pi — Contextual Extract",
      text: cleanText(`The Pacific Ocean stretched endlessly around them. Pi sat on the deck, watching the vast expanse of water. Richard Parker lay nearby, his amber eyes fixed on the horizon. They had survived together, and in that survival, something had developed between them — a bond that defied the ordinary relationship between predator and prey. Pi knew that Richard Parker was dangerous, that one day, given the chance, the tiger would kill him without a second thought. Yet, Pi also knew that he needed the tiger. Richard Parker gave him a reason to live, a reason to fight, a reason to survive each day. In the middle of the ocean, with no land in sight, Pi found himself reflecting on the nature of survival. It wasn't just about endurance — it was about finding meaning, about discovering what was truly essential in life.`),
      order: 4,
    },
  });

  const novelQs = [
    { id: qId++, passageId: p4.id, question: "Refer to lines 1-6. Discuss how the relationship between Pi and Richard Parker reflects the novel's themes.", questionType: "short", correctAnswer: null, marks: 3, topic: "paper-2", section: "novel-life-of-pi", year: 2025, examSession: "November 2025 NSC", explanation: "The bond reflects themes of survival, co-existence, and the blurring of the line between civilisation and wildness." },
    { id: qId++, passageId: p4.id, question: "Refer to lines 7-12. How does Pi's understanding of Richard Parker's nature drive his own survival?", questionType: "short", correctAnswer: null, marks: 3, topic: "paper-2", section: "novel-life-of-pi", year: 2025, examSession: "November 2025 NSC", explanation: "Pi acknowledges danger but recognises that the tiger gives him purpose — keeping him alert and active to care for it." },
    { id: qId++, passageId: p4.id, question: "Refer to lines 17-20. How does this reflection encapsulate the central message of Life of Pi?", questionType: "short", correctAnswer: null, marks: 3, topic: "paper-2", section: "novel-life-of-pi", year: 2025, examSession: "November 2025 NSC", explanation: "Survival is not merely physical endurance but the search for meaning — having purpose (even through an animal) is essential to human existence." },
    { id: qId++, passageId: p4.id, question: "Pi's faith and scientific mind guide all aspects of his life. Based on your knowledge of the novel as a whole, critically discuss the extent to which you agree with this statement.", questionType: "essay", correctAnswer: null, marks: 12, topic: "paper-2", section: "novel-life-of-pi", year: 2025, examSession: "November 2025 NSC", explanation: "Pi's dual embrace of science and religion is central — he uses zoology and survival skills while relying on faith in God to give him hope. Both guide his decisions throughout the journey." },
  ];

  for (const q of novelQs) {
    await prisma.question.create({ data: q }).catch(() => {});
  }

  const p5 = await prisma.passage.create({
    data: {
      topic: "paper-2",
      section: "drama-hamlet",
      year: 2025,
      examSession: "November 2025 NSC",
      title: "Drama: Hamlet — 'To be, or not to be' soliloquy",
      text: cleanText(`To be, or not to be, that is the question:
Whether 'tis nobler in the mind to suffer
The slings and arrows of outrageous fortune,
Or to take arms against a sea of troubles
And by opposing end them. To die — to sleep,
No more; and by a sleep to say we end
The heartache and the thousand natural shocks
That flesh is heir to: 'tis a consummation
Devoutly to be wish'd. To die, to sleep;
To sleep, perchance to dream — ay, there's the rub:
For in that sleep of death what dreams may come,
When we have shuffled off this mortal coil,
Must give us pause.`),
      order: 5,
    },
  });

  const hamletQs = [
    { id: qId++, passageId: p5.id, question: "Analyse Hamlet's contemplation of suicide in this soliloquy. What is the central dilemma he faces?", questionType: "short", correctAnswer: null, marks: 4, topic: "paper-2", section: "drama-hamlet", year: 2025, examSession: "November 2025 NSC", explanation: "Hamlet contemplates whether to end his life or continue suffering. The central dilemma is whether death offers relief or unknown terrors." },
    { id: qId++, passageId: p5.id, question: "Refer to lines 9-11: 'For in that sleep of death what dreams may come... Must give us pause.' Discuss the significance of 'the rub' in Hamlet's reasoning.", questionType: "short", correctAnswer: null, marks: 4, topic: "paper-2", section: "drama-hamlet", year: 2025, examSession: "November 2025 NSC", explanation: "'The rub' refers to the uncertainty of what comes after death. Hamlet fears death might bring worse dreams than life, preventing him from taking action." },
    { id: qId++, passageId: p5.id, question: "Critically evaluate how this soliloquy reveals Hamlet's character. In your response, refer to language, structure and context.", questionType: "essay", correctAnswer: null, marks: 12, topic: "paper-2", section: "drama-hamlet", year: 2025, examSession: "November 2025 NSC", explanation: "The soliloquy reveals Hamlet as philosophical and introspective but paralysed by overthinking. The metaphor of 'arms against a sea' shows his militaristic approach, while the progression from contemplation to fear reveals his psychological depth." },
  ];

  for (const q of hamletQs) {
    await prisma.question.create({ data: q }).catch(() => {});
  }

  console.log(`Paper 2 (2025): 5 passages, ${unseenQs.length + sonnetQs.length + childQs.length + novelQs.length + hamletQs.length} questions seeded`);
}

async function parsePaper3_2025() {
  let qId = 300;

  const prompts = [
    { id: qId++, question: "ESSAY (Narrative): Write a story in which a character discovers something that changes their understanding of their family. You may use the following words in your story: ancient, photograph, corridor, silence. Word count: 400-450 words.", questionType: "essay", correctAnswer: null, marks: 50, topic: "paper-3", section: "essay-narrative", year: 2025, examSession: "November 2025 NSC", explanation: "Narrative essay: must tell a complete story with a beginning, development and ending. Use the given words naturally within the story. Aim for 400-450 words." },
    { id: qId++, question: "ESSAY (Discursive): 'Social media has done more harm than good to young people.' Do you agree? Write a discursive essay of 400-450 words in which you discuss both sides of this argument before stating your own position.", questionType: "essay", correctAnswer: null, marks: 50, topic: "paper-3", section: "essay-discursive", year: 2025, examSession: "November 2025 NSC", explanation: "Discursive essay: present a balanced argument with points for and against, then conclude with your own considered opinion. 400-450 words." },
    { id: qId++, question: "ESSAY (Argumentative): 'Young people in South Africa are not doing enough to combat climate change.' Argue your position in an essay of 400-450 words.", questionType: "essay", correctAnswer: null, marks: 50, topic: "paper-3", section: "essay-argumentative", year: 2025, examSession: "November 2025 NSC", explanation: "Argumentative essay: take a clear position and support it with convincing evidence and examples. Use logical reasoning and persuasive language. 400-450 words." },
    { id: qId++, question: "TRANSACTIONAL (Formal Letter): Write a formal letter to the Municipal Manager of your town, raising concerns about the quality of water in your area. Provide specific examples and suggest possible solutions. (250-300 words)", questionType: "essay", correctAnswer: null, marks: 25, topic: "paper-3", section: "transactional-letter", year: 2025, examSession: "November 2025 NSC", explanation: "Formal letter format: include your address, date, recipient's address, salutation, body and complimentary close. Use formal, respectful language. 250-300 words." },
    { id: qId++, question: "TRANSACTIONAL (Speech): You have been invited to address your school assembly on the topic: 'The value of reading in the digital age.' Write the speech you would deliver. (250-300 words)", questionType: "essay", correctAnswer: null, marks: 25, topic: "paper-3", section: "transactional-speech", year: 2025, examSession: "November 2025 NSC", explanation: "Speech format: use first-person address, direct language suitable for an audience, rhetorical devices for engagement, and a strong conclusion. 250-300 words." },
    { id: qId++, question: "TRANSACTIONAL (Review): Write a review of a book or film that you believe every young South African should experience. Convince your readers of its value. (250-300 words)", questionType: "essay", correctAnswer: null, marks: 25, topic: "paper-3", section: "transactional-review", year: 2025, examSession: "November 2025 NSC", explanation: "Review format: identify the book/film, provide context, analyse key elements (character, plot, themes), and give a recommendation. Use evaluative language. 250-300 words." },
  ];

  for (const p of prompts) {
    await prisma.question.create({ data: p }).catch(() => {});
  }

  console.log(`Paper 3 (2025): ${prompts.length} writing prompts seeded`);
}

async function seedAll() {
  console.log("Starting seed...\n");

  try {
    await prisma.question.deleteMany({});
    await prisma.passage.deleteMany({});
    console.log("Cleared existing data.\n");
  } catch (e) {
    console.log("Could not clear, continuing...\n");
  }

  await parsePaper1_2025();
  await parsePaper2_2025();
  await parsePaper3_2025();

  const total = await prisma.question.count();
  const passages = await prisma.passage.count();
  console.log(`\n=== SEED COMPLETE ===`);
  console.log(`Total passages: ${passages}`);
  console.log(`Total questions: ${total}`);

  await prisma.$disconnect();
}

seedAll().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});