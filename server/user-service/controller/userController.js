const User = require("../models/user.model")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const signup = async (req, res, next) => {
    try {
        // console.log(req.body)
        const { username, password, email, signupType } = req.body;

        if (!username || !email || !signupType || username.length < 3)
            return res.status(429).json({ message: "All Fields are required.", status: false });

        // check user
        const checkUser = await User.findOne({ email });
        if (checkUser)
            return res.status(409).json({ message: "The given email already exists", status: false });

        let hashedPassword;
        if (signupType === "self") {
            if (!password || password.length < 6)
                return res.status(400).json({ message: "Password must be at least 6 characters", status: false });

            // hashedPassword = await bcrypt.hash(password, 10); // saltRounds = 10
        }

        // create user
        const addUser = await User.create({
            username,
            email,
            signupType,
            password
        });

        if (!addUser) throw new Error("User not added, try again later");

        return res.status(201).json({ message: "User Created Successfully", status: true });
    } catch (err) {
        console.log(err);
        next(err);
    }
};


const login = async (req, res, next) => {
    try {
        const { email, password, loginType } = req.body;

        // 1. Check all required fields
        if (!loginType || !email || (loginType === "self" && !password)) {
            return res.status(400).json({ message: "All Fields are required", status: false });
        }

        // 2. Check if already logged in (cookie exists)
        const existingToken = req.cookies?.[process.env.JWT_TOKEN];
        if (existingToken) {
            try {
                const decoded = jwt.verify(existingToken, process.env.JWT_SECRET);
                const confirm = await User.findOne({ email: decoded.data.email });
                if (confirm) {
                    return res.status(200).json({ message: "User already authenticated!", status: true });
                }
            } catch (err) {
                console.log("Invalid/expired token:", err.message);
            }
        }

        // 3. Find user with given email + loginType
        const checkUser = await User.findOne({ email, signupType: loginType });
        // console.log(checkUser)
        if (!checkUser) {
            return res.status(404).json({ message: `User with ${email} not found`, status: false });
        }

        // 4. Self signup → compare password with bcrypt
        if (checkUser.signupType === "self") {
            const isMatch = await bcrypt.compareSync(password, checkUser.password);
            console.log(isMatch);
            if (!isMatch) {
                return res.status(401).json({ message: "Wrong Password", status: false });
            }
        }

        // 5. Generate JWT token
        const token = jwt.sign(
            { data: {username:checkUser.username, email: checkUser.email, id: checkUser.id } },
            process.env.JWT_SECRET,
            { expiresIn: "72h" }
        );

        // 6. Store token in cookie
        res.cookie(process.env.JWT_TOKEN, token, {
            maxAge: 72000 * 60 * 60, // 1 hour
            httpOnly: true,         // cannot access from JS
            secure: false, // only https in prod
            sameSite: "strict",
        });

        // 7. Return response (omit password)
        const { password: _, ...userData } = checkUser.toObject();

        return res.status(200).json({
            message: "User authenticated successfully!",
            status: true,
            token,
            user: userData,
        });
    } catch (err) {
        console.log("Login error:", err);
        next(err);
    }
};

const isAuth = async function (req, res, next) {
    try {

        let token = await req.cookies['ecommerce-web-app']
        let decoded = jwt.decode(token, process.env.JWT_SECRET)
        console.log(decoded)
        if (!decoded)
            return res.status(404).json({ status: false, message: "User not found !!" })
        let checkUser = await User.findById(decoded.data.id)
        if (!checkUser)
            return res.status(404).json({ status: false, message: "User not found !!" })
        else
            return res.status(200).json({ status: true, message: "User is authenticated.",email:decoded.data.email,username:decoded.data.username })

    } catch (err) {
        console.log(err)
        next()
    }
}

module.exports = { signup, login, isAuth }