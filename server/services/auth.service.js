import User from "../models/user.js"
import { userService } from "./index.js";
import { ApiError } from "../middleware/apiError.js";
import httpStatus from "http-status";

export const genAuthToken = (user) =>{
    const token = user.generateAuthToken();
    return token;
}

export const signInWithEmailAndPassword = async(email,password)=>{
    try {
        const user = await userService.findUserByEmail(email);
        //for testing purpose. TO BE REMOVE
        if(!(await user.comparePassword(password))){
            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry BAD password');
        }
        
        return user;
    } catch(error){
        throw error
    }

}

