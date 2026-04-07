import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { customerEmail, note, items, type = 'bid', name, message } = await request.json()

    // Handle contact form submissions
    if (type === 'contact') {
      if (!customerEmail || !name || !message) {
        return new Response(JSON.stringify({ error: 'Missing contact form data.' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      const resendApiKey = Deno.env.get('RESEND_API_KEY')
      const resendFrom = Deno.env.get('RESEND_FROM_EMAIL')
      const notifyEmail = Deno.env.get('RETROKROKEN_NOTIFY_EMAIL') ?? 'retrokroken@gmail.com'

      if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !resendFrom) {
        return new Response(JSON.stringify({ error: 'Missing function secrets.' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2>Nytt kontaktmeddelande från retrokroken.com</h2>
          <p><strong>Namn:</strong> ${escapeHtml(name)}</p>
          <p><strong>E-post:</strong> ${escapeHtml(customerEmail)}</p>
          <p><strong>Meddelande:</strong></p>
          <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        </div>
      `

      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: resendFrom,
          to: [notifyEmail],
          reply_to: customerEmail,
          subject: `Nytt kontaktmeddelande från Retrokroken`,
          text: `Namn: ${name}\nE-post: ${customerEmail}\n\nMeddelande:\n${message}`,
          html: htmlBody,
        }),
      })

      if (!emailResponse.ok) {
        const errorText = await emailResponse.text()
        throw new Error(`Email delivery failed: ${errorText}`)
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Handle bid requests
    if (!customerEmail || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing bid request data.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const validItems = items.filter((item) => Number(item.amount) > 0)
    if (!validItems.length) {
      return new Response(JSON.stringify({ error: 'At least one bid amount is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    const resendFrom = Deno.env.get('RESEND_FROM_EMAIL')
    const notifyEmail = Deno.env.get('RETROKROKEN_NOTIFY_EMAIL') ?? 'retrokroken@gmail.com'

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !resendFrom) {
      return new Response(JSON.stringify({ error: 'Missing function secrets.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    const { data: bidRequest, error: bidRequestError } = await supabase
      .from('bid_requests')
      .insert({ customer_email: customerEmail, note: note || null })
      .select('id, submitted_at')
      .single()

    if (bidRequestError) {
      throw bidRequestError
    }

    const rows = validItems.map((item) => ({
      bid_request_id: bidRequest.id,
      item_id: item.id ?? null,
      title: item.title,
      object_code: item.object_code ?? null,
      main_category: item.main_category ?? null,
      category: item.category ?? null,
      amount: Number(item.amount),
    }))

    const { error: itemInsertError } = await supabase.from('bid_request_items').insert(rows)
    if (itemInsertError) {
      throw itemInsertError
    }

    const textLines = rows.map((item) => {
      const meta = [item.main_category, item.category].filter(Boolean).join(' / ')
      const code = item.object_code ? ` (${item.object_code})` : ''
      return `- ${item.title}${code}${meta ? ` - ${meta}` : ''}: ${item.amount} kr`
    })

    const htmlLines = rows.map((item) => {
      const meta = [item.main_category, item.category].filter(Boolean).join(' / ')
      const code = item.object_code ? ` (${item.object_code})` : ''
      return `<li><strong>${escapeHtml(item.title)}</strong>${escapeHtml(code)}${meta ? ` - ${escapeHtml(meta)}` : ''}: ${item.amount} kr</li>`
    })

    const textBody = [
      'Nytt bud från retrokroken.com',
      '',
      `Kundens e-post: ${customerEmail}`,
      `Bid request ID: ${bidRequest.id}`,
      `Skickat: ${bidRequest.submitted_at}`,
      '',
      'Objekt:',
      ...textLines,
      '',
      `Meddelande: ${note || '-'}`,
    ].join('\n')

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Nytt bud från retrokroken.com</h2>
        <p><strong>Kundens e-post:</strong> ${escapeHtml(customerEmail)}</p>
        <p><strong>Bid request ID:</strong> ${escapeHtml(bidRequest.id)}</p>
        <p><strong>Skickat:</strong> ${escapeHtml(bidRequest.submitted_at)}</p>
        <p><strong>Objekt:</strong></p>
        <ul>${htmlLines.join('')}</ul>
        <p><strong>Meddelande:</strong> ${escapeHtml(note || '-')}</p>
      </div>
    `

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: resendFrom,
        to: [notifyEmail],
        reply_to: customerEmail,
        subject: `Nytt bud till Retrokroken (${rows.length} objekt)`,
        text: textBody,
        html: htmlBody,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      throw new Error(`Email delivery failed: ${errorText}`)
    }

    return new Response(JSON.stringify({ success: true, bidRequestId: bidRequest.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message || 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}