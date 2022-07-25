import express from 'express';
import commentController from '../controllers/comment.controller.js';

//Middleware
import {auth} from '../middleware/auth.js'

const router = express.Router()

router.post('/paginate/:defectId',auth('readAny','comments'),commentController.paginateComment)
router.post('/add/:defectId',auth('createAny','comments'),commentController.addComment)
router.delete('/delete/:defectId',auth('deleteAny','comments'),commentController.deleteComment)
router.patch('/update/:defectId',auth('updateAny','comments'),commentController.editComment)

export default router;