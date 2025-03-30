import { Router } from 'express';
import authorize from "../middleware/auth.middleware.js";
import {
    createSubscription,
    getAllSubscriptions,
    getSubscriptions,
    getSubsById,
    sendRemindersBySubscriptionId
} from "../controllers/subscription.controller.js";
const subscriptionRouter = Router();


subscriptionRouter.get('/', getAllSubscriptions);

subscriptionRouter.get('/workflowCron', sendRemindersBySubscriptionId);

subscriptionRouter.get( '/:id', getSubsById);

subscriptionRouter.post('/', authorize, createSubscription );

subscriptionRouter.get('/user/:id', authorize, getSubscriptions);



subscriptionRouter.put('/:id', (req, res) => {
    res.send({title: 'PUT update subscription'});
});

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE subscription'});
});


subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({title: 'PUT cancel subscription'});
});

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({title: 'GET upcoming renewals'});
})

export default subscriptionRouter;