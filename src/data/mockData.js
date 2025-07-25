export const MOCK_DATA = {
  homepage: {
    mainStory: {
      id: 'home-main',
      category: 'The Big Idea',
      title: 'The surprising science behind what makes a hit song',
      author: 'Jane Doe',
      imageUrl: 'https://placehold.co/1200x800/334155/e2e8f0?text=Abstract+Soundwaves',
      excerpt: 'For decades, record labels have spent millions trying to predict the next big thing. Now, data scientists are getting closer to cracking the code.'
    },
    topStories: [
      { id: 'politics-1', category: 'Politics', title: 'Global trade agreements face a new wave of uncertainty', author: 'John Smith', imageUrl: 'https://placehold.co/600x400/475569/e2e8f0?text=Global+Trade' },
      { id: 'tech-1', category: 'Technology', title: 'Are AI companions the future of mental wellness?', author: 'Emily White', imageUrl: 'https://placehold.co/600x400/52525b/e2e8f0?text=AI+Companion' },
      { id: 'culture-1', category: 'Culture', title: 'The revival of classic cinema: A nostalgic trend or a new art form?', author: 'Chris Green', imageUrl: 'https://placehold.co/600x400/64748b/e2e8f0?text=Classic+Cinema' },
      { id: 'science-1', category: 'Science & Health', title: 'The race to develop a universal flu vaccine heats up', author: 'Dr. Anya Sharma', imageUrl: 'https://placehold.co/600x400/71717a/e2e8f0?text=Vaccine+Research' },
    ],
    secondaryStories: [
      { id: 'urban-1', title: 'How remote work is reshaping urban landscapes', imageUrl: 'https://placehold.co/400x300/4b5563/e2e8f0?text=Cityscape' },
      { id: 'fashion-1', title: 'The hidden environmental cost of fast fashion', imageUrl: 'https://placehold.co/400x300/4b5563/e2e8f0?text=Fashion' },
    ]
  },

  explainersPage: {
    featuredStory: {
      id: 'explainer-featured',
      category: 'How Government Works',
      title: 'The Three Tiers of Government in Nigeria',
      author: 'Chiamaka Nwosu',
      date: 'July 26, 2024',
      imageUrl: 'https://placehold.co/1200x700/1e3a8a/e0e7ff?text=Nigerian+Government',
      excerpt: 'A foundational look at the Federal, State, and Local governments and how they interact to govern the nation.'
    },
    articles: [
      { id: 'explainer-1', category: 'The Economy', title: 'What is Inflation and How Does it Affect You?', author: 'David Adewale', date: 'July 25, 2024', imageUrl: 'https://placehold.co/600x400/991b1b/fee2e2?text=Economy' },
      { id: 'series-part-1', category: 'How Government Works', title: 'How a Bill Becomes Law: The First Step', author: 'Aisha Bello', date: 'July 24, 2024', imageUrl: 'https://placehold.co/600x400/047857/a7f3d0?text=Lawmaking' },
      { id: 'explainer-3', category: 'Civic Duties', title: 'How Your Vote Makes a Difference', author: 'Tunde Okoro', date: 'July 23, 2024', imageUrl: 'https://placehold.co/600x400/854d0e/fefce8?text=Voting' },
      { id: 'explainer-4', category: 'How Government Works', title: 'The Role of the National Assembly', author: 'Chiamaka Nwosu', date: 'July 22, 2024', imageUrl: 'https://placehold.co/600x400/1e40af/dbeafe?text=NASS' },
    ]
  },

  startHerePage: {
    title: "New to how government works? Start here.",
    description: "Understanding government can seem complicated. This guided path will walk you through the most important, foundational concepts to get you started.",
    articles: [
      { id: 'explainer-featured', description: "Begin with the basics. Learn how power is shared across the country." },
      { id: 'explainer-2', description: "Discover the principle that ensures no one is above the law." },
      { id: 'explainer-3', description: "Understand the power you hold as a citizen in a democracy." },
      { id: 'explainer-1', description: "See how economic policies are made and how they affect your daily life." }
    ]
  },

  series: {
    'how-a-bill-becomes-law': {
      id: 'how-a-bill-becomes-law',
      title: 'How a Bill Becomes Law',
      articles: [
        { id: 'series-part-1' },
        { id: 'series-part-2' },
        { id: 'series-part-3' },
      ]
    }
  },

  timelines: {
    'history-of-nigerian-democracy': {
      id: 'history-of-nigerian-democracy',
      category: 'How Government Works',
      title: 'A Brief History of Nigerian Democracy',
      description: 'From independence to the Fourth Republic, a look at the key moments that have shaped Nigeria\'s democratic journey.',
      events: [
        { date: '1960', title: 'Independence', description: 'Nigeria gains independence from British colonial rule on October 1st.' },
        { date: '1999', title: 'Fourth Republic', description: 'Nigeria returns to democratic rule with the election of Olusegun Obasanjo, marking the beginning of the current Fourth Republic.' },
      ]
    }
  },

  allArticles: {
    'home-main': { title: 'The surprising science behind what makes a hit song', author: 'Jane Doe', content: '...' },
    'politics-1': { title: 'Global trade agreements face a new wave of uncertainty', author: 'John Smith', content: '...' },
    'explainer-featured': {
      title: 'The Three Tiers of Government in Nigeria',
      author: 'Chiamaka Nwosu',
      category: 'How Government Works',
      content: 'The full, detailed explanation of the three tiers of government would go here...',
      keyTakeaways: ["..."],
      relatedArticles: ['explainer-1', 'explainer-2', 'explainer-4']
    },
    'explainer-1': {
      title: 'What is Inflation and How Does it Affect You?',
      author: 'David Adewale',
      category: 'The Economy',
      content: 'A comprehensive breakdown of inflation...',
      keyTakeaways: ["..."],
      relatedArticles: ['explainer-featured']
    },
    'explainer-2': {
      title: 'Understanding the Rule of Law',
      author: 'Aisha Bello',
      category: 'Key Concepts',
      content: 'This article defines the rule of law...',
      keyTakeaways: ["..."],
      relatedArticles: ['explainer-featured', 'explainer-3']
    },
    'explainer-3': {
      title: 'How Your Vote Makes a Difference',
      author: 'Tunde Okoro',
      category: 'Civic Duties',
      content: 'An in-depth look at the power of a single vote...',
    },
    'explainer-4': {
      title: 'The Role of the National Assembly',
      author: 'Chiamaka Nwosu',
      category: 'How Government Works',
      content: 'This article explains the bicameral structure of Nigeria\'s National Assembly...',
      keyTakeaways: ["..."],
      relatedArticles: ['explainer-featured']
    },
    // New articles for the series
    'series-part-1': {
      title: 'How a Bill Becomes Law: The First Step',
      author: 'Aisha Bello',
      category: 'How Government Works',
      seriesId: 'how-a-bill-becomes-law',
      content: 'This is Part 1. Every law begins as an idea. This article explains how that idea is drafted into a formal bill and introduced on the floor of the National Assembly for its first reading.',
      keyTakeaways: ["A bill can be proposed by anyone, but only a legislator can introduce it.", "The first reading is a formality to announce the bill."],
      relatedArticles: ['explainer-4']
    },
    'series-part-2': {
      title: 'How a Bill Becomes Law: Committees and Debates',
      author: 'Aisha Bello',
      category: 'How Government Works',
      seriesId: 'how-a-bill-becomes-law',
      content: 'This is Part 2. After the first reading, the bill goes to a specialized committee for review. This is where the real work happens: public hearings, amendments, and detailed scrutiny.',
      keyTakeaways: ["Committees are the 'engine room' of the legislature.", "The second reading involves a general debate on the bill's principles."],
      relatedArticles: ['explainer-4']
    },
    'series-part-3': {
      title: 'How a Bill Becomes Law: Final Steps and Assent',
      author: 'Aisha Bello',
      category: 'How Government Works',
      seriesId: 'how-a-bill-becomes-law',
      content: 'This is Part 3. If a bill passes the committee stage and third reading, it must be passed in the exact same form by both chambers. Finally, it goes to the President for assent to officially become law.',
      keyTakeaways: ["A conference committee resolves differences between House and Senate versions.", "The President can sign the bill into law or veto it."],
      relatedArticles: ['explainer-4']
    }
  }
};
