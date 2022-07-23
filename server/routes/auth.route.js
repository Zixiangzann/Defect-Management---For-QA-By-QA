import express from 'express';
import authController from '../controllers/auth.controller.js';
const router = express.Router();

//Middleware
import {auth} from '../middleware/auth.js'

router.post('/signin',authController.signin)
router.get('/isauth',auth(),authController.isauth)

export default router;
