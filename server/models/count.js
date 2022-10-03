import mongoose from 'mongoose';
import 'dotenv/config'

export const countSchema = mongoose.Schema({
    projectName: {
        type: String,
        unique: true,
        required: true
    },
    defectCount: {
        type: Number,
        // unique: true,
        default: 1
    }
})

const DefectCount = mongoose.model('DefectCount', countSchema);
export default DefectCount;