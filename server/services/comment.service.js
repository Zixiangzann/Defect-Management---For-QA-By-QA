import Comment from "../models/comment.js";
import httpStatus from "http-status";
import { ApiError } from "../middleware/apiError.js";
import Project from "../models/project.js";
import Defect from '../models/defect.js';
import User from '../models/user.js'

export const addComment = async (defectid, body, user) => {
    try {
        //If it is a "user" account, account must be assigned to the project to comment on the defect.
        const defectProject = (await Defect.find({ defectid: defectid }).select('project -_id').exec())[0].project;
        if (user.role !== 'admin' && !user.project.includes(defectProject)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to add comment');
        }

        const comment = new Comment({
            defectidComment: defectid,
            user: user.email,
            comment: body.comment
        })

        await comment.save();
        return comment;
    } catch (error) {
        throw (error)

    }
}

export const deleteComment = async (defectid, body, user) => {
    //Only admin or the 1 who commented can delete comment.
    try {

    } catch (error) {

    }


}

export const paginateComment = async (defectid,body, user) => {

    const sortby = body.sortby || "date";
    const order = body.order || "desc";
    const limit = body.limit || 15;
    const skip = body.skip || 0;

    try {
        // //If it is a "user" account, account must be assigned to the project view the comment.
        const defectProject = (await Defect.find({ defectid: defectid }).select('project -_id').exec())[0].project;
        if (user.role !== 'admin' && !user.project.includes(defectProject)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view comment');
        }

        const options = {
            page: body.page,
            limit,
            sortby
        }

        let aggQuery = Comment.aggregate([{$match:{defectidComment:parseInt(defectid)}}])
        const comments = Comment.aggregatePaginate(aggQuery, options)
        // const comments = Comment.find({defectidComment:defectid})
        return comments;
    } catch (error) {
        throw error;
    }

}