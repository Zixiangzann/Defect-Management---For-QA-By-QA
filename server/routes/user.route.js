import express from 'express';
import userController from '../controllers/user.controller.js';

const router = express.Router();

//Middleware
import {auth} from '../middleware/auth.js'

router.route('/profile')
.get(auth('readOwn','profile'),userController.profile)
.patch(auth('updateOwn','profile'),userController.updateProfile)

// router.patch('/email',auth('updateOwn','profile'),userController.updateUserEmail)
router.get('/verify',userController.verifyAccount)

 
export default router;