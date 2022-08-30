import express from 'express';
import adminController from '../controllers/admin.controller.js';


const router = express.Router();

//Middleware
import {auth} from '../middleware/auth.js'

router.post('/adduser',auth('createAny','admin'), adminController.addUser)
router.get('/allusers',auth('readAny','admin'),adminController.getAllUsers)
router.get('/allusersemail',auth('readAny','admin'),adminController.getAllUsersEmail)
router.patch('/changerole',auth('updateAny','admin'),adminController.changeRole)


//check if email exist
router.post('/checkemailexist',auth('readAny','admin'),adminController.checkEmailExist)
router.post('/checkusernameexist',auth('readAny','admin'),adminController.checkUsernameExist)

//get user
router.post('/getuserbyemail',auth('readAny','admin'),adminController.getUserByEmail)

//update user details
router.patch('/updateuser/firstname',auth('updateAny','admin'),adminController.updateUserFirstName)
router.patch('/updateuser/lastname',auth('updateAny','admin'),adminController.updateUserLastName)
router.patch('/updateuser/username',auth('updateAny','admin'),adminController.updateUserUserName)
router.patch('/updateuser/email',auth('updateAny','admin'),adminController.updateUserEmail)
router.patch('/updateuser/jobtitle',auth('updateAny','admin'),adminController.updateUserJobTitle)
router.patch('/updateuser/resetpassword',auth('updateAny','admin'),adminController.resetUserPassword)
router.patch('/updateuser/role',auth('updateAny','admin'),adminController.updateUserRole)



export default router;