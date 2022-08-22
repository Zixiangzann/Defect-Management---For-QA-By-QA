import {authService,userService,emailService} from '../services/index.js'
import httpStatus from "http-status";

const authController = {
    async signin(req,res,next){
        try {
            const {email,password} = req.body;
            const user = await authService.signInWithEmailAndPassword(email,password);
            const token = await authService.genAuthToken(user)

            res.cookie('x-access-token',token)
            .json({ 
                  user:{
                    _id:user._id,
                    email: user.email,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    project:user.project,
                    age:user.age,
                    role:user.role,
                    jobtitle:user.jobtitle,
                    verified:user.verified,
                    firstlogin:user.firstlogin
                }
                ,token:token })
        } catch (error) {
            next(error)
        }
    },
    async isauth(req,res,next){
        res.json(req.user)        
    }
}

export default authController;