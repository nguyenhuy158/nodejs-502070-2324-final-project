exports.getOrders = (req, res) => {
    res.render('pages/orders/home', {
        pageTitle: 'Orders Manager - Tech Hut'
    });
};