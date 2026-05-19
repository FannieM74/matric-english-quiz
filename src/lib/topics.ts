export const TOPICS: { slug: string; label: string; sections: { slug: string; label: string }[] }[] = [
  {
    slug: "paper-1",
    label: "Paper 1: Language in Context",
    sections: [
      { slug: "comprehension", label: "Comprehension" },
      { slug: "summary", label: "Summary" },
      { slug: "visual-literacy", label: "Visual Literacy" },
      { slug: "language-structures", label: "Language Structures" },
      { slug: "critical-language-awareness", label: "Critical Language Awareness" },
    ],
  },
  {
    slug: "paper-2",
    label: "Paper 2: Literature",
    sections: [
      { slug: "poetry-sonnet-130", label: "Poetry: Sonnet 130 – Shakespeare" },
      { slug: "poetry-child-shot", label: "Poetry: The child who was shot… – Jonker" },
      { slug: "poetry-ata-funeral", label: "Poetry: Ata Funeral – Brutus" },
      { slug: "poetry-poem-of-return", label: "Poetry: Poem of Return – Rocha" },
      { slug: "poetry-talk-to-peach-tree", label: "Poetry: Talk to the Peach Tree – Sepamla" },
      { slug: "poetry-prayer-to-masks", label: "Poetry: Prayer to Masks – Senghor" },
      { slug: "poetry-this-winter-coming", label: "Poetry: This Winter Coming – Press" },
      { slug: "poetry-solitude", label: "Poetry: Solitude – Wilcox" },
      { slug: "poetry-morning-sun", label: "Poetry: The Morning Sun is Shining – Schreiner" },
      { slug: "poetry-beauteous-evening", label: "Poetry: It is a beauteous evening… – Wordsworth" },
      { slug: "poetry-fern-hill", label: "Poetry: Fern Hill – Thomas" },
      { slug: "poetry-shipwreck", label: "Poetry: The Shipwreck – Dickinson" },
      { slug: "unseen-poetry", label: "Unseen Poetry" },
      { slug: "novel-life-of-pi", label: "Novel: Life of Pi – Martel" },
      { slug: "novel-dorian-gray", label: "Novel: The Picture of Dorian Gray – Wilde" },
      { slug: "drama-hamlet", label: "Drama: Hamlet – Shakespeare" },
      { slug: "drama-othello", label: "Drama: Othello – Shakespeare" },
      { slug: "drama-crucible", label: "Drama: The Crucible – Miller" },
    ],
  },
  {
    slug: "paper-3",
    label: "Paper 3: Writing",
    sections: [
      { slug: "essay-writing", label: "Essay Writing" },
      { slug: "longer-transactional", label: "Longer Transactional Text" },
      { slug: "shorter-transactional", label: "Shorter Transactional Text" },
    ],
  },
];

export const TOPIC_LABELS: Record<string, string> = {
  "paper-1": "Paper 1: Language in Context",
  "paper-2": "Paper 2: Literature",
  "paper-3": "Paper 3: Writing",
};

export const TOPIC_COLORS: Record<string, string> = {
  "paper-1": "bg-emerald-100 text-emerald-800",
  "paper-2": "bg-violet-100 text-violet-800",
  "paper-3": "bg-amber-100 text-amber-800",
};

export const SECTION_LABELS: Record<string, string> = {};
for (const t of TOPICS) {
  for (const s of t.sections) {
    SECTION_LABELS[s.slug] = s.label;
  }
}
