const jwt = require('jwt-native-implementation')

const pl = {
    user: "Matija",
    username: "MatijaK123",
    role: "admin"
}
const secret = "SecretKey"
const token = jwt.sign(pl, secret)

console.log(token);

console.log(jwt.verify(token, "asd"));