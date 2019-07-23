const express = require('express');
const config = require('../config');
const PosterApi = require('../api/poster');

const router = new express.Router();


router.get('/', async (req, res) => {
    const posterApi = new PosterApi({ token: config.token });

    const products = await posterApi.makePosterRequest('menu.getProducts');

    res.render('products', { products: products })
});


router.post('/buy', async (req, res) => {
    const posterApi = new PosterApi({ token: config.token });
    const { productId } = req.body;

    const order = await posterApi.makePosterRequest('incomingOrders.createIncomingOrder', 'post', {
        body: {
            spot_id: 1,
            phone: '+380680000000',
            products: [
                { product_id: productId, count: 1 },
            ],
        }
    });

    // const order = { incoming_order_id: 1 };

    res.render('order', { order: order });
});


module.exports = router;
