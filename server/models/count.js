import mongoose from 'mongoose';
import 'dotenv/config'

export const countSchema = mongoose.Schema({
    defectCount:{
        type:Number,
        unique:true,
        default:1
}
})

const DefectCount = mongoose.model('DefectCount',countSchema);
export default DefectCount;