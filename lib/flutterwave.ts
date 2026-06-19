import crypto from 'crypto'
import { env } from '@/lib/env'

const FLW_BASE = 'https://api.flutterwave.com/v3'

export function verifyFlutterwaveWebhook(
  payload: string,
  signature: string
): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', env.flutterwaveWebhookSecret)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function verifyTransaction(
  transactionId: string
): Promise<{
  status: string
  amount: number
  currency: string
  flutterwaveRef: string
} | null> {
  try {
    const response = await fetch(
      `${FLW_BASE}/transactions/${transactionId}/verify`,
      {
        headers: {
          Authorization: `Bearer ${env.flutterwaveSecretKey}`,
        },
      }
    )

    const data = await response.json()

    if (data.status === 'success' && data.data.status === 'successful') {
      return {
        status: data.data.status,
        amount: data.data.amount,
        currency: data.data.currency,
        flutterwaveRef: data.data.flw_ref,
      }
    }

    return null
  } catch (error) {
    console.error('[flutterwave] Verification error:', error)
    return null
  }
}

export async function initiatePayment(
  amount: number,
  email: string,
  phoneNumber: string,
  name: string,
  redirectUrl: string,
  transactionRef: string
): Promise<{ link: string } | null> {
  try {
    const response = await fetch(`${FLW_BASE}/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.flutterwaveSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: transactionRef,
        amount,
        currency: 'NGN',
        redirect_url: redirectUrl,
        customer: {
          email,
          phonenumber: phoneNumber,
          name,
        },
        meta: {
          source: 'pledgepay',
        },
      }),
    })

    const data = await response.json()

    if (data.status === 'success') {
      return { link: data.data.link }
    }

    return null
  } catch (error) {
    console.error('[flutterwave] Payment initiation error:', error)
    return null
  }
}
