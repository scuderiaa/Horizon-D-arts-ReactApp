// stripe.controller.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
    try {
        const { amount, email, fullName, exhibitionId } = req.body;

        console.log('Received payment intent request:', {
            amount,
            email,
            fullName,
            exhibitionId
        });

        // Validate inputs
        if (!amount || !email || !fullName || !exhibitionId) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Ensure amount is a positive integer
        const amountInCents = Math.max(1, Math.round(amount));

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'eur',
            metadata: {
                exhibitionId,
                email,
                fullName
            },
            description: `Exhibition booking for ${fullName}`,
            receipt_email: email
        });

        console.log('Payment intent created:', paymentIntent.id);

        // Return the client secret
        return res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        console.error('Payment Intent Creation Error:', {
            message: error.message,
            type: error.type,
            code: error.code
        });

        return res.status(500).json({
            success: false,
            message: "Failed to create payment intent",
            error: error.message
        });
    }
};