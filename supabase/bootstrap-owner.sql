-- Run AFTER creating the first user through Supabase Auth.
-- Replace the email below with the exact owner's login email.
-- This script must be run from the Supabase SQL Editor by the project administrator.
insert into public.store_members (user_id, display_name, role)
select id, 'Store Owner', 'owner'
from auth.users
where lower(email) = lower('OWNER_EMAIL@example.com')
on conflict (user_id) do update
set role = 'owner';

-- Verify the owner membership was created:
select m.display_name, m.role, u.email
from public.store_members m
join auth.users u on u.id = m.user_id
where lower(u.email) = lower('OWNER_EMAIL@example.com');
