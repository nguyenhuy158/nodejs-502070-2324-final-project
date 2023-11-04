const fs = require("fs");

// FIXME: auto view
let autoViews = [];
exports.autoViews = (req, res, next) => {
    const queryPath = req.path.toLowerCase().trim();
    const path = "./views/pages/auto" + queryPath + ".pug";
    if (autoViews[queryPath]) return res.render(autoViews[queryPath]);

    if (fs.existsSync(path)) {
        autoViews[queryPath] = "pages/auto/" + queryPath.replace(/^\//, "");
        console.log(`🚀 ----------------------------------------------------🚀`);
        console.log(`🚀 🚀 file: auto-views.js:11 🚀 autoViews`, autoViews);
        console.log(`🚀 ----------------------------------------------------🚀`);
        return res.render(autoViews[queryPath]);
    }
    next();
};