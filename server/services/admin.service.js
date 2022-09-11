import User from "../models/user.js"
import { ApiError } from "../middleware/apiError.js";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { userService } from "./index.js";
import Project from "../models/project.js";
import bcrypt from 'bcrypt'
import Defect from "../models/defect.js";



import { getAuth } from 'firebase-admin/auth'
import admin from "../firebase.js"

export const addUser = async (req) => {
    try {

        let userNewPermission = ''
        let firebaseuid = ''

        //check account permission
        if (!req.user.permission[0].addUser) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
        }

        // only owner allowed to add admin account
        if (req.user.role !== 'owner' && req.body.userDetails.role === 'admin') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
        }

        //non owner account cannot create account with these permission
        if (req.user.role !== 'owner' && (
            req.body.permission.viewAllDefect ||
            req.body.permission.deleteAllDefect ||
            req.body.permission.editAllComment ||
            req.body.permission.deleteAllComment ||
            req.body.permission.addUser ||
            req.body.permission.disableUser ||
            req.body.permission.deleteUser ||
            req.body.permission.changeUserDetails ||
            req.body.permission.resetUserPassword ||
            req.body.permission.addProject ||
            req.body.permission.assignProject ||
            req.body.permission.deleteProject ||
            req.body.permission.addComponent ||
            req.body.permission.deleteComponent)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to assign these permission');
        }


        //Only owner account can give all type of permission 
        if (req.user.role === 'owner') {
            userNewPermission = req.body.permission
        } else if (req.user.role === 'admin') {
            userNewPermission = [{
                addDefect: req.body.permission[0].addDefect,
                editOwnDefect: req.body.permission[0].editOwnDefect,
                editAllDefect: req.body.permission[0].editAllDefect,
                addComment: req.body.permission[0].addComment,
                editOwnComment: req.body.permission[0].editOwnComment,
                deleteOwnComment: req.body.permission[0].deleteOwnComment
            }]
        }

        //if email already exist
        if (await User.emailTaken(req.body.userDetails.email.toLowerCase())) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry email taken');
        }

        //if username already exist
        if (await User.usernameTaken(req.body.userDetails.username.toLowerCase())) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry username taken');
        }

        const regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        if (!regExp.test(req.body.userDetails.password)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'did not meet password criteria');
        }

        //firebase create user
        await getAuth()
            .createUser({
                email: req.body.userDetails.email,
                emailVerified: false,
                phoneNumber: "+" + req.body.userDetails.phone,
                password: req.body.userDetails.password,
                displayName: req.body.userDetails.username,
                photoURL: req.body.photoURL,
                disabled: false,
            })
            .then(async (userRecord) => {
                firebaseuid = userRecord.uid
                
            })
            .catch((error) => {
                console.log(error)
                throw new ApiError(httpStatus.BAD_REQUEST, error.message);
            })

            if(firebaseuid === "") throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');

            const user = new User({
                firebaseuid:firebaseuid,
                photoURL: req.body.photoURL,
                firstname: req.body.userDetails.firstname,
                lastname: req.body.userDetails.lastname,
                username: req.body.userDetails.username,
                email: req.body.userDetails.email,
                phone: "+" + req.body.userDetails.phone,
                password: req.body.userDetails.password,
                role: req.body.userDetails.role,
                jobtitle: req.body.userDetails.jobtitle,
                permission: req.body.permission
            });  

            
            await user.save();
            return user;

    } catch (error) {
        console.log(error)
        throw error;
        

    }
}

export const checkEmailExist = async (body) => {

    try {
        if (await User.emailTaken(body.email)) {
            return { message: 'Sorry email taken' }
        }
    } catch (error) {
        throw error
    }

}

export const getUserByEmail = async (body) => {
    try {
        const user = await User.find({ email: body.email })
        if (user.length === 0) throw new ApiError(httpStatus.BAD_REQUEST, 'User does not exist');

        return user


    } catch (error) {
        throw error
    }
}

export const checkUsernameExist = async (body) => {

    try {
        if (await User.usernameTaken(body.username.toLowerCase().trim())) {
            return { message: 'Sorry username taken' }
        }

    } catch (error) {
        throw error
    }
}

//might not be needed.
export const checkPhoneExist = async (body) => {
    try {
        if (await User.checkPhoneExist(body.phone.trim())) {
            return { message: 'Sorry Phone number have been registered to another account' }
        }
    } catch (error) {
        throw error
    }
}


export const updateUserFirstName = async (req) => {

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    //user details
    const userEmail = req.body.userEmail
    const userUpdatedFirstName = req.body.userNewFirstName

    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password. No changes were made.');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updateUser = User.findOneAndUpdate({ email: userEmail }, { firstname: userUpdatedFirstName }, { new: true });
    return updateUser;

}

export const updateUserLastName = async (req) => {

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    //user details
    const userEmail = req.body.userEmail
    const userUpdatedLastName = req.body.userNewLastName

    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password. No changes were made.');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updateUser = User.findOneAndUpdate({ email: userEmail }, { lastname: userUpdatedLastName }, { new: true });
    return updateUser;

}

export const updateUserUserName = async (req) => {

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    //user details
    const userEmail = req.body.userEmail
    const userUpdatedUsername = req.body.userNewUsername

    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password. No changes were made.');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updateUser = User.findOneAndUpdate({ email: userEmail }, { username: userUpdatedUsername }, { new: true });
    return updateUser;

}

export const updateUserPhone = async (req) => {

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    //user details
    const userEmail = req.body.userEmail
    const userUpdatedPhone = req.body.userNewPhone

    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password. No changes were made.');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updatedUser = User.findOneAndUpdate({ email: userEmail }, { phone: userUpdatedPhone }, { new: true });
    return updatedUser;

}


export const updateUserEmail = async (req) => {

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }


    //update in user collection
    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    //user details
    const userEmail = req.body.userEmail
    const userUpdatedEmail = req.body.userNewEmail

    //check if admin email and password is correct
    const adminCredentials = await userService.findUserByEmail(adminEmail);
    if (!(await adminCredentials.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password. No changes were made.');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    //need to update in User(email),Project(assignee),Defects(Reporter)
    const updatedUser = User.findOneAndUpdate({ email: userEmail }, { email: userUpdatedEmail }, { new: true })
    const updatedUserProject = Project.updateMany({ "assignee": userEmail }, { $set: { "assignee.$": userUpdatedEmail } })
    const updatedUserDefect = Defect.updateMany({ "reporter": userEmail }, { $set: { reporter: userUpdatedEmail } })


    //firebase update email
    getAuth().getUserByEmail(userEmail)
        .then((userRecord) => {
            let uid = userRecord.uid

            getAuth().updateUser(
                uid, {
                email: userUpdatedEmail
            }
            ).then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                console.log('Successfully updated user email, ', userRecord.email);
            })
                .catch((error) => {
                    console.log('Error updating user:', error);
                    throw new ApiError(httpStatus.BAD_REQUEST, error);
                });
        })
        .catch((error) => {
            throw new ApiError(httpStatus.BAD_REQUEST, error);
        })

    // join the json and return as response
    const result = new Array();
    result.push(await updatedUser)
    result.push(await updatedUserProject)
    result.push(await updatedUserDefect)

    return result;

}

export const updateUserJobTitle = async (req) => {

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }


    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    const userEmail = req.body.userEmail
    const userUpdatedJobTitle = req.body.userNewJobTitle

    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password. No changes were made.');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updatedUser = User.findOneAndUpdate({ email: userEmail }, { jobtitle: userUpdatedJobTitle }, { new: true });
    return updatedUser;

}
//reset user password
export const resetUserPassword = async (req) => {

    //check account permission
    if (!req.user.permission[0].resetUserPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }


    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    const userEmail = req.body.userEmail
    const userNewPassword = req.body.userNewPassword

    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password. No changes were made.');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    //new password validation, check if meet criteria
    const regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
    if (!regExp.test(userNewPassword)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Password did not meet criteria');
    }

    const encrytedPassword = async (userNewPassword) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(userNewPassword, salt);
        const encrytedPassword = hash;
        return encrytedPassword;
    }

    //When user password is reset, set passwordresetted,firstlogin to true and set verified to false to enforce user to change password again when login.
    const updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        {
            "$set": {
                password: await encrytedPassword(userNewPassword),
                passwordresetted: true
            }
        },
        { new: true }
    )

    return updatedUser;

}

//update role 
export const updateUserRole = async (req) => {
    // only owner allowed to change account role
    if (req.user.role !== 'owner') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    const userEmail = req.body.userEmail
    const userNewRole = req.body.userNewRole

    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password. No changes were made.');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');


    if (userNewRole === 'admin' || userNewRole === 'owner') {
        const updatedUser = User.findOneAndUpdate({ email: userEmail }, { role: userNewRole }, { new: true });
        return updatedUser;
    }//changing role to user will remove all admin permission 
    else if (userNewRole === 'user') {
        const removedAllAdminPermission = [{
            addDefect: user.permission[0].addDefect,
            editOwnDefect: user.permission[0].editOwnDefect,
            editAllDefect: user.permission[0].editAllDefect,
            addComment: user.permission[0].addComment,
            editOwnComment: user.permission[0].editOwnComment,
            deleteOwnComment: user.permission[0].deleteOwnComment,
            viewAllDefects: false,
            deleteAllDefect: false,
            editAllComment: false,
            deleteAllComment: false,
            addUser: false,
            disableUser: false,
            deleteUser: false,
            changeUserDetails: false,
            resetUserPassword: false,
            addProject: false,
            assignProject: false,
            deleteProject: false,
            addComponent: false,
            deleteComponent: false,
        }]

        const updatedUser = User.findOneAndUpdate({ email: userEmail }, {
            "$set": {
                role: userNewRole,
                permission: removedAllAdminPermission
            }
        }, { new: true });
        return updatedUser;
    }

    else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
    }

}

//TODO
// disable user account
// delete user account
// update user permission

export const updateUserPermission = async (req) => {


    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    const userEmail = req.body.userEmail
    let userNewPermission

    // only owner and admin allowed to change permission
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    //Only owner account can give all type of permission 
    if (req.user.role === 'owner') {
        userNewPermission = req.body.userNewPermission
    } else if (req.user.role === 'admin') {
        userNewPermission = [{
            addDefect: req.body.userNewPermission.addDefect,
            editOwnDefect: req.body.userNewPermission.editOwnDefect,
            editAllDefect: req.body.userNewPermission.editAllDefect,
            addComment: req.body.userNewPermission.addComment,
            editOwnComment: req.body.userNewPermission.editOwnComment,
            deleteOwnComment: req.body.userNewPermission.deleteOwnComment
        }]
    }

    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password. No changes were made.');
    }

    const updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        {
            "$set": {
                permission: userNewPermission
            }
        },
        { new: true }
    )

    return updatedUser;

}

// Assign user to project

export const getAllUsersEmail = async (req) => {

    // only system owner allowed to perform this action
    if (req.user.role !== 'owner' && req.user.role !== 'admin') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    try {
        const users = User.find({}, { "email": 1, "_id": 0 })
        if (!users) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Unable to fetch users')
        }
        return users;
    } catch (error) {
        throw error
    }
}


//might remove
export const getAllUsers = async (req) => {

    // only system owner allowed to perform this action
    if (req.user.role !== 'owner') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    try {
        const users = User.find({}).select('-password')
        if (!users) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Unable to fetch users')
        }
        return users;
    } catch (error) {
        throw error
    }
}

