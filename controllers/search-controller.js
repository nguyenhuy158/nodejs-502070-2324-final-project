const Product = require("../models/product");
const ProductCategory = require("../models/product-category");
const User = require("../models/user");


const isFormSubmit = (req) => {
    return !(req.headers["x-requested-with"] === "XMLHttpRequest");
};

exports.searchResults = async (req, res, next) => {
    const q = req.query.q;
    const perPage = parseInt(req.query.perPage) || 10;
    let page = parseInt(req.query.page) || 1;

    try {
        const products = await Product.find({
            productName: {
                $regex: q,
                $options: "i"
            }
        })
            .populate("category")
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        const count = await Product.countDocuments({
            productName: {
                $regex: q,
                $options: "i"
            }
        });
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        if (isFormSubmit(req)) {
            const response = {
                products,
                current: page,
                count,
                perPage,
                nextPage: hasNextPage ? nextPage : null,
                q: req.query.q,
                categories: await ProductCategory.find({})
                    .limit(10),
            };

            res.render("pages/search/search-results", {
                ...response,
                pageTitle: "Search Results - Tech Hut"
            });
        } else {
            const users = await User.find({
                fullName: {
                    $regex: q,
                    $options: "i"
                }
            })
                .limit(5);

            res.json({
                error: false,
                message: "Get data success",
                results: [...products, ...users]
            });
        }
    } catch (error) {
        console.log(`🚀 🚀 file: indexController.js:224 🚀 exports.searchResults= 🚀 error`, error);
        if (isFormSubmit(req)) {
            return next(error);
        }

        res.json({
            error: true,
            message: error
        });
    }
};


const jsonData = require('../public/vietnam-address-api.json');
exports.searchAddress = (req, res) => {
    const { q, type, regioncode, districtcode } = req.query;

    if (!q && !regioncode && !districtcode) {
        return res.json(jsonData);
    }

    let result = [];

    if (type === 'regions') {
        result = jsonData.filter(item => item.codename.includes(q));
    } else if (type === 'districts') {
        if (!regioncode) {
            return res.status(400).json({ error: 'Missing required parameter: regioncode' });
        }

        const region = jsonData.find(item => item.codename === regioncode);
        if (region) {
            result = region.districts.filter(district => district.codename.includes(q));
        }
        if (!q) {
            result = region.districts;
        }
    } else if (type === 'wards') {
        if (!regioncode || !districtcode) {
            return res.status(400).json({ error: 'Missing required parameters: regioncode and districtcode' });
        }

        const region = jsonData.find(item => item.codename === regioncode);
        if (region) {
            const district = region.districts.find(item => item.codename === districtcode);
            if (district) {
                result = district.wards.filter(ward => ward.codename.includes(q));
            }
            if (!q) {
                result = district.wards;
            }
        }
    } else {
        return res.status(400).json({ error: 'Invalid type parameter' });
    }

    res.json(result);
};