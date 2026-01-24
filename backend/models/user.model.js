import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    mobile: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['user', 'owner', 'deliveryBoy'],
        required: true
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)
export default User