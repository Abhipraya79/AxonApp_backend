import express from 'express';
import {
  getKpi,
  getSalesTrend,
  getCustomerDistribution,
} from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/kpi', getKpi);
router.get('/sales-trend', getSalesTrend);
router.get('/customer-distribution', getCustomerDistribution);

export default router;
