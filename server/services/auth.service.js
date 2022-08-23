import User from "../models/user.js"
import { userService } from "./index.js";
import { ApiError } from "../middleware/apiError.js";
import httpStatus from "http-status";
import bcrypt from 'bcrypt'

export const genAuthToken = (user) => {
    const token = user.generateAuthToken();
    return token;
}

export const signInWithEmailAndPassword = async (email, password) => {
    try {
        const user = await userService.findUserByEmail(email);
        //for testing purpose. TO BE REMOVE
        if (!(await user.comparePassword(password))) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Sorry BAD password');
        }

        return user;
    } catch (error) {
        throw error
    }

}

export const firstLoginValidation = async (req) => {
    try {

        const newPassword = req.body.newPassword
        const oldPassword = req.body.oldPassword

        const user = await userService.findUserByEmail(req.body.email);
        if (!(await user.comparePassword(req.body.oldPassword))) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Wrong old password, please check with admin');
        }

        const regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        if(!regExp.test(newPassword)){
            throw new ApiError(httpStatus.BAD_REQUEST,'Password did not meet criteria');
        }

        if (newPassword === oldPassword) throw new ApiError(httpStatus.NOT_FOUND, 'New password cannot be same as old password');


        const encrytedPassword = async(newPassword) => {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);
            const encrytedPassword = hash;
            return encrytedPassword;
        }

        //success validation
        const updatedUser = await User.findOneAndUpdate(
            { email: req.user.email },
            {
                "$set": {
                    password: await encrytedPassword(newPassword),
                    verified: true,
                    firstlogin: false
                }
            },
            { new: true }
        )

        return updatedUser;

    } catch (error) {
        throw error
    }
}


