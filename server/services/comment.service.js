import Comment from "../models/comment.js";
import httpStatus from "http-status";
import { ApiError } from "../middleware/apiError.js";
import Project from "../models/project.js";
import Defect from '../models/defect.js';
import User from '../models/user.js'

export const addComment = async (defectid, body, user) => {
    try {
        //must have addComment permission and must be assigned to the project to comment on defect, unless it is a admin or owner account
        const defectProject = (await Defect.find({ defectid: defectid }).select('project -_id').exec())[0].project;
        if ((!user.project.includes(defectProject) && !user.permission[0].addComment) && (user.role !== 'admin' || user.role !== 'owner')) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to add comment');
        }

        const comment = new Comment({
            defectidComment: defectid,
            user: {
                email: user.email,
                username: user.username,
                photoURL: user.photoURL
            },
            comment: body.comment
        })

        await comment.save();
        return comment;
    } catch (error) {
        throw (error)

    }
}

export const deleteComment = async (defectid, body, user) => {
    //must have permission deleteOwnComment to delete own comment and deleteAllComment to delete all comment
    try {

    } catch (error) {

    }


}

export const paginateComment = async (defectid,body, user) => {

    const sortby = body.sortby || "date";
    const order = body.order || -1;
    const limit = body.limit || 15;
    const skip = body.skip || 0;

    try {
        // //If it is a "user" account, account must be assigned to the project view the comment.
        const defectProject = (await Defect.find({ defectid: defectid }).select('project -_id').exec())[0].project;
        if ((user.role !== 'admin' || user.role !== 'owner') && !user.project.includes(defectProject)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view comment');
        }

        const options = {
            page: body.page,
            limit,
            sortby,
            order
        }

        let aggQuery = Comment.aggregate(
            [{$match:{defectidComment:parseInt(defectid)}},
                { $sort: { [sortby]: order } }
                ]
                , { collation: { locale: "en", caseLevel: true } }
            )

        const comments = Comment.aggregatePaginate(aggQuery, options)
        return comments;
    } catch (error) {
        throw error;
    }

}