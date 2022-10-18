import express from 'express';
import watchlistController from '../controllers/watchlist.controller.js';

const router = express.Router();

//Middleware
import {auth} from '../middleware/auth.js'

router.post('/updatelayout',auth('updateOwn','watchlist'),watchlistController.updateLayout)
router.post('/getwatchlist',auth('readOwn','watchlist'),watchlistController.updateLayout)
router.post('/updatefieldfilter',auth('updateOwn','watchlist'),watchlistController.updateFieldFilter)

export default router;