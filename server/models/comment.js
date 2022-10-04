import mongoose from 'mongoose';
import 'dotenv/config'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

export const commentSchema = mongoose.Schema({
    defectid:{
        type:String
    },
    user:[{}],
    comment:{
        type:String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

mongoose.plugin(mongooseAggregatePaginate);
const Comment = mongoose.model('Comment',commentSchema);
export default Comment;