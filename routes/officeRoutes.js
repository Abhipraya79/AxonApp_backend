import express from 'express';
import { getOfficePerformance } from '../controllers/officeController.js';

const router = express.Router();

router.get('/performance', getOfficePerformance);

export default router;
