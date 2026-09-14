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
  applications_open: "2026-09-14",
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
  { number: 2, dates: "September 21–27", focus: "Find a group, shape an idea, and apply" },
  { number: 3, dates: "September 28–October 4", focus: "Project planning and development kickoff" },
  { number: 4, dates: "October 5–11", focus: "Build the first version · check-in October 11" },
  { number: 5, dates: "October 12–18", focus: "Development and team work" },
  { number: 6, dates: "October 19–25", focus: "Development · check-in October 25" },
  { number: 7, dates: "October 26–November 1", focus: "Development and feedback" },
  { number: 8, dates: "November 2–8", focus: "Development · check-in November 8" },
  { number: 9, dates: "November 9–15", focus: "Testing the first usable version" },
  { number: 10, dates: "November 16–22", focus: "Finalization · Wood Centre pitch November 19" },
  { number: 11, dates: "November 23–29", focus: "Finalize the project" },
  { number: 12, dates: "November 30–December 6", focus: "Finalize, test, and rehearse" },
  { number: 13, dates: "December 7–13", focus: "Finish and prepare to present" },
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
    name: "Recruitment and Team Formation",
    weeks: "Weeks 1 – 2",
    dates: "September 14 – 27",
    summary: "Find teammates, shape an idea, and apply.",
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
    name: "Project Planning",
    weeks: "Week 3",
    dates: "September 28 – October 4",
    summary: "Plan the project and get ready to build.",
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
    weeks: "Weeks 4 – 9",
    dates: "October 5 – November 15",
    summary: "Build, test, and share progress.",
    items: [
      "Submit one team check-in every two weeks",
      "Raise blockers while there is still time to fix them",
      "Attend workshops that are useful to your project",
      "Use mentor sessions when the team needs outside help",
    ],
  },
  {
    number: 4,
    name: "Finalization and Presentations",
    weeks: "Weeks 10 – 13",
    dates: "November 16 – December 13",
    summary: "Finish the project and prepare to present.",
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
  "Submit a short check-in every two weeks",
  "Keep their project in GitHub",
  "Respond to their SOCIS contact",
  "Finish and present their project",
];

export const ELIGIBILITY = [
  "Enrolled in Computer Science, Software Engineering, or a related program",
  "Comfort with writing some code (Previous project experience is not required)",
];

export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
  {
    question: "Do I need a project idea or team?",
    answer:
      "No. You can bring a team, find teammates through the Idea Portal, or apply solo. Applications close September 27.",
  },
  {
    question: "How much time does the program take?",
    answer:
      "Plan for 4–6 hours per week. The biweekly check-in takes about five minutes.",
  },
  {
    question: "Do I need to be an experienced developer?",
    answer:
      "No. You should be comfortable writing some code, but previous project experience isn't required.",
  },
  {
    question: "Who owns the project?",
    answer:
      "Your team. You can continue working on it after the program and use it in your portfolio or job applications.",
  },
  {
    question: "What happens if my team falls behind?",
    answer:
      "Tell your SOCIS contact early. We can help you reduce the scope, solve a blocker, or work through a team issue.",
  },
  {
    question: "Is there funding?",
    answer:
      `Yes. Teams can request ${PROGRAM.microgrant} in microgrants for approved project costs. Get approval before spending.`,
  },
  {
    question: "What happens if I need to leave the program?",
    answer:
      "Let SOCIS know as soon as possible. We'll work with your team to adjust or fill the gap.",
  },
  {
    question: "When is Demo Day?",
    answer:
      "The date is TBD. We'll update the Timeline once it's confirmed.",
  },
  {
    question: "Is the Wood Centre event confirmed?",
    answer:
      "Yes. The Wood Centre Open Pitch Night is November 19, 2026.",
  },
  {
    question: "Will there be prizes or industry collaborators?",
    answer:
      "TBD. We'll announce confirmed collaborators or prizes as they become available.",
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
  { tool: "Website", use: "dates, applications, proposals, and check-ins" },
  { tool: "Discord", use: "team conversation and quick questions" },
  { tool: "Email", use: "decisions and deadline notices" },
  { tool: "Google Drive", use: "templates and reimbursement" },
  { tool: "GitHub", use: "code and project documentation" },
];
