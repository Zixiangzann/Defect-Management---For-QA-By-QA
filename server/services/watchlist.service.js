import Watchlist from "../models/watchlist.js";
import { ApiError } from "../middleware/apiError.js";
import httpStatus from "http-status";
import jwt from 'jsonwebtoken';
import 'dotenv/config';


export const getWatchlist = async (req) => {
    try {
        const watchlist = await Watchlist.findOne({ user: req.user.email })

        if (!watchlist) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Watchlist not found');
        }

        return watchlist

    } catch (error) {
        throw error
    }
}

export const updateFieldFilter = async (req) => {
    try {

        const watchlist = await Watchlist.findOne({ user: req.user.email })

        if (!watchlist) {
            //if user does not have a watchlist, create a watchlist for that user
            const newWatchlist = new Watchlist({
                user: req.user.email
            })

            await newWatchlist.save()
        }

        const updateFieldFilter = await Watchlist.findOneAndUpdate(
            { user: req.user.email },
            {
                "$set": {
                    "defectList.filter.field.project": req.body.project,
                    "defectList.filter.field.components": req.body.components,
                    "defectList.filter.field.status": req.body.status,
                    "defectList.filter.field.severity": req.body.severity,
                    "defectList.filter.field.server": req.body.server,
                    "defectList.filter.field.assignee": req.body.assignee,
                    "defectList.filter.field.reporter": req.body.reporter,
                    "defectList.filter.field.search": req.body.search
                }
            },
            { new: true }
        )

        return updateFieldFilter

    } catch (error) {
        throw error
    }
}

export const updateLayout = async (req) => {
    try {

        const watchlist = await Watchlist.findOne({ user: req.user.email })

        if (!watchlist) {
            //if user does not have a watchlist, create a watchlist for that user
            const newWatchlist = new Watchlist({
                user: req.user.email
            })

            await newWatchlist.save()
        }

        const updateLayout = await Watchlist.findOneAndUpdate(
            { user: req.user.email },
            {
                "$set": {
                    layouts: req.body.layouts
                }

            },
            { new: true }
        )

        return updateLayout;


    } catch (error) {
        throw error
    }
}

