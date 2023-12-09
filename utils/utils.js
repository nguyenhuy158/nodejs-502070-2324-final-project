const { v2: cloudinary } = require("cloudinary");
const { transporter } = require("../config/email");
const ejs = require("ejs");
const fs = require("fs");

const emailTemplateCreateAccount = fs.readFileSync("./views/email/email-template-create-account.ejs", "utf-8");
const emailTemplateForgotPassword = fs.readFileSync("./views/email/email-template-forgot-password.ejs", "utf-8");

exports.sendEmail = async function (req, user, token, type = "create-account") {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to: user.email,

    };

    let emailTemplate;
    let subject;

    switch (type) {
        case "create-account":
            subject = "Your New Retail Store Login Account";
            emailTemplate = ejs.compile(emailTemplateCreateAccount);
            break;

        case "forgot-password":
            subject = "Your Retail Store System Password Reset";
            emailTemplate = ejs.compile(emailTemplateForgotPassword);
            break;

        default:
            break;
    }
    try {

        if (emailTemplate) {
            const htmlContent = emailTemplate({
                name: user.fullName,
                url: req.protocol + "://" + req.get("host") + "/email-confirm?token=" + token,
                admin: req.user.fullName || "Admin",
            });

            mailOptions.subject = subject;
            mailOptions.html = htmlContent;
        }
        await transporter.sendMail(mailOptions, (err, info) => {
            console.log(`[SEND MAIL] ${err ? 'Fail' : 'Success'}`);
            console.log("[SEND MAIL][INFO]", info.accepted);
            console.log("[SEND MAIL][ERR]", err);
        });
    } catch (error) {
        console.log("[SEND MAIL][ERR]", error);
    }
};

exports.isNumeric = function isNumeric(value) {
    return !isNaN(value) && typeof value !== 'boolean';
};

exports.getFullUrlForMailConfirm = function getFullUrlForMailConfirm(req, token) {
    const baseUrl = `${req.protocol + "://" + req.get("host")}/email-confirm?token=${token}`;
    return baseUrl;
};

exports.getFullUrl = function getFullUrl(req) {
    const baseUrl = `${req.protocol + "://" + req.get("host")}`;
    return baseUrl;
};

exports.generateToken = function () {
    const length = 64;
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};

exports.uploadImage = async (imagePath) => {
    const options = {
        use_filename: true,
        unique_filename: false,
        overwrite: true,
    };

    try {
        const result = await cloudinary.uploader.upload(imagePath, options);
        console.log("=>(utils.js:54) result", result);
        return result.url;
    } catch (error) {
        console.log("[][ERR]", error);
    }
};

exports.removeImageByUrl = async function (imageUrl) {
    try {
        const publicId = imageUrl.match(/\/v\d+\/(.+)\./)[1];

        const result = await cloudinary.uploader.destroy(publicId);

        console.log(`Image removed from Cloudinary: ${publicId}`);
        return result;
    } catch (error) {
        console.error(`Error removing image from Cloudinary: ${error.message}`);
    }
};


