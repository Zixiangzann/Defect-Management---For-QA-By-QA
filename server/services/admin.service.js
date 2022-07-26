import User from "../models/user.js"
import { ApiError } from "../middleware/apiError.js";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { userService } from "./index.js";
import Project from "../models/project.js";
import bcrypt from 'bcrypt'
import Defect from "../models/defect.js";
import Comment from "../models/comment.js";
import History from "../models/history.js";



import { getAuth } from 'firebase-admin/auth'
import admin from "../firebase.js"
import { 
    mailUserAdded, 
    mailUserEmailUpdated, 
    mailUserFirstNameUpdated, 
    mailUserJobTitleUpdated, 
    mailUserLastNameUpdated, 
    mailUserPasswordResetted, 
    mailUserPermissionUpdated, 
    mailUserPhoneUpdated, 
    mailUserPicUpdated, 
    mailUserRoleUpdated, 
    mailUserUserNameUpdated } from "../mailTemplate/templates.js";

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

        if (firebaseuid === "") throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');

        const user = new User({
            firebaseuid: firebaseuid,
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

        //send email
        try {
            mailUserAdded(req, user)
        } catch {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'User added, but system failed to send email notification');
        }

        return user;

    } catch (error) {
        console.log(error)
        throw error;


    }
}

export const checkEmailExist = async (body) => {

    try {
        if (await User.emailTaken(body.email)) {
            return { message: 'Sorry, Email taken' }
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
            return { message: 'Sorry, Username taken' }
        }

    } catch (error) {
        throw error
    }
}

export const checkPhoneExist = async (body) => {
    try {
        if (await User.phoneTaken(body.phone.trim())) {
            return { message: 'Sorry, Phone number has been registered with another account.' }
        }
    } catch (error) {
        throw error
    }
}

export const updateProfilePicture = async (req) => {

    const result = new Array();

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    //user details
    // const userId = req.body.userId
    const userEmail = req.body.userEmail
    const userUpdatedPhotoURL = req.body.userNewPhotoURL

    //validate if url is valid
    try {
        Boolean(new URL(userUpdatedPhotoURL))
    } catch (error) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'A valid URL is required.');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updateUser = await User.findOneAndUpdate({ email: userEmail }, { photoURL: userUpdatedPhotoURL }, { new: true });
    //update user in comment collection
    const updateUserInComment = await Comment.updateMany({ "user.email": userEmail }, { "user.$.photoURL": userUpdatedPhotoURL }, { new: true });
    result.push(updateUser)
    //update user in history collection
    const updateUserInHistory = await History.updateMany({ "user.email": userEmail }, { "user.$.photoURL": userUpdatedPhotoURL }, { new: true });
     //update assigneeDetails in defect collection
     const updateAssigneeDetailsInDefect = await Defect.updateMany({"assigneeDetails.email": userEmail},{"assigneeDetails.$.photoURL": userUpdatedPhotoURL},{new: true});
     //update reporter in defect collection
     const updatedReporterInDefect = await Defect.updateMany({"reporter.email": userEmail},{"reporter.photoURL": userUpdatedPhotoURL},{new: true});

    //firebase
    const uid = user.firebaseuid

    await getAuth().updateUser(
        uid,
        {
            photoURL: userUpdatedPhotoURL
        }
    ).then((userRecord) => {
        result.push({ 'firebase photoURL updated': userRecord.photoURL })
    }).catch((error) => {
        console.log('Error updating user:', error);
        throw new ApiError(httpStatus.BAD_REQUEST, error);
    });

    result.push(updateUserInComment)
    result.push(updateUserInHistory)
    result.push(updateAssigneeDetailsInDefect)
    result.push(updatedReporterInDefect)


    //send email
    try {
        mailUserPicUpdated(req, result)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Profile picture updated, but system failed to send email notification');
    }

    return result;

}


export const updateUserFirstName = async (req) => {

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    //user details
    const userEmail = req.body.userEmail
    const userUpdatedFirstName = req.body.userNewFirstName

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updateUser = await User.findOneAndUpdate({ email: userEmail }, { firstname: userUpdatedFirstName }, { new: true });

    //send email
    try {
        mailUserFirstNameUpdated(req, updateUser)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'First name updated, but system failed to send email notification');
    }


    return updateUser;

}

export const updateUserLastName = async (req) => {

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    //user details
    const userEmail = req.body.userEmail
    const userUpdatedLastName = req.body.userNewLastName

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updateUser = await User.findOneAndUpdate({ email: userEmail }, { lastname: userUpdatedLastName }, { new: true });

    //send email
    try {
        mailUserLastNameUpdated(req, updateUser)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Last name updated, but system failed to send email notification');
    }


    return updateUser;

}

export const updateUserUserName = async (req) => {

    const result = new Array();

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    //user details
    const userEmail = req.body.userEmail
    const userUpdatedUsername = req.body.userNewUsername

    if (await User.usernameTaken(userUpdatedUsername)) throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry, Username taken');

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    //update in user collection
    const updateUser = await User.findOneAndUpdate({ email: userEmail }, { username: userUpdatedUsername }, { new: true });
    //update in user comment collection
    const updateUserInComment = await Comment.updateMany({ "user.email": userEmail }, { "user.$.username": userUpdatedUsername }, { new: true });
    // update user in history collection
    const updateUserInHistory = await History.updateMany({ "user.email": userEmail }, { "user.$.username": userUpdatedUsername }, { new: true });
    //update assigneeDetails in defect collection
    const updateAssigneeDetailsInDefect = await Defect.updateMany({"assigneeDetails.email": userEmail},{"assigneeDetails.$.username": userUpdatedUsername},{new: true});
    //update reporter in defect collection
    const updatedReporterInDefect = await Defect.updateMany({"reporter.email": userEmail},{"reporter.username": userUpdatedUsername},{new: true});

    result.push(updateUser)

    //firebase
    const uid = user.firebaseuid

    await getAuth().updateUser(
        uid,
        {
            displayName: userUpdatedUsername
        }
    ).then((userRecord) => {
        result.push({ 'firebase displayName updated': userRecord.displayName })
    }).catch((error) => {
        console.log('Error updating user:', error);
        throw new ApiError(httpStatus.BAD_REQUEST, error);
    });

    result.push(updateUserInComment)
    result.push(updateUserInHistory)
    result.push(updatedReporterInDefect)
    result.push(updateAssigneeDetailsInDefect)

    //send email
    try {
        mailUserUserNameUpdated(req, result)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Username updated, but system failed to send email notification');
    }

    return result;

}

export const updateUserPhone = async (req) => {

    const result = new Array();

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    //user details
    const userEmail = req.body.userEmail
    const userUpdatedPhone = req.body.userNewPhone

    //to check if user new phone is already taken.
    if (await User.phoneTaken(userUpdatedPhone)) throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry, Phone number has been registered with another account.');

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updatedUser = User.findOneAndUpdate({ email: userEmail }, { phone: "+" + userUpdatedPhone }, { new: true });

    result.push(await updatedUser)

    //firebase
    const uid = user.firebaseuid

    await getAuth().updateUser(
        uid,
        {
            phoneNumber: "+" + userUpdatedPhone
        }
    ).then((userRecord) => {
        result.push({ 'firebase phone updated': userRecord.phoneNumber })
    }).catch((error) => {
        console.log('Error updating user:', error);
        throw new ApiError(httpStatus.BAD_REQUEST, error);
    });

    //send email
    try {
        mailUserPhoneUpdated(req, result)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Phone number updated, but system failed to send email notification');
    }

    return result;

}


export const updateUserEmail = async (req) => {

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    //update in user collection
    //user details
    const userEmail = req.body.userEmail
    const userUpdatedEmail = req.body.userNewEmail

    //to check if user new email is already taken.
    if (await User.emailTaken(userUpdatedEmail)) throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry, Email taken')

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    //need to update in User(email),Project(assignee),Defects(Reporter,assigneeDetails),Comments(email),History(email)
    const updatedUser = await User.findOneAndUpdate({ email: userEmail }, { email: userUpdatedEmail }, { new: true })
    const updatedUserProject = await Project.updateMany({ "assignee": userEmail }, { $set: { "assignee.$": userUpdatedEmail } })
    const updateUserInComment = await Comment.updateMany({ "user.email": userEmail }, { "user.$.email": userUpdatedEmail }, { new: true });
    const updateUserInHistory = await History.updateMany({ "user.email": userEmail }, { "user.$.email": userUpdatedEmail }, { new: true });
    //update assigneeDetails in defect collection
    const updateAssigneeDetailsInDefect = await Defect.updateMany({"assigneeDetails.email": userEmail},{"assigneeDetails.$.email": userUpdatedEmail},{new: true});
    //update reporter in defect collection
    const updatedReporterInDefect = await Defect.updateMany({"reporter.email": userEmail},{"reporter.email": userUpdatedEmail},{new: true});
    //update assignee in defect collection, email only..
    const updateAssigneeEmailInDefect = await Defect.updateMany({"assignee": userEmail},{ $set: { "assignee.$": userUpdatedEmail }},{new:true})
    //update watching in defect collection
    const updateWatchingEmailDefect = await Defect.updateMany({"watching": userEmail},{ $set: { "watching.$": userUpdatedEmail }},{new:true})


    // join the json and return as response
    const result = new Array();
    result.push(updatedUser)
    result.push(updatedUserProject)
    result.push(updateAssigneeDetailsInDefect)
    result.push(updatedReporterInDefect)
    result.push(updateAssigneeEmailInDefect)
    result.push(updateWatchingEmailDefect)
    result.push(updateUserInComment)
    result.push(updateUserInHistory)

    //firebase
    const uid = user.firebaseuid

    await getAuth().updateUser(
        uid,
        {
            email: userUpdatedEmail
        }
    ).then((userRecord) => {
        result.push({ 'firebase email updated': userRecord.email })
    }).catch((error) => {
        console.log('Error updating user:', error);
        throw new ApiError(httpStatus.BAD_REQUEST, error);
    });

    //send email
    try {
        mailUserEmailUpdated(req, result)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Email updated, but system failed to send email notification');
    }

    return result;

}

export const updateUserJobTitle = async (req) => {

    //check account permission
    if (!req.user.permission[0].changeUserDetails) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    const userEmail = req.body.userEmail
    const userUpdatedJobTitle = req.body.userNewJobTitle

    //check if user email is found
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updatedUser = await User.findOneAndUpdate({ email: userEmail }, { jobtitle: userUpdatedJobTitle }, { new: true });
    
    try {
        mailUserJobTitleUpdated(req, updatedUser)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Job title updated, but system failed to send email notification');
    }
    
    return updatedUser;

}
//reset user password
export const resetUserPassword = async (req) => {

    const result = new Array();

    //check account permission
    if (!req.user.permission[0].resetUserPassword) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    const userEmail = req.body.userEmail
    const userNewPassword = req.body.userNewPassword

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

    result.push(await updatedUser)

    //firebase
    const uid = user.firebaseuid

    await getAuth().updateUser(
        uid,
        {
            password: userNewPassword
        }
    ).then((userRecord) => {
        result.push({ 'firebase password updated': "success" })
    }).catch((error) => {
        console.log('Error updating user:', error);
        throw new ApiError(httpStatus.BAD_REQUEST, error);
    });

    try {
        mailUserPasswordResetted(req, result)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Password has been reset, but system failed to send email notification');
    }

    return result;

}

//update role 
export const updateUserRole = async (req) => {
    // only owner allowed to change account role
    if (req.user.role !== 'owner') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
    }

    const userEmail = req.body.userEmail
    const userNewRole = req.body.userNewRole

    //check if user email is found
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');


    if (userNewRole === 'admin' || userNewRole === 'owner') {
        const updatedUser = await User.findOneAndUpdate({ email: userEmail }, { role: userNewRole }, { new: true });
        
        try {
            mailUserRoleUpdated(req, updatedUser)
        } catch {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Role updated, but system failed to send email notification');
        }

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

        const updatedUser = await User.findOneAndUpdate({ email: userEmail }, {
            "$set": {
                role: userNewRole,
                permission: removedAllAdminPermission
            }
        }, { new: true });

        try {
            mailUserRoleUpdated(req, updatedUser)
        } catch {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Role updated, but system failed to send email notification');
        }

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

    const userEmail = req.body.userEmail
    let userNewPermission

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

    const updatedUser = await User.findOneAndUpdate(
        { email: userEmail },
        {
            "$set": {
                permission: userNewPermission
            }
        },
        { new: true }
    )

    try {
        mailUserPermissionUpdated(req, updatedUser)
    } catch {
        throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'Permission updated, but system failed to send email notification');
    }

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
// export const getAllUsers = async (req) => {

//     // only system owner and admin allowed to perform this action
//     if (req.user.role !== 'owner' && req.user.role !== 'admin') {
//         throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
//     }

//     try {
//         const users = User.find({}).select('-password')
//         if (!users) {
//             throw new ApiError(httpStatus.NOT_FOUND, 'Unable to fetch users')
//         }
//         return users;
//     } catch (error) {
//         throw error
//     }
// }

