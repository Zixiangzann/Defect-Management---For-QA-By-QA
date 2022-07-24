import mongoose from 'mongoose';
import 'dotenv/config'
import validator from 'validator';
import * as autoIncrement from 'mongoose-auto-increment'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import mongoosePaginate from 'mongoose-paginate-v2'

export const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    components: {
        type: [],
        unique: true
    },
    assignee: {
        type: [],
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})
mongoose.plugin(mongoosePaginate);
mongoose.plugin(mongooseAggregatePaginate);
const Project = mongoose.model('Project', projectSchema)

export default Project