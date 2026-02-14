const jwt = require("jsonwebtoken")
const secretKey = "sKhan21"
function setUser(user) {
    return jwt.sign(
        { id: user._id,  },
        secretKey,
        { expiresIn: "1h" }
      );
      
}

function getUser(token){
    try {
        return jwt.verify(token,secretKey)
    } catch (error) {
        if(error) throw new Error(`varification failed ${error.message}`);
    }
}


module.exports={
    setUser,
    getUser
}