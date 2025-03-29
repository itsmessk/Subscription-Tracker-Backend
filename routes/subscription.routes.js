import { Router } from 'express';
const subscriptionRouter = Router();


subscriptionRouter.get('/', (req, res) => {
    res.send({title: 'GET all subscriptions'});
});

subscriptionRouter.post('/', (req, res) => {
    res.send({title: 'POST new subscription'});
});

subscriptionRouter.put('/:id', (req, res) => {
    res.send({title: 'PUT update subscription'});
});

subscriptionRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE subscription'});
});

subscriptionRouter.get( '/:id', (req, res) => {
    res.send({title: 'GET subscription'});
})

subscriptionRouter.get('/user/:id',(req, res) => {
    res.send({title: 'GET all subscriptions for user'});

});

subscriptionRouter.put('/:id/cancel', (req, res) => {
    res.send({title: 'PUT cancel subscription'});
});

subscriptionRouter.get('/upcoming-renewals', (req, res) => {
    res.send({title: 'GET upcoming renewals'});
})

export default subscriptionRouter;