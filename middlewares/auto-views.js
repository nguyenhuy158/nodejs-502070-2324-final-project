const fs = require("fs");

autoViews = [];
exports.autoViews = (req, res, next) => {
    const queryPath = req.path.toLowerCase().trim();
    const path = "./views/pages" + queryPath + "-auto.pug";
    // console.log(fs.existsSync(path));
    // console.log("=>(auto-views.js:9) __dirname + path", __dirname + path);
    // console.log(fs.existsSync(__dirname + path));
    if (autoViews[queryPath]) return res.render(autoViews[queryPath]);
    
    if (fs.existsSync(path)) {
        autoViews[queryPath] = "pages/" + queryPath.replace(/^\//, "") + "-auto";
        console.log("=>(auto-views.js:14) autoViews", autoViews);
        return res.render(autoViews[queryPath]);
    }
    next();
};