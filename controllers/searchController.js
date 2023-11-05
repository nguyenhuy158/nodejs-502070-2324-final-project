const Product = require("../models/product");
const ProductCategory = require("../models/productCategory");
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

            res.render("pages/search/search-results", { ...response });
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