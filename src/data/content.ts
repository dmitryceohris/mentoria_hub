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
  coverUrl?: string;
  difficulty: "Beginner" | "Intermediate";
  tags: string[];
  progress: number;
  lessons: Lesson[];
};

export type Lesson = {
  id: string;
  title: string;
  description?: string;
  coverUrl?: string;
  duration: string;
  materials: string[];
  videoUrl?: string;
  videoLabel: string;
  assignment: string;
  quiz: string;
};

export type MentorPetLessonNote = {
  id: string;
  courseId: string;
  lessonId: string;
  title: string;
  body: string;
  createdBy: "mentorpet";
  prototypeOnly?: boolean;
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
    description: "Academic vocabulary, reading, writing, and communication skills for school, programs, and applications.",
    difficulty: "Beginner",
    tags: ["english", "admissions", "writing"],
    progress: 62,
    lessons: [
      {
        id: "academic-vocabulary",
        title: "Academic Vocabulary",
        description: "Build a reusable bank of academic verbs, nouns, and sentence patterns for school and application writing.",
        duration: "18 min",
        materials: ["Vocabulary bank", "Practice worksheet"],
        videoLabel: "Video placeholder: academic vocabulary strategy",
        assignment: "Write 8 sentences about one target topic using academic verbs and precise nouns.",
        quiz: "Which word choice sounds most formal in an academic paragraph?"
      },
      {
        id: "reading-skimming-scanning",
        title: "Academic Reading 1: Skimming and Scanning",
        description: "Use fast reading strategies to find the main topic, key facts, and target details in a text.",
        duration: "17 min",
        materials: ["Reading guide", "Practice passage"],
        videoLabel: "Video placeholder: skimming and scanning",
        assignment: "Skim one article and scan it for five named facts.",
        quiz: "What is the difference between skimming and scanning?"
      },
      {
        id: "reading-critical-analysis",
        title: "Academic Reading 2: Critical Analysis",
        description: "Identify claims, evidence, and bias so you can read like a student and not just a decoder.",
        duration: "20 min",
        materials: ["Annotation sheet", "Reading checklist"],
        videoLabel: "Video placeholder: critical reading",
        assignment: "Annotate a short article for main idea, evidence, and assumptions.",
        quiz: "What should you look for when checking an author's argument?"
      },
      {
        id: "writing-process",
        title: "The Writing Process",
        description: "Move from brainstorming to outlining and drafting without losing your core idea.",
        duration: "19 min",
        materials: ["Writing planner", "Draft outline"],
        videoLabel: "Video placeholder: writing workflow",
        assignment: "Plan a one-page draft with brainstorm, outline, and first paragraph.",
        quiz: "Which step usually happens before the first draft?"
      },
      {
        id: "paragraph-structure",
        title: "Paragraph Structure",
        description: "Build one strong paragraph with a topic sentence, development, and a clear close.",
        duration: "16 min",
        materials: ["Paragraph frame", "Sample response"],
        videoLabel: "Video placeholder: paragraph anatomy",
        assignment: "Rewrite a weak paragraph using one clear topic sentence and two support points.",
        quiz: "What is the job of the topic sentence?"
      },
      {
        id: "essay-structure",
        title: "Essay Structure",
        description: "Organize an introduction, body paragraphs, and conclusion around one sharp thesis.",
        duration: "22 min",
        materials: ["Essay outline", "Thesis examples"],
        videoLabel: "Video placeholder: essay skeleton",
        assignment: "Outline a three-paragraph essay on a school-related prompt.",
        quiz: "Where should the thesis statement usually appear?"
      },
      {
        id: "essay-types",
        title: "Types of Academic Essays",
        description: "Compare structure and purpose in compare-contrast and persuasive essays.",
        duration: "18 min",
        materials: ["Essay samples", "Prompt sorter"],
        videoLabel: "Video placeholder: essay types",
        assignment: "Choose the right essay type for two different prompts.",
        quiz: "Which essay type is designed to convince a reader?"
      },
      {
        id: "research-skills",
        title: "Research Skills",
        description: "Find credible academic sources, search with intent, and check whether a source is reliable.",
        duration: "20 min",
        materials: ["Source checklist", "Search plan"],
        videoLabel: "Video placeholder: research workflow",
        assignment: "Find two credible sources and explain why each is useful.",
        quiz: "What is one sign that a source may not be reliable?"
      },
      {
        id: "integrating-sources",
        title: "Integrating Sources",
        description: "Paraphrase and summarize external ideas without losing your own voice or control of the argument.",
        duration: "18 min",
        materials: ["Paraphrase guide", "Citation examples"],
        videoLabel: "Video placeholder: source integration",
        assignment: "Rewrite one source sentence as a paraphrase and one as a summary.",
        quiz: "What is the main goal of paraphrasing?"
      },
      {
        id: "citation-integrity",
        title: "Citation and Academic Integrity",
        description: "Use APA and MLA basics, avoid plagiarism, and keep a clean academic trail.",
        duration: "21 min",
        materials: ["Citation cheat sheet", "Integrity checklist"],
        videoLabel: "Video placeholder: citations and integrity",
        assignment: "Format two references in either APA or MLA style.",
        quiz: "Why do citations matter in academic writing?"
      },
      {
        id: "academic-listening",
        title: "Academic Listening",
        description: "Follow lecture structure, capture key ideas, and build notes that you can reuse later.",
        duration: "17 min",
        materials: ["Lecture notes template", "Cornell sheet"],
        videoLabel: "Video placeholder: lecture listening",
        assignment: "Take Cornell notes from a short lecture clip.",
        quiz: "What should you record first when listening to a lecture?"
      },
      {
        id: "academic-speaking",
        title: "Academic Speaking",
        description: "Join seminars, build arguments, and disagree respectfully while staying clear and precise.",
        duration: "16 min",
        materials: ["Discussion prompts", "Speaking rubric"],
        videoLabel: "Video placeholder: seminar speaking",
        assignment: "Write three seminar responses, including one respectful disagreement.",
        quiz: "What makes a seminar response academically strong?"
      },
      {
        id: "presentation-skills",
        title: "Presentation Skills",
        description: "Plan a short oral report, use visuals well, and practice confident delivery.",
        duration: "19 min",
        materials: ["Slide plan", "Presentation checklist"],
        videoLabel: "Video placeholder: presentation practice",
        assignment: "Outline a three-slide presentation with one key message per slide.",
        quiz: "What should visual material do in a presentation?"
      },
      {
        id: "academic-communication",
        title: "Academic Communication",
        description: "Write formal emails to teachers and university offices with the right tone and structure.",
        duration: "15 min",
        materials: ["Email template", "Tone guide"],
        videoLabel: "Video placeholder: formal communication",
        assignment: "Draft a formal email asking for academic advice or clarification.",
        quiz: "What makes an academic email sound professional?"
      }
    ]
  },
  {
    id: "physics-basics",
    track: "Mentoria Physics",
    title: "Physics Basics",
    description: "Kinematics, dynamics, statics, and mechanics modeling for school science and competitions.",
    difficulty: "Beginner",
    tags: ["stem", "science", "physics", "mechanics"],
    progress: 38,
    lessons: [
      {
        id: "forces-models",
        title: "Introduction to Physics and the Scientific Method",
        description: "Frame physics as measurement, modeling, and testing instead of memorizing formulas too early.",
        duration: "18 min",
        materials: ["Science method notes", "Observation sheet"],
        videoLabel: "Video placeholder: scientific method in physics",
        assignment: "Write one hypothesis and one testable observation for a motion problem.",
        quiz: "What is the purpose of a scientific hypothesis?"
      },
      {
        id: "newtons-second-law",
        title: "Newton's Laws and Dynamics",
        description: "Use Newton's laws to connect net force, mass, and acceleration in real systems.",
        duration: "24 min",
        materials: ["Force diagram sheet", "Worked examples"],
        videoLabel: "Video placeholder: Newton's laws",
        assignment: "Solve three dynamics problems and explain how the net force changed.",
        quiz: "What happens to acceleration when net force increases?"
      },
      {
        id: "measurement-units",
        title: "Measurement, Units, and Significant Figures",
        description: "Use SI units, conversions, and precision rules to keep calculations clean.",
        duration: "17 min",
        materials: ["Unit table", "Precision practice"],
        videoLabel: "Video placeholder: units and precision",
        assignment: "Convert three measurements and round them to the correct significant figures.",
        quiz: "Why do significant figures matter in physics?"
      },
      {
        id: "scalars-vectors-motion",
        title: "Scalars, Vectors, and 1D Motion",
        description: "Separate direction from size and use it to describe position and displacement correctly.",
        duration: "19 min",
        materials: ["Vector sketch sheet", "1D motion examples"],
        videoLabel: "Video placeholder: scalars and vectors",
        assignment: "Classify eight quantities as scalar or vector.",
        quiz: "Which quantity includes direction?"
      },
      {
        id: "speed-velocity-acceleration",
        title: "Speed, Velocity, and Acceleration",
        description: "Build the core kinematics language for how motion changes over time.",
        duration: "21 min",
        materials: ["Formula sheet", "Motion exercises"],
        videoLabel: "Video placeholder: speed and acceleration",
        assignment: "Solve three motion problems using speed, velocity, and acceleration.",
        quiz: "What does acceleration measure?"
      },
      {
        id: "motion-graphs",
        title: "Motion Graphs and Kinematics Equations",
        description: "Read and create distance-time and velocity-time graphs, then connect them to equations.",
        duration: "23 min",
        materials: ["Graph workbook", "Equation reference"],
        videoLabel: "Video placeholder: motion graphs",
        assignment: "Interpret two graphs and calculate one missing value from each.",
        quiz: "What does the slope of a distance-time graph show?"
      },
      {
        id: "free-body-diagrams",
        title: "Free-Body Diagrams and Resultant Force",
        description: "Draw forces clearly before solving any mechanics problem.",
        duration: "18 min",
        materials: ["FBD template", "Force cards"],
        videoLabel: "Video placeholder: free-body diagrams",
        assignment: "Draw free-body diagrams for three real-world situations.",
        quiz: "Why is a free-body diagram useful before calculation?"
      },
      {
        id: "friction-drag-circular-motion",
        title: "Friction, Drag, and Circular Motion",
        description: "Model resistive forces and the role of inward force in curved motion.",
        duration: "20 min",
        materials: ["Force notes", "Circular motion examples"],
        videoLabel: "Video placeholder: friction and drag",
        assignment: "Compare a friction problem and a circular motion problem in one page.",
        quiz: "Which force is needed to keep an object moving in a circle?"
      },
      {
        id: "energy-methods",
        title: "Work, Energy, Power, and Efficiency",
        description: "Switch between force and energy methods to solve mechanics problems more efficiently.",
        duration: "22 min",
        materials: ["Energy notes", "Worked examples"],
        videoLabel: "Video placeholder: energy methods",
        assignment: "Solve one problem with forces and again with energy methods.",
        quiz: "When is energy the cleaner method to use?"
      },
      {
        id: "momentum-impulse",
        title: "Momentum and Impulse",
        description: "Track how motion changes during collisions and short interactions.",
        duration: "19 min",
        materials: ["Momentum sheet", "Collision practice"],
        videoLabel: "Video placeholder: momentum and impulse",
        assignment: "Calculate momentum before and after a short collision.",
        quiz: "What is impulse equal to?"
      },
      {
        id: "moments-torque",
        title: "Moments, Torque, and Rotational Balance",
        description: "Use turning effects to study beams, levers, and balanced systems.",
        duration: "21 min",
        materials: ["Lever diagram", "Moments worksheet"],
        videoLabel: "Video placeholder: torque and balance",
        assignment: "Find the turning effect of three forces around a pivot.",
        quiz: "What is the moment of a force?"
      },
      {
        id: "static-equilibrium",
        title: "Static Equilibrium and Center of Mass",
        description: "Explain when a system is stable, balanced, and not rotating.",
        duration: "18 min",
        materials: ["Balance examples", "Center of mass notes"],
        videoLabel: "Video placeholder: equilibrium",
        assignment: "Mark the center of mass on three objects and explain stability.",
        quiz: "What conditions must be met for static equilibrium?"
      },
      {
        id: "pressure-density-fluids",
        title: "Pressure, Density, and Mechanical Fluids",
        description: "Connect pressure, density, and fluid behavior in everyday mechanical systems.",
        duration: "20 min",
        materials: ["Pressure chart", "Fluid examples"],
        videoLabel: "Video placeholder: fluids and pressure",
        assignment: "Compare pressure in two different situations using one formula.",
        quiz: "How does pressure change when the same force acts on a smaller area?"
      },
      {
        id: "mixed-mechanics-review",
        title: "Mixed Mechanics Review and Problem Solving",
        description: "Pull the entire mechanics track together with mixed questions and method choice.",
        duration: "26 min",
        materials: ["Review set", "Formula summary"],
        videoLabel: "Video placeholder: mechanics review",
        assignment: "Solve a mixed mechanics set and label the topic used for each answer.",
        quiz: "What is the first step in solving a mixed mechanics problem?"
      }
    ]
  },
  {
    id: "university-admission-basics",
    track: "Mentoria Admissions",
    title: "University Admission Basics",
    description: "A practical track for building a shortlist, activity story, and application timeline.",
    difficulty: "Intermediate",
    tags: ["admissions", "english", "scholarship"],
    progress: 44,
    lessons: [
      {
        id: "profile-audit",
        title: "Admissions Process Overview",
        description: "Understand the moving parts of a first-year application and the major deadline types.",
        duration: "18 min",
        materials: ["Application map", "Deadline sheet"],
        videoLabel: "Video placeholder: admissions overview",
        assignment: "Map one university application into parts and dates.",
        quiz: "What is the purpose of an application timeline?"
      },
      {
        id: "shortlist-logic",
        title: "College Match",
        description: "Group schools into Reach, Match, and Safety so the list has balance and strategy.",
        duration: "19 min",
        materials: ["Shortlist table", "Fit checklist"],
        videoLabel: "Video placeholder: college match",
        assignment: "Sort six universities into Reach, Match, and Safety.",
        quiz: "Why should a shortlist include more than one risk level?"
      },
      {
        id: "deadline-system",
        title: "Academic Requirements",
        description: "Read transcripts, understand GPA logic, and see how core subjects affect eligibility.",
        duration: "17 min",
        materials: ["Transcript tracker", "GPA guide"],
        videoLabel: "Video placeholder: academic requirements",
        assignment: "Review a sample transcript and note two strengths and two gaps.",
        quiz: "Why do core subjects matter in admissions?"
      },
      {
        id: "standardized-tests",
        title: "Standardized Tests",
        description: "Compare SAT and ACT formats, pacing, and the way they fit the application strategy.",
        duration: "20 min",
        materials: ["Test comparison sheet", "Timing chart"],
        videoLabel: "Video placeholder: SAT and ACT",
        assignment: "Compare SAT and ACT in a one-page decision table.",
        quiz: "What is one difference between SAT and ACT timing?"
      },
      {
        id: "language-testing",
        title: "Language Testing",
        description: "Understand TOEFL and IELTS basics and how language scores fit application requirements.",
        duration: "18 min",
        materials: ["Score guide", "Requirement tracker"],
        videoLabel: "Video placeholder: English proficiency tests",
        assignment: "Find the minimum language score for one target university.",
        quiz: "Which exam measures English proficiency for university entry?"
      },
      {
        id: "extracurriculars",
        title: "Extracurriculars",
        description: "Shape your activities into a strong story with leadership, commitment, and impact.",
        duration: "19 min",
        materials: ["Activity map", "Impact rubric"],
        videoLabel: "Video placeholder: extracurricular profile",
        assignment: "Rank five activities by strength of impact and leadership.",
        quiz: "What makes an extracurricular meaningful for applications?"
      },
      {
        id: "activity-list",
        title: "Activity List Formation",
        description: "Write concise activity entries that are specific, quantified, and easy to scan.",
        duration: "16 min",
        materials: ["Common App format guide", "Draft list"],
        videoLabel: "Video placeholder: activity list writing",
        assignment: "Rewrite three activities into short application-ready lines.",
        quiz: "What should each activity entry communicate quickly?"
      },
      {
        id: "personal-statement-topic",
        title: "Personal Statement 1: Choosing a Topic",
        description: "Choose a story that is personal, focused, and not built from a cliché.",
        duration: "17 min",
        materials: ["Idea map", "Topic filter"],
        videoLabel: "Video placeholder: essay topic choice",
        assignment: "List three possible essay stories and explain why one is strongest.",
        quiz: "What should you avoid when choosing a personal statement topic?"
      },
      {
        id: "personal-statement-structure",
        title: "Personal Statement 2: Structure",
        description: "Use storytelling structure and the 'show, don't tell' rule to draft the first version.",
        duration: "20 min",
        materials: ["Story arc template", "Draft frame"],
        videoLabel: "Video placeholder: essay structure",
        assignment: "Write a first draft opening that shows the story in motion.",
        quiz: "What does 'show, don't tell' mean in a personal statement?"
      },
      {
        id: "personal-statement-editing",
        title: "Personal Statement 3: Editing",
        description: "Improve logic, tone, and grammar so the statement reads smoothly and honestly.",
        duration: "18 min",
        materials: ["Editing checklist", "Tone guide"],
        videoLabel: "Video placeholder: essay editing",
        assignment: "Edit one paragraph for clarity, flow, and precision.",
        quiz: "What should you check first when revising an essay?"
      },
      {
        id: "supplemental-essays",
        title: "Supplemental Essays",
        description: "Answer prompts like 'Why us?' with specific research and a clear reason for fit.",
        duration: "19 min",
        materials: ["Prompt tracker", "Research notes"],
        videoLabel: "Video placeholder: supplemental essays",
        assignment: "Draft a short 'Why this college?' response using one concrete example.",
        quiz: "What is the main goal of a supplemental essay?"
      },
      {
        id: "recommendation-letters",
        title: "Letters of Recommendation",
        description: "Choose recommenders, manage timelines, and prepare a useful brag sheet.",
        duration: "16 min",
        materials: ["Brag sheet template", "Request timeline"],
        videoLabel: "Video placeholder: recommendation letters",
        assignment: "Draft a recommendation request message for one teacher.",
        quiz: "What should a brag sheet help your recommender understand?"
      },
      {
        id: "financial-aid",
        title: "Financial Aid",
        description: "Distinguish need-based and merit-based support and learn the basics of FAFSA and CSS Profile.",
        duration: "18 min",
        materials: ["Aid comparison", "Form checklist"],
        videoLabel: "Video placeholder: financial aid",
        assignment: "List the documents needed for one financial aid form.",
        quiz: "What is the difference between need-based and merit aid?"
      },
      {
        id: "admissions-interviews",
        title: "Admissions Interviews",
        description: "Practice answer structure, etiquette, and mock interview behavior.",
        duration: "17 min",
        materials: ["Interview prompts", "Mock scorecard"],
        videoLabel: "Video placeholder: admissions interviews",
        assignment: "Write answers to three common interview questions.",
        quiz: "What should you do when you do not know an interview answer?"
      }
    ]
  },
  {
    id: "chemistry-basics",
    track: "Mentoria Chemistry",
    title: "Chemistry Basics",
    description: "Atoms, bonding, reactions, and practical chemistry for secondary school science tracks.",
    difficulty: "Beginner",
    tags: ["stem", "science", "chemistry"],
    progress: 24,
    lessons: [
      {
        id: "chemistry-introduction",
        title: "Introduction to Chemistry and Lab Safety",
        description: "Learn what chemistry studies and how to work safely and carefully in the lab.",
        duration: "17 min",
        materials: ["Safety checklist", "Lab notebook"],
        videoLabel: "Video placeholder: chemistry basics",
        assignment: "List five lab safety rules and one reason for each.",
        quiz: "Why is lab safety part of chemistry?"
      },
      {
        id: "atomic-structure",
        title: "Atomic Structure and the Periodic Table",
        description: "Review subatomic particles, atomic number, mass number, and periodic patterns.",
        duration: "21 min",
        materials: ["Periodic table", "Atom diagram"],
        videoLabel: "Video placeholder: atomic structure",
        assignment: "Label the parts of three atoms from their symbols.",
        quiz: "What does atomic number tell you?"
      },
      {
        id: "bonding-structure",
        title: "Chemical Bonding and Structure",
        description: "Compare ionic, covalent, and metallic bonding and link bonding to structure.",
        duration: "22 min",
        materials: ["Bonding chart", "Structure notes"],
        videoLabel: "Video placeholder: chemical bonding",
        assignment: "Classify five substances by bonding type.",
        quiz: "Which bond involves electron sharing?"
      },
      {
        id: "formulae-equations-mole",
        title: "Formulae, Equations, and the Mole",
        description: "Write formulae, balance equations, and use mole ideas in simple calculations.",
        duration: "24 min",
        materials: ["Equation practice", "Mole sheet"],
        videoLabel: "Video placeholder: formulae and equations",
        assignment: "Balance four equations and identify reactants and products.",
        quiz: "Why do chemical equations need to be balanced?"
      },
      {
        id: "states-particle-model",
        title: "States of Matter and the Particle Model",
        description: "Connect particle behavior to solids, liquids, gases, and changes of state.",
        duration: "18 min",
        materials: ["Particle model notes", "State diagram"],
        videoLabel: "Video placeholder: particle model",
        assignment: "Explain three state changes using particle motion.",
        quiz: "What happens to particles when a solid melts?"
      },
      {
        id: "acids-bases-salts",
        title: "Acids, Bases, and Salts",
        description: "Understand pH, neutralization, and how common salts are prepared.",
        duration: "20 min",
        materials: ["pH scale", "Reaction guide"],
        videoLabel: "Video placeholder: acids and bases",
        assignment: "Sort everyday substances by acidic, neutral, or basic.",
        quiz: "What happens during neutralization?"
      },
      {
        id: "chemical-reactions",
        title: "Chemical Reactions and Reactivity",
        description: "Compare common reaction types and use the reactivity series to predict outcomes.",
        duration: "21 min",
        materials: ["Reactivity series", "Reaction cards"],
        videoLabel: "Video placeholder: reactions",
        assignment: "Predict whether three metals will react with acid.",
        quiz: "What is a displacement reaction?"
      },
      {
        id: "energetics",
        title: "Energy Changes in Reactions",
        description: "Study exothermic and endothermic reactions and how energy diagrams describe them.",
        duration: "18 min",
        materials: ["Energy diagrams", "Reaction examples"],
        videoLabel: "Video placeholder: energetics",
        assignment: "Label one reaction as exothermic or endothermic and explain why.",
        quiz: "What does exothermic mean?"
      },
      {
        id: "rates-catalysts",
        title: "Rates of Reaction and Catalysts",
        description: "See how concentration, temperature, surface area, and catalysts change reaction speed.",
        duration: "19 min",
        materials: ["Rates graph", "Experiment notes"],
        videoLabel: "Video placeholder: rates of reaction",
        assignment: "Design a fair test for one rate factor.",
        quiz: "Which factor usually increases reaction rate the most directly?"
      },
      {
        id: "electrochemistry-redox",
        title: "Electrochemistry and Redox",
        description: "Learn oxidation and reduction in the context of simple cells and electrolysis.",
        duration: "22 min",
        materials: ["Cell diagram", "Redox practice"],
        videoLabel: "Video placeholder: electrochemistry",
        assignment: "Identify oxidation and reduction in two reaction examples.",
        quiz: "What happens at the anode during electrolysis?"
      },
      {
        id: "metals-extraction",
        title: "Metals and Extraction",
        description: "Connect metal reactivity to extraction methods, corrosion, and alloys.",
        duration: "20 min",
        materials: ["Metals chart", "Extraction notes"],
        videoLabel: "Video placeholder: metals and extraction",
        assignment: "Match three metals to the extraction method they need.",
        quiz: "Why are some metals harder to extract than others?"
      },
      {
        id: "organic-basics",
        title: "Organic Chemistry Basics",
        description: "Meet the basic idea of hydrocarbons, fuels, and simple organic families.",
        duration: "18 min",
        materials: ["Organic family chart", "Fuel notes"],
        videoLabel: "Video placeholder: organic chemistry",
        assignment: "Identify the functional group family in three example molecules.",
        quiz: "What is a hydrocarbon made of?"
      },
      {
        id: "separation-purity",
        title: "Separation, Purity, and Analytical Techniques",
        description: "Use filtration, crystallization, chromatography, and purity ideas to analyze mixtures.",
        duration: "19 min",
        materials: ["Separation guide", "Chromatography strip"],
        videoLabel: "Video placeholder: separation techniques",
        assignment: "Choose the best method to separate three different mixtures.",
        quiz: "Which method is best for separating dissolved substances?"
      },
      {
        id: "chemistry-practical-review",
        title: "Chemistry Practical Skills and Review",
        description: "Pull together measurement, observation, and the core ideas from the course.",
        duration: "24 min",
        materials: ["Practical checklist", "Review set"],
        videoLabel: "Video placeholder: chemistry practical review",
        assignment: "Complete a mixed chemistry review and note one weak topic.",
        quiz: "What makes a chemistry result reliable?"
      }
    ]
  },
  {
    id: "biology-basics",
    track: "Mentoria Biology",
    title: "Biology Basics",
    description: "Cells, genetics, evolution, and ecology in a 14-lesson school biology curriculum.",
    difficulty: "Beginner",
    tags: ["stem", "science", "biology"],
    progress: 31,
    lessons: [
      {
        id: "intro-biology-scientific-method",
        title: "Introduction to Biology and the Scientific Method",
        description: "Define life, frame a question, and use evidence to build a scientific explanation.",
        duration: "18 min",
        materials: ["Method notes", "Hypothesis sheet"],
        videoLabel: "Video placeholder: scientific method in biology",
        assignment: "Write one hypothesis and one testable prediction.",
        quiz: "What is the role of a hypothesis?"
      },
      {
        id: "chemical-basis-life",
        title: "Chemical Basis of Life",
        description: "Review water properties and the macromolecules that build living systems.",
        duration: "22 min",
        materials: ["Biomolecule chart", "Water notes"],
        videoLabel: "Video placeholder: chemical basis of life",
        assignment: "Match each macromolecule to one of its core functions.",
        quiz: "Which macromolecule stores genetic information?"
      },
      {
        id: "cell-theory-structure",
        title: "Cell Theory and Structure",
        description: "Learn the main ideas of cell theory and compare prokaryotic and eukaryotic cells.",
        duration: "19 min",
        materials: ["Cell comparison sheet", "Theory notes"],
        videoLabel: "Video placeholder: cell theory",
        assignment: "Compare a prokaryotic and eukaryotic cell in a table.",
        quiz: "What does cell theory say about living things?"
      },
      {
        id: "cell-organelles",
        title: "Cell Organelles",
        description: "Connect each organelle to its job inside the cell.",
        duration: "20 min",
        materials: ["Organelle cards", "Cell diagram"],
        videoLabel: "Video placeholder: organelles",
        assignment: "Label a cell diagram and explain five organelle functions.",
        quiz: "Which organelle makes most ATP in eukaryotic cells?"
      },
      {
        id: "cellular-transport",
        title: "Cellular Transport",
        description: "Use membrane structure to explain diffusion, osmosis, and active transport.",
        duration: "21 min",
        materials: ["Membrane notes", "Transport scenarios"],
        videoLabel: "Video placeholder: membrane transport",
        assignment: "Predict the direction of movement in three transport examples.",
        quiz: "What is the difference between passive and active transport?"
      },
      {
        id: "cell-cycle-mitosis",
        title: "Cell Cycle and Mitosis",
        description: "Follow the cell cycle and the stages of somatic cell division.",
        duration: "23 min",
        materials: ["Mitosis diagram", "Cycle notes"],
        videoLabel: "Video placeholder: mitosis",
        assignment: "Put the stages of mitosis in order and describe each one.",
        quiz: "What happens during mitosis?"
      },
      {
        id: "photosynthesis",
        title: "Energy Metabolism: Photosynthesis",
        description: "Explain how plants convert light energy into chemical energy.",
        duration: "20 min",
        materials: ["Photosynthesis chart", "Chloroplast notes"],
        videoLabel: "Video placeholder: photosynthesis",
        assignment: "Label the inputs and outputs of photosynthesis.",
        quiz: "Why is chlorophyll important?"
      },
      {
        id: "cellular-respiration",
        title: "Energy Metabolism: Cellular Respiration",
        description: "Track glycolysis, the Krebs cycle, electron transport, and ATP synthesis.",
        duration: "24 min",
        materials: ["Respiration pathway", "ATP notes"],
        videoLabel: "Video placeholder: cellular respiration",
        assignment: "Map the main stages of respiration in the correct order.",
        quiz: "What is the main purpose of cellular respiration?"
      },
      {
        id: "meiosis-gamete-formation",
        title: "Meiosis and Gamete Formation",
        description: "See how sex cells are formed and why crossing over increases diversity.",
        duration: "22 min",
        materials: ["Meiosis chart", "Variation notes"],
        videoLabel: "Video placeholder: meiosis",
        assignment: "Compare mitosis and meiosis in one chart.",
        quiz: "Why is meiosis important for genetic diversity?"
      },
      {
        id: "fundamentals-genetics",
        title: "Fundamentals of Genetics",
        description: "Use Mendel's laws, dominant and recessive alleles, and simple crosses.",
        duration: "21 min",
        materials: ["Punnett square sheet", "Inheritance notes"],
        videoLabel: "Video placeholder: Mendelian genetics",
        assignment: "Solve three monohybrid crosses.",
        quiz: "What does a dominant allele do?"
      },
      {
        id: "molecular-genetics",
        title: "Molecular Genetics",
        description: "Describe DNA structure and the flow of information through replication, transcription, and translation.",
        duration: "23 min",
        materials: ["DNA model", "Protein synthesis notes"],
        videoLabel: "Video placeholder: molecular genetics",
        assignment: "Label the steps from DNA to protein in order.",
        quiz: "What is the role of transcription?"
      },
      {
        id: "evolution-theory",
        title: "Theory of Evolution",
        description: "Understand natural selection, microevolution, and the formation of new species.",
        duration: "20 min",
        materials: ["Evolution timeline", "Selection notes"],
        videoLabel: "Video placeholder: evolution",
        assignment: "Explain one example of natural selection in a short paragraph.",
        quiz: "What is natural selection?"
      },
      {
        id: "ecology-fundamentals",
        title: "Fundamentals of Ecology",
        description: "Follow ecological levels, populations, food chains, and energy transfer.",
        duration: "19 min",
        materials: ["Food web sheet", "Population graph"],
        videoLabel: "Video placeholder: ecology",
        assignment: "Build one food chain and one food web from the same habitat.",
        quiz: "Where does energy move in an ecosystem?"
      },
      {
        id: "human-impact-biosphere",
        title: "Human Impact on the Biosphere",
        description: "Track carbon and nitrogen cycles and the human effects on climate and biodiversity.",
        duration: "22 min",
        materials: ["Cycle diagram", "Impact notes"],
        videoLabel: "Video placeholder: human impact on biosphere",
        assignment: "Name two human activities that alter an ecosystem.",
        quiz: "Which cycle is strongly affected by fossil fuel use?"
      }
    ]
  },
];

export const mentorPetLessonNotes: MentorPetLessonNote[] = [
  {
    id: "mentorpet-newtons-force-check",
    courseId: "physics-basics",
    lessonId: "newtons-second-law",
    title: "MentorPet checkpoint",
    body: "Before the next task, write one sentence explaining which object you chose as the system and why. This makes the force diagram easier to debug.",
    createdBy: "mentorpet",
    prototypeOnly: true
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
