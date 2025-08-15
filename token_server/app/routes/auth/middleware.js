module.exports = (jwt, secret) => {
    return (req, res, next) => {

      console.log("madafakka")
      // const token = req.body.token || req.params.token || req.headers['x-access-token'] || req.query.token;

      console.log(req.body);

      // if (!token) {
      //    return res.status(403).send({
      //       success: false,
      //       message: 'No token'
      //    });
      // }

      // jwt.verify(token, secret, (err, decoded) => {
      //    if (err) {
      //          return res.status(403).send({
      //             success: false,
      //             message: 'Wrong token'
      //       });
      //    }
      //    req.decoded = decoded;
      //    next();
      // });
    };
}