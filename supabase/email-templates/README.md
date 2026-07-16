# Zenith Supabase email templates

These templates match Zenith's authentication flows. For a hosted Supabase project, copy each HTML file into **Authentication → Email Templates** and set the subject shown below.

| Supabase template | File | Subject |
| --- | --- | --- |
| Confirm signup | `confirm-signup.html` | `Confirm your Zenith email` |
| Reset password | `reset-password.html` | `Reset your Zenith password` |
| Change email address | `confirm-email-change.html` | `Confirm your new Zenith email` |
| Password changed notification | `password-changed.html` | `Your Zenith password was changed` |
| Email address changed notification | `email-changed.html` | `Your Zenith email was changed` |

Enable the **Password changed** and **Email address changed** security notifications after adding their templates. Zenith requests password recovery links with `redirectTo: /auth/callback?type=recovery`; add that exact URL for every environment to **Authentication → URL Configuration → Redirect URLs**.

For a new free-tier project using Supabase's default mail provider, custom templates require either a paid plan or a custom SMTP provider. Disable click-tracking in the SMTP provider so it does not rewrite Supabase confirmation links.

The templates use supported Supabase variables: `{{ .ConfirmationURL }}`, `{{ .Data.first_name }}`, `{{ .NewEmail }}`, `{{ .OldEmail }}`, and `{{ .Email }}`.
