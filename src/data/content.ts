export type Opportunity = {
  id: string;
  title: string;
  category: string;
  direction: string;
  format: "Online" | "Offline" | "Hybrid";
  deadline: string;
  grades: string[];
  location: string;
  description: string;
  requirements: string;
  tags: string[];
  applyUrl: string;
};

export type Course = {
  id: string;
  track: string;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate";
  tags: string[];
  progress: number;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  materials: string[];
  videoLabel: string;
  assignment: string;
  quiz: string;
};

export type FaqItem = {
  question: string;
  answer: string;
  open?: boolean;
};

export type OnboardingQuestionId =
  | "grade"
  | "interests"
  | "academicDirection"
  | "directions"
  | "formats"
  | "locations";

export type OnboardingQuestionType = "single-select" | "multi-select";

export type OnboardingOption = {
  id: string;
  label: string;
  tag?: string;
};

export type OnboardingQuestion = {
  id: OnboardingQuestionId;
  title: string;
  description: string;
  type: OnboardingQuestionType;
  required: boolean;
  options: OnboardingOption[];
};

export type OnboardingProfile = {
  grade: string;
  interests: string[];
  academicDirection: string;
  directions: string[];
  formats: string[];
  locations: string[];
};

export const navLinks = [
  { href: "#match-console", label: "Matches" },
  { href: "#courses", label: "Courses" },
  { href: "#companion", label: "MentorPet" },
  { href: "#faq", label: "FAQ" }
];

export const emptyOnboardingProfile: OnboardingProfile = {
  grade: "",
  interests: [],
  academicDirection: "",
  directions: [],
  formats: [],
  locations: []
};

export const onboardingQuestions: OnboardingQuestion[] = [
  {
    id: "grade",
    title: "Which grade are you in?",
    description: "We use this to match age-appropriate programs and deadlines.",
    type: "single-select",
    required: true,
    options: [
      { id: "8", label: "Grade 8" },
      { id: "9", label: "Grade 9" },
      { id: "10", label: "Grade 10" },
      { id: "11", label: "Grade 11" },
      { id: "12", label: "Grade 12" }
    ]
  },
  {
    id: "interests",
    title: "What are you interested in?",
    description: "Choose several interests so Mentoria can build a useful starting profile.",
    type: "multi-select",
    required: true,
    options: [
      { id: "business", label: "Business" },
      { id: "stem", label: "STEM" },
      { id: "social-impact", label: "Social Impact" },
      { id: "finance", label: "Finance" },
      { id: "programming", label: "Programming" },
      { id: "science", label: "Science" },
      { id: "english", label: "English" },
      { id: "admissions", label: "University Admission" }
    ]
  },
  {
    id: "academicDirection",
    title: "What is your academic direction?",
    description: "Pick the strongest direction for your current study path.",
    type: "single-select",
    required: true,
    options: [
      { id: "science-research", label: "Science and research" },
      { id: "business-economics", label: "Business and economics" },
      { id: "technology", label: "Technology and programming" },
      { id: "global-admissions", label: "Global university admission" },
      { id: "language-tests", label: "English and language tests" }
    ]
  },
  {
    id: "directions",
    title: "Which opportunity directions should we prioritize?",
    description: "These match the catalog filters students will use later.",
    type: "multi-select",
    required: true,
    options: [
      { id: "business", label: "Business" },
      { id: "stem", label: "STEM" },
      { id: "social-impact", label: "Social Impact" },
      { id: "finance", label: "Finance" },
      { id: "programming", label: "Programming" },
      { id: "science", label: "Science" }
    ]
  },
  {
    id: "formats",
    title: "Which formats work for you?",
    description: "Mentoria will avoid suggesting opportunities you cannot attend.",
    type: "multi-select",
    required: true,
    options: [
      { id: "online", label: "Online" },
      { id: "offline", label: "Offline" },
      { id: "hybrid", label: "Hybrid" }
    ]
  },
  {
    id: "locations",
    title: "Where can you participate?",
    description: "Choose one or more location scopes.",
    type: "multi-select",
    required: true,
    options: [
      { id: "kazakhstan", label: "Kazakhstan" },
      { id: "global", label: "Global" },
      { id: "central-asia", label: "Central Asia" }
    ]
  }
];

export const opportunities: Opportunity[] = [
  {
    id: "almaty-physics-battles",
    title: "Almaty Physics Battles 2026",
    category: "Competition",
    direction: "STEM",
    format: "Hybrid",
    deadline: "2026-07-08",
    grades: ["9", "10", "11", "12"],
    location: "Kazakhstan",
    description:
      "An international team-based physics competition for secondary school students, held in Almaty with online selection stages.",
    requirements: "Team registration, physics problem solving, and mentor-supported preparation.",
    tags: ["stem", "science", "competition", "hybrid", "kazakhstan", "research"],
    applyUrl: "https://example.com/almaty-physics-battles"
  },
  {
    id: "iypt-2026",
    title: "International Young Physicists' Tournament 2026",
    category: "Competition",
    direction: "Science",
    format: "Offline",
    deadline: "2026-07-12",
    grades: ["10", "11", "12"],
    location: "Global",
    description:
      "A team-based physics tournament with research, experiments, and scientific discussion.",
    requirements: "Strong physics background, research presentation, and national selection pathway.",
    tags: ["stem", "science", "competition", "offline", "global", "research"],
    applyUrl: "https://www.iypt.org/"
  },
  {
    id: "beamline-for-schools",
    title: "Beamline for Schools 2026",
    category: "Research",
    direction: "Science",
    format: "Online",
    deadline: "2026-08-18",
    grades: ["9", "10", "11", "12"],
    location: "Global",
    description:
      "A CERN, DESY, and ELSA physics proposal competition where high-school teams design an accelerator experiment.",
    requirements: "Experiment proposal, teacher support, and a small student research team.",
    tags: ["stem", "science", "research", "competition", "online", "global"],
    applyUrl: "https://beamline-for-schools.web.cern.ch/"
  },
  {
    id: "online-physics-olympiad",
    title: "Online Physics Olympiad Invitational 2026",
    category: "Competition",
    direction: "STEM",
    format: "Online",
    deadline: "2026-08-30",
    grades: ["8", "9", "10", "11"],
    location: "Global",
    description:
      "An online contest pathway with an invitational round and international participation from physics students.",
    requirements: "Individual registration, olympiad practice, and timed online problem solving.",
    tags: ["stem", "science", "competition", "online", "global"],
    applyUrl: "https://example.com/physics-olympiad"
  },
  {
    id: "central-asia-startup-lab",
    title: "Central Asia Student Startup Lab",
    category: "Summer School",
    direction: "Business",
    format: "Hybrid",
    deadline: "2026-07-24",
    grades: ["9", "10", "11", "12"],
    location: "Central Asia",
    description: "A short startup studio for students building early ideas in education, climate, and youth services.",
    requirements: "Idea sketch, short motivation statement, and weekly team sessions.",
    tags: ["business", "finance", "summer-school", "hybrid", "central-asia", "social-impact"],
    applyUrl: "https://example.com/startup-lab"
  },
  {
    id: "youth-finance-case-cup",
    title: "Youth Finance Case Cup",
    category: "Competition",
    direction: "Finance",
    format: "Online",
    deadline: "2026-09-05",
    grades: ["10", "11", "12"],
    location: "Global",
    description: "A finance and economics case competition for students interested in markets, budgeting, and impact.",
    requirements: "Case deck, basic spreadsheet skills, and a 5 minute team pitch.",
    tags: ["finance", "business", "competition", "online", "global"],
    applyUrl: "https://example.com/finance-case-cup"
  },
  {
    id: "junior-code-research",
    title: "Junior Code Research Fellowship",
    category: "Research",
    direction: "Programming",
    format: "Online",
    deadline: "2026-08-02",
    grades: ["9", "10", "11", "12"],
    location: "Global",
    description: "A mentored online fellowship for students exploring data, simple web tools, and research automation.",
    requirements: "Basic programming experience, GitHub account, and weekly asynchronous updates.",
    tags: ["programming", "stem", "research", "online", "global"],
    applyUrl: "https://example.com/code-research"
  },
  {
    id: "social-impact-volunteer",
    title: "Youth Social Impact Volunteer Track",
    category: "Volunteering",
    direction: "Social Impact",
    format: "Hybrid",
    deadline: "2026-07-30",
    grades: ["8", "9", "10", "11", "12"],
    location: "Kazakhstan",
    description: "A guided volunteering track for students who want to document community work for applications.",
    requirements: "Availability for local or remote service work and a short reflection portfolio.",
    tags: ["social-impact", "volunteering", "hybrid", "kazakhstan", "admissions"],
    applyUrl: "https://example.com/social-impact-track"
  },
  {
    id: "global-admission-scholarship",
    title: "Global Admission Scholarship Sprint",
    category: "Scholarship",
    direction: "Science",
    format: "Online",
    deadline: "2026-09-18",
    grades: ["10", "11", "12"],
    location: "Global",
    description: "A scholarship preparation sprint for students building essays, recommendation plans, and activity lists.",
    requirements: "Draft activity list, target university region, and weekly writing checkpoints.",
    tags: ["scholarship", "admissions", "english", "online", "global", "science"],
    applyUrl: "https://example.com/scholarship-sprint"
  }
];

export const courses: Course[] = [
  {
    id: "english-academic-success",
    track: "Mentoria English",
    title: "English for Academic Success",
    description: "Academic vocabulary, writing structure, and communication habits for applications and programs.",
    difficulty: "Beginner",
    tags: ["english", "admissions", "scholarship"],
    progress: 62,
    lessons: [
      {
        id: "academic-vocabulary",
        title: "Academic vocabulary map",
        duration: "18 min",
        materials: ["Vocabulary bank", "Practice worksheet"],
        videoLabel: "Video placeholder: vocabulary strategy",
        assignment: "Write 8 sentences about one target opportunity using academic verbs.",
        quiz: "Which phrase sounds strongest in an application paragraph?"
      },
      {
        id: "essay-paragraphs",
        title: "Essay paragraph structure",
        duration: "24 min",
        materials: ["Essay outline", "Mentor checklist"],
        videoLabel: "Video placeholder: paragraph walkthrough",
        assignment: "Draft one motivation paragraph for a scholarship or summer school.",
        quiz: "What belongs in the first sentence of a focused paragraph?"
      },
      {
        id: "interview-speaking",
        title: "Clear speaking for interviews",
        duration: "16 min",
        materials: ["Answer framework", "Self-review rubric"],
        videoLabel: "Video placeholder: interview response model",
        assignment: "Record a 60 second answer about your strongest project.",
        quiz: "Which detail makes an interview answer more credible?"
      }
    ]
  },
  {
    id: "physics-basics",
    track: "Mentoria Physics",
    title: "Physics Basics",
    description: "Mechanics, Newton's laws, and modeling habits for olympiads and science programs.",
    difficulty: "Beginner",
    tags: ["stem", "science", "competition", "research"],
    progress: 38,
    lessons: [
      {
        id: "forces-models",
        title: "Forces and useful models",
        duration: "22 min",
        materials: ["Formula sheet", "Problem set"],
        videoLabel: "Video placeholder: force diagram examples",
        assignment: "Solve three force diagram tasks and mark assumptions.",
        quiz: "Why do physicists simplify a system before solving?"
      },
      {
        id: "newtons-second-law",
        title: "Newton's 2nd Law",
        duration: "24 min",
        materials: ["Force diagram sheet", "Worked examples"],
        videoLabel: "How does it work?",
        assignment: "Solve three force diagram tasks and write what changed when mass increased.",
        quiz: "What happens to acceleration when net force increases?"
      },
      {
        id: "energy-methods",
        title: "Energy methods",
        duration: "25 min",
        materials: ["Energy notes", "Worked examples"],
        videoLabel: "Video placeholder: conservation walkthrough",
        assignment: "Compare force and energy approaches on one task.",
        quiz: "When is energy conservation the cleaner method?"
      },
      {
        id: "research-problem",
        title: "From problem to research question",
        duration: "20 min",
        materials: ["Research question template", "Experiment notes"],
        videoLabel: "Video placeholder: turning prompts into research",
        assignment: "Turn one physics prompt into a testable research question.",
        quiz: "What makes a research question measurable?"
      }
    ]
  },
  {
    id: "university-admission-basics",
    track: "Mentoria Physics",
    title: "University Admission Basics",
    description: "A practical track for building a shortlist, activity story, and application timeline.",
    difficulty: "Intermediate",
    tags: ["admissions", "english", "scholarship", "social-impact"],
    progress: 44,
    lessons: [
      {
        id: "profile-audit",
        title: "Profile audit",
        duration: "19 min",
        materials: ["Activity map", "Profile scorecard"],
        videoLabel: "Video placeholder: profile review",
        assignment: "List five activities and connect each to one evidence point.",
        quiz: "Which activity detail is strongest for admissions?"
      },
      {
        id: "shortlist-logic",
        title: "University shortlist logic",
        duration: "21 min",
        materials: ["Shortlist table", "Deadline tracker"],
        videoLabel: "Video placeholder: choosing target schools",
        assignment: "Build a 6 school shortlist with one reason per school.",
        quiz: "Why should a shortlist include more than ranking?"
      },
      {
        id: "deadline-system",
        title: "Deadline system",
        duration: "15 min",
        materials: ["Timeline template", "Weekly planning sheet"],
        videoLabel: "Video placeholder: planning backwards",
        assignment: "Create a 4 week application schedule.",
        quiz: "What is the first deadline you should plan backward from?"
      }
    ]
  }
];

export function getOptionLabel(questionId: OnboardingQuestionId, optionId: string) {
  return onboardingQuestions.find((question) => question.id === questionId)?.options.find((option) => option.id === optionId)
    ?.label ?? optionId;
}

export function getOptionLabels(questionId: OnboardingQuestionId, optionIds: string[]) {
  return optionIds.map((optionId) => getOptionLabel(questionId, optionId));
}

const tagExpansions: Record<string, string[]> = {
  "science-research": ["science", "stem", "research", "competition"],
  "business-economics": ["business", "finance", "economics", "case"],
  technology: ["programming", "technology", "stem", "hackathon"],
  "global-admissions": ["admissions", "scholarship", "english", "global"],
  "language-tests": ["english", "ielts", "sat", "admissions"],
  online: ["online"],
  offline: ["offline"],
  hybrid: ["hybrid"],
  kazakhstan: ["kazakhstan"],
  global: ["global"],
  "central-asia": ["central-asia", "central asia"]
};

const opportunityKeywordTags: Array<[RegExp, string[]]> = [
  [/(stem|physics|science|research|experiment|олимпиад|науч|исследован)/i, ["stem", "science", "research"]],
  [/(programming|code|coding|hackathon|хакатон|developer|web|data)/i, ["programming", "technology", "hackathon"]],
  [/(business|startup|case|economics|finance|стартап|бизнес|эконом)/i, ["business", "finance"]],
  [/(scholarship|admission|university|essay|sat|ielts|nyuad|грант|стипенд|университет)/i, ["admissions", "scholarship", "english", "global"]],
  [/(volunteer|social|impact|community|волонт|социаль)/i, ["social-impact", "volunteering"]],
  [/(competition|cup|championship|tournament|contest|конкурс|чемпионат|турнир)/i, ["competition"]],
  [/(webinar|вебинар|meeting|мит|course|курс|lesson)/i, ["event", "online"]],
  [/(kazakhstan|almaty|astana|казахстан|алматы|астана)/i, ["kazakhstan"]],
  [/(central asia|central-asia|asia|азия)/i, ["central-asia"]],
  [/(global|international|world|международ)/i, ["global"]]
];

function normalizeTag(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
}

function getProfileTags(profile: OnboardingProfile) {
  const tags = new Set<string>();
  const profileValues = [
    profile.grade,
    profile.academicDirection,
    ...profile.interests,
    ...profile.directions,
    ...profile.formats,
    ...profile.locations
  ];

  profileValues.forEach((value) => {
    if (!value) return;
    const normalized = normalizeTag(value);
    tags.add(normalized);
    tagExpansions[normalized]?.forEach((tag) => tags.add(normalizeTag(tag)));
  });

  return tags;
}

export function getOpportunityTags(opportunity: Opportunity) {
  const tags = new Set<string>();
  const fields = [
    opportunity.category,
    opportunity.direction,
    opportunity.format,
    opportunity.location,
    opportunity.title,
    opportunity.description,
    opportunity.requirements,
    ...opportunity.tags
  ];

  fields.forEach((field) => {
    if (!field) return;
    tags.add(normalizeTag(field));
    tagExpansions[normalizeTag(field)]?.forEach((tag) => tags.add(normalizeTag(tag)));
  });

  const searchableText = fields.join(" ");
  opportunityKeywordTags.forEach(([pattern, inferredTags]) => {
    if (pattern.test(searchableText)) {
      inferredTags.forEach((tag) => tags.add(normalizeTag(tag)));
    }
  });

  return [...tags];
}

function parseOpportunityDeadline(deadline: string) {
  if (!deadline) return null;

  const date = new Date(`${deadline}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function isPastDeadline(opportunity: Opportunity, now = new Date()) {
  const deadline = parseOpportunityDeadline(opportunity.deadline);
  if (!deadline) return false;

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return deadline < today;
}

export function hasUpcomingDeadline(opportunity: Opportunity, now = new Date()) {
  const deadline = parseOpportunityDeadline(opportunity.deadline);
  if (!deadline) return false;

  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  return deadline >= today;
}

export function formatOpportunityDeadline(opportunity: Opportunity) {
  const deadline = parseOpportunityDeadline(opportunity.deadline);

  if (!deadline) {
    return "Rolling";
  }

  if (isPastDeadline(opportunity)) {
    return "Past deadline";
  }

  return deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

export function getRecommendedOpportunities(profile: OnboardingProfile, opportunityPool: Opportunity[] = opportunities, limit = 3) {
  const selectedTags = getProfileTags(profile);

  const ranked = opportunityPool
    .map((opportunity, index) => {
      const opportunityTags = getOpportunityTags(opportunity);
      const tagScore = opportunityTags.filter((tag) => selectedTags.has(tag)).length;
      const gradeScore = opportunity.grades.includes(profile.grade) ? 2 : 0;
      const futureDeadlineScore = hasUpcomingDeadline(opportunity) ? 0.75 : 0;
      const pastDeadlineScore = isPastDeadline(opportunity) ? -1.5 : 0;

      return {
        opportunity,
        score: tagScore + gradeScore + futureDeadlineScore + pastDeadlineScore,
        index
      };
    })
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return ranked.slice(0, limit).map((item) => item.opportunity);
}

export function getRecommendedCourses(profile: OnboardingProfile, limit = 3) {
  const selectedTags = new Set([profile.academicDirection, ...profile.interests]);

  const ranked = courses
    .map((course) => ({
      course,
      score: course.tags.filter((tag) => selectedTags.has(tag)).length
    }))
    .sort((a, b) => b.score - a.score);

  return ranked.slice(0, limit).map((item) => item.course);
}

export const faqItems: FaqItem[] = [
  {
    question: "Who is Mentoria Hub for?",
    answer: "Students in grades 8-11 who want to find opportunities and prepare through Mentoria courses.",
    open: true
  },
  {
    question: "What opportunities can students find?",
    answer: "Competitions, scholarships, internships, summer schools, research programs, and similar education paths."
  },
  {
    question: "Are Mentoria courses included?",
    answer: "Yes. Courses can support language tests, science tracks, and application preparation."
  },
  {
    question: "What happens after a match appears?",
    answer: "The student can review it in the dashboard with preparation notes and next steps."
  }
];
