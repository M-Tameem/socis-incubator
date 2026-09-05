-- Optional starter rows. Edit the dates before running.

insert into program_settings (key, value) values
  ('applications_open',  '2026-09-08'),
  ('applications_close', '2026-09-19'),
  ('teams_announced',    '2026-09-22'),
  ('proposals_due',      '2026-09-26'),
  ('demo_day_date',      '2026-12-02'),
  ('demo_day_time',      '5:30 - 8:30 pm'),
  ('demo_day_location',  'Rozanski Hall, Room 104'),
  ('contact_email',      'incubator@socis.ca'),
  ('discord_url',        'https://discord.gg/socis')
on conflict (key) do update set value = excluded.value;

insert into resources (title, url, description, category, sort_order) values
  ('Project proposal template', 'https://docs.google.com/document/d/EXAMPLE', 'The document every team fills in during Week 2.', 'Templates', 1),
  ('MVP scoping worksheet', 'https://docs.google.com/document/d/EXAMPLE', 'Cut your idea down to something you can actually finish in ten weeks.', 'Templates', 2),
  ('Git and GitHub for teams', 'https://docs.github.com/en/get-started', 'Branches, pull requests, and reviews without stepping on each other.', 'GitHub', 3),
  ('Writing a README people read', 'https://www.makeareadme.com/', 'What recruiters look for when they open your repository.', 'GitHub', 4),
  ('Deploying on Vercel', 'https://vercel.com/docs/getting-started-with-vercel', 'Free hosting that covers most student projects.', 'Deployment', 5),
  ('Reimbursement form', 'https://forms.gle/EXAMPLE', 'Submit receipts here after your expense has been pre-approved.', 'Program', 6);
