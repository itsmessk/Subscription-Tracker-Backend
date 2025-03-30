import Subscription from "../models/subscription.model.js";
import User from "../models/user.model.js";
import {workFlowClient} from "../config/upstash.js";
import {SERVER_URL} from "../config/env.js";


export const createSubscription = async (req, res, next) =>{
    try{
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const {workflowRunId } = await workFlowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                    subscriptionId: subscription.id,
            },
            headers: {
                "content-type": "application/json"
            },
            retries: 0,
        });

        res.status(201).json({success: true, data: {subscription, workflowRunId}});

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

        if(!req.params.id) return res.status(400).json({success: false, message: 'Subscription id is required'})
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

export const sendRemindersBySubscriptionId = async (req, res, next) => {
    try {
        const subscriptions = await Subscription.find();


        if (!subscriptions || subscriptions.length === 0) {
            const error = new Error('No subscriptions found');
            error.statusCode = 404;
            throw error;
        }


        const results = [];


        for (const subscription of subscriptions) {
            try {
                const { workflowRunId } = await workFlowClient.trigger({
                    url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
                    body: {
                        subscriptionId: subscription.id,
                    },
                    headers: {
                        "content-type": "application/json",
                    },
                    retries: 0,
                });

                const user = await User.findById(subscription.user);
                results.push({
                    subscriptionId: subscription.id,
                    workflowRunId,
                    message: `Reminder sent successfully to ${user}`,
                });

                console.log(
                    `Reminder sent successfully for subscription ${subscription.id}`
                );
            } catch (error) {
                console.error(
                    `Error sending reminder for subscription ${subscription.id}: ${error.message}`
                );
                results.push({
                    subscriptionId: subscription.id,
                    error: error.message,
                });
            }
        }


        res.status(200).json({
            success: true,
            message: `Reminders processed successfully`,
            results,
        });
    } catch (error) {
        next(error);
    }
};


