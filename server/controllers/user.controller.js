import { authService, userService,emailService } from '../services/index.js'
import httpStatus from 'http-status';
import { ApiError } from '../middleware/apiError.js';

const userController = {
    async profile(req, res, next) {
        try {
            const user = await userService.findUserById(req.user._id);
            res.json(res.locals.permission.filter(user._doc))
        } catch (error) {
            next(error)
        }
    },
    async updateProfile(req, res, next) {
        try {
            const user = await userService.updateUserProfile(req)
            res.json(res.locals.permission.filter(user._doc))
        } catch (error) {
            next(error)
        }
    },
    async updateUserEmail(req, res, next) {
        try {
            const user = await userService.updateUserEmail(req);
            const token = await authService.genAuthToken(user);
            //////
            await emailService.registerEmail(user.email,user);

            res.cookie('x-access-token', token)
                .send({
                    user: res.locals.permission.filter(user._doc),
                    token
                })
        } catch (error) {
            next(error)
        }

    }, 
    async verifyAccount(req,res,next){
        try{
            const token = userService.validateToken(req.query.validation);
            const user = await userService.findUserById(token.sub);

            if(!user) throw new ApiError(httpStatus.NOT_FOUND,'User not found');
            if(user.verified) throw new ApiError(httpStatus.NOT_FOUND,'Already verified');

            user.verified = true;
            user.save();
            res.status(httpStatus.CREATED).send({
                email: user.email,
                verified:user.verified
            })
        } catch(error){
            next(error)
        }
    }
}

export default userController;