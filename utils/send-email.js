import {emailTemplates} from "./email-template.js";
import dayjs from "dayjs";
import {email_address} from "../config/nodemailer.js";
import transporter from "../config/nodemailer.js";

export const sendRemainderEmail = async ({to, type, subscription}) => {
        if(!to || !type){
        throw new Error('Missing required parameters');
    }

    const template = emailTemplates.find((t) => t.label === type);
    if(!template){
        throw new Error('Invalid email template');
    }

    const mailInfo = {
        userName: subscription.user.name,
        subscriptionName: subscription.name,
        renewalDate: dayjs(subscription.renewalDate).format('MMMM D, YYYY'),
        planName: subscription.name,
        price: `${subscription.currency} ${subscription.price} ${subscription.frequency}`,
        paymentMethod: subscription.paymentMethod,
    }

    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);

    const mailOptions = {
        from: email_address,
        to: to,
        subject: subject,
        html: message,
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err);
        }
        else{
            console.log(info);
        }
    });
};