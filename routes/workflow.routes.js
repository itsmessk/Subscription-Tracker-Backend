import { Router } from 'express';
import {sendRemainders} from "../controllers/workflow.controller.js";
const workflowRouter = Router();

workflowRouter.post('/subscription/reminder', sendRemainders);

workflowRouter.all('/subscription/reminder', (req, res) => {
    res.status(405).send({success: false, message: 'Method not allowed'});
})

export default workflowRouter;