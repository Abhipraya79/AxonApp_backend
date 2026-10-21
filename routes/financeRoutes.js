import express from 'express';
import {
  getPayments,
  getRevenueVsCash,
} from '../controllers/financeController.js';

const router = express.Router();

router.get('/payments', getPayments);
router.get('/revenue-vs-cash', getRevenueVsCash);

export default router;
