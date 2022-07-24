import httpStatus from "http-status";
import { commentService } from "../services/index.js";

const commentController ={

    //get comment by defectId
    async commentPaginate(req,res,next){

    },

    async addComment(req,res,next){
        try {
         const defectid = req.params.defectId
         const comment = await commentService.addComment(defectid,req.body,req.user);
         res.json(comment);
        } catch (error) {
            next(error);
        }
    },

    async deleteComment(req,res,next){

    },

    async editComment(req,res,next){

    }

}

export default commentController;