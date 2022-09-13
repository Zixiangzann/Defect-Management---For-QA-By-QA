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
    reporter:{
        type:String
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
    attachment:{
        type:[{}]
    },
    createdDate:{
        type: Date,
        default: Date.now
    },
    lastUpdatedDate:{
        type: Date,
        default: Date.now
    }
})


mongoose.plugin(mongooseAggregatePaginate);

const Defect = mongoose.model('Defect',defectSchema);
export default Defect;