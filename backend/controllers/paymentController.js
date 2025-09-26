import stripe from '../utils/stripe.js';

const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'inr', customer_email } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        status: 'error',
        message: 'Amount is required and must be a number.',
        statusCode: 400,
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never',
      },
      receipt_email: customer_email,
    });

    res.status(200).json({
      status: 'success',
      message: 'Payment Intent created successfully!',
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
    });
  } catch (error) {
    console.error('Create Payment Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
      statusCode: 500,
    });
  }
};

const checkPaymentStatus = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment Intent ID is required',
        statusCode: 400,
      });
    }

    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({
      status: intent.status,
      message: 'Payment status retrieved successfully!',
      amount: intent.amount / 100,
      currency: intent.currency,
      statusCode: 200,
    });
  } catch (error) {
    console.error('Check Payment Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
      error: error.message,
      statusCode: 500,
    });
  }
};

const confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        status: 'error',
        message: 'Payment Intent ID is required',
        statusCode: 400,
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        status: 'error',
        message: `Payment not succeeded. Current status: ${paymentIntent.status}`,
        statusCode: 400,
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment verified successfully!',
      payment: {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      },
      statusCode: 200,
    });
  } catch (error) {
    console.error('Confirm Payment Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to confirm payment.',
      error: error.message,
      statusCode: 500,
    });
  }
};

export default {
  createPaymentIntent,
  checkPaymentStatus,
  confirmPayment,
};


