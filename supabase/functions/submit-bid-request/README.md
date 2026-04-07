Required secrets for the Supabase Edge Function:

- RESEND_API_KEY
- RESEND_FROM_EMAIL
- RETROKROKEN_NOTIFY_EMAIL

Deploy after linking the project:

supabase functions deploy submit-bid-request

Example secret setup:

supabase secrets set RESEND_API_KEY=your_key
supabase secrets set RESEND_FROM_EMAIL='Retrokroken <noreply@your-domain.com>'
supabase secrets set RETROKROKEN_NOTIFY_EMAIL=retrokroken@gmail.com