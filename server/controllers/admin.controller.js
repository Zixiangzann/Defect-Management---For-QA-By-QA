import httpStatus from 'http-status';
import { ApiError } from '../middleware/apiError.js';
import { adminService } from '../services/index.js';
import { emailService } from '../services/index.js';
import User from '../models/user.js';
import { checkPhoneExist } from '../services/admin.service.js';

const adminController = {
    async getAllUsers(req, res, next) {
        try {
            const allUsers = await adminService.getAllUsers(req);
            res.json(allUsers);
        } catch (error) {
            next(error);
        }
    },
    async getAllUsersEmail(req, res, next) {
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

            //send a email that account is created
            const mailInfo = {
                name: `${createdAccount.firstname} ${createdAccount.lastname}`,
                intro: "Welcome to Defect Management(ForQAByQA)! \n A admin have created a account for you.",
                instructions: "Please get your account credentials from your admin and login to change your password to proceed",
                showButton: true,
                buttonText: "Account validation",
                link: "auth",
                outro: "Please contact your admin if you have any questions.",
                subject: "Welcome to Defect Management(ForQAByQA)",
                toEmail: createdAccount.email
            }

            await emailService.mail(mailInfo);
            // await emailService.registerEmail(req.body.userDetails.email, createdAccount);

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

    //might not be needed
    async checkPhoneExist(req, res, next) {
        //if phone already exist
        try {
            const phonecheck = await adminService.checkPhoneExist(req.body)
            res.status(httpStatus.OK).json(phonecheck)
        } catch (error) {
            next(error)
        }
    },

    async updateUserPhotoURL(req, res, next) {
        try {
            const updatedUser = await adminService.updateProfilePicture(req)

            //send a mail to inform user account updated
            const mailInfo = {
                name: `${updatedUser[0].firstname} ${updatedUser[0].lastname}`,
                intro: "A admin have updated your account's profile picture.",
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: "(ForQAByQA) Your account's profile picture have been updated",
                toEmail: updatedUser[0].email
            }

            await emailService.mail(mailInfo);

            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserFirstName(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserFirstName(req)

            //send a mail to inform user account updated
            const mailInfo = {
                name: `${updatedUser.firstname} ${updatedUser.lastname}`,
                intro: "A admin have updated your account's first name.",
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: "(ForQAByQA) Your account's first name have been updated",
                toEmail: updatedUser.email
            }

            await emailService.mail(mailInfo);

            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserLastName(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserLastName(req)

            //send a mail to inform user account updated
            const mailInfo = {
                name: `${updatedUser.firstname} ${updatedUser.lastname}`,
                intro: "A admin have updated your account's last name.",
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: "(ForQAByQA) Your account's last name have been updated",
                toEmail: updatedUser.email
            }

            await emailService.mail(mailInfo);

            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserUserName(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserUserName(req)

            //send a mail to inform user account updated
            const mailInfo = {
                name: `${updatedUser[0].firstname} ${updatedUser[0].lastname}`,
                intro: "A admin have updated your account's username.",
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: "(ForQAByQA) Your account's username have been updated",
                toEmail: updatedUser[0].email
            }

            await emailService.mail(mailInfo);

            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserPhone(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserPhone(req)

             //send a mail to inform user account updated
            const mailInfo = {
                name: `${updatedUser[0].firstname} ${updatedUser[0].lastname}`,
                intro: "A admin have updated your account's phone number.",
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: "(ForQAByQA) Your account's phone number have been updated",
                toEmail: updatedUser[0].email
            }

            await emailService.mail(mailInfo);

            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserEmail(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserEmail(req)

            //send a mail to inform user account updated
            const mailInfo = {
                name: `${updatedUser[0].firstname} ${updatedUser[0].lastname}`,
                intro: "A admin have updated your account's email.",
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: "(ForQAByQA) Your account's email have been updated",
                toEmail: req.body.userNewEmail
            }

            await emailService.mail(mailInfo);

            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserJobTitle(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserJobTitle(req)

            //send a mail to inform user account updated
            const mailInfo = {
                name: `${updatedUser.firstname} ${updatedUser.lastname}`,
                intro: "A admin have updated your account's Job Title.",
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: "(ForQAByQA) Your account's Job Title have been updated",
                toEmail: updatedUser.email
            }

            await emailService.mail(mailInfo);

            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async resetUserPassword(req, res, next) {
        try {
            const updatedUser = await adminService.resetUserPassword(req)
            
            //send a mail to inform user account password resetted
            const mailInfo = {
                name: `${updatedUser[0].firstname} ${updatedUser[0].lastname}`,
                intro: "A admin have resetted your account password",
                instructions: "Please get your account credentials from your admin and login to change your password to proceed",
                showButton: true,
                buttonText: "Account validation",
                link: "auth",
                outro: "Please contact your admin if you have any questions.",
                subject: "(ForQAByQA) Your account's password have been resetted",
                toEmail: updatedUser[0].email 
            }

            await emailService.mail(mailInfo);

            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserRole(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserRole(req)
            
            //send a mail to inform user account role updated
            const mailInfo = {
                name: `${updatedUser.firstname} ${updatedUser.lastname}`,
                intro: "A admin have updated your account's role.",
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: "(ForQAByQA) Your account's role have been updated",
                toEmail: updatedUser.email
            }

            await emailService.mail(mailInfo);

            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    },

    async updateUserPermission(req, res, next) {
        try {
            const updatedUser = await adminService.updateUserPermission(req)
            
            //send a mail to inform user account role updated
            const mailInfo = {
                name: `${updatedUser.firstname} ${updatedUser.lastname}`,
                intro: "A admin have updated your account's permission.",
                showButton: false,
                outro: "Please contact your admin if you have any questions.",
                subject: "(ForQAByQA) Your account's permission have been updated",
                toEmail: updatedUser.email
            }

            await emailService.mail(mailInfo);

            res.status(httpStatus.OK).json(updatedUser)
        } catch (error) {
            next(error)
        }
    }

}




export default adminController;