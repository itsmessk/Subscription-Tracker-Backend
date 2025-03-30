import Subscription from "../models/subscription.model.js";
import dayjs from "dayjs";
import {sendRemainderEmail} from "../utils/send-email.js";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express');

const REMINDERS = [7, 5, 2, 1];

export const sendRemainders = serve(async (context) => {
    const {subscriptionId} = context.requestPayload;

    const subscription = await fetchSubscription(context, subscriptionId);

    if(!subscription || subscription.status !== 'active') return;

    const renewalDate = dayjs(subscription.renewalDate);

    if(renewalDate.isBefore(dayjs())) {
        console.log(`Renawal date is passed for subscription ${subscriptionId}. Stopping workflow`);
        return;
    }

    for(const reminder of REMINDERS) {
        const reminderDate = renewalDate.subtract(reminder, 'day');

        if(reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder ${reminder} days before`, reminderDate);
        }

        if(dayjs().isSame(reminderDate, 'day')){
            await triggerReminder(context, `${reminder} days before reminder`, subscription);
        }


    }


});

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return Subscription.findById(subscriptionId).populate('user', 'name email');
    })
}

const sleepUntilReminder = async(context, label, date) => {
    console.log(`sleeping until ${label} reminder at ${date}`);
    await context.sleepUntil(label, date.toDate());
}

const triggerReminder = async(context, label, subscription) => {
    return await context.run(label, async () => {
        console.log(`triggering ${label}`);
        await sendRemainderEmail( {
            to: subscription.user.email,
            type: label,
            subscription,
        })
    });
}