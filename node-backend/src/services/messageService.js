import dotenv from 'dotenv'

dotenv.config()

const normalizePhoneForWhatsApp = (phone) => {
  if (!phone) return null
  const digits = String(phone).replace(/\D/g, '')
  if (!digits) return null

  // If 10-digit Indian number, prefix country code 91.
  if (digits.length === 10) {
    return `whatsapp:+91${digits}`
  }

  // If starts with 91 and total 12 digits, keep as India international.
  if (digits.length === 12 && digits.startsWith('91')) {
    return `whatsapp:+${digits}`
  }

  // Generic international fallback.
  if (digits.length >= 11 && digits.length <= 15) {
    return `whatsapp:+${digits}`
  }

  return null
}

export const sendMockMessage = async ({ agent, farmer, message }) => {
  const timestamp = new Date().toISOString()
  console.log(`[MOCK MESSAGE] ${timestamp} | Agent: ${agent?.name || 'unknown'} | Farmer: ${farmer?.name || 'unknown'} | Message: ${message}`)
  return { success: true, provider: 'mock' }
}

const sendTwilioWhatsAppMessage = async ({ to, body }) => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_WHATSAPP_FROM

  if (!accountSid || !authToken || !from) {
    throw new Error('Twilio credentials are missing (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM).')
  }

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const params = new URLSearchParams({
    From: from,
    To: to,
    Body: body,
  })

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Twilio API error (${response.status}): ${errorText}`)
  }

  const data = await response.json()
  return { success: true, provider: 'twilio', sid: data.sid }
}

export const sendReminderMessage = async ({ agent, farmer, message }) => {
  const to = normalizePhoneForWhatsApp(agent?.phone)
  if (!to) {
    return { success: false, provider: 'none', error: 'Invalid or missing agent phone number.' }
  }

  if (String(process.env.WHATSAPP_PROVIDER || 'mock').toLowerCase() === 'twilio') {
    try {
      return await sendTwilioWhatsAppMessage({ to, body: message })
    } catch (error) {
      console.error(`Twilio send failed for agent ${agent?.id || 'unknown'}:`, error.message)
      return { success: false, provider: 'twilio', error: error.message }
    }
  }

  return sendMockMessage({ agent, farmer, message })
}
