export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.rawBody, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        
        // Save booking to database
        await saveBooking({
          exhibitionId: session.metadata.exhibition_id,
          fullName: session.metadata.full_name,
          email: session.customer_email,
          paymentStatus: 'completed',
          sessionId: session.id
        });
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};