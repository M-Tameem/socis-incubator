-- Applications open September 9; Week 1 begins September 14. Demo Day is TBD.
insert into public.program_settings (key, value) values
  ('applications_open', '2026-09-09'),
  ('applications_close', '2026-09-27'),
  ('teams_announced', '2026-09-22'),
  ('proposals_due', '2026-09-27'),
  ('demo_day_date', ''),
  ('demo_day_time', ''),
  ('demo_day_location', '')
on conflict (key) do update set value = excluded.value, updated_at = now();

-- Keep direct idea-board writes on the same dates and time zone as the app.
create or replace function public.idea_portal_open()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select not exists (
    select 1
    from public.program_settings
    where key in ('applications_open', 'applications_close') and value <> ''
      and case
        when value ~ '^\d{4}-\d{2}-\d{2}$' then
          case when key = 'applications_open'
            then (now() at time zone 'America/Toronto')::date < value::date
            else (now() at time zone 'America/Toronto')::date > value::date
          end
        else true
      end
  );
$$;
