import passport from "passport";
import { ApiError } from "./apiError.js";
import httpStatus from "http-status";
import roles from "../config/roles.js";

const verify = (req,res,resolve,reject,rights) => async(err,user) => {

    if(err || !user){
        return reject(new ApiError(httpStatus.UNAUTHORIZED,'Sorry, unauthorized'))
    }

    req.user={
        _id:user._id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
        jobtitle: user.jobtitle,
        project:user.project,
        role:user.role,
        verified:user.verified,
        firstlogin:user.firstlogin,
        passwordresetted: user.passwordresetted,
        permission: user.permission,
    }

    if(rights.length){
        const action = rights[0] 
        const resource = rights[1]
        const permission = roles.can(req.user.role)[action](resource);

        if(!permission.granted){
            return reject(new ApiError(httpStatus.FORBIDDEN,"Sorry, you don't have enough permission"))
        }

        res.locals.permission = permission;
    }

    return resolve()
}



export const auth = (...rights) => async(req,res,next)=>{
return new Promise((resolve,reject)=>{
    passport.authenticate('jwt',{session:false},verify(req,res,resolve,reject,rights))(req,res,next)
})
.then(()=> next())
.catch((err)=>next(err)) 
}