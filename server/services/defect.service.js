import Defect from "../models/defect.js";
import httpStatus from "http-status";
import { ApiError } from "../middleware/apiError.js";
import User from "../models/user.js"
import Project from "../models/project.js";
import DefectCount from "../models/count.js";

export const createDefect = async (body, user) => {
    try {

        if (!user.permission[0].addDefect) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to perform action');
        }

        //check if project exist
        const checkIfProjectExist = await DefectCount.findOne({ projectName: body.project }).exec()

        if (checkIfProjectExist === null) {
            //set it to 1 if it is not exist
            const count = new DefectCount({
                projectName: body.project,
                defectCount: 1
            })
            await count.save()
        } else {
            //increase count by 1(defectid)
            const currentCount = await DefectCount.findOne({ projectName: body.project }, { "defectCount": 1, "_id": 0 })
            await DefectCount.findOneAndUpdate({ projectName: body.project }, {
                "$set": {
                    defectCount: currentCount.defectCount + 1
                }
            },
                { new: true }).exec();
        }

  
        //defectid = project + the number of count of the defects in that project. 
        const projectDefectCount = await DefectCount.findOne({ projectName: body.project }, { "defectCount": 1, "_id": 0 })
        const defectid = `${body.project}-${projectDefectCount.defectCount}`
        //reporter details
        const reporter = {
            "_id": user._id,
            "photoURL":user.photoURL,
            "email": user.email,
            "username": user.username
        }

        const watching = [...body.assignee,user.email]

        try {
            const defect = new Defect({
                defectid: defectid,
                reporter: reporter,
                title: body.title,
                description: body.description,
                project: body.project,
                components: body.components,
                issuetype: body.issuetype,
                severity: body.severity,
                status: body.status,
                assignee: body.assignee,
                assigneeDetails: body.assigneeDetails,
                watching: watching,
                server: body.server
            })

            await defect.save();
            return defect;

        } catch (error) {
            console.log(error)
            //if fail to create the defect, need to rollback the count
            const currentCountProject = await DefectCount.findOne({ projectName: body.project }).select('defectCount').exec()
            await DefectCount.findOneAndUpdate({ projectName: body.project }, {
                "$set": {
                    defectCount: currentCountProject.defectCount - 1
                }
            },
                { new: true }).exec();

            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'System failed to create defect');

        }
s
    } catch (error) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'System failed to create defect');
    }
}

export const updateAttachment = async (defectId, user, body) => {

    try {
        const defect = await Defect.findOne({ defectid: defectId }).exec();
        if (defect === null) throw new ApiError(httpStatus.NOT_FOUND, 'Defect details not found');

        const defectProject = (await Defect.find({ defectid: defectId }).select('project -_id').exec())[0].project;
        if (!user.permission[0].viewAllDefect && !user.project.includes(defectProject)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to update defect');
        }

        const addFileAttachment = Defect.findOneAndUpdate({ defectid: defectId },
            {
                "$set": {
                    attachment: body.attachment
                }
            },
            { new: true }).exec();

        return addFileAttachment;
    } catch (error) {
        throw error
    }
}


export const getDefectById = async (defectId, user) => {
    try {

        const result = new Array();

        const defect = await Defect.findOne({ defectid: defectId }).exec();
        if (defect === null) throw new ApiError(httpStatus.NOT_FOUND, 'Defect details not found');

        //If account does not have "viewAllDefect" permission, the account need to be assigned to the project in order to view the defect.
        const defectProject = (await Defect.find({ defectid: defectId }).select('project -_id').exec())[0].project;
        if (!user.permission[0].viewAllDefect && !user.project.includes(defectProject)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view defect');
        }

        //using the assigne from defect, find the users 
        const assignee = defect.assignee
        const users = await User.find({ email: assignee }).select(["photoURL", "username", "email"])

        result.push({"defect":defect})
        result.push({"assignee":users})

        return result;

    } catch (error) {
        throw error
    }
}

export const updateDefectById = async (defectId, user, body) => {
    try {


        const defect = await Defect.findOne({ defectid: defectId }).exec();
        if (defect === null) throw new ApiError(httpStatus.NOT_FOUND, 'Defect details not found');

        const defectProject = (await Defect.find({ defectid: defectId }).select('project -_id').exec())[0].project;

        if (!user.permission[0].editOwnDefect && !user.permission[0].editAllDefect) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to update defect');
        }

        if (!user.permission[0].viewAllDefect && !user.project.includes(defectProject)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view defect');
        }

        if (!user.permission[0].editAllDefect && user.permission[0].editOwnDefect && defect.reporter !== user.email) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to update defect');
        }

        const watching = [...body.assignee,defect.reporter.email]

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
                    assignee: body.assignee,
                    assigneeDetails: body.assigneeDetails,
                    watching: watching,
                    server: body.server,
                    lastUpdatedDate: Date.now()
                }
            },
            { new: true }).exec();

        return (newDefectDetail);
    } catch (error) {
        throw error
    }
}

export const deleteDefectById = async (defectId, user) => {
    try {

        if (!user.permission[0].deleteAllDefect) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to delete defect');
        }

        const defect = await Defect.findOne({ defectid: defectId }).exec();
        if (defect === null) throw new ApiError(httpStatus.NOT_FOUND, 'Defect details not found');
        Defect.findOneAndDelete({ defectid: defectId }).exec();


        //need to also delete attachment in firebase

        return defect;
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

    if (!req.user.permission[0].viewAllDefect && !user.project.includes(project)) {
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
// //not using
// export const paginateDefectList = async (req) => {

//     const sortby = req.body.sortby || "lastUpdatedDate";
//     const order = req.body.order || -1
//     const limit = req.body.limit || 15;
//     const skip = req.body.skip || 0;
//     const search = req.body.search || '(.*?)';

//     //If it is a user account, user can only see project that the account is been assigned to
//     const userProject = Project.find({ "assignee": { $in: [req.user.email] } }).select("title -_id").distinct("title").exec()

//     const options = {
//         page: req.body.page,
//         limit,
//         sortby,
//         order,
//         search
//     }

//     let aggQuery;

//     try {
//         if (!req.user.permission[0].viewAllDefect) {
//             aggQuery = Defect.aggregate(
//                 [{ $match: { project: { $in: await userProject }, title: { $regex: search, $options: 'i' } } },
//                 { $sort: { [sortby]: order } }
//                 ], { collation: { locale: "en", caseLevel: true } }
//             )
//         }

//         if (req.user.permission[0].viewAllDefect) {
//             aggQuery = Defect.aggregate(
//                 [{ $match: { title: { $regex: search, $options: 'i' } } },
//                 { $sort: { [sortby]: order } }
//                 ]
//                 , { collation: { locale: "en", caseLevel: true } }
//             )
//         }

//         const defects = Defect.aggregatePaginate(aggQuery, options);

//         return defects;

//     } catch (error) {
//         throw error
//     }

// }

//Get details for creating defects
//Get assignee of the project.
export const getAllAssignee = async (req, title) => {

    const sortby = req.body.sortby || "email";
    const order = req.body.order || -1
    const search = req.body.search || '(.*?)';

    try {
        const project = await Project.find({ title: title })
        const assignee = project[0].assignee

        //using the assignee from project, find the users
        //username and photourl
        const users = await User.find({ email: assignee }).select(["photoURL", "username", "email"])

        return users;
    } catch (error) {
        throw error
    }
}

//add/remove from watchlist
export const defectWatch = async (defectid,user) => {


    const defect = await Defect.find({defectid})
    if(!defect) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Defect Details not found'); 

    //Toggle
    //If user is already watching, remove from watchlist
    if(defect[0].watching.includes(user)){
        const removeFromWatchlist = await Defect.findOneAndUpdate({defectid}, { $pull: { watching: user } }, { new: true })
        return "Removed from watchlist"
    }else{
        //if user is not watching, add to watchlist
        const addedToWatchlist = await Defect.findOneAndUpdate({defectid}, { $push: { watching: user } }, { new: true })
        return "Added to watchlist"
    }

}


//Get details for creating defects
//To get available projects.
//Only account with viewAllDefect permission can see all projects defects.
//account without this permission can only see project that is assigned to them.
export const getAllProjects = async (user) => {
    try {
        if (!user.permission[0].viewAllDefect) {
            const project = Project.find({ assignee: user.email }).sort([['title', 'desc']])
            return project
        }

        if (user.permission[0].viewAllDefect) {
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

        const sortby = req.body.sortby || "lastUpdatedDate";
        const order = req.body.order || 1;
        const limit = req.body.limit || 15;
        const skip = req.body.skip || 0;
        const project = req.body.project || '';
        const components = req.body.components || '';
        const status = req.body.status || '';
        const severity = req.body.severity || '';
        const assignee = req.body.assignee || '';
        const watchlist = req.body.watchlist || ''; 
        const reporter = req.body.reporter || '';
        const server = req.body.server || '';
        const search = req.body.search || '(.*?)';


        //if search by project but user is not assigned to the project and does not have viewAllDefect permission throw error
        if (project !== '' && !user.permission[0].viewAllDefect && !user.project.includes(project)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
        }

        if(watchlist && watchlist !== user.email){
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view other user watchlist');
        }

        const matchAll = new RegExp('(.*?)', 'gi')
        //if not search by project and user does not have viewAllDefect permission
        //the searched project will be whatever project that is assigned to the user
        //else if user have viewAllDefect permission then search everything   
        let filterProject = ''

        if (project === '' && !user.permission[0].viewAllDefect) {
            filterProject = { $in: user.project }
        } else if (project === '' && user.permission[0].viewAllDefect) {
            filterProject = { $regex: matchAll }
        } else {
            filterProject = project
        }


        const filterComponents = (components === '') ? { $regex: matchAll } : components
        const filterStatus = (status === '') ? { $regex: matchAll } : status
        const filterSeverity = (severity === '') ? { $regex: matchAll } : severity
        const filterServer = (server === '') ? { $regex: matchAll } : server
        const filterAssignee = (!assignee.length) ?  { $all: [/(.*?)/i] }   :  { $all: assignee }
        const filterWatchlist = (watchlist === '') ?  { $in: [/(.*?)/i] }:  { $in: [ user.email ] }
        const filterReporter = (reporter === '') ? { $regex: matchAll } : reporter

        let aggQuery = Defect.aggregate([
            [
                {
                    $match: {
                        project: filterProject,
                        components: filterComponents,
                        status: filterStatus,
                        severity: filterSeverity,
                        server: filterServer,
                        "reporter.username": filterReporter,
                        title: { $regex: search, $options: 'i' },
                        "assigneeDetails.username": filterAssignee,
                        watching: filterWatchlist
                    }
                },
                { $sort: { [sortby]: order } }
            ],
        ], { collation: { locale: "en", caseLevel: true } });

        const options = {
            page: req.body.page,
            limit,
            sortby,
            search
        }

        const defects = Defect.aggregatePaginate(aggQuery, options);
        return defects;

    } catch (error) {
        throw error
    }
}

//For generate report

export const countSeverity = async (req, user) => {
    const project = req.body.project || ''

    try {
        if (!req.user.permission[0].viewAllDefect && !user.project.includes(project)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
        }

        const matchAll = new RegExp('(.*?)', 'gi')
        const filterProject = (project === '') ? { $regex: matchAll } : project

        let aggQuery = ([
            { $match: { project: filterProject } },
            { $group: { _id: '$severity', count: { $sum: 1 } } }])

        const defects = Defect.aggregate(aggQuery).sort('_id').exec()
        return defects;

    } catch (error) {
        throw error
    }
}


export const countStatus = async (req, user) => {
    const project = req.body.project || ''

    try {
        if (!user.permission[0].viewAllDefect && !user.project.includes(project)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
        }

        const matchAll = new RegExp('(.*?)', 'gi')
        const filterProject = (project === '') ? { $regex: matchAll } : project

        let aggQuery = ([
            { $match: { project: filterProject } },
            { $group: { _id: '$status', count: { $sum: 1 } } }])

        const defects = Defect.aggregate(aggQuery).sort('_id').exec()
        return defects;

    } catch (error) {
        throw error
    }
}

export const countServer = async (req, user) => {
    const project = req.body.project || ''

    try {
        if (!user.permission[0].viewAllDefect && !user.project.includes(project)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
        }

        const matchAll = new RegExp('(.*?)', 'gi')
        const filterProject = (project === '') ? { $regex: matchAll } : project

        let aggQuery = ([
            { $match: { project: filterProject } },
            { $group: { _id: '$server', count: { $sum: 1 } } }])

        const defects = Defect.aggregate(aggQuery).sort('_id').exec()
        return defects;

    } catch (error) {
        throw error
    }
}


export const countIssueType = async (req, user) => {
    const project = req.body.project || ''

    try {
        if (!req.user.permission[0].viewAllDefect && !user.project.includes(project)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
        }

        const matchAll = new RegExp('(.*?)', 'gi')
        const filterProject = (project === '') ? { $regex: matchAll } : project

        let aggQuery = ([
            { $match: { project: filterProject } },
            { $group: { _id: '$issuetype', count: { $sum: 1 } } }])

        const defects = Defect.aggregate(aggQuery).sort('_id').exec()
        return defects;

    } catch (error) {
        throw error
    }
}

export const countComponents = async (req, user) => {
    const project = req.body.project || ''

    try {
        if (!req.user.permission[0].viewAllDefect && !user.project.includes(project)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view project');
        }

        const matchAll = new RegExp('(.*?)', 'gi')
        const filterProject = (project === '') ? { $regex: matchAll } : project

        let aggQuery = ([
            { $match: { project: filterProject } },
            { $group: { _id: '$components', count: { $sum: 1 } } }])

        const defects = Defect.aggregate(aggQuery).sort('_id').exec()
        return defects;

    } catch (error) {
        throw error
    }
}


