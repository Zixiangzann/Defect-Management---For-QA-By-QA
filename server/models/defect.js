import mongoose from 'mongoose';
import 'dotenv/config'
import validator from 'validator';
import * as autoIncrement from 'mongoose-auto-increment'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export const defectSchema = mongoose.Schema({
    defectid:{
        type:Number,
        unique:true
    },
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    project:{
        type:String,
        required:true
    },
    components:{
        type:String,
        required: true
    },
    server:{
        type:String,
        required: true,
        enum:['Local','Development','QA','Production']
    },
    issuetype:{
        type:String,
        required: true,
        enum:['Bug','Change','Incident']
    },
    severity:{
        type:String,
        required: true,
        enum:['Low','Medium','High','Showstopper']
    },
    status:{
        type:String,
        required: true,
        enum:['New','Open','Fixed','Pending re-test','Verified','Closed','Deferred','Duplicate','Not a bug'],
        // default: 'New'
    },
    assignee:{
        type:[String]
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const connection = mongoose.createConnection(process.env.DB_URI);
autoIncrement.initialize(connection);
mongoose.plugin(autoIncrement.plugin,{model:'Defect',field:'defectid',startAt: 1})
mongoose.plugin(mongooseAggregatePaginate);

const Defect = mongoose.model('Defect',defectSchema);
export default Defect;