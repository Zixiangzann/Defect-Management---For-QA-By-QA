
import express from 'express'
import mongoose from 'mongoose';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize'
import 'dotenv/config'
import routes from './routes/index.js'

import passport from 'passport';
import jwtStrategy from './middleware/passport.js';
import { handleError,convertToApiError } from './middleware/apiError.js';

const mongoUri = process.env.DB_URI
mongoose.connect(mongoUri);

const app = express();

//Parsing
app.use(express.json());

//Sanitize
app.use(xss());
app.use(mongoSanitize());

//Passport
app.use(passport.initialize());
passport.use('jwt',jwtStrategy);

//Routes
app.use('/api',routes);

//Error handling
app.use(convertToApiError);
app.use((err,req,res,next)=>{
    handleError(err,res);
})

const port = process.env.PORT || 3001;
app.listen(port,()=>{
    console.log(`server running on port:${port}`)
});





