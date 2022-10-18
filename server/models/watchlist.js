import mongoose from 'mongoose';
import 'dotenv/config'


export const watchlistSchema = mongoose.Schema({
    defectList:{
        filter:{
            field:{},
            showColumn:{},
            sort:{}
        }
    },
    projectReport:[{
        chart:{},
        table:{}
    }],
    layouts:{},
    user:{
        type:String,
        required:true,
        unique: true
    }
})

const Watchlist = mongoose.model('Watchlist',watchlistSchema)
export default Watchlist;