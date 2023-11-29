exports.getCustomers = (req, res) => {
    res.render('pages/customers/home', {
        pageTitle: 'Customers Manager - Tech Hut',
    });
};