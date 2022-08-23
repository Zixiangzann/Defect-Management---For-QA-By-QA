import User from "../models/user.js"
import { ApiError } from "../middleware/apiError.js";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

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

export const checkUsernameExist = async(body)=>{

    try {
        if (await User.usernameTaken(body.username.toLowerCase())) {
            return {message:'Sorry username taken'}
        }
    
    } catch (error) {
        throw error
    }

}

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