# The Inner Observatory — secure access setup

This page is an invite-only reading room for selected collaborators. Each
person signs in with their own email address and password. You approve which
projects they can see. Files are never served from GitHub Pages.

## Architecture

- GitHub Pages hosts the presentation and login screen at
  https://www.swapnilsingh.co.in/private.html.
- Supabase Auth verifies invited users and manages password resets.
- Postgres Row-Level Security restricts projects and file records per account.
- A private Supabase Storage bucket holds files. Download links expire after
  60 seconds. An existing signed link may be usable until it expires even
  after access is revoked.
- The Supabase Dashboard is the administrator console for this first release.
  Collaborators cannot create projects, invite people, or upload files.

## 1. Set up the backend (owner only)

1. Create a Supabase project in your own account at https://supabase.com/.
   Use a unique strong password and enable multifactor authentication on
   your Supabase administrator account.
2. Open SQL Editor. Run the complete contents of schema.sql. Confirm the
   bucket named "inner-observatory" exists in Storage and is **private**.
   Use a new dedicated Supabase project: existing permissive policies on a
   reused storage bucket could unintentionally grant additional access.
3. In Authentication settings, keep the Email provider enabled and turn
   **Allow new users to sign up** OFF. Keep email verification enabled.
   Never add a public sign-up page.
4. In Authentication > URL Configuration, set the Site URL to
   https://www.swapnilsingh.co.in/private.html and add this exact URL to
   allowed redirect URLs. If you later use another website or preview
   domain, add that precise URL too.
5. From Project Settings > API, copy the **Project URL** and the
   **publishable** key (or legacy anon key). Put those two public browser
   values in assets/portal-config.js. The file is intentionally blank until
   you have completed the policy setup. Never paste a secret or service-role
   key into any website file.
6. Deploy the updated static website through your normal reviewed GitHub
   Pages release. Test with two separate invited users before sharing
   anything sensitive. For dependable invitation and reset emails at scale,
   configure a verified custom SMTP provider in Supabase.

There is no password for you to choose on somebody else's behalf. Supabase
sends each person a private invitation link, and they set their own password
on the site. They can later use "Forgot password?".

## 2. Invite a collaborator

1. In the Supabase Dashboard go to Authentication > Users > Add user >
   Send invitation. Enter their email address.
2. The invitation creates an Auth user. Copy that user's UUID from the
   Users table.
3. Create or choose the research project you want them to see. Run these
   commands in SQL Editor, substituting actual UUID values:

       insert into public.research_projects (title, description)
       values ('Selected research materials', 'Private collaboration')
       returning id;

       insert into public.project_members (project_id, user_id)
       values ('PROJECT-UUID', 'USER-UUID');

4. The invitation link must direct them to private.html. On the first visit
   they choose a password of at least 12 characters. Then they see only the
   projects linked to their user ID.

To share one project with several collaborators, add one project_members row
for each person. To give one person multiple projects, add several rows.

## 3. Share files

1. In Supabase Storage, open the private inner-observatory bucket.
2. Make a folder named exactly with the project's UUID. Upload the
   files inside that folder.
3. Register each uploaded file with SQL Editor:

       insert into public.project_files
         (project_id, display_name, storage_path)
       values
         ('PROJECT-UUID', 'Paper draft.pdf',
          'PROJECT-UUID/paper-draft.pdf');

The storage_path must match the object's exact path in Storage. Registration
is deliberate: uploaded objects not listed in project_files are inaccessible
through the collaborator portal. The file's folder UUID must match the
project_id. Do not put protected documents in your website repository or
the public assets folder.

## 4. Change or revoke access

- Remove access to one project:

      delete from public.project_members
      where project_id = 'PROJECT-UUID' and user_id = 'USER-UUID';

- To remove a person's ability to sign in entirely, ban or remove the user
  through Authentication > Users as appropriate.
- Previously created signed download URLs can remain usable for the rest
  of their 60-second lifetime. For especially sensitive material, consider
  rotating/revoking Storage signing keys after an incident.

## 5. Before considering it live

- Verify an anonymous browser sees no projects and cannot access any
  storage file.
- Verify invited user A can read project A but not project B.
- Verify user B cannot read project A even by requesting its known database
  UUID or storage path directly.
- Verify neither account can insert, edit, or delete projects, grants,
  file records or uploaded objects.
- Remove a project_members row and verify the user can no longer retrieve
  that project or generate fresh signed download links.
- Verify invitation, password setup, password reset and sign-out on the
  actual HTTPS domain. Check the invitation URL redirects are allowed.

Do not call this portal secured for real collaborators until these tests
pass against your configured Supabase project.

## Security boundaries

The browser interface is never a security boundary. Hiding a button or
requiring a password in client-side JavaScript does not protect a file.
The database policies and private bucket in schema.sql provide access
control even when someone bypasses the website entirely.

This first release is a read-only research library. It does not provide
end-to-end encryption, per-file watermarking, collaboration editing,
malware scanning, automatic offboarding or an administrator invitation
dashboard. The Supabase project owner remains responsible for updates,
backups, account security and policy testing.

## Reference documentation

- https://supabase.com/docs/guides/auth/users
- https://supabase.com/docs/guides/auth/passwords
- https://supabase.com/docs/guides/auth/general-configuration
- https://supabase.com/docs/guides/database/postgres/row-level-security
- https://supabase.com/docs/guides/storage/security/access-control
