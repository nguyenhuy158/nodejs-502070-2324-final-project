const { transporter } = require("../config/email");

exports.generateToken = function () {
    const length = 64;
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let token = "";
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};

exports.sendEmail = async function (req, user, token, options = undefined) {
    try {
        console.log("=>(userController.js:226) user", user);
        
        const mailOptions =
            options ?
                options :
                {
                    from: process.env.FROM_EMAIL,
                    to: user.email,
                    subject: "Activate Sales Account",
                    text: `Dear ${user.fullName},
                An account has been created for you in the Sales System. To log in, please click the following link within 1 minute:
                ${req.protocol + "://" + req.get("host")}/email-confirm?token=${token}
                Best regards,
                Administrator`,
                };
        
        await transporter.sendMail(mailOptions, (err, info) => {
            console.log("=>(userController.js:237) info", info);
            console.log("=>(userController.js:237) err", err);
        });
    } catch (err) {
        console.log("=>(userController.js:243) err", err);
    }
};
