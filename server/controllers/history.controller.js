import httpStatus from "http-status";
import { historyService } from "../services/index.js";


const historyController ={

    //get history by defectId
    async paginateHistory(req,res,next){
        try {
         const defectid = req.params.defectId
         const history = await historyService.paginateHistory(defectid,req.body,req.user);
         res.json(history)
        } catch (error) {
            next(error);
        }
    },

    async addHistory(req,res,next){
        try {
         const defectid = req.params.defectId
         const history = await historyService.addHistory(defectid,req.body,req.user);
         res.json(history);
        } catch (error) {
            next(error);
        }
    },


}

export default historyController;