-- Run once after creating the first Neon Auth user.
-- Replace the email below with the owner's login email.
insert into public.store_members (user_id, display_name, role)
select id, name, 'owner'
from neon_auth."user"
where lower(email) = lower('OWNER_EMAIL@example.com')
on conflict (user_id) do update
set role = 'owner', display_name = excluded.display_name;
