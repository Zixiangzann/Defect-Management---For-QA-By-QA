import Project from '../models/project.js'
import httpStatus from 'http-status'
import { ApiError } from '../middleware/apiError.js'
import Defect from '../models/defect.js'

export const createProject = async (body) => {
    try {
        const project = new Project({
            title: body.title,
            description:body.description,
            assignee:body.assignee,
            components:body.components
        })
        await project.save();
        return project;
    } catch (error) {
        throw error
    }
}

export const getProjectByTitle = async (title) => {
    try {
        const project = Project.findOne({title})
        if(project === null) throw ApiError(httpStatus.NOT_FOUND,'Project details not found')
        return project;
    } catch (error) {
        throw error;
    }
}

export const getAllProjects = async (req) =>{

    const sortby = req.query.sortby || "title";
    const order = req.query.order || "desc";
    const limit = req.query.limit;
    
    try {
        const project = Project.find({}).sort([[sortby,order]]).limit(parseInt(limit));
        return project;        
    } catch (error) {
        throw error;
    }
}

export const deleteProjectByTitle = async (title) => {
try {
    const project = await Project.findOne({title:title}).exec()
    if(project === null) throw new ApiError(httpStatus.NOT_FOUND,'Project not found');
    Project.findOneAndDelete({title:title}).exec();
    return project;
} catch (error) {
    throw error;
}
}

export const updateProjectByTitle = async(title,body) =>{
    try {
        const project = await Project.findOne({title:title}).exec()
        if(project === null) throw new ApiError(httpStatus.NOT_FOUND,'Project not found')

        const newProjectDetail = Project.findOneAndUpdate({title:title},{
            "$set":{
                title: body.title,
                description: body.description
            },"$push":{
                assignee: body.assignee
            }
        },{new:true}).exec();
        return(newProjectDetail);
    } catch (error) {
        throw error
    }
}

export const assignProject = async(title,req) => {
    try {
        const project = await Project.findOne({title:title}).exec()
        if(project === null) throw new ApiError(httpStatus.NOT_FOUND,'Project not found')
        const uniqueReq = !req.some((v, i) => req.indexOf(v) < i);

        //check project should not have duplicate assignee
        if(!project.assignee.includes(...req) && uniqueReq){
            project.assignee.push(...req)
            project.save();
        }else{
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED,'Duplicated assignee not allowed');
        }
        return project;
    } catch (error) {
        throw error;
    }
}

export const addComponentsToProject = async(title,req) => {
    try {
        const project = await Project.findOne({title:title}).exec()
        if(project === null) throw new ApiError(httpStatus.NOT_FOUND,'Project not found')
        const uniqueReq = !req.some((v, i) => req.indexOf(v) < i);
        
        //check adding components should not be duplicated and should not exist.
        if(!project.components.includes(...req) && uniqueReq){
            project.components.push(...req)
            project.save();
        }else{
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED,'Duplicated components not allowed');
        }
        
        return project;
    } catch (error) {
        throw error;
    }
}

export const paginateProjectsList = async (req,user) =>{
    const sortby = req.body.sortby || "title";
    const order = req.body.order || "desc";
    const limit = req.body.limit || 15;
    const skip = req.body.skip || 0;

    try {
        let aggQuery = Project.aggregate();

        if (req.body.keywords && req.body.keywords != '') {
            const re = new RegExp(`${req.body.keywords}`, 'gi')
            aggQuery = Project.aggregate([
               {$match:{ title: { $regex: re }}}])
        }

        const options = {
            page: req.body.page,
            limit,
            sortby
        }
        const projects = Project.aggregatePaginate(aggQuery,options);
        return projects;
    } catch (error) {
        throw error
    }
}


export const getMoreProjects = async(req,user) => {
    const sortby = req.body.sortby || "title";
    const order = req.body.order || "desc";
    const limit = req.body.limit || 15;
    const skip = req.body.skip || 0;

    let projects = Project.find({})
    try {
        projects
        .sort([[sortby,order]])
        .skip(skip)
        .limit(parseInt(limit));
        return projects
    } catch (error) {
        throw error
    }

}