import express from 'express';
import {
  getAllProducts,
  getTopSellingProducts,
  getProductCategories,
  getUnsoldProducts,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/top-selling', getTopSellingProducts);
router.get('/categories', getProductCategories);
router.get('/unsold', getUnsoldProducts);

export default router;
