import express from 'express';
import projectController from '../controllers/project.controller.js';

const router = express.Router();

//Middleware
import {auth} from '../middleware/auth.js'


router.get('/:title',auth('readAny','projects'),projectController.getProjectByTitle)
router.post('/all',auth('readAny','projects'),projectController.getAllProjects)
router.post('/add',auth('createAny','projects'),projectController.createProject)
router.patch('/update',auth('updateAny','projects'),projectController.updateProjectByTitle)
// router.delete('/delete',auth('deleteAny','projects'),projectController.deleteProjectByTitle)

router.post('/getallusersforassign',auth('readAny','projects'),projectController.getAllUsersForAssign)

//project assignee
router.patch('/assignee/assign',auth('updateAny','projects'),projectController.assignProject)
router.patch('/assignee/removefromproject',auth('updateAny','projects'),projectController.removeAssigneeFromProject)
//get the list of defect assigned to the user that is about to be removed
router.post('/assignee/defectlist',auth('readAny','projects'),projectController.defectListOfToBeRemovedUser)

//project component
router.patch('/components/add',auth('updateAny','projects'),projectController.addComponentsToProject)
router.patch('/components/remove',auth('updateAny','projects'),projectController.removeComponentsFromProject)
//get the list of defect of the component that about to be removed
router.post('/components/defectlist',auth('readAny','projects'),projectController.defectListOfToBeRemovedComponents)


//not using yet
// router.post('/paginate',auth('readAny','projects'),projectController.projectsListPaginate)
// router.post('/more',auth('readAny','projects'),projectController.getMoreProjects)

export default router;