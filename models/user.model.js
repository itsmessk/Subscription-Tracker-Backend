import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, 'Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [ true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [ /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [ true, 'Password is required'],
        minlength: 6,
        maxlength: 100,
    }

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;