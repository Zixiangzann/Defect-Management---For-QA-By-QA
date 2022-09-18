import History from "../models/history.js";
import httpStatus from "http-status";
import { ApiError } from "../middleware/apiError.js";
import Defect from '../models/defect.js';

export const addHistory = async (defectid, body, user) => {
    try {
       
        const history = new History({
            defectid: defectid,
            user: {
                email: user.email,
                username: user.username,
                photoURL: user.photoURL
            },
            from: body.from,
            to: body.to,
            field: body.field,
            // date: body.date
        })

        console.log(history)
        await history.save();
        return history;
    } catch (error) {
        throw (error)

    }
}


export const paginateHistory = async (defectid, body, user) => {

    const sortby = body.sortby || "date";
    const order = body.order || -1;
    const limit = body.limit || 15;
    const skip = body.skip || 0;

    try {
        // //If it is a "user" account, account must be assigned to the project to view the history.
        const defectProject = (await Defect.find({ defectid: defectid }).select('project -_id').exec())[0].project;
        if ((user.role !== 'admin' || user.role !== 'owner') && !user.project.includes(defectProject)) {
            throw new ApiError(httpStatus.METHOD_NOT_ALLOWED, 'No permission to view defect history');
        }

        const options = {
            page: body.page,
            limit,
            sortby,
            order
        }

        let aggQuery = History.aggregate(
            [{$match:{defectid:parseInt(defectid)}},
                { $sort: { [sortby]: order } }
                ]
                , { collation: { locale: "en", caseLevel: true } }
            )

        const history = History.aggregatePaginate(aggQuery, options)
        return history;
    } catch (error) {
        throw error;
    }

}