import mongoose from 'mongoose';


const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price:{
        type: Number,
        required: [true, 'Subscription Price is required'],
        min: [ 0, 'Price cannot be negative'],
    },
    currency: {
        type: String,
        enum: [ 'USD', 'EUR', 'GBP', 'INR'],
        default: 'USD',
    },
    frequency: {
        type: String,
        enum: [ 'monthly', 'yearly', 'weekly', 'daily'],
        default: 'monthly',
    },
    category: {
        type: String,
        enum: [ 'business', 'education', 'entertainment', 'finance', 'health', 'lifestyle', 'personal', 'shopping', 'social', 'sports', 'technology', 'travel'],
        required: [true, 'Subscription Category is required'],
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: [ 'active', 'cancelled', 'expired'],
        default: 'active',
    },
    startDate:{
        type: Date,
        required: [true, 'Subscription Start Date is required'],
        validate: {
            validator: function(value){
                return value < new Date();
            },
            message: 'Start date must be in the past'
        }
    },
    renewalDate:{
        type: Date,
        validate: {
            validator: function(value){
                return value > this.startDate;
            },
            message: 'Renewal date must be after start date'
        }
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }

}, { timestamps: true });


subscriptionSchema.pre('save', function(next){
    if(!this.renewalDate){
        const renewalPeriods = {
            monthly: 30,
            yearly: 365,
            weekly: 7,
            daily: 1,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewal.getDate() + renewalPeriods[this.frequency]);
    }
    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;