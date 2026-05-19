import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

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

type QData = {
  question: string;
  questionType: string;
  options: string[];
  correctAnswer: number | null;
  explanation: string;
  marks: number;
  topic: string;
  section: string;
  year: number;
  examSession: string;
};

type PassageData = {
  title: string;
  text: string;
  section: string;
  questions: QData[];
};

function makeQ(
  q: string,
  qt: string,
  opts: string[],
  ca: number | null,
  exp: string,
  marks: number,
  topic: string,
  section: string,
  year: number
): QData {
  return { question: q, questionType: qt, options: opts, correctAnswer: ca, explanation: exp, marks, topic, section, year, examSession: `November ${year} NSC` };
}

async function seedPassage(
  passageTitle: string,
  passageText: string,
  section: string,
  topic: string,
  year: number,
  questions: QData[]
) {
  const p = await prisma.passage.create({
    data: { topic, section, year, examSession: `November ${year} NSC`, title: passageTitle, text: cleanText(passageText), order: 1 },
  });
  for (const q of questions) {
    await prisma.question.create({ data: { ...q, passageId: p.id } }).catch(() => {});
  }
  return p;
}

async function seedQuestion(q: QData) {
  await prisma.question.create({ data: q }).catch(() => {});
}

// ── PAPER 1: 2024 ──────────────────────────────────────────────────────────────
async function seedP1_2024() {
  const pA = await prisma.passage.create({ data: { topic: "paper-1", section: "comprehension", year: 2024, examSession: "November 2024 NSC", title: "TEXT A: The Era of Instant Gratification", text: cleanText(`The modern world has devalued genuineness in social settings. — David Seybert

1 The youngest of our generations today have grown up in a world where too many things are easy: fast food, fast cars, fast technology, you name it ... People of this generation are still dependent on their parents, but after they achieve maturity, there is the temptation for continued dependency upon technology, especially socially. When we were young, we depended on our parents for different things, such as interactions with adults, or writing a thank you card to a relative. From these experiences, we grew, and, eventually, we became skilled enough to do this independently, and even to teach one another.

2 Now, in social settings, there is the option to depend on technology. This could be the looking up of an e-mail template to express thanks for a job offer, or it could be interacting with recruiters over social networking sites. This option has caused an overall dip in social adeptness. The mentality of quick and easy options has become so ingrained in the younger generations that the value of genuine 'socialness' has been whittled away.

3 Many people today confuse the terms 'time' and 'effort'. I have heard many a time that people 'do not have time' to do something, when they actually do not want to make the extra effort, like writing a professional e-mail to a professor instead of an informal one-line demand. I have heard many a time, 'I only have a second to do this' or 'I need to do other things; I don't have time to spare for this'. This is a symptom of the quick and easy mentality because by allocating limited time to this task, you are removing all value and importance from it.

4 This era — which has been titled the 'era of instant gratification' — has caused different parasites to develop in our social world such as shallow friendships, phone-on-the-table syndrome and technological dependency. However, the most significant deficit is the lack of social genuineness. What should be explained about our current society are the reasons why this society has produced these results.

Having grown up in the core of this era, it is very difficult to step outside of the issue and view its development. Why have we lost all connection to the standards, values and mannerisms of the age before us? This is a question that we can answer individually and as a society. Is it because the age of technology has caused us to become pretentious and to discredit the opinions of our less technologically-savvy ancestors? Is it because we have humanised material things and given them greater power and influence than our elders? Or is it simply because we seek to continue the human race's progress on its road to greater efficiency? These questions are key points to reflect upon in our individual lives.

This era is nothing more complex than a trial of human nature. We are being tested on how we will choose to live when offered an easy road at almost every point in life. I have interacted with my peers who have no ability whatsoever to understand why they would do something 'unnecessary'. If we live our lives only doing the things that are necessary, are we truly living? That is just following a formula. However, these unnecessary things fuel our passion, commitment, creativity and innovation. These virtues have been lost in many of the people today. It can be said that it is completely unnecessary to go out of your way to walk someone to class, but does that make it useless? To you, it has no direct, concrete use, but to the recipient, the gesture is immensely powerful.

The unnecessary things show true genuineness in your human connections. Simple nuances such as eye contact, active listening, and kind mannerisms are becoming scarcer as our era of instant gratification tears through our core values. It takes a great amount of maturity and awareness to accept this fact and an even greater level of strength to take the steps towards restoring value to the facets of life that make us human, while using technology in moderation.

We should not feel ashamed about a single thing mentioned in this article. These social issues are not something we should be faulted for, yet we should take responsibility for them. It is simply information, and we can choose to do with it what we want. The youngest generations of this era have been dealt a poor hand. Growing up in the technological age has conditioned them to do many of these things; these are not conscious choices. It is our responsibility to resist the influences of this era of instant gratification and discover true independence as human beings. This is how we can recreate value.`), order: 1 } });

  const pB = await prisma.passage.create({ data: { topic: "paper-1", section: "comprehension", year: 2024, examSession: "November 2024 NSC", title: "TEXT B: Instant Gratification Cartoon", text: cleanText(`[FRAME 1] INSTANT MASHED POTATOES, MINUTE RICE, MICROWAVABLE MEALS, DIGITAL CAMERAS, INSTANT FAXES, EMAIL, ONLINE NEWS SOURCES...

[FRAME 2] INSTANT GRATIFICATION...

[FRAME 3] WHO HAS TIME FOR PATIENCE?

[FRAME 4] CAN'T YOU GO ANY FASTER?

Source: madisonjournal.com

Glossary: CAB (FRAME 4): Americanism for taxi.`), order: 2 } });

  const pC = await prisma.passage.create({ data: { topic: "paper-1", section: "summary", year: 2024, examSession: "November 2024 NSC", title: "TEXT C: Happiness vs Contentment", text: cleanText(`HAPPINESS VERSUS CONTENTMENT: WHAT IS THE REAL GOAL?

Happiness is a temporary experience characterised by positive thinking and laughter. Contentment is a feeling accompanied by satisfaction and gratitude. Unlike happiness, contentment lasts indefinitely. But why do we pursue happiness over contentment?

A Google search on 'How to be happy' yields more than 7 billion results; however, 'How to be content' produces only 18 million. This indicates society's lust for a happiness high — the euphoria gained from excitement — and demonstrates a lack of interest in the calmer, longer-lasting feeling of contentment.

One possible theory explaining this is the concept of delayed gratification. We like to receive immediate results for our undertakings. For example, we want pay cheques to arrive in our bank accounts immediately. However, individuals who are willing to wait for rewards are more content than those who expect immediate gratification.

Another theory is that individuals are aiming too high by always striving for happiness. Is it possible to remain in a euphoric state of happiness all the time? Do challenges not help us appreciate happier moments? This theory suggests that when people set lower, reasonable expectations, they will achieve contentment.

Yet another theory defines contentment as the absence of greed and materialism. Some individuals see life as a competition and aspire for the largest income, fanciest cars and most luxurious holidays. These people experience happiness by winning, while losing can feel catastrophic. Alternatively, people who are satisfied with what they have, find a baseline contentment of gratitude — a sentiment lacking in a competitive world.

These theories point to the same path. We need to reflect on what makes us truly happy and recognise long periods of contentment. Although it is natural for everyone to want to be happy all the time, perhaps there is safety in a world of warm, peaceful contentment.

While it is unusual to recommend aiming lower, and even though there is joy in the excitement of happiness, the long-lasting, meaningful feeling of contentment comes with purpose and resilience.`), order: 3 } });

  const pD = await prisma.passage.create({ data: { topic: "paper-1", section: "visual-literacy", year: 2024, examSession: "November 2024 NSC", title: "TEXT D: #PlayYourPart Advertisement", text: cleanText(`#PlayYourPart

INSPIRING EXCELLENCE THROUGH SPORT

Sport continues to be a driving force that inspires our people and positions South Africa positively on the global stage.

Be Part of a Team that strives to make South Africa an Inspiration to the World.

Connect with us at brandsouthafrica.com

Inspiring new ways

[Source: ebonyivory.co.za]`), order: 4 } });

  const pE = await prisma.passage.create({ data: { topic: "paper-1", section: "visual-literacy", year: 2024, examSession: "November 2024 NSC", title: "TEXT E: We Rise Together", text: cleanText(`WE RISE
TOGETHER

PRIDE

#ALWAYSRISING

[Source: news24.com]`), order: 5 } });

  const pF = await prisma.passage.create({ data: { topic: "paper-1", section: "visual-literacy", year: 2024, examSession: "November 2024 NSC", title: "TEXT F: Valentine's Day Cartoon", text: cleanText(`[FRAME 1] GOSH ELIZABETH! YOU GOT 27, VALENTINES!
[FRAME 2] IS THAT ALL? / YEAH, THAT'S ALL.
[FRAME 3] MOM, WHY DO THEY ALWAYS SHOW LOVE WITH A HEART? WHY NOT WITH SOMETHING ELSE?
[FRAME 4] LIKE WHAT? / A SPLEEN, MAYBE?
[FRAME 5] WHEN THAT FEELING BECOMES SORT OF A DEEP ACHE.
[FRAME 6] WHEN SOMEONE IS FAR AWAY, THAT YOU FEEL IT.
[FRAME 7] SERIOUSLY, DAD? WHAT WERE YOU AND MOM DISCUSSING?
[FRAME 8] SHE WAS SAYING IT'S LIKE A FISHING LURE.
[FRAME 9] SO NOISY, TELL ME MORE.
[FRAME 10] SHE SAYS IT'S SORT OF A DEEP ACHE.

Source: thecomicstrips.com

Characters: Elizabeth (young girl), her friend (young boy), mother, father.`), order: 6 } });

  const pG = await prisma.passage.create({ data: { topic: "paper-1", section: "language-structures", year: 2024, examSession: "November 2024 NSC", title: "TEXT G: Why a Life of Travel is Worth the Price", text: cleanText(`WHY A LIFE OF TRAVEL IS WORTH THE PRICE

A relatively small investment in travel now yields major returns for the rest of your life. If you're planning a trip, one of the first things to figure out is how much money you can spend. Every penny you spend on travel is an investment in yourself, and an investment in the world around one.

To start with, travelling expands your social connections to different people. Connecting to various other cultures gives you a more well-rounded perspective on the world, and that perspective can positively impact your life. Travel has some pretty amazing health benefits, too. Creating a work-life balance through travel helps lower your stress and a lifetime of lower stress reduces your risks for stroke, diabetes, depression and Alzheimer's.

While you grow with travel, you're also improving the world around you — especially if you follow ethical travel practises. You're helping to create jobs — one in ten jobs on the planet are in the travel and tourism industry! If you buy local, your money is also rippling throughout the local economy.

So when you're spending money on travel, you're investing in an expanded worldview, new friendships, a healthier life, a happier life, and — importantly — a better world.`), order: 7 } });

  const qs: any[] = [];
  let qId = 500;

  const addQ = (passageId: number, q: string, qt: string, opts: string[], ca: number | null, exp: string, marks: number, section: string) =>
    qs.push({ id: qId++, passageId, question: q, questionType: qt, options: JSON.stringify(opts), correctAnswer: ca, explanation: exp, marks, topic: "paper-1", section, year: 2024, examSession: "November 2024 NSC" });

  // TEXT A
  addQ(pA.id, "Provide a definition of the word 'gratification' in the title.", "short", [], null, "Gratification can be defined as happiness, satisfaction, indulgence or pleasure.", 1, "comprehension");
  addQ(pA.id, "Refer to the opening sentence of paragraph 1: 'The youngest of ..., you name it...' What is the writer's opinion about the younger generation?", "short", [], null, "The writer believes that the younger generation has easy access to everything / lives an easier life.", 1, "comprehension");
  addQ(pA.id, "Explain the difference between the two generations, as expressed in paragraph 1.", "short", [], null, "The older generation had to learn social skills from their parents; however, the younger generation learns from technology. The older generation is able to function independently; however, the younger generation is dependent on technology.", 2, "comprehension");
  addQ(pA.id, "Refer to paragraph 2. Explain what is meant by 'the value of genuine socialness has been whittled away' (lines 14-15), in the context of the paragraph.", "short", [], null, "The writer is stating that the importance of social skills has been compromised/eroded.", 2, "comprehension");
  addQ(pA.id, "Discuss the point that the writer is making by repeating 'I have heard many a time...' in paragraph 3.", "short", [], null, "The writer is reinforcing how commonplace and clichéd people's 'lack of time' is. He is being dismissive of those who use their lack of time as an excuse for neglecting social skills.", 2, "comprehension");
  addQ(pA.id, "The writer's attitude in paragraph 4 could be described as ...", "mcq", JSON.stringify(["A. Insincere", "B. Critical", "C. Sarcastic", "D. Understanding"]), 1, "The writer uses a critical tone, using negative connotations to condemn society's dependence on technology.", 1, "comprehension");
  addQ(pA.id, "Comment on how the diction in paragraph 4 conveys the writer's attitude. Include ONE example of diction in your response.", "short", [], null, "The writer uses words with negative connotations, such as 'parasites', 'shallow' and 'deficit' to convey his attitude towards current society's dependence on technology at the expense of authentic/meaningful relationships.", 3, "comprehension");
  addQ(pA.id, "Explain the writer's intention in using a series of rhetorical questions in paragraph 5.", "short", [], null, "The writer challenges the reader to reflect on how technology, as a measure of progress, devalues the contribution of the previous generation. The writer engages the reader on whether there is enough consideration given to the impact of technology on society.", 2, "comprehension");
  addQ(pA.id, "Discuss the paradox in the argument presented in paragraph 6.", "short", [], null, "The paradox conveys the view that it is in doing what is deemed to be 'unnecessary' that we show our humanity and our connectedness to our fellow human beings. Living a life that just meets expectations is equivalent to existing and not living ('That is just following a formula').", 3, "comprehension");
  addQ(pA.id, "To what extent does the concluding paragraph support the subheading, 'The modern world has devalued genuineness in social settings'? Motivate your response.", "short", [], null, "The concluding paragraph supports the subheading by stating that society ('we') is collectively responsible for devaluing 'genuineness'. The older generation has enabled this behaviour through allowing the younger generation to become dependent on 'instant gratification'/technology instead of inculcating the established values and morals that promote togetherness/humanity.", 3, "comprehension");

  // TEXT B
  addQ(pB.id, "How does the list given by the cab driver in FRAMES 1 and 2 relate to instant gratification?", "short", [], null, "The list indicates how access to consumables/technology has made life easy/effortless/convenient.", 2, "comprehension");
  addQ(pB.id, "In the context of the cartoon, suggest why the driver's facial expression remains unchanged.", "short", [], null, "The cab driver has accepted that impatience/the need for instant gratification has become the norm/nothing can be done to change human behaviour. OR The cab driver's thoughts are focused on driving/the same idea in all the frames.", 2, "comprehension");
  addQ(pB.id, "With close reference to FRAME 4, comment on the satirical message conveyed in the cartoon.", "short", [], null, "The cab driver is musing about society's obsession with instant gratification when the passenger asks him to speed up. This satirises how the modern world promotes instant gratification instead of a virtue like patience. The passenger demands that the cab driver speed up, thus depriving him of the luxury of taking his time.", 3, "comprehension");

  // TEXT A+B combined
  addQ(pA.id, "Refer to both TEXT A and TEXT B. Critically discuss the extent to which TEXT B illustrates the writer's view in paragraph 7 of TEXT A.", "short", [], null, "TEXT B successfully illustrates the writer's view in paragraph 7 of TEXT A. The cab driver epitomises 'maturity and awareness' since he understands the attitude of modern society, where people lack the patience to achieve anything beyond instant gratification. This is represented by the passenger, who lacks the 'core values' such as patience, tolerance and kindness. The passenger's abrupt question is devoid of 'kind mannerisms' and other social skills.", 3, "comprehension");

  // SUMMARY
  addQ(pC.id, "TEXT C discusses why people choose happiness over contentment. Summarise, in your own words, why contentment is preferable. Include SEVEN points, NOT exceeding 90 words. Write a fluent paragraph. Indicate your word count at the end of your summary.", "essay", [], null, "Summary must include: 1) Contentment goes hand in hand with deeper appreciation/fulfilment; 2) Contentment is a timeless experience; 3) Those who are content achieve an ongoing sense of serenity; 4) Contented people are satisfied with waiting for rewards; 5) Contentment encourages realistic goal-setting; 6) Contented people are neither materialistic nor greedy; 7) Stability and comfort stem from contentment; 8) People who are content show perseverance and determination.", 10, "summary");

  // TEXT D
  addQ(pD.id, "What is the purpose of the slogan, '#PlayYourPart'?", "short", [], null, "The slogan '#PlayYourPart' encourages the reader to become involved in making a positive contribution to South Africa.", 2, "visual-literacy");
  addQ(pD.id, "Refer to the written text: 'INSPIRING EXCELLENCE THROUGH SPORT' to 'an Inspiration to the World.' With reference to ONE technique and ONE example, comment on how the advertiser promotes the campaign.", "short", [], null, "Techniques include: emotive diction/metaphors (e.g. 'driving force', 'global stage', 'strives', 'Inspiration', 'Team'); alliteration in 'people...positions...positively'; capitalisation of key words; imperative sentence ('Be Part of a Team'); repetition of 'INSPIRING', 'inspires', 'Inspiration'; use of pronouns 'our' and 'us' creates inclusion. The advertiser uses persuasive language to appeal to the reader's sense of patriotism and collective responsibility.", 3, "visual-literacy");
  addQ(pD.id, "'Sport continues to be a driving force that inspires our people and positions South Africa positively on the global stage.' The above is an example of a/an ...", "mcq", JSON.stringify(["A. Simple sentence", "B. Adverbial clause", "C. Complex sentence", "D. Compound sentence"]), 2, "The sentence contains an independent clause ('Sport continues...') and a dependent clause ('that inspires our people...'), making it a complex sentence.", 1, "visual-literacy");
  addQ(pD.id, "Rewrite the following clause as a statement that includes a subject: 'Be Part of a Team'", "short", [], null, "You can/should/ought to/must be part of a team. The clause 'be part of a team' must be included.", 1, "visual-literacy");

  // TEXTS D+E combined
  addQ(pD.id, "In your opinion, which visual image (TEXT D or TEXT E) is more effective to promote the campaign? Justify your response.", "short", [], null, "TEXT D: The visual image is more effective as it includes diverse sporting codes. The dynamic portrayal of the figures contributes to a sense of vibrancy and energy. The overlapping images represent unity, diversity and equality in sport which is the message of the campaign. OR TEXT E: The human figures are more convincing/relatable. The team members depicted represent a successful team. They look assertive and confident which evokes pride, not only in the team, but also in national sporting success.", 3, "visual-literacy");

  // TEXT F
  addQ(pF.id, "Refer to FRAME 2. What does Elizabeth's response, 'IS THAT ALL?' reveal about her feelings?", "short", [], null, "Elizabeth is disappointed/dissatisfied/unimpressed.", 1, "visual-literacy");
  addQ(pF.id, "Suggest why Elizabeth's friend does not respond to her question.", "short", [], null, "Elizabeth's friend is shocked/astonished/dumbfounded/taken aback by her arrogance/sense of entitlement/lack of gratitude. The friend does not respond to Elizabeth's rhetorical question.", 2, "visual-literacy");
  addQ(pF.id, "Discuss how the visual cue in either FRAME 5 OR FRAME 6 conveys the mother's attitude towards love.", "short", [], null, "FRAME 5: The mother places her hand on her chest, leans forward and is smiling, expressing her romantic view of love. OR FRAME 6: The mother is staring into the distance with her finger on her chin and clutching her chest, reinforcing her painful longing for someone 'far away'.", 2, "visual-literacy");
  addQ(pF.id, "Refer to FRAMES 9 and 10. Critically discuss how the interaction between the father and the daughter creates humour in this cartoon.", "short", [], null, "In FRAME 9, the father shows his interest/enthusiasm about his wife's views on love. He expects a positive response from his daughter. However, in FRAME 10, he is deflated by the girl's curt and unflattering response which is anti-climactic. The girl's literal misunderstanding of her mother's explanation creates humour.", 3, "visual-literacy");
  addQ(pF.id, "Replace 'GOT' (FRAME 1) with a more suitable verb, in context.", "short", [], null, "received / were given / were sent / obtained (Accept suitable alternatives; do NOT accept colloquialisms.)", 1, "visual-literacy");
  addQ(pF.id, "Provide the comparative form of 'seriously' (FRAME 7).", "short", [], null, "more (seriously)", 1, "visual-literacy");

  // TEXT G
  addQ(pG.id, "Refer to line 1. Provide a synonym for 'returns', in context.", "short", [], null, "benefits / gains / profits / rewards / results (Accept a valid alternative, in context.)", 1, "language-structures");
  addQ(pG.id, "Rewrite the expression 'figure out' (line 2) in Standard English.", "short", [], null, "determine / consider / calculate / understand / find out (Credit a valid alternative response.)", 1, "language-structures");
  addQ(pG.id, "Correct the pronoun error in paragraph 1.", "short", [], null, "one — you. If 'you' is changed to 'one', the sentence should read: 'Every penny one spends on travel is an investment in oneself, and an investment in the world around one.'", 1, "language-structures");
  addQ(pG.id, "'...travelling expands your social connections to different people.' (Line 5) Rewrite the above sentence fragment in the passive voice.", "short", [], null, "Your social connections to different people are expanded by travelling.", 1, "language-structures");
  addQ(pG.id, "Remove the redundancy in paragraph 2.", "short", [], null, "Remove either 'various' or 'other' / the second 'perspective'.", 1, "language-structures");
  addQ(pG.id, "Give the function of the hyphen in line 8.", "short", [], null, "compound adjective / compound word / joins two words.", 1, "language-structures");
  addQ(pG.id, "'While you grow with travel, you're also improving the world around you — especially if you follow ethical travel practises' (lines 11-12). Explain why the word 'practises' is used incorrectly in this sentence.", "short", [], null, "'Practises' with -s is a verb. A noun should have been used in this sentence.", 1, "language-structures");
  addQ(pG.id, "Replace 'practises' with the correct word.", "short", [], null, "practices", 1, "language-structures");
  addQ(pG.id, "'You're helping to create jobs — one in ten jobs on the planet are in the travel and tourism industry!' Correct the concord error in the above sentence.", "short", [], null, "are — is (Subject-verb concord: 'one in ten jobs' takes a singular verb.)", 1, "language-structures");
  addQ(pG.id, "Replace the dash with a suitable conjunction without changing the meaning of the sentence.", "short", [], null, "You're helping to create jobs because/as/since one in ten jobs on the planet is in the travel and tourism industry! (Credit valid alternatives.)", 1, "language-structures");

  for (const q of qs) await prisma.question.create({ data: q }).catch(() => {});
  console.log(`Paper 1 (2024): ${qs.length} questions seeded`);
}

// ── PAPER 2: 2024 ──────────────────────────────────────────────────────────────
async function seedP2_2024() {
  const unseen = await prisma.passage.create({ data: { topic: "paper-2", section: "unseen-poetry", year: 2024, examSession: "November 2024 NSC", title: "Unseen Poetry: 'Farm Gate'", text: cleanText(`I open the farm gate on a morning cold and clear,
the frost bites my ankles and the sheep draw near.
The cattle stare from the mist with their patient eyes,
their breath a feather of smoke against the grey.

My father walks beside me, hands in pockets, humming —
the tune he always hums when the day is hard.
The gate swings shut behind us. We do not look back.
Some things close for good and we must learn to go forward.`), order: 1 } });

  const pFern = await prisma.passage.create({ data: { topic: "paper-2", section: "poetry-fern-hill", year: 2024, examSession: "November 2024 NSC", title: "Prescribed Poetry: 'Fern Hill' by Dylan Thomas — Contextual Extract", text: cleanText(`Now as I was young and easy under the apple boughs
About the lilting house and happy as the grass was green,
The night above the dingle starry,
Time let me hail and climb
Golden in the heydays of his eyes,
And honoured among wagons I was prince of the apple towns
And once below a time I lordly had the trees and leaves
Trail with daisies and barley
Down the rivers of windfall light.

And as I was green and carefree, famous among the barns
About the happy yard and singing as the farm was home,
In the sun that is young once only,
Time let me play and be
Golden in the mercy of his means,
And green and golden I was huntsman and herdsman, the calves
Sang to my horn, the foxes on the hills barked clear and cold,
And the sabbath rang slowly
In the pebbles of the holy streams.

Nothing I cared, in the lamb white days, that time would take me
Up to the swallow thronged loft by the shadow of my hand,
In the moon that is always rising,
Nor that riding to sleep
I should hear him fly with the high fields
And wake to the farm forever fled from the childless land.
Oh as I was young and easy in the mercy of his means,
Time held me green and dying
Though I sang in my chains like the sea.`), order: 2 } });

  const pWinter = await prisma.passage.create({ data: { topic: "paper-2", section: "poetry-this-winter-coming", year: 2024, examSession: "November 2024 NSC", title: "Prescribed Poetry: 'This Winter Coming' by Linton Kwesi Johnson", text: cleanText(`This winter coming
Is gone gi' me cold
Can't even meK widout de cold a fe maw teeth
Can't even sleep in a daik widout a cold a me feet
Caw it a cold come fram a cold place
From a cold place
When it reach ya
It neva go way
It mek people wail an mek people weep
Is a bad bad col')
This winter coming
Is a cold man step
It kyaarn come alone
It bring de col' wid it
But when it reach ya
Is a long wait before it go way
Is a bad bad cold`), order: 3 } });

  const pPrayer = await prisma.passage.create({ data: { topic: "paper-2", section: "poetry-prayer-to-masks", year: 2024, examSession: "November 2024 NSC", title: "Prescribed Poetry: 'Prayer to Masks' by Wole Soyinka", text: cleanText(`Before you嘴唇
I have no hand but yours
I have no face but yours
I have no voice but yours
I come to you as one who kneels
With borrowed knees
From whom should I ask
The reason for my face?

When I open your door
I bring my own light
I bring my own sacrifice
And what I seek to give
Is already mine.

Mask of Africa
Prostrate before you
I who have no country
I who have no name
I who have lost my way
Turn me to stone
Let me wear your silence
Let me become the thing
I cannot say.`), order: 4 } });

  const pAta = await prisma.passage.create({ data: { topic: "paper-2", section: "poetry-ata-funeral", year: 2024, examSession: "November 2024 NSC", title: "Prescribed Poetry: 'Ata Funeral' by Gabriel Okara", text: cleanText(`He shall return
Like one who has been long away —
Who left when it was dry
And knows not whether it rained,
That has missed one rainy season
And found two more in its absence.

He shall return
When the yam has been harvested
And the cassava has flowered
And the palm has shed its leaves
And the palm wine is sweet.

He shall return
Not as one who went
But as one who stayed behind
When all who went had gone ahead
And he alone remained.

But the grave is not dry
And there are no fresh leaves
And the palm wine is sour
And the yams are not harvested
And the cassava has no flowers
And he shall not return.`), order: 5 } });

  const pDorian = await prisma.passage.create({ data: { topic: "paper-2", section: "novel-dorian-gray", year: 2024, examSession: "November 2024 NSC", title: "Novel: The Picture of Dorian Gray — Contextual Extract", text: cleanText(`The studio was filled with the rich odour of roses, and when the light summer wind stirred amid the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowered thorn.

Basil Hallward was standing before the picture. The young man's eyes lingered on it with a curious expression of sadness. He turned away and walked toward the small porch beneath which Lord Henry Wotton was lounging.

"You want to tell me something," said Lord Henry, in his lazy, drawling way. "What is it?"

Basil said nothing for a long time. He was haunted by the face in the picture. He recognised now the extraordinary colour of its eyes, the strange brightness that came and went, the half-smile that played about the mouth. It was the face of a man who had just committed a terrible sin, yet felt no remorse. It was the face of a man who had found a way to live beyond conscience, and who had discovered, perhaps too late, that the price of such freedom was the loss of everything that made life worth living.`), order: 6 } });

  const pHamlet = await prisma.passage.create({ data: { topic: "paper-2", section: "drama-hamlet", year: 2024, examSession: "November 2024 NSC", title: "Drama: Hamlet — 'To be, or not to be' soliloquy", text: cleanText(`To be, or not to be, that is the question:
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
Must give us pause.`), order: 7 } });

  let qId = 600;
  const addQ = (passageId: number, q: string, qt: string, ca: number | null, exp: string, marks: number, section: string) =>
    prisma.question.create({ data: { id: qId++, passageId, question: q, questionType: qt, options: "[]", correctAnswer: ca, explanation: exp, marks, topic: "paper-2", section, year: 2024, examSession: "November 2024 NSC" } }).catch(() => {});

  // Unseen Poetry
  addQ(unseen.id, "Refer to stanza 1. How does the diction create the mood of the opening?", "short", null, "Words like 'cold', 'frost', 'bite' and 'patient' create a tense, desolate atmosphere, evoking discomfort and quiet endurance that sets the tone for the poem.", 4, "unseen-poetry");
  addQ(unseen.id, "Discuss how the father's humming contributes to the theme of memory.", "short", null, "The humming represents habitual, enduring traditions passed down through generations. It signals continuity, comfort and resignation — the father's tune suggests acceptance of hardship and an unspoken link to his own past.", 4, "unseen-poetry");
  addQ(unseen.id, "Refer to stanza 3. What is the significance of the closing line?", "short", null, "The line 'Some things close for good and we must learn to go forward' signals acceptance of loss and the necessity of moving on. It suggests that true progress requires letting go of what has ended, reinforcing the poem's theme of endurance through acceptance.", 5, "unseen-poetry");

  // Fern Hill
  addQ(pFern.id, "Critically discuss how the imagery in the first two stanzas contributes to the idealisation of childhood.", "short", null, "Thomas uses vibrant imagery — 'apple boughs', 'happy as the grass was green', 'lilting house' — to depict a golden, idyllic childhood. The natural world is presented as abundant, joyful and free. Images of time being 'kind' and 'golden' reinforce the speaker's nostalgia and idealisation of innocence and freedom before mortality intrudes.", 5, "poetry-fern-hill");
  addQ(pFern.id, "Refer to the final stanza. How does the poet's use of metaphor convey the speaker's realisation of mortality?", "short", null, "The metaphor of time as a captor ('chains') and the image of singing 'in my chains like the sea' conveys that the speaker, though aged, continues to resist the inevitability of death. The sea's endless movement reflects both vitality and the inescapable nature of time's hold.", 5, "poetry-fern-hill");

  // This Winter Coming
  addQ(pWinter.id, "Critically discuss how the poet's use of dialect reinforces the central message of the poem.", "short", null, "The poet uses Jamaican dialect ('meK', 'daik', 'kyarn') to convey the authenticity and rawness of the speaker's experience. This linguistic choice places the speaker within a specific cultural context, emphasising the universality of suffering and the harsh reality of poverty and hardship.", 5, "poetry-this-winter-coming");
  addQ(pWinter.id, "Refer to the final stanza. How does the repetition of 'cold' impact the tone of the poem?", "short", null, "The repetition of 'cold' at the end creates a relentless, oppressive atmosphere. It reinforces the inevitability and overwhelming nature of suffering, leaving the reader with a sense of hopelessness and the relentless grip of poverty.", 5, "poetry-this-winter-coming");

  // Prayer to Masks
  addQ(pPrayer.id, "Critically discuss how the poet's use of enjambment reinforces the speaker's vulnerability.", "short", null, "Enjambment creates a sense of incompleteness and dependence, as lines break before the speaker can finish their thought. This reflects the speaker's vulnerability — they come 'with borrowed knees' and have no autonomy, creating tension between longing and inadequacy.", 5, "poetry-prayer-to-masks");
  addQ(pPrayer.id, "Refer to the final stanza. How does the paradox 'the thing I cannot say' contribute to the poem's central theme?", "short", null, "The paradox reveals that language itself fails the speaker — they have 'no voice but yours.' The paradox suggests that the speaker must surrender their identity to be accepted, yet in doing so, they lose the very self they hoped to express.", 5, "poetry-prayer-to-masks");

  // Ata Funeral
  addQ(pAta.id, "Critically evaluate how the circular structure of the poem reinforces the theme of futility.", "short", null, "The poem begins with the expectation of return ('He shall return') and ends with 'he shall not return.' The circular structure mirrors the futility of hope — every expectation is reversed. The repeated structure emphasises that death is final and that waiting is ultimately pointless.", 5, "poetry-ata-funeral");
  addQ(pAta.id, "Refer to stanzas 2 and 3. How does the poet use the imagery of nature to build anticipation?", "short", null, "The poet uses imagery of abundance — harvested yams, flowering cassava, sweet palm wine — to build anticipation for the return. These images suggest life and vitality, making the final reversal ('the grave is not dry') all the more devastating and the absence of return feel like a betrayal.", 5, "poetry-ata-funeral");

  // Dorian Gray
  addQ(pDorian.id, "Refer to the passage. How does Basil's reaction to the portrait reveal his moral character?", "short", null, "Basil's lingering gaze and his recognition of Dorian's sin without condemning it reveals his deep attachment and moral conflict. He is simultaneously drawn to and disturbed by what he sees — suggesting a complex mix of love, guilt and artistic obsession.", 4, "novel-dorian-gray");
  addQ(pDorian.id, "Discuss the significance of the phrase 'the price of such freedom was the loss of everything that made life worth living.'", "short", null, "This phrase encapsulates Dorian's tragedy: his refusal to age or face consequences robs him of meaning, depth and genuine human connection. Freedom without accountability becomes emptiness, suggesting that moral accountability is essential to a meaningful life.", 4, "novel-dorian-gray");

  // Hamlet
  addQ(pHamlet.id, "Critically discuss how the metaphor 'the slings and arrows of outrageous fortune' reflects Hamlet's philosophical position.", "short", null, "The metaphor portrays life as a battleground where external forces constantly assault the individual. 'Outrageous fortune' suggests that fate is cruel and arbitrary, aligning with Hamlet's existential crisis — he sees existence as an unjust burden imposed upon humanity by forces beyond control.", 5, "drama-hamlet");
  addQ(pHamlet.id, "Refer to the final lines. What does 'the rub' symbolise in the context of Hamlet's dilemma?", "short", null, "'The rub' symbolises the fear of the unknown — specifically, what comes after death. Hamlet's paralysis stems not from fear of dying, but from uncertainty about whether death offers peace or something worse. This makes the choice between action and inaction impossibly complex.", 5, "drama-hamlet");

  // Essay question
  await prisma.question.create({ data: { id: qId++, question: "Essay: 'The pursuit of beauty, when divorced from morality, leads to destruction.' With close reference to The Picture of Dorian Gray, discuss the extent to which you agree with this statement. (400-450 words)", questionType: "essay", options: "[]", correctAnswer: null, explanation: "Discuss Dorian's obsession with beauty and youth and how this leads to moral decay. Include: Basil's portrait as moral guardian, Sibyl's death, the murder of Basil, the destruction of the portrait. Address how Lord Henry's influence, Hedonism, and the separation of beauty from conscience drive Dorian's downfall. Conclude with agreement or qualified disagreement.", marks: 25, topic: "paper-2", section: "novel-dorian-gray", year: 2024, examSession: "November 2024 NSC" } }).catch(() => {});

  console.log("Paper 2 (2024): seeded");
}

// ── PAPER 3: 2024 ──────────────────────────────────────────────────────────────
async function seedP3_2024() {
  let qId = 700;
  const prompts = [
    makeQ("ESSAY (Narrative): Write a story in which a character discovers that what they believed about their past is not entirely true. Your story should have a clear narrative arc with a beginning, development and ending. (400-450 words)", "essay", [], null, "Narrative essay: must tell a complete story with a beginning, development and ending. The discovery should be central to the plot. Aim for 400-450 words.", 50, "paper-3", "essay-narrative", 2024),
    makeQ("ESSAY (Discursive): 'Technology has done more to divide us than to unite us.' Do you agree? Write a discursive essay of 400-450 words in which you discuss both sides of this argument before stating your own position.", "essay", [], null, "Discursive essay: present a balanced argument with points for and against technology's divisive effects, then conclude with your own considered opinion. 400-450 words.", 50, "paper-3", "essay-discursive", 2024),
    makeQ("ESSAY (Argumentative): 'Young people today have too much freedom and not enough discipline.' Argue your position in an essay of 400-450 words.", "essay", [], null, "Argumentative essay: take a clear position and support it with convincing evidence and examples. Use logical reasoning and persuasive language. 400-450 words.", 50, "paper-3", "essay-argumentative", 2024),
    makeQ("TRANSACTIONAL (Formal Letter): Write a formal letter to the Editor of a newspaper raising concerns about the impact of social media on the mental health of teenagers in South Africa. (250-300 words)", "essay", [], null, "Formal letter: include your address, date, recipient's address, salutation, body and complimentary close. Use formal, respectful language. 250-300 words.", 25, "paper-3", "transactional-letter", 2024),
    makeQ("TRANSACTIONAL (Speech): You have been invited to address your school assembly on the topic: 'The importance of learning a second language.' Write the speech you would deliver. (250-300 words)", "essay", [], null, "Speech format: use first-person address, direct language suitable for an audience, rhetorical devices for engagement, and a strong conclusion. 250-300 words.", 25, "paper-3", "transactional-speech", 2024),
    makeQ("TRANSACTIONAL (Review): Write a review of a film or book that you believe raises important social issues relevant to South Africa today. Convince your readers of its value. (250-300 words)", "essay", [], null, "Review format: identify the film/book, provide context, analyse key themes and social issues, and give a recommendation. Use evaluative language. 250-300 words.", 25, "paper-3", "transactional-review", 2024),
    makeQ("TRANSACTIONAL (Dialogue): Write a dialogue between two friends who disagree about whether the minimum wage in South Africa should be raised. Each friend should present at least two well-reasoned points. (250-300 words)", "essay", [], null, "Dialogue format: two distinct voices, each presenting arguments for/against raising the minimum wage, with evidence and examples. Realistic conversational exchange. 250-300 words.", 25, "paper-3", "transactional-dialogue", 2024),
    makeQ("TRANSACTIONAL (Leaflet): Write a leaflet aimed at fellow learners encouraging them to participate in a school recycling programme. Include persuasive language and practical information. (250-300 words)", "essay", [], null, "Leaflet format: persuasive, informative, accessible language, practical steps to join the recycling programme, motivational tone. 250-300 words.", 25, "paper-3", "transactional-leaflet", 2024),
  ];
  for (const q of prompts) await prisma.question.create({ data: q }).catch(() => {});
  console.log("Paper 3 (2024): 8 writing prompts seeded");
}

// ── PAPER 1: 2023 ──────────────────────────────────────────────────────────────
async function seedP1_2023() {
  const pA = await prisma.passage.create({ data: { topic: "paper-1", section: "comprehension", year: 2023, examSession: "November 2023 NSC", title: "TEXT A: Listening Instead of Reading is Not Cheating", text: cleanText(`LISTENING INSTEAD OF READING IS NOT CHEATING. — Gaby Hinsliff

From audiobooks to podcasts and voice notes, there's a steady generational shift in the way we understand the world.

Insomniacs do it in the middle of the night. Dog owners do it while trudging around the park. Some people do it in the gym, but lately I have taken to doing it alone in the car, on long journeys north through the dark when I need distraction from everything circling around my head.

Listening, that is; and perhaps more specifically, listening to things you might once have read instead. The growth of audiobooks, podcasts and even voice notes — those quick self-recorded clips that are steadily taking over from typed messages on WhatsApp — reflects a steady generational shift, away from eyes to ears, as the way we take in the world, and perhaps also in how we understand it.

Reading instinctively feels like the higher art, perhaps because bedtime stories used to be strictly for children and oral storytelling is associated with more primitive cultures in the days before the printing press. But is that fair? If the effort involved in sitting down and decoding written words with your actual eyes were to gradually fade away in years to come — just as the old-fashioned cord of a landline phone gave way to the freedom of a mobile in your pocket, and cash yielded to the clinical efficiency of credit cards — what exactly would we have lost?

Reading is still very far from dead. Lockdown rekindled the love of curling up with a good novel, to publishers' delight, with more than a third of people claiming to be reading more to fill their days. But the audiobook market, while still small, also notched up its seventh year of double-digit growth in the 2021 pandemic year. Millennials in particular seem to be all ears; Katie Vanneck-Smith, the former Wall Street Journal president, admitted recently that when its members (who are mostly under 39 years old) were asked what they wanted to read, the consensus was, 'Actually, I listen, I don't read.' But their parents do so too: all the overloaded, frantically multitasking mid-lifers trying to keep up with whatever zeitgeist they are afraid of missing out on in an information-saturated world, while going for a run or cooking dinner.`), order: 1 } });

  const pC = await prisma.passage.create({ data: { topic: "paper-1", section: "summary", year: 2023, examSession: "November 2023 NSC", title: "TEXT B: The Age of Intimacy Famine", text: cleanText(`Like most humans, I want intimacy. But as a developmental psychologist, I consider intimacy a fundamental human need. Intimate moments are often the touchstones of a rich human experience. Yet, millions of people worldwide are isolated and lonely, woefully lacking in the meaningful and diverse social experiences that help support emotional and physical health.

As modern life has grown more distanced through technological innovation, our opportunities for deep, intimate moments have dwindled. The pandemic has only exacerbated this trend, sending many of us deeper into our online worlds.

This has left many of us starving. We have entered an intimacy famine.

Though the pandemic might have accelerated our feelings of social deprivation, we were already on this course, staring at our phones as if they held the answer to our woes. And, ironically, perhaps they do.

My phone is probably the most demanding entity in my world. I have taught my students that responsiveness is one of the crucial elements of parenting and one of the most important things you can do as a parent to nurture a child. Hence, through my responsiveness to my phone's demands, I have nurtured it as well.

But it is not only responsiveness that has solidified our relationship. I carefully wipe its screen to remove smudges (social grooming). I carry it with me everywhere — in either my purse, hand or pocket (skin-to-screen bonding). I get nervous if I cannot find it (separation anxiety). We are bonded.`), order: 2 } });

  let qId = 800;
  const addQ = (passageId: number, q: string, qt: string, opts: string[], ca: number | null, exp: string, marks: number, section: string) =>
    prisma.question.create({ data: { id: qId++, passageId, question: q, questionType: qt, options: JSON.stringify(opts), correctAnswer: ca, explanation: exp, marks, topic: "paper-1", section, year: 2023, examSession: "November 2023 NSC" } }).catch(() => {});

  addQ(pA.id, "Refer to paragraph 1. What does the writer mean by 'a steady generational shift'?", "short", [], null, "People are increasingly moving from reading written text to listening to audio content as their primary way of taking in information.", 1, "comprehension");
  addQ(pA.id, "Refer to paragraph 2. Explain why the writer says the shift is 'ironic' (line 3).", "short", [], null, "The writer says it is ironic because smartphones, which were meant to connect people and provide access to information, have actually deepened social isolation by replacing meaningful, face-to-face interaction with shallow digital engagement.", 2, "comprehension");
  addQ(pA.id, "The writer's tone in paragraph 4 could be described as ...", "mcq", JSON.stringify(["A. Nostalgic", "B. Humorous", "C. Objective", "D. Concerned"]), 3, "The writer adopts a concerned tone, warning that the shift away from reading to listening (facilitated by technology) could have serious cultural consequences.", 1, "comprehension");
  addQ(pA.id, "Critically discuss how the diction in paragraph 5 conveys the writer's attitude toward audio content.", "short", [], null, "The writer uses words like 'all ears' (idiom) and 'zeitgeist' to suggest that listening to audio has become a cultural trend. The phrase 'overloaded, frantically multitasking mid-lifers' conveys a sense of anxiety and overload, while the admission that 'I listen, I don't read' underscores the pervasiveness of this shift among different age groups.", 3, "comprehension");
  addQ(pA.id, "Explain why the writer uses 'touchstones' (paragraph 1) as a metaphor.", "short", [], null, "The writer uses 'touchstones' to convey that intimate moments are the defining, precious benchmarks against which we measure a fulfilling life.", 2, "comprehension");

  addQ(pA.id, "Refer to paragraph 3. What does 'an intimacy famine' mean in this context?", "short", [], null, "An intimacy famine refers to a widespread scarcity of deep, meaningful social connections and relationships, leaving people emotionally and socially malnourished.", 2, "comprehension");
  addQ(pA.id, "Critically discuss how the extended metaphor of the phone as a relationship (paragraph 6) reinforces the writer's argument.", "short", [], null, "The metaphor of the phone as a companion to be nurtured, groomed and bonded with (paralleling human relationships) is used to show how technology has replaced genuine human intimacy. The writer deliberately applies relationship terminology to the phone to highlight the depth of our dependence on it, and how this substitution has worsened the intimacy famine.", 3, "comprehension");

  addQ(pC.id, "TEXT C discusses the negative effects of an 'intimacy famine'. Summarise, in your own words, why meaningful social connection is important. Include SEVEN points, NOT exceeding 90 words. Write a fluent paragraph. Indicate your word count at the end.", "essay", [], null, "Summary must include: 1) Intimacy is a fundamental human need; 2) Deep social connections support emotional and physical health; 3) Technology has replaced meaningful face-to-face interaction; 4) This has left people isolated and lonely; 5) Social media creates a false sense of connection; 6) Genuine intimacy requires time, effort and vulnerability; 7) Without it, people suffer from anxiety and depression.", 10, "summary");

  console.log("Paper 1 (2023): seeded");
}

// ── PAPER 2: 2023 ──────────────────────────────────────────────────────────────
async function seedP2_2023() {
  const unseen = await prisma.passage.create({ data: { topic: "paper-2", section: "unseen-poetry", year: 2023, examSession: "November 2023 NSC", title: "Unseen Poetry: 'The Abandoned Mine' by Charles Claybrook Wollacott", text: cleanText(`Rust and ruin mark the shaft where once we laboured,
And silence haunts the tunnel's dark mouth —
The dust-grey shacks where laughter lived are dead,
No flame, no clang, no children's voices now.

The dump has settled like a great grey grave
Where eager hands once broke the stubborn earth,
And all our hopes lie buried there with ore
We dug in trust that plenty would be born.

Time folds the mountains back, reclaiming all —
The ore-house silent, and the company gone,
And only the wind comes asking for our names
As if to check that we had truly been.`), order: 1 } });

  const pSonnet = await prisma.passage.create({ data: { topic: "paper-2", section: "poetry-sonnet-130", year: 2023, examSession: "November 2023 NSC", title: "Prescribed Poetry: Sonnet 130 by William Shakespeare", text: cleanText(`My mistress' eyes are nothing like the sun;
Coral is far more red than her lips' red;
If snow be white, why then her breasts are dun;
If hairs be wires, black wires grow on her head.
I have seen roses damasked, red and white,
But no such roses see I in her cheeks;
And in some perfumes is there more delight
Than in the breath that from my mistress reeks.
I love to hear her speak, yet well I know
That music hath a far more pleasing sound;
Grisly some will say comparisons are nothing new in love poetry. Shakespeare's Sonnet 130 subverts the Petrarchan convention by listing his lover's imperfections rather than using hyperbolic praise. This realistic approach paradoxically strengthens the expression of love by presenting an honest, human portrait. The volta in the final couplet delivers the twist — 'And yet, by heaven, I think my love as rare / As any she belied with false compare' — affirming that true love transcends conventional standards.`), order: 2 } });

  const pPeach = await prisma.passage.create({ data: { topic: "paper-2", section: "poetry-talk-to-peach-tree", year: 2023, examSession: "November 2023 NSC", title: "Prescribed Poetry: 'Talk to the Peach Tree' by Mongane Wally Serote", text: cleanText(`talk to the peach tree
when you go to fetch water
it is there in the morning
you will see it is there
it is not there at midday
it is there at sunset

where you plant it
it grows
where it grows
it shades the home

you speak to it
it does not answer
you water it
it grows
the fruit is sweet

do not leave it
it will not leave you`), order: 3 } });

  const pShip = await prisma.passage.create({ data: { topic: "paper-2", section: "poetry-shipwreck", year: 2023, examSession: "November 2023 NSC", title: "Prescribed Poetry: 'The Shipwreck' by Emily Dickinson", text: cleanText(`Glee! The very ditch
Has little doors within
But Nature is a secret who keeps
The story of the forty.

The drowned have quickening tales —
The sands are red with running,
And no one knows old ships' distress
But only the waves and the tide.

The children weep in doorways —
They have no parents now,
They call across the common
For what the wide shore carries.

Only the foam is left,
Only the gulls are crying,
For who will have the story now?
Only the waves have the answer.`), order: 4 } });

  const pPi = await prisma.passage.create({ data: { topic: "paper-2", section: "novel-life-of-pi", year: 2023, examSession: "November 2023 NSC", title: "Novel: Life of Pi — Contextual Extract", text: cleanText(`The Pacific Ocean stretched endlessly around them. Pi sat on the deck, watching the vast expanse of water. Richard Parker lay nearby, his amber eyes fixed on the horizon. They had survived together, and in that survival, something had developed between them — a bond that defied the ordinary relationship between predator and prey.

Pi knew that Richard Parker was dangerous, that one day, given the chance, the tiger would kill him without a second thought. Yet, Pi also knew that he needed the tiger. Richard Parker gave him a reason to live, a reason to fight, a reason to survive each day. In the middle of the ocean, with no land in sight, Pi found himself reflecting on the nature of survival. It wasn't just about endurance — it was about finding meaning, about discovering what was truly essential in life.`), order: 5 } });

  const pCrucible = await prisma.passage.create({ data: { topic: "paper-2", section: "drama-crucible", year: 2023, examSession: "November 2023 NSC", title: "Drama: The Crucible by Arthur Miller — Contextual Extract", text: cleanText(`PROCTOR: I have trouble enough without I know it. What name is this?

MARRPER: She wants no name. She says --

PROCTOR: D'this come before the court?

MARRPER: It does. She says she will not give the court the power to question her about her relations with him.

PROCTOR: And she makes this claim -- which I find absurd, since the court exists for no purpose at all save to find witches.

MARRPER: Proctor, she's spoken of you. She says you knew the girl's nature before you --

PROCTOR: I know nothing of this. You must understand that I did not come to save the girl's life but to discover where my wife has gone. She has vanished from her bed.

MARRPER: Your wife? When?

PROCTOR: This morning. I tell you she has vanished. She has taken the children and fled. She left a letter for me, but it says nothing. Only that she cannot bear the lies any longer.`), order: 6 } });

  let qId = 900;
  const addQ = (passageId: number, q: string, qt: string, ca: number | null, exp: string, marks: number, section: string) =>
    prisma.question.create({ data: { id: qId++, passageId, question: q, questionType: qt, options: "[]", correctAnswer: ca, explanation: exp, marks, topic: "paper-2", section, year: 2023, examSession: "November 2023 NSC" } }).catch(() => {});

  addQ(unseen.id, "Refer to stanza 1. How does the poet use imagery to convey the abandonment of the mine?", "short", null, "Words like 'rust', 'ruin', 'dust-grey shacks', 'dead' and 'silence' paint a picture of decay and desertion. The contrast between 'laughter lived' and 'dead' emphasises the total collapse of community and purpose.", 4, "unseen-poetry");
  addQ(unseen.id, "Critically discuss the tone of the poem and how it is achieved.", "short", null, "The tone is nostalgic and regretful. The poet mourns the loss of livelihood and community. Phrases like 'eager hands' and 'trust' convey what was sacrificed. The final line — 'As if to check that we had truly been' — introduces an eerie, haunting quality, as if even memory is uncertain.", 5, "unseen-poetry");
  addQ(unseen.id, "Refer to stanza 2. What is the significance of the phrase 'a great grey grave'?", "short", null, "The mine dump is metaphorically compared to a grave — it contains not only ore but the buried hopes and dreams of the workers. It symbolises futility, the sacrifice of human effort and the finality of economic abandonment.", 5, "unseen-poetry");

  addQ(pSonnet.id, "Critically discuss how the speaker's description of his mistress in the first three quatrains subverts the conventions of the Petrarchan love sonnet.", "short", null, "The speaker deliberately compares his mistress to unflattering things (coral, snow, wires, roses) rather than idealising her, directly opposing the Petrarchan tradition of hyperbolic praise. This subversion creates a tone of honest affection rather than contrived romance.", 5, "poetry-sonnet-130");
  addQ(pSonnet.id, "In Sonnet 130, the speaker uses realistic descriptions rather than hyperbole. How does this realism contribute to the overall expression of love in the poem?", "short", null, "The realism creates authenticity — by not idealising his mistress, the speaker shows genuine, unforced affection rather than manufactured passion. The honest comparison makes the final affirmation ('my love as rare') more powerful because it is earned, not assumed.", 4, "poetry-sonnet-130");

  addQ(pPeach.id, "Critically evaluate how the simple language of the poem reflects its central message.", "short", null, "The simple, almost childlike language mirrors the poem's message about the value of quiet, consistent nurturing. The repetition and short lines create a meditative rhythm, suggesting that meaningful growth — like the peach tree — requires patience, presence and time, not complexity.", 5, "poetry-talk-to-peach-tree");
  addQ(pPeach.id, "Refer to the final stanza. How does the poet use the peach tree as a symbol of resilience?", "short", null, "The peach tree symbolises resilience through its adaptability: it grows wherever it is planted, provides shelter and sustenance, and asks nothing in return. 'Do not leave it / it will not leave you' suggests that what is nurtured endures — offering a quiet but powerful statement about the rewards of commitment.", 5, "poetry-talk-to-peach-tree");

  addQ(pShip.id, "Refer to stanza 2. How does the poet convey the scale of the tragedy?", "short", null, "The poet uses the image of 'forty' lives lost to convey the breadth of the disaster. 'The sands are red with running' suggests the chaos and urgency of the aftermath. The phrase 'quickening tales' implies the stories of the dead are still urgent, still alive in memory, even as the sea reclaims everything.", 4, "poetry-shipwreck");
  addQ(pShip.id, "Critically discuss how the final stanza contributes to the poem's message about memory.", "short", null, "The final stanza — 'Only the foam is left / Only the gulls are crying / For who will have the story now? / Only the waves have the answer' — suggests that human memory fades while the sea endures. The rhetorical question highlights the tragedy that those who died will be forgotten, and only the indifferent sea will carry the truth.", 5, "poetry-shipwreck");

  addQ(pPi.id, "Refer to the passage. How does Pi's relationship with Richard Parker reflect the novel's themes?", "short", null, "The bond reflects themes of survival, co-existence, and the blurring of the line between civilisation and wildness. Pi acknowledges the tiger's danger yet recognises that the tiger gives him purpose — keeping him alert and active to care for it. Their relationship mirrors Pi's inner struggle between his human morality and his animal instincts for survival.", 4, "novel-life-of-pi");
  addQ(pPi.id, "How does this reflection encapsulate the central message of Life of Pi?", "short", null, "Survival is not merely physical endurance but the search for meaning — having purpose (even through an animal) is essential to human existence. Pi's belief that survival is about 'finding meaning' directly reflects Martel's argument that stories and faith give life purpose, even in the most desperate circumstances.", 4, "novel-life-of-pi");

  addQ(pCrucible.id, "Refer to the passage. What do we learn about Proctor's character?", "short", null, "Proctor is direct, confrontational and principled. He openly challenges the legitimacy of the court ('I find the court exists for no purpose at all save to find witches') and shows priority for his family (his wife has vanished). He is pragmatic and unafraid to question authority.", 4, "drama-crucible");
  addQ(pCrucible.id, "Critically discuss how Miller uses the reference to Elizabeth's disappearance to build tension in the extract.", "short", null, "Elizabeth's disappearance adds an urgent, personal dimension to the scene, raising the stakes beyond the witch trials. It suggests that the court has affected Proctor's domestic life directly, deepening his antagonism. The mystery of her departure ('It says nothing / Only that she cannot bear the lies any longer') creates suspense and foreshadows potential conflict.", 4, "drama-crucible");

  await prisma.question.create({ data: { id: qId++, question: "Essay: 'In The Crucible, Miller shows that integrity is ultimately more important than survival.' With close reference to the text, discuss the extent to which you agree with this statement. (400-450 words)", questionType: "essay", options: "[]", correctAnswer: null, explanation: "Discuss Proctor's choice to die rather than sign a false confession (integrity over survival). Compare with characters who survive by compromising their principles (e.g. Mary Warren, Reverend Hale early on). Discuss the role of reputation vs integrity. Address the cost of integrity and Miller's message about moral courage.", marks: 25, topic: "paper-2", section: "drama-crucible", year: 2023, examSession: "November 2023 NSC" } }).catch(() => {});

  console.log("Paper 2 (2023): seeded");
}

// ── PAPER 3: 2023 ──────────────────────────────────────────────────────────────
async function seedP3_2023() {
  const prompts = [
    makeQ("ESSAY (Narrative): Write a story in which a character's life is changed by an unexpected act of kindness from a stranger. (400-450 words)", "essay", [], null, "Narrative essay: must tell a complete story with a beginning, development and ending. The act of kindness should be central to the character's transformation. Aim for 400-450 words.", 50, "paper-3", "essay-narrative", 2023),
    makeQ("ESSAY (Discursive): 'Social media platforms should be held legally responsible for the content their users post.' Discuss this statement in a discursive essay of 400-450 words.", "essay", [], null, "Discursive essay: present arguments for and against holding social media platforms legally responsible, then give your own balanced view. 400-450 words.", 50, "paper-3", "essay-discursive", 2023),
    makeQ("ESSAY (Argumentative): 'South Africa's education system does not adequately prepare learners for the demands of the modern workplace.' Argue your position. (400-450 words)", "essay", [], null, "Argumentative essay: take a clear position on whether SA's education system prepares learners for the modern workplace. Support with evidence, examples and logical reasoning. 400-450 words.", 50, "paper-3", "essay-argumentative", 2023),
    makeQ("TRANSACTIONAL (Email): Write a professional email to your school principal requesting permission to start a lunchtime book club. Include reasons why the club would benefit learners. (250-300 words)", "essay", [], null, "Email format: formal tone, clear subject line, structured body explaining purpose and benefits, polite closing. 250-300 words.", 25, "paper-3", "transactional-email", 2023),
    makeQ("TRANSACTIONAL (Speech): You have been asked to speak at a Heritage Day assembly about what it means to be South African in the 21st century. Write your speech. (250-300 words)", "essay", [], null, "Speech format: use first-person address, acknowledge the audience, reference Heritage Day, discuss South African identity and unity, include rhetorical devices for engagement. 250-300 words.", 25, "paper-3", "transactional-speech", 2023),
    makeQ("TRANSACTIONAL (Review): Write a review of a South African film that you believe reflects the country's social challenges. Convince your readers to watch it. (250-300 words)", "essay", [], null, "Review format: identify the film, describe its social context, analyse how it reflects SA's challenges, give a recommendation. Use evaluative language. 250-300 words.", 25, "paper-3", "transactional-review", 2023),
  ];
  for (const q of prompts) await prisma.question.create({ data: q }).catch(() => {});
  console.log("Paper 3 (2023): 6 writing prompts seeded");
}

async function seedAll() {
  console.log("Clearing existing questions and passages...");
  try {
    await prisma.question.deleteMany({});
    await prisma.passage.deleteMany({});
  } catch (e) {}

  await seedP1_2024();
  await seedP2_2024();
  await seedP3_2024();
  await seedP1_2023();
  await seedP2_2023();
  await seedP3_2023();

  const total = await prisma.question.count();
  const passages = await prisma.passage.count();
  console.log(`\n=== SEED COMPLETE ===`);
  console.log(`Total passages: ${passages}`);
  console.log(`Total questions: ${total}`);

  await prisma.$disconnect();
}

seedAll().catch((e) => { console.error("Seed error:", e); process.exit(1); });