import Defect from "../models/defect.js";
import httpStatus from "http-status";
import { ApiError } from "../middleware/apiError.js";
import User from "../models/user.js"
import Project from "../models/project.js";

export const createDefect = async (body) => {
    try {
        const defect = new Defect({
            title: body.title,
            description: body.description,
            project: body.project,
            components: body.components,
            issuetype: body.issuetype,
            severity: body.severity,
            status: body.status,
            assignee: body.assignee,
            server: body.server
        })
        await defect.save();
        return defect;
    } catch (error) {
        throw error
    }
}

export const getDefectById = async (defectId, user) => {
    try {

        const defect = await Defect.findOne({ defectid: defectId }).exec();
        if (defect === null) throw new ApiError(httpStatus.NOT_FOUND, 'Defect details not found');

        //If it is a "user" account, the account need to be assigned to the project in order to view the defect.
        const defectProject = (await Defect.find({ defectId }).select('project -_id').exec())[0].project;
        if (user.role !== 'admin' && !user.project.includes(defectProject)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
        }
        return defect;
    } catch (error) {
        throw error
    }
}

export const updateDefectById = async (defectId, body) => {
    try {
        const defect = await Defect.findOne({ defectid: defectId }).exec();
        if (defect === null) throw new ApiError(httpStatus.NOT_FOUND, 'Defect details not found');

        const newDefectDetail = Defect.findOneAndUpdate({ defectid: defectId },
            {
                "$set": {
                    title: body.title,
                    description: body.description,
                    project: body.project,
                    components: body.components,
                    issuetype: body.issuetype,
                    severity: body.severity,
                    status: body.status,
                    assignee: body.assignee
                }
            },
            { new: true }).exec();

        return (newDefectDetail);
    } catch (error) {
        throw error
    }
}

export const deleteDefectById = async (defectId) => {
    try {
        const defect = await Defect.findOne({ defectid: defectId }).exec();
        if (defect === null) throw new ApiError(httpStatus.NOT_FOUND, 'Defect details not found');
        Defect.findOneAndDelete({ defectid: defectId }).exec();
        return defect;
    } catch (error) {
        throw error
    }
}

export const getAllDefects = async (req, user) => {
    const sortby = req.query.sortby || "_id";
    const order = req.query.order || "desc";
    const limit = req.query.limit || 15;
    const project = req.query.project || 'all'

    if (req.user.role !== 'admin' && !user.project.includes(project)) {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
    }

    let defects = ''
    if (project === 'all') {
        defects = Defect.find({})
    } else {
        defects = Defect.find({ project })
    }

    try {
        defects
            .sort([[sortby, order]])
            .limit(parseInt(limit));

        return defects;
    } catch (error) {
        throw error
    }
}

//For more
export const getMoreDefects = async (req, user) => {
    const sortby = req.body.sortby || "_id";
    const order = req.body.order || "desc";
    const limit = req.body.limit || 15;
    const project = req.body.project || 'all';
    const skip = req.body.skip || 0;

    if (req.user.role !== 'admin' && !user.project.includes(project)) {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
    }

    let defects = ''
    if (project === 'all') {
        defects = Defect.find({})
    } else {
        defects = Defect.find({ project })
    }

    try {
        defects
            .sort([[sortby, order]])
            .skip(skip)
            .limit(parseInt(limit));
        return defects;
    } catch (error) {
        throw error
    }
}

//For paginate and search by title
//Do a seperate search for id? 
export const paginateDefectList = async (req, user) => {

    const sortby = req.body.sortby || "_id";
    const order = req.body.order || "desc";
    const limit = req.body.limit || 15;
    const project = req.body.project || 'all';
    const skip = req.body.skip || 0;

    if (req.user.role !== 'admin' && !user.project.includes(project)) {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
    }

    try {
        //default
        let aggQuery = Defect.aggregate();

        //Project only
        if (project !== 'all')
            aggQuery = Defect.aggregate([
                { $match: { project: project } }
            ]);

        //Project and keyword
        if (req.body.keywords && req.body.keywords != '' && project !== 'all') {
            const re = new RegExp(`${req.body.keywords}`, 'gi')
            aggQuery = Defect.aggregate([
                { $match: { title: { $regex: re }, project: project } }])
        }

        //no project but have keyword
        if (req.body.keywords && req.body.keywords != '' && project === 'all') {
            const re = new RegExp(`${req.body.keywords}`, 'gi')
            aggQuery = Defect.aggregate([
                { $match: { title: { $regex: re } } }])
        }

        const options = {
            page: req.body.page,
            limit,
            sortby
        }

        const defects = Defect.aggregatePaginate(aggQuery, options);
        return defects;

    } catch (error) {
        throw error
    }

}

//Get details for creating defects
//Get assignee of the project.
export const getAllAssignee = async (title) => {
    try {
        const assignee = Project.find({ title: title }).select('assignee -_id')
        return assignee;
    } catch (error) {
        throw error
    }
}
//Get details for creating defects
//To get available projects.
//Only admin can see all projects.
//user or any other role can only see project that is assigned to them.
export const getAllProjects = async (user) => {
    try {
        if (user.role !== 'admin') {
            const project = Project.find({ assignee: user.email }).sort([['title', 'desc']])
            return project
        }

        if (user.role === 'admin') {
            const project = Project.find({}).sort([['title', 'desc']])
            return project
        }
    } catch (error) {
        throw error
    }
}

//Get details for creating defects
//Get components of the project.
export const getAllComponents = async (title) => {
    try {
        const components = Project.find({ title: title }).select('components -_id')
        return components
    } catch (error) {
        throw error
    }
}

//search/filter for defects
export const filterDefectList = async (req, user) => {
    try {

        const sortby = req.body.sortby || "_id";
        const order = req.body.order || "desc";
        const limit = req.body.limit || 15;
        const skip = req.body.skip || 0;
        const project = req.body.project || '';
        const components = req.body.components || '';
        const status = req.body.status || '';
        const severity = req.body.severity || '';

        if (req.user.role !== 'admin' && !user.project.includes(project)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
        }

     const matchAll = new RegExp('(.*?)', 'gi')   
     const filterProject = (project==='') ? { $regex: matchAll } : project   
     const filterComponents = (components==='') ? { $regex: matchAll } : components   
     const filterStatus = (status==='') ? { $regex: matchAll } : status
     const filterSeverity = (severity==='') ? { $regex: matchAll } : severity

        let aggQuery = Defect.aggregate([
            [
                { $match: {
                    project:filterProject,
                    components:filterComponents,
                    status:filterStatus,
                    severity:filterSeverity
                   }
                }
            ]
        ]);

        
        const options = {
            page: req.body.page,
            limit,
            sortby
        }

        const defects = Defect.aggregatePaginate(aggQuery, options);
        return defects;

    } catch (error) {
        throw error
    }
}

