const { User } = require("../model/user")
const bcrypt = require("bcryptjs")
const { setUser } = require("../services/auth")
async function register(req, res) {
    try {
        const password = req.body.password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        req.body.password = hashPassword

        await User.create(req.body)
        return res.status(200).json({ success: true, message: "record created" })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "User not registered"
        });
    }
}


async function login(req, res) {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(404).json({ success: false, msg: "user not found" })

        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) return res.status(401).json({ success: false, msg: "password not found" })
        const token = setUser(user)
        res.cookie("uid", token, {
            httpOnly: true,//avoid access cookie from js
            secure: false,   //true only for https false(http,https)           
            maxAge: 1000 * 60 * 60//expire
        });
        return res.status(200).json({ success: true, msg: "login successfull" })
    } catch (error) {
        return res.status(500).json({ success: false, msg: "login failed" })
    }
}
function logOut(req, res) {
    try {
      res.clearCookie("uid", {
        httpOnly: true,
        secure: false,
      });
      return res.status(200).json({success:true})
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, msg: "logout failed", err: error });
    }
  }
  
module.exports = {
    register,
    login,
    logOut
}