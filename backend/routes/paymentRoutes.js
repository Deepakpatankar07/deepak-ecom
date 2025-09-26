import express from 'express';
import paymentController from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.get('/check-payment-status', paymentController.checkPaymentStatus);
router.post('/confirm-payment', paymentController.confirmPayment);

export default router;


