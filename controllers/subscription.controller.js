import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) =>{
    try{
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        res.status(201).json({success: true, data: subscription});

    } catch(error){
        next(error);
    }
}

export const getSubscriptions = async (req, res, next) =>{
    try{
        if(req.user.id !== req.params.id) {
            const error = new Error('You are not the owner of this account');
            error.statusCode = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({ user: req.params.id});

        res.status(200).json({success: true, data: subscriptions});
    } catch(error){
        next(error);
    }
}

export const getAllSubscriptions = async (req, res, next) =>{
    try{
        const subscriptions = await Subscription.find();

        if(!subscriptions) {
            const error = new Error('Subscriptions not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: subscriptions});

    } catch(error){
        next(error);
    }
}

export const getSubsById = async (req, res, next) =>{
    try{
        const subs = await Subscription.find({user :req.params.id})

        if(!subs) {
            const error = new Error('Subscriptions not found');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({success: true, data: subs});
    } catch(error){
        next(error);
    }
}


