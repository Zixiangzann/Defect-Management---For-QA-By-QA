import httpStatus from 'http-status';
import { ApiError } from '../middleware/apiError.js';
import { adminService } from '../services/index.js';
import { emailService } from '../services/index.js';

const adminController = {
    async getAllUsers(req, res, next){
        try {
            const allUsers =  await adminService.getAllUsers(req,req.user);
            res.json(allUsers);
        } catch (error) {
            next(error);
        }
    },
    async changeRole(req,res,next){
        try {
            const userId = req.query.userId; 
            const changeRole = await adminService.changeRole(userId,req);
            res.status(httpStatus.OK).json({
                id: changeRole.id,
                email: changeRole.email,
                role: changeRole.role,
                action: "Change role"
                });
        } catch (error) {
            next(error)
        }
    },
    //User manangement. Add team members/users.
    async addUser(req,res,next){
        try {
            const {
                email,
                password,
                role} = req.body;
            const user = await adminService.addUser(email,password,role);

            // send verification email
            //TODO, member will receive a email when the admin created the account.
            //Upon clicking on the email, the member will be ask to create profile and force change of password.
            await emailService.registerEmail(email,user);

            res
            .status(httpStatus.CREATED).send({
                email,
                password,
                role
            })

        } catch (error) {
            next(error)
        }
    }
}



export default adminController;