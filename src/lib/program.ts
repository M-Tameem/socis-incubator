/**
 * Program content taken from the SOCIS Incubator Fall Semester Execution Plan.
 * Kept in code rather than the database because it changes once a semester and
 * belongs in version control with the rest of the site.
 */

export const PROGRAM = {
  name: "SOCIS Computer Science Incubator",
  term: "Fall 2026",
  lengthWeeks: "12–13 weeks",
  targetStudents: "30–50 students",
  targetTeams: "6–10 teams",
  teamSize: "3–5 students",
  contactEmail: "incubator@socis.ca",
  discordUrl: "https://discord.gg/socis",
  githubOrg: "https://github.com/socis",
} as const;

export type Phase = {
  number: number;
  name: string;
  weeks: string;
  summary: string;
  items: string[];
};

export const PHASES: Phase[] = [
  {
    number: 1,
    name: "Recruitment and team formation",
    weeks: "Weeks 1–2",
    summary: "Apply, meet your team, and agree on a project you can finish.",
    items: [
      "Every student submits their own application",
      "Use the idea portal to find possible collaborators",
      "List preferred teammates in your application",
      "SOCIS matches applicants by interests, experience, and availability",
      "Each team submits a short proposal",
      "SOCIS assigns one executive contact to each team",
    ],
  },
  {
    number: 2,
    name: "Project planning",
    weeks: "Week 3",
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
    weeks: "Weeks 4–11",
    summary: "Build for eight weeks. Send a short update every other week.",
    items: [
      "Submit one team check-in every two weeks",
      "Raise blockers while there is still time to fix them",
      "Attend workshops that are useful to your project",
      "Use mentor sessions when the team needs outside help",
    ],
  },
  {
    number: 4,
    name: "Finalization and Demo Day",
    weeks: "Weeks 11–13",
    summary: "Stop adding features. Make the current build reliable and prepare the demo.",
    items: [
      "Fix the bugs that could break the demo",
      "Deploy if the project can run online",
      "Write a useful README",
      "Rehearse on the computer you will present from",
      "Present at Demo Day",
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
    when: "Week 1",
    label: "Applications open",
    detail: "Apply individually, with a team, or with your own idea.",
  },
  {
    when: "Week 2",
    label: "Teams finalized",
    detail: "You meet your team and get an executive contact.",
  },
  {
    when: "Week 2",
    label: "Project proposals due",
    detail: "Each team defines its first usable version. SOCIS checks the scope.",
  },
  {
    when: "Week 3",
    label: "Development kickoff",
    detail: "Set up the repository, open the first issues, and start building.",
  },
  {
    when: "Weeks 4–11",
    label: "Bi-weekly check-ins",
    detail: "One short written update from each team every two weeks.",
  },
  {
    when: "Weeks 6–10",
    label: "Workshops and mentor sessions",
    detail: "Events are posted as they are confirmed.",
  },
  {
    when: "Week 11",
    label: "Feature freeze",
    detail: "Stop adding features and make the current build dependable.",
  },
  {
    when: "Week 12/13",
    label: "Demo Day",
    detail: "Each team gives a short presentation and live demo.",
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
  "Keep the code in a team GitHub repository",
  "Reply when your executive contact checks in",
  "Present at Demo Day",
];

export const ELIGIBILITY = [
  "Enrolled in Computer Science, Software Engineering, or a related program",
  "In any year of study",
  "Comfortable writing some code; project experience is not required",
  "Available through Demo Day",
];

export type Faq = { question: string; answer: string };

export const FAQS: Faq[] = [
  {
    question: "Do I need a project idea or a team to apply?",
    answer:
      "No. Everyone submits their own application. List preferred teammates if you have them, or use the idea portal to meet people. SOCIS confirms final teams after applications close.",
  },
  {
    question: "Does contacting someone in the idea portal put us on a team?",
    answer:
      "No. It only lets you exchange contact details and discuss working together. Each person still applies separately and lists preferred teammates. SOCIS makes the final placement.",
  },
  {
    question: "Can an existing group apply together?",
    answer:
      "Yes, but every person must submit their own application and name the same teammates. SOCIS will try to keep the group together if the team size, availability, and project scope work.",
  },
  {
    question: "How much time does this take?",
    answer:
      "Plan for 4 to 6 hours a week. Check-ins take about five minutes every other week.",
  },
  {
    question: "What counts as an MVP?",
    answer:
      "The smallest version someone can use from start to finish. We review scope in Week 2 and will ask you to cut features if the plan is too large.",
  },
  {
    question: "Do I need to be an experienced developer?",
    answer:
      "No. You should be able to write some code, but you do not need prior project experience. We try to mix experience levels when forming teams.",
  },
  {
    question: "Who owns the project?",
    answer:
      "Your team. You can keep working on it after the program and use it in job applications.",
  },
  {
    question: "What if my team falls behind or falls apart?",
    answer:
      "Tell your executive contact early. We may cut scope or change the team. Waiting makes the options worse.",
  },
  {
    question: "Is there funding for my project?",
    answer:
      "Teams can request about $100 to $150 for approved costs such as hosting or a domain. Ask Finance and Operations before spending. Reimbursement requires a Demo Day presentation.",
  },
  {
    question: "Do I have to present at Demo Day?",
    answer:
      "Yes. Show what works and explain what did not. Teams must present to receive expense reimbursement.",
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
