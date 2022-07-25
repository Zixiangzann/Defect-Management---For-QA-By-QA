import Defect from "../models/defect.js";
import httpStatus from "http-status";
import { ApiError } from "../middleware/apiError.js";
import User from "../models/user.js"
import Project from "../models/project.js";
import DefectCount from "../models/count.js";

export const createDefect = async (body) => {
        try {

            const checkIfExist = await DefectCount.findOne({}).exec()

            if(checkIfExist === null){
                //set it to 1 if it is not exist
                const count = new DefectCount({
                    defectCount:1
                })
                await count.save()
            }else{
                //increase count by 1(defectid)
                const currentCount = await DefectCount.findOne({}).select('defectCount').exec()
                await DefectCount.findOneAndUpdate({},{
                    "$set": {
                        defectCount: currentCount.defectCount +1
                    }
                },
                { new: true }).exec();
            }

            //get new count and set it to defectid
            const newCount = await DefectCount.findOne({}).select('defectCount').exec()
            console.log(newCount)
            const defect = new Defect({
            defectid: parseInt(await newCount.defectCount),
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

        // const update = DefectCount.update('')
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
        const defectProject = (await Defect.find({defectid:defectId }).select('project -_id').exec())[0].project;
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
export const paginateDefectList = async (req) => {

    const sortby = req.body.sortby || "_id";
    const order = req.body.order || "desc";
    const limit = req.body.limit || 15;
    const skip = req.body.skip || 0;

    //If it is a user account, user can only see project that the account is been assigned to
    const userProject = Project.find({"assignee":{$in:[req.user.email]}}).select("title -_id").distinct("title").exec()

    const options = {
        page: req.body.page,
        limit,
        sortby
    }

    let aggQuery = Defect.aggregate()

    try {
        if (req.user.role !== 'admin') {
            aggQuery = Defect.aggregate(
                [{$match:{project:{$in:await userProject}}}]
                )
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

