import express from 'express';
import defectController from '../controllers/defect.controller.js';

const router = express.Router();

//Middleware
import {auth} from '../middleware/auth.js'

router.post('/create',auth('createAny','defects'),defectController.createDefect)
router.get('/:defectId',auth('readAny','defects'),defectController.getDefectById)
router.patch('/update/:defectId',auth('updateAny','defects'),defectController.updateDefectById);
router.delete('/delete/:defectId',auth('deleteAny','defects'),defectController.deleteDefectById);

//get all
router.post('/more',auth('readAny','defects'),defectController.getMoreDefects);
router.post('/paginate',auth('readAny','defects'),defectController.defectListPaginate)

//Get details for create
router.post('/assignee',auth('readAny','defects'),defectController.getAllAssignee)
router.post('/components',auth('readAny','defects'),defectController.getAllComponents)
router.post('/projects',auth('readAny','defects'),defectController.getAllProjects)

//filter
router.post('/filter',auth('readAny','defects'),defectController.filterDefectList);

//For Report
router.post('/countseverity',auth('readAny','defects'),defectController.countSeverity);
router.post('/countstatus',auth('readAny','defects'),defectController.countStatus);
router.post('/countserver',auth('readAny','defects'),defectController.countServer);
router.post('/countissuetype',auth('readAny','defects'),defectController.countIssueType);
router.post('/countcomponents',auth('readAny','defects'),defectController.countComponents);

export default router;