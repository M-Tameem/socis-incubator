/**
 * Program content taken from the SOCIS Incubator Fall Semester Execution Plan.
 * Kept in code rather than the database because it changes once a semester and
 * belongs in version control with the rest of the site.
 */

export const PROGRAM = {
  name: "SOCIS Computer Science Incubator",
  term: "Fall 2026",
  lengthWeeks: "12–13 weeks",
  targetStudents: "45–75 students",
  targetTeams: "15 teams",
  teamSize: "3–5 students",
  microgrant: "$50–$75",
  contactEmail: "socis@uoguelph.ca",
  websiteUrl: "https://socis.ca",
  discordUrl: "https://discord.gg/socis",
  githubOrg: "https://github.com/socis",
  woodCentreEventsUrl: "https://www.uoguelph.ca/wood-centre/current-events",
} as const;

export const PROGRAM_DATES = {
  applications_open: "2026-09-09",
  applications_close: "2026-09-27",
  teams_announced: "2026-09-22",
  proposals_due: "2026-09-27",
  demo_day_date: "",
  demo_day_time: "",
  demo_day_location: "",
} as const;

export const LATE_SEMESTER_NOTE =
  "You'll finish the semester with a working project and somewhere to present it. Weeks 10–13 focus on finishing and preparing to share your work. The remaining event schedule, SOCIS Demo Day's date, industry participation, and prizes are TBD; we'll share updates as plans are confirmed.";

/** Consecutive Monday–Sunday weeks, starting September 14, 2026. */
export const PROGRAM_WEEKS = [
  { number: 1, dates: "September 14–20", focus: "Applications and finding teammates" },
  { number: 2, dates: "September 21–27", focus: "Find a group, shape an idea, and submit or revise your application" },
  { number: 3, dates: "September 28–October 4", focus: "Final team placements, project planning, and development kickoff" },
  { number: 4, dates: "October 5–11", focus: "Build the first version · check-in October 11" },
  { number: 5, dates: "October 12–18", focus: "Development and team work" },
  { number: 6, dates: "October 19–25", focus: "Development · check-in October 25" },
  { number: 7, dates: "October 26–November 1", focus: "Development and feedback" },
  { number: 8, dates: "November 2–8", focus: "Development · check-in November 8" },
  { number: 9, dates: "November 9–15", focus: "Testing the first usable version" },
  { number: 10, dates: "November 16–22", focus: "Wood Centre pitch November 19 · finalization schedule TBD" },
  { number: 11, dates: "November 23–29", focus: "Finalize the project · details TBD" },
  { number: 12, dates: "November 30–December 6", focus: "Finalize, test, and rehearse · details TBD" },
  { number: 13, dates: "December 7–13", focus: "Finish a working project and prepare to present · Demo Day date TBD" },
] as const;

export type Phase = {
  number: number;
  name: string;
  weeks: string;
  dates: string;
  summary: string;
  items: string[];
};

export const PHASES: Phase[] = [
  {
    number: 1,
    name: "Recruitment and team formation",
    weeks: "Weeks 1–2",
    dates: "September 14–27",
    summary: "Bring friends or find people around an idea, then apply together.",
    items: [
      "Every student submits their own application",
      "Use the idea portal to meet people and build a group",
      "List the same teammates and project name when applying together",
      "Applying solo is welcome; SOCIS will help you find a group",
      "Submit or revise your application and optional idea by September 27",
      "SOCIS assigns one executive contact to each team",
    ],
  },
  {
    number: 2,
    name: "Project planning",
    weeks: "Week 3",
    dates: "September 28–October 4",
    summary: "Set the scope, divide the work, and prepare the repository.",
    items: [
      "Name the user and the problem",
      "Write down what the first usable version must do",
      "Choose roles and tools",
      "Break the first month into issues",
      "Join the Git and GitHub session if you need it",
    ],
  },
  {
    number: 3,
    name: "Development",
    weeks: "Weeks 4–9",
    dates: "October 5–November 15",
    summary: "Build your project and share progress every other week.",
    items: [
      "Submit one team check-in every two weeks",
      "Raise blockers while there is still time to fix them",
      "Attend workshops that are useful to your project",
      "Use mentor sessions when the team needs outside help",
    ],
  },
  {
    number: 4,
    name: "Finalization and presentations",
    weeks: "Weeks 10–13",
    dates: "November 16–December 13 · details TBD",
    summary: "Finish a working project by semester's end. Pitch at the Wood Centre on November 19 and prepare for SOCIS Demo Day; its date and the remaining event schedule are TBD.",
    items: [
      "Pitch at the Wood Centre's Open Pitch Night on November 19",
      "Finish the project and fix the bugs that could break the demo",
      "Deploy if the project can run online",
      "Write a useful README",
      "Rehearse on the computer you will present from",
      "Present at SOCIS Demo Day; date TBD",
    ],
  },
];

export type Milestone = {
  when: string;
  label: string;
  detail: string;
};

export const MILESTONES: Milestone[] = [
  {
    when: "September 9",
    label: "Applications open",
    detail: "Apply with your friends or a group formed around an idea. Solo applicants use the same form.",
  },
  {
    when: "Week 2",
    label: "Find your people",
    detail: "Meet around an idea, form a group, and apply together. SOCIS is available to help applicants looking for teammates.",
  },
  {
    when: "Week 2",
    label: "Applications and project ideas due",
    detail: "September 27 is the deadline to submit or revise the same application, whether you have a group, an idea, or are applying solo.",
  },
  {
    when: "Week 3",
    label: "Development kickoff",
    detail: "Set up the repository, open the first issues, and start building.",
  },
  {
    when: "Weeks 4–9",
    label: "Bi-weekly check-ins",
    detail: "One short written update from each team every two weeks.",
  },
  {
    when: "Throughout the semester",
    label: "Workshops and mentor sessions",
    detail: "Events are posted as they are confirmed.",
  },
  {
    when: "November 19",
    label: "Pitch at the Wood Centre",
    detail: "Present your project at Open Pitch Night at the Bullring and get feedback from judges.",
  },
  {
    when: "Weeks 10–13 · TBD",
    label: "Finalize your project",
    detail: "Finish a working project by semester's end. Detailed finalization and presentation arrangements will follow.",
  },
  {
    when: "Date TBD",
    label: "Demo Day",
    detail: "Each team presents its working project. The date, event format, and industry participation are TBD.",
  },
  {
    when: "After Demo Day",
    label: "Reimbursements and showcase",
    detail: "Approved expenses are reimbursed. Finished projects stay on the site.",
  },
];

export const EXPECTATIONS = [
  "Spend 4–6 hours a week on the project",
  "Submit one team check-in every two weeks",
  "Must be available through Demo Day",
  "Keep the code in a team GitHub repository",
  "Reply when your executive contact checks in",
  "Build a working project by the end of the semester",
  "Pitch at the Wood Centre on November 19 and present at SOCIS Demo Day (date TBD)",
];

export const ELIGIBILITY = [
  "Enrolled in Computer Science, Software Engineering, or a related program",
  "In any year of study",
  "Comfortable writing some code; project experience is not required",
];

export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
  {
    question: "Do I need a project idea or a team to apply?",
    answer:
      "Bring friends or meet people around an idea and apply together. If you do not have a group or project yet, apply solo by September 27 and SOCIS will help you find a team. Everyone uses the same application.",
  },
  {
    question: "How do we apply after meeting in the idea portal?",
    answer:
      "Chat about the idea, decide who wants to work together, then each fill out the application with the same teammates and project name. You can revise your answers until September 27 as your group takes shape.",
  },
  {
    question: "Can an existing group apply together?",
    answer:
      "Yes. Form a group of three to five with your friends and apply together. Each person fills out the same form and lists the same teammates and project name so we can record your group.",
  },
  {
    question: "Can I edit my application after submitting?",
    answer:
      "Yes. Sign in with the email you applied with and return to Apply. You can change teammates, your project idea, and your other answers through September 27. Your latest saved version is your submission.",
  },
  {
    question: "Is a project idea a separate application?",
    answer:
      "No. Add your idea to the same application you use to join the incubator. Teammates and project ideas are optional, and the September 27 deadline is the same for everyone. Teams develop their detailed project plan after joining.",
  },
  {
    question: "How much time does this take?",
    answer:
      "Plan for 4 to 6 hours a week. Check-ins take about five minutes every other week.",
  },
  {
    question: "What counts as an MVP?",
    answer:
      "The smallest version someone can use from start to finish. Pick a scope your team can build by the end of the semester; SOCIS can help you keep it manageable.",
  },
  {
    question: "Do I need to be an experienced developer?",
    answer:
      "No. You should be able to write some code, but you do not need prior project experience. Build with friends, learn from your group, and ask SOCIS for help when you need it.",
  },
  {
    question: "Who owns the project?",
    answer:
      "Your team. You can keep working on it after the program and use it in job applications.",
  },
  {
    question: "What if my team falls behind or falls apart?",
    answer:
      "Tell your executive contact early. We will work with you to adjust the scope or help fill a gap in the group so you can keep building.",
  },
  {
    question: "Is there funding for my project?",
    answer:
      `Teams can request microgrants of ${PROGRAM.microgrant} for approved costs such as hosting or a domain. Ask Finance and Operations before spending. Reimbursement requires a Demo Day presentation.`,
  },
  {
    question: "What will we build and present?",
    answer:
      "Your team will build a working project by semester's end, pitch it at the Wood Centre's Open Pitch Night on November 19, and present it at SOCIS Demo Day. The Demo Day date is TBD. Presenting at Demo Day is required for expense reimbursement.",
  },
  {
    question: "Is the end-of-semester schedule confirmed?",
    answer:
      "You'll finish the semester with a working project and somewhere to present it. The Wood Centre's Open Pitch Night is November 19. Weeks 10–13 focus on finishing and preparing to share your work; the remaining event schedule and SOCIS Demo Day's date and format are TBD.",
  },
  {
    question: "Will there be prizes or industry collaborators?",
    answer:
      "Prizes and industry participation are TBD. We'll announce any collaborators as they are confirmed. Throughout the semester, you will build with a team, get feedback, and finish with a project you can show.",
  },
  {
    question: "What if I get accepted and then need to drop out?",
    answer:
      "Tell us as soon as you know. We can adjust the team or offer the place to someone on the waitlist.",
  },
];

export const EXEC_ROLES = [
  {
    title: "Program Lead",
    duties: "Owns the schedule and handles program-level issues.",
  },
  {
    title: "Student Engagement Lead",
    duties: "Handles applications, team formation, and student feedback.",
  },
  {
    title: "Technical Lead",
    duties: "Runs technical workshops and helps teams with engineering blockers.",
  },
  {
    title: "External Relations Lead",
    duties: "Coordinates mentors, guests, judges, and sponsors.",
  },
  {
    title: "Events Lead",
    duties: "Runs events and handles Demo Day logistics.",
  },
  {
    title: "Finance and Operations Lead",
    duties: "Approves project expenses and processes reimbursements.",
  },
];

export const CHECK_IN_QUESTIONS = [
  "What did you complete?",
  "What are you working on?",
  "What will you complete next?",
  "Are you behind schedule?",
  "Are you facing any problems?",
  "Do you need help from SOCIS?",
];

/** Where each tool fits, straight from the communication rule in the plan. */
export const TOOLING = [
  { tool: "This website", use: "Program dates, applications, proposals, and check-ins" },
  { tool: "Discord", use: "Team conversation and quick questions" },
  { tool: "Email", use: "Decisions and deadline notices" },
  { tool: "Google Drive", use: "Templates and reimbursement forms" },
  { tool: "GitHub", use: "Code, issues, and project documentation" },
];
