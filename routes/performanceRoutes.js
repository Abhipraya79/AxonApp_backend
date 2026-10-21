import express from 'express';
import {
  getEmployeePerformance,
  getTeamPerformance,
  getVendorPerformance,
} from '../controllers/performanceController.js';

const router = express.Router();

router.get('/employees', getEmployeePerformance);
router.get('/teams', getTeamPerformance);
router.get('/vendors', getVendorPerformance);

export default router;
