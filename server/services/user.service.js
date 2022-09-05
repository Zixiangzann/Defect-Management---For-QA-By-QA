import User from "../models/user.js"
import { ApiError } from "../middleware/apiError.js";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import 'dotenv/config';

export const findUserByEmail = async (email) => {
    try {
        
        const user = await User.findOne({email});

        if(!user){
            throw new ApiError(httpStatus.BAD_REQUEST,'User not found');
        }

        return user;
        
    } catch (error) {
        throw error
    }
    
}

export const findUserById = async (_id) => {
    try {
        const user = User.findById(_id);

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        }

        return user;

    } catch (error) {
        throw error
    }
}

export const updateUserProfile = async (req) => {
    try {
        const user = await User.findOneAndUpdate(
            {_id:req.user._id},
            {
                "$set": {
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                }
            },
            { new: true }
        )

        if (!user) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        }

        return user;
    } catch (error) {
        throw error
    }
}

export const updateUserEmail = async(req) => {
    try {

        if(req.body.newemail === req.user.email){
            throw new ApiError(httpStatus.NOT_FOUND,'Email is the same as current')
        }

        if(await User.emailTaken(req.body.newemail)){
            throw new ApiError(httpStatus.NOT_FOUND,'Sorry email taken')
        }

        const user = await User.findOneAndUpdate(
            {_id:req.user._id, email: req.user.email},
            {
                "$set": {
                    email: req.body.newemail,
                    verified: false
                }
            },
            { new: true }
        )

        if(!user){
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        }

        return user;
    } catch (error) {
        throw error;
    } 
}


export const validateToken = (token) => {
    return jwt.verify(token,process.env.DB_SECRET);
}