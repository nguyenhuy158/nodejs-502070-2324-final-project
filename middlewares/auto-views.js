const fs = require("fs");

autoViews = [];
exports.autoViews = (req, res, next) => {
    const queryPath = req.path.toLowerCase().trim();
    const path = "./views/pages" + queryPath + "-auto.pug";
    if (autoViews[queryPath]) return res.render(autoViews[queryPath]);
    
    if (fs.existsSync(path)) {
        autoViews[queryPath] = "pages/" + queryPath.replace(/^\//, "") + "-auto";
        return res.render(autoViews[queryPath]);
    }
    next();
};