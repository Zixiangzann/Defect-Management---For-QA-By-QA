import User from "../models/user.js"
import { ApiError } from "../middleware/apiError.js";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { userService } from "./index.js";

export const addUser = async(body) => {
    try{

        //if email already exist
        if(await User.emailTaken(body.email.toLowerCase())){
            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry email taken');
        }

        //if username already exist
        if(await User.usernameTaken(body.username.toLowerCase())){
            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry username taken');
        }

        const regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        if(!regExp.test(body.password)){
            throw new ApiError(httpStatus.BAD_REQUEST,'did not meet password criteria');
        }

        const user = new User({
            firstname:body.firstname,
            lastname:body.lastname,
            username:body.username,
            email:body.email,
            password:body.password,
            role:body.role,
            jobtitle:body.jobtitle
        });

        await user.save();
        return user;

    } catch(error){
        throw error;

    }
}

export const checkEmailExist = async(body)=>{

    try {
        if (await User.emailTaken(body.email)) {
            return {message:'Sorry email taken'}
        }
    } catch (error) {
        throw error
    }
        
}

export const getUserByEmail = async(body)=>{
    try {
        const user = await User.find({email:body.email})
        if(user.length === 0) throw new ApiError(httpStatus.BAD_REQUEST,'User does not exist');

        return user
        

    } catch (error) {
        throw error
    }
}

export const checkUsernameExist = async(body)=>{

    try {
        if (await User.usernameTaken(body.username.toLowerCase())) {
            return {message:'Sorry username taken'}
        }
    
    } catch (error) {
        throw error
    }
}

export const updateUserFirstName = async(req)=>{
    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    //user details
    const userEmail = req.body.userEmail
    const userFirstName = req.body.userNewFirstName
    
    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password, changes will not be made');
    }

    //check if user email is found
    const user = await User.findOne({email:userEmail})
    if(!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updateUser = User.findOneAndUpdate({email:userEmail},{firstname:userFirstName},{new:true});
    return updateUser;

}

export const updateUserLastName = async(req)=>{
    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    //user details
    const userEmail = req.body.userEmail
    const userLastName = req.body.userNewLastName
    
    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password, changes will not be made');
    }

    //check if user email is found
    const user = await User.findOne({email:userEmail})
    if(!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updateUser = User.findOneAndUpdate({email:userEmail},{lastname:userLastName},{new:true});
    return updateUser;

}

export const updateUserUserName = async(req)=>{
    const adminEmail = req.user.email
    const adminPassword = req.body.adminPassword
    //user details
    const userEmail = req.body.userEmail
    const userUserName = req.body.userNewUserName
    
    //check if admin email and password is correct
    const admin = await userService.findUserByEmail(adminEmail);
    if (!(await admin.comparePassword(adminPassword))) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong admin password, changes will not be made');
    }

    //check if user email is found
    const user = await User.findOne({email:userEmail})
    if(!user) throw new ApiError(httpStatus.BAD_REQUEST, 'User details not found');

    const updateUser = User.findOneAndUpdate({email:userEmail},{username:userUserName},{new:true});
    return updateUser;

}

//TODO
//update email, need to also update in Project assignee
//update job title
//reset user password
//update role 
//Delete user






//might remove
export const getAllUsers = async()=>{
    try{
        const users = User.find({}).select('-password')
        if(!users){
            throw new ApiError(httpStatus.NOT_FOUND,'Unable to fetch users')
        }
        return users;
    }catch(error){
        throw error
    }
}

export const changeRole = async(userId,req) =>{
    try {
        const userToBeChange = await User.findById(userId).exec();
        if(req.user.role !=='admin') throw new ApiError(httpStatus.METHOD_NOT_ALLOWED,'No permission to change role');
        if(!userToBeChange) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');

        const changeRole = await User.findOneAndUpdate(
            {_id:userId},
            {
                "$set": {
                    role: req.body.role
                }
            },
            { new: true }
        )
        return changeRole;
    } catch (error) {
        throw error
    }
}