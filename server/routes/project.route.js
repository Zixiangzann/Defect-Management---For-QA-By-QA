import express from 'express';
import projectController from '../controllers/project.controller.js';

const router = express.Router();

//Middleware
import {auth} from '../middleware/auth.js'


router.get('/:title',auth('readAny','projects'),projectController.getProjectByTitle)
router.post('/all',auth('readAny','projects'),projectController.getAllProjects)
router.post('/add',auth('createAny','projects'),projectController.createProject)
router.patch('/update',auth('updateAny','projects'),projectController.updateProjectByTitle)
router.delete('/delete',auth('deleteAny','projects'),projectController.deleteProjectByTitle)
router.patch('/assign',auth('updateAny','projects'),projectController.assignProject)
router.patch('/removefromproject',auth('updateAny','projects'),projectController.removeAssigneeFromProject)
router.patch('/components',auth('updateAny','projects'),projectController.addComponentsToProject)

router.post('/paginate',auth('readAny','projects'),projectController.projectsListPaginate)
router.post('/more',auth('readAny','projects'),projectController.getMoreProjects)

export default router;