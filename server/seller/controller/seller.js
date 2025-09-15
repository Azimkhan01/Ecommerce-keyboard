const Seller = require("../model/sellerSchema")

const signup = async (req, res, next) => {

    try {
        console.log(req.body)
        //check seller is there or not      
        let seller = await Seller.findOne({ email: req.body.email })
        if (seller)
            return res.status(429).json({ message: "Seller already exists !", status: false })
        seller = await Seller.create({...req.body})
        if(seller)
            return res.status(200).json({message:"Seller Created Succesfully",status:true})

    } 
    catch (err) {
        console.log(err)
        next()
    }

}

const login = async (req, res, next) => {

     try {

        const { email, password, loginType } = req.body
        if (!loginType)
            return res.status(429).json({ message: "All Fields are required", status: false })
        // console.log("done");

        if (loginType === "self") {
            // console.log("done2");

            if (!email || !password)
                return res.status(429).json({ message: "All Fields are required", status: false })
            else if (loginType === 'google') {
                if (!email)
                    return res.status(429).json({ message: "All Fields are required", status: false })
            }

        }
        // console.log("done3");

        //check is there any user with the same type of login ??
        let checkSeller = await Seller.findOne({ email, signupType: loginType })
        console.log(checkSeller)
        if (!checkSeller || Object.keys(checkSeller).length === 0)
            return res.status(404).json({ message: `User with ${email} not found`, status: false })
        // console.log("done4");
        // console.log(checkSeller, checkSeller.length > 0);
        // console.log(checkSeller);
        // console.log(checkSeller?.signupType,loginType,checkSeller.signupType === loginType);

        if (checkSeller && checkSeller.signupType === loginType) {
            // console.log("done5");

            if (loginType === 'self') {
                // console.log("done 6")
                let checkPassword = await checkSeller.comparePassword(password)
                // console.log(checkPassword)
                if (checkPassword) {
                    return res.status(200).json({ message: "user is  authenticated succesfully !", status: true })
                }
                else {
                    return res.status(404).json({ message: "user is not authenticated", status: false })
                }
            }
            else if (loginType === 'google') {
                if (checkSeller.signupType === loginType)
                    return res.status(200).json({ message: "user is authenticated succesfully !", status: true })
            }
        } else {
            throw new Error("Server Error Try again in sometime")
        }
    }
    catch(err)
    {
        console.log(err)
        next()
    }

}

module.exports = { signup, login }