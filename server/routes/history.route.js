import express from 'express';
import historyController from '../controllers/history.controller.js';

//Middleware
import {auth} from '../middleware/auth.js'

const router = express.Router()

router.post('/paginate/:defectId',auth('readAny','history'),historyController.paginateHistory)
router.post('/add/:defectId',auth('createAny','history'),historyController.addHistory)

export default router;