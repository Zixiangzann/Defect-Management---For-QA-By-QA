import Project from '../models/project.js'
import httpStatus from 'http-status'
import { ApiError } from '../middleware/apiError.js'
import Defect from '../models/defect.js'
import User from "../models/user.js"
import { userService } from "./index.js";
import {
    mailProjectAssigneeAdded,
    mailProjectAssigneeRemoved,
    mailProjectComponentAdded,
    mailProjectComponentRemoved,
    mailProjectCreated,
    mailProjectTitleUpdated
} from '../mailTemplate/templates.js'

export const createProject = async (req) => {

    const title = req.body.title
    const description = req.body.description

    //require addProject permission.
    if (!req.user.permission[0].addProject) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to create project');

    if (title.length > 20) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Max length for project name is: 20');

    req.body.components.map((e) => {
        if (e.length > 20) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Max length for component name is: 20');
    })

    //title and description cannot be empty
    if (title.trim().length <= 0) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Project Title is required');
    if (description.trim().length <= 0) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Project Description is required');

    //Check if title is already taken
    if (await Project.projectTitleTaken(title)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry, This Project name have been taken, Please use another Project name');
    }


    //remove any duplicate in assignee/components before adding project
    //front end will also validate this. but just in case somehow it get to backend with duplicate.
    const assignee = [... new Set(req.body.assignee)]
    const components = [... new Set(req.body.components)]


    try {
        const createdProject = new Project({
            title: title,
            description: description,
            assignee: assignee,
            components: components
        })
        await createdProject.save();

        //after create project, assign project to user
        //find user by the assignee email and add the project
        const updatedUser = await User.updateMany({ email: assignee }, { $push: { project: title } }, { new: true })

        const result = new Array();
        result.push(createdProject)
        result.push({
            "email": assignee,
            "project": title,
            "action": "assigned user to project"
        })

        //send email
        try {
            mailProjectCreated(req, result)
        } catch {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Project created but failed to send email notification');
        }

        return result;
    } catch (error) {
        throw error
    }
}

export const checkProjectTitleExist = async (body) => {
    try {
        if (await Project.projectTitleTaken(body.title)) {
            return { message: 'Sorry, This Project name has been taken, Please use another Project name' }
        }

    } catch (error) {
        throw error
    }
}

export const getProjectByTitle = async (title) => {
    try {
        const project = await Project.findOne({ title })
        if (project === null) throw ApiError(httpStatus.NOT_FOUND, 'Project details not found')
        //use project assignee to get user details

        const user = await User.find({ email: project.assignee }, { "username": 1, "email": 1, "photoURL": 1 })

        const result = new Array();
        result.push(project)
        result.push(user)

        return result;
    } catch (error) {
        throw error;
    }
}

export const getAllProjects = async (req) => {

    const sortby = req.query.sortby || "title";
    const order = req.query.order || "desc";
    const limit = req.query.limit;

    try {
        const project = Project.find({}).sort([[sortby, order]]).limit(parseInt(limit));
        return project;
    } catch (error) {
        throw error;
    }
}


//get all users for assigning
export const getAllUsersForAssign = async (req) => {

    // only system owner and admin allowed to perform this action
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    try {
        const users = await User.find({}).select("username email photoURL")

        if (!users) throw new ApiError(httpStatus.NOT_FOUND, 'Unable to fetch users')
        return users

    } catch (error) {
        throw error
    }
}

export const updateProjectByTitle = async (req) => {
    try {

        if (!req.user.permission[0].addProject) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to update project details');

        const oldTitle = req.body.oldTitle
        const newTitle = req.body.newTitle;
        const newDescription = req.body.newDescription;

        const project = await Project.findOne({ title: oldTitle })
        //only using it for email
        const oldDescription = { oldDescription: project.description };

        if (project === null) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found')

        if (newTitle) {

            //update in Project Collection
            const newProjectDetail = await Project.findOneAndUpdate({ title: oldTitle }, {
                "$set": {
                    title: newTitle
                }
            }, { new: true }).exec();

            //update in User Collection
            const updatedUserProject = await User.updateMany(
                { project: oldTitle },
                { $set: { "project.$": newTitle } })

            //update in Defect Collection
            const updatedDefectProject = await Defect.updateMany({ project: oldTitle }
                , { $set: { "project": newTitle } })

            //send email
            try {
                mailProjectTitleUpdated(req, newProjectDetail)
            } catch {
                throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Project title updated but failed to send email notification');
            }

            return (newProjectDetail);

        } else if (newDescription) {

            const newProjectDetail = await Project.findOneAndUpdate({ title: oldTitle }, {
                "$set": {
                    description: newDescription
                }
            }, { new: true }).exec();

            const result = {
                ...newProjectDetail._doc,
                ...oldDescription
            }

            //send email
            try {
                mailProjectTitleUpdated(req, result)
            } catch {
                throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Project description updated but failed to send email notification');
            }

            return (result);

        }

    } catch (error) {
        throw error
    }
}

export const assignProject = async (req) => {

    const userEmail = req.body.userEmail
    const projectTitle = req.body.projectTitle

    //check account permission
    if (!req.user.permission[0].assignProject) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    //check if project is found
    const project = await Project.findOne({ title: projectTitle });
    if (!project) throw new ApiError(httpStatus.BAD_REQUEST, 'Project not found');

    //check if user is already assigned to project
    if (project.assignee.includes(userEmail)) throw new ApiError(httpStatus.BAD_REQUEST, 'User is already assigned to this project');

    //update in Project collection
    const updatedProject = await Project.findOneAndUpdate({ title: projectTitle }, { $push: { assignee: userEmail } }, { new: true })

    //update in user collection
    const updatedUser = await User.findOneAndUpdate({ email: userEmail }, { $push: { project: projectTitle } }, { new: true })


    const result = new Array();
    result.push(await updatedProject)
    result.push(
        {
            "email": await updatedUser.email,
            "username": user.username,
            "project": await updatedUser.project
        }
    )

    //send email
    try {
        mailProjectAssigneeAdded(req, result)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Assignee added but failed to send email notification');
    }

    return result;

}
// removing assignee from project
export const removeAssigneeFromProject = async (req) => {


    const userEmail = req.body.userEmail
    const projectTitle = req.body.projectTitle

    //check account permission
    if (!req.user.permission[0].assignProject) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }


    //check if user email is found
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    //check if project is found
    const project = await Project.findOne({ title: projectTitle });
    if (!project) throw new ApiError(httpStatus.BAD_REQUEST, 'Project not found');

    //to check if there is any defect assigned to this user
    const defect = await Defect.find({ project: projectTitle, assignee: userEmail })
    if (defect.length > 0) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Unable to remove user from this project as there are defect/s assigned to this user');

    //update in Project collection
    const updatedProject = await Project.findOneAndUpdate({ title: projectTitle }, { $pull: { assignee: userEmail } }, { new: true })

    //update in user collection
    const updatedUser = await User.findOneAndUpdate({ email: userEmail }, { $pull: { project: projectTitle } }, { new: true })

    const result = new Array();
    result.push(await updatedProject)
    result.push({
        "email": await updatedUser.email,
        "username": user.username,
        "project": await updatedUser.project
    })

    //send email
    try {
        mailProjectAssigneeRemoved(req, result)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Assignee removed but failed to send email notification ');
    }

    return result;

}

//get defects that are assigned to the user to be removed
export const defectListOfToBeRemovedUser = async (req) => {
    try {
        const userEmail = req.body.userEmail
        const projectTitle = req.body.projectTitle


        //check account permission
        if (!req.user.permission[0].assignProject) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
        }

        //check if user exist
        //check if user email is found
        const user = await User.findOne({ email: userEmail });
        if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

        //to check if there is any defect assigned to this user
        const defect = await Defect.find({ project: projectTitle, assignee: userEmail })
        return defect

    } catch (error) {
        throw error
    }
}


export const addComponentsToProject = async (req) => {

    try {

        const title = req.body.title

        //require addComponent permission.
        if (!req.user.permission[0].addComponent) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to add new component');

        const project = await Project.findOne({ title: title }).exec()
        if (project === null) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found')


        //adding components array
        if (Array.isArray(req.body.components)) {

            //remove any duplicate in components before adding project
            //front end will also validate this. but just in case somehow it get to backend with duplicate.
            const components = [... new Set(req.body.components)]

            components.map((e) => {
                if (e.length > 20) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Max length for component name is: 20');
            })

            //check the component to be added does not already exist in project
            components.map((component) => {
                if (project.components.includes(component)) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'The component/s you are trying to add is already exist in this project');
            })

            //add to project collection
            project.components.push(...components);
            project.save();
        } else {
            //adding single component
            const components = req.body.components
            if (components > 20) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Max length for component name is: 20');
            if (project.components.includes(components)) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'The component/s you are trying to add is already exist in this project');

            //add to project collection
            project.components.push(components);
            project.save();
        }

        //send email
        try {
            mailProjectComponentAdded(req, project)
        } catch {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Component added but failed to send email notification');
        }

        return project;
    } catch (error) {
        throw error;
    }
}

//remove components
export const removeComponentsFromProject = async (req) => {

    try {
        const title = req.body.title
        const componentToBeRemove = req.body.componentToBeRemove

        //require deleteComponent permission.
        if (!req.user.permission[0].deleteComponent) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to remove component');

        //check if component exist
        const project = await Project.findOne({ title: title })
        if (!project.components.includes(componentToBeRemove)) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'The component/s you are trying to remove does not exist');

        //to check if there is any defect assigned to this components
        const defect = await Defect.find({ project: title, components: componentToBeRemove })
        if (defect.length > 0) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Unable to remove component as there are defect/s assigned to this component');

        const updatedProject = await Project.findOneAndUpdate({ title: title }, { $pull: { components: componentToBeRemove } }, { new: true })

        //send email
        try {
            mailProjectComponentRemoved(req, project)
        } catch {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Component removed but failed to send email notification');
        }

        return updatedProject;
    } catch (error) {
        throw error
    }

}

//get defect list of the components to be deleted
export const defectListOfToBeRemovedComponents = async (req) => {
    try {
        const title = req.body.title
        const componentToBeRemove = req.body.componentToBeRemove

        //require deleteComponent permission.
        if (!req.user.permission[0].deleteComponent) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to remove component');

        //check if component exist
        const project = await Project.findOne({ title: title })
        if (!project.components.includes(componentToBeRemove)) throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'The component/s you are trying to remove does not exist');

        //to check if there is any defect assigned to this components
        const defect = await Defect.find({ project: title, components: componentToBeRemove })
        return defect

    } catch (error) {
        throw error
    }
}




//not using yet

// export const deleteProjectByTitle = async (title) => {
//     try {
//         const project = await Project.findOne({ title: title }).exec()
//         if (project === null) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found');
//         Project.findOneAndDelete({ title: title }).exec();
//         return project;
//     } catch (error) {
//         throw error;
//     }
// }




//not using yet

// export const paginateProjectsList = async (req, user) => {
//     const sortby = req.body.sortby || "title";
//     const order = req.body.order || "desc";
//     const limit = req.body.limit || 15;
//     const skip = req.body.skip || 0;

//     try {
//         let aggQuery = Project.aggregate();

//         if (req.body.keywords && req.body.keywords != '') {
//             const re = new RegExp(`${req.body.keywords}`, 'gi')
//             aggQuery = Project.aggregate([
//                 { $match: { title: { $regex: re } } }])
//         }

//         const options = {
//             page: req.body.page,
//             limit,
//             sortby
//         }
//         const projects = Project.aggregatePaginate(aggQuery, options);
//         return projects;
//     } catch (error) {
//         throw error
//     }
// }


// export const getMoreProjects = async (req, user) => {
//     const sortby = req.body.sortby || "title";
//     const order = req.body.order || "desc";
//     const limit = req.body.limit || 15;
//     const skip = req.body.skip || 0;

//     let projects = Project.find({})
//     try {
//         projects
//             .sort([[sortby, order]])
//             .skip(skip)
//             .limit(parseInt(limit));
//         return projects
//     } catch (error) {
//         throw error
//     }

// }