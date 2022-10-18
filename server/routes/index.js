import express from 'express';
const router = express.Router();

import authRoute from './auth.route.js';
import userRoute from './user.route.js';
import defectRoute from './defect.route.js';
import adminRoute from './admin.route.js';
import projectRoute from './project.route.js';
import commentRoute from './comment.route.js';
import historyRoute from './history.route.js';
import watchlistRoute from './watchlist.route.js' 

const routesIndex = [
    {
        path:'/auth',
        route: authRoute
    },
    {
        path: '/users',
        route: userRoute
    },
    {
        path:'/defect',
        route: defectRoute
    },
    {
        path:'/admin',
        route:adminRoute
    },
    {
        path:'/project',
        route:projectRoute
    },
    {
        path:'/comment',
        route:commentRoute
    },
    {
        path:'/history',
        route:historyRoute
    },
    {
        path:'/watchlist',
        route:watchlistRoute
    }
] 


routesIndex.forEach((route)=>{
    router.use(route.path,route.route)
})

export default router;