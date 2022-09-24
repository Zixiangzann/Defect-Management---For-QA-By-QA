import mongoose from 'mongoose';
import 'dotenv/config'
import validator from 'validator';
import * as autoIncrement from 'mongoose-auto-increment'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export const projectSchema = mongoose.Schema({
    title: {
        type: String,
        maxLength: 20,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    components: {
        type: [{type:String, maxLength: 20}]
    },
    assignee: {
        type: [{type:String}]
    },
    date: {
        type: Date,
        default: Date.now
    }
})
mongoose.plugin(mongooseAggregatePaginate);
const Project = mongoose.model('Project', projectSchema)

export default Project