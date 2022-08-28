import User from "../models/user.js"
import { ApiError } from "../middleware/apiError.js";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { userService } from "./index.js";
import Project from "../models/project.js";
import bcrypt from 'bcrypt'

export const addUser = async (req) => {
    try {

        //check account permission
        if (!req.user.permission[0].addUser) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
        }

        // only owner allowed to add admin account
        if (req.user.role !== 'owner') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'No permission to perform action');
        }


        //if email already exist
        if (await User.emailTaken(req.body.email.toLowerCase())) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry email taken');
        }

        //if username already exist
        if (await User.usernameTaken(req.body.username.toLowerCase())) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry username taken');
        }

        const regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        if (!regExp.test(req.body.password)) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'did not meet password criteria');
        }

        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role,
            jobtitle: req.body.jobtitle
        });

        await user.save();
        return user;

    } catch (error) {
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
        if (await User.usernameTaken(body.username.toLowerCase())) {
            return { message: 'Sorry username taken' }
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
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password, changes will not be made');
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
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password, changes will not be made');
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
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password, changes will not be made');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updateUser = User.findOneAndUpdate({ email: userEmail }, { username: userUpdatedUsername }, { new: true });
    return updateUser;

}

//TODO
//update email, need update in user and project collection
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
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password, changes will not be made');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail })
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updatedUser = User.findOneAndUpdate({ email: userEmail }, { email: userUpdatedEmail }, { new: true })
    const updatedUserProject = Project.updateMany({ "assignee": userEmail }, { $set: { "assignee.$": userUpdatedEmail } })

    // join both json and return as response
    const result = new Array();
    result.push(await updatedUser)
    result.push(await updatedUserProject)

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
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password, changes will not be made');
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
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password, changes will not be made');
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
export const changeUserRole = async (req) => {

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
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password, changes will not be made');
    }

    //check if user email is found
    const user = await User.findOne({ email: userEmail });
    if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');


    if (userNewRole === 'admin' || userNewRole === 'user') {
        const updatedUser = User.findOneAndUpdate({ email: userEmail }, { role: userNewRole }, { new: true });
        return updatedUser;
    } else {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid role');
    }

}



// disable user account
// delete user account



//might remove
export const getAllUsers = async () => {

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

