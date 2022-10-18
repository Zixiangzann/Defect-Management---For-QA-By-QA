import httpStatus from 'http-status';
import { ApiError } from '../middleware/apiError.js';
import { watchlistService } from '../services/index.js';

const watchlistController = {
    async getWatchlist(req, res, next) {
        try {
            const watchlist = await watchlistService.getWatchlist(req);
            res.json(watchlist)
            
        } catch (error) {
            next(error)
        }
    },
    async updateLayout(req, res, next) {
        try {
            const updatedLayout = await watchlistService.updateLayout(req);
            res.json(updatedLayout)
            
        } catch (error) {
            next(error)
        }
    },
    async updateFieldFilter(req, res, next) {
        try {
            const updatedFieldFilter = await watchlistService.updateFieldFilter(req);
            res.json(updatedFieldFilter)
            
        } catch (error) {
            next(error)
        }
    }
}

export default watchlistController;