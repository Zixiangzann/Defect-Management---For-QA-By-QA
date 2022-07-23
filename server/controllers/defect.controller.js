import httpStatus from 'http-status';
import { defectService } from '../services/index.js';

const defectController ={

    async createDefect(req,res,next){
        try {
            const defect = await defectService.createDefect(req.body);
            res.json(defect)
        } catch (error) {
            next(error)
        }
    },
    async getDefectById(req,res,next){
        try {
            const defectId = req.params.defectId
            const defect = await defectService.getDefectById(defectId,req.user);
            res.json(defect);
        } catch (error) {
            next(error);
        }
    },
    async updateDefectById(req,res,next){
        try {
            const defectId = req.params.defectId;
            const defect = await defectService.updateDefectById(defectId,req.body);
            res.json(defect);
        } catch (error) {
            next(error);
        }
    },
    async deleteDefectById(req,res,next){
        try {
            const defectId = req.params.defectId;
            await defectService.deleteDefectById(defectId);
            res.status(httpStatus.OK).json({[defectId]:'deleted'});
        } catch (error) {
            next(error);
        }
    },
    async getAllDefects(req,res,next){
        try {
            const defects = await defectService.getAllDefects(req,req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },
    //For more
    async getMoreDefects(req,res,next){
        try {
            const defects = await defectService.getMoreDefects(req,req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },
    async defectListPaginate(req,res,next){
        try {
            const defects = await defectService.paginateDefectList(req,req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },
    //Get details for creating defects
    async getAllAssignee(req,res,next){
        try {
            const assignee =  await defectService.getAllAssignee(req.body.title);
            res.json(assignee);
        } catch (error) {
            next(error);
        }
    },
    async getAllProjects(req,res,next){
        try {
            const projects = await defectService.getAllProjects(req.user);
            res.json(projects)
        } catch (error) {
            next(error);
        }
    },
    async getAllComponents(req,res,next){
        try {
            const components = await defectService.getAllComponents(req.body.title);
            res.json(components);
        } catch (error) {
            next(error)
        }
    },
    async filterDefectList(req,res,next){
        try {
            const defects = await defectService.filterDefectList(req,req.user);
            res.json(defects);
        } catch (error) {
            next(error);
        }
    },
}

export default defectController;