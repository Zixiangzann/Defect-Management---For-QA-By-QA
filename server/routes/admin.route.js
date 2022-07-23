import express from 'express';
import adminController from '../controllers/admin.controller.js';

const router = express.Router();

//Middleware
import {auth} from '../middleware/auth.js'

router.post('/adduser',auth('createAny','admin'), adminController.addUser)
router.get('/allusers',auth('readAny','admin'),adminController.getAllUsers)
router.patch('/changerole',auth('updateAny','admin'),adminController.changeRole)


export default router;