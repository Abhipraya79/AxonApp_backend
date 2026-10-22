import express from 'express';
import {
  getAllOrders,
  getOnHoldOrders,
  getShippingDelays,
} from '../controllers/orderController.js';

const router = express.Router();

router.get('/', getAllOrders);
router.get('/on-hold', getOnHoldOrders);
router.get('/shipping-delays', getShippingDelays);

export default router;
