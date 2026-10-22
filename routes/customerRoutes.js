import express from 'express';
import {
  getAllCustomers,
  getTopCustomers,
} from '../controllers/customerController.js';

const router = express.Router();

router.get('/', getAllCustomers);
router.get('/top', getTopCustomers);

export default router;
