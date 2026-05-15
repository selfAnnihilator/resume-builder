import { createHmac } from 'crypto'

export async function POST(request: Request) {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    return Response.json({ error: 'Not configured' }, { status: 503 })
  }

  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await request.json()

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return Response.json({ paid: false }, { status: 400 })
    }

    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature === razorpay_signature) {
      return Response.json({ paid: true, paymentId: razorpay_payment_id })
    }

    return Response.json({ paid: false }, { status: 402 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[checkout/verify]', message)
    return Response.json({ error: 'Verification failed' }, { status: 500 })
  }
}
