import nodemailer from "nodemailer";
import {EMAIL_PASSWORD} from "./env.js";

export const email_address = 'real.sks.infotech@gmail.com';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email_address,
        pass: EMAIL_PASSWORD
    }
});

export default transporter;