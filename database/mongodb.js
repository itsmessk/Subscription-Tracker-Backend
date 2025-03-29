import mongoose from 'mongoose';
import {DB_URI, NODE_ENV} from "../config/env.js";

if(!DB_URI){
    throw new Error(`DB_URI is not defined, inside .env.${NODE_ENV}.local file`);
}

const connectTODatabase = async() => {
    try{
        await mongoose.connect(DB_URI);
        console.log(`MongoDB Connected: ${NODE_ENV}`);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

export default connectTODatabase;