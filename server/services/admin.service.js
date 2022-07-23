import User from "../models/user.js"
import { ApiError } from "../middleware/apiError.js";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const addUser = async(email,password,role) => {
    try{

        //if email already exist
        if(await User.emailTaken(email)){
            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry email taken');
        }

        const user = new User({
            email,
            password,
            role
        });

        await user.save();
        return user;

    } catch(error){
        throw error;

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