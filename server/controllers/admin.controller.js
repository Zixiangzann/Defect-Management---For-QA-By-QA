import httpStatus from 'http-status';
import { ApiError } from '../middleware/apiError.js';
import { adminService } from '../services/index.js';
import { emailService } from '../services/index.js';
import User from '../models/user.js';

const adminController = {
    async getAllUsers(req, res, next) {
        try {
            const allUsers = await adminService.getAllUsers(req);
            res.json(allUsers);
        } catch (error) {
            next(error);
        }
    },
    async getAllUsersEmail(req,res,next){
        try {
            const allUsersEmail = await adminService.getAllUsersEmail(req);
            res.json(allUsersEmail);
        } catch (error) {
            next(error);
        }
    },
    async changeRole(req, res, next) {
        try {
            const userId = req.query.userId;
            const changeRole = await adminService.changeRole(userId, req);
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
    async addUser(req, res, next) {
        try {
            const createdAccount = await adminService.addUser(req);

            await emailService.registerEmail(req.body.userDetails.email, createdAccount);

            res.status(httpStatus.CREATED).json(createdAccount)
        } catch (error) {
            next(error)
        }
    },

    async checkEmailExist(req, res, next) {
        //if email already exist
        try {
            const emailcheck = await adminService.checkEmailExist(req.body)
            res.status(httpStatus.OK).json(emailcheck)
        } catch (error) {
            next(error)
        }

    },

    async getUserByEmail(req, res, next) {
        try {
            const user = await adminService.getUserByEmail(req.body)
            res.status(httpStatus.OK).json(user)
        } catch (error) {
            next(error)
        }
    },

    async checkUsernameExist(req, res, next) {
        //if username already exist
        try {
            const usernamecheck = await adminService.checkUsernameExist(req.body)
            res.status(httpStatus.OK).json(usernamecheck)
        } catch (error) {
            next(error)
        }

    },

    async updateUserFirstName(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserFirstName(req)
            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserLastName(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserLastName(req)
            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserUserName(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserUserName(req)
            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserEmail(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserEmail(req)
            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserJobTitle(req,res,next){
        try {
            const updatedUser = await adminService.updateUserJobTitle(req)
            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async resetUserPassword(req,res,next){
        try {
            const updatedUser = await adminService.resetUserPassword(req)
            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserRole(req,res,next){
        try {
            const updatedUser = await adminService.updateUserRole(req)
            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserPermission(req,res,next){
        try {
            const updatedUser = await adminService.updateUserPermission(req)
            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    }

}




export default adminController;