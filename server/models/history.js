import mongoose from 'mongoose';
import 'dotenv/config'
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';


export const historySchema = mongoose.Schema({
    defectid:{
        type:Number
    },
    user:[{}],
    from:{
        type:String,
        required: true
    },
    to:{
        type:String,
        required: true
    },
    field:{
        type:String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

mongoose.plugin(mongooseAggregatePaginate);
const History = mongoose.model('History',historySchema);
export default History;