const { sign, verify } = require("jsonwebtoken");
const SECRET_WORD = `${process.env.JWT_SECRET}`

 async function createRefreshToken(id) {
    return await sign({id}, SECRET_WORD,{expiresIn: "3d"});
}
module.exports = {
    createRefreshToken
};