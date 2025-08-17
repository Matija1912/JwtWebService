module.exports = (jwt, secret) => {
    return (req, res, next) => {
      
      const authHeader = req.headers['authorization'];

      if (!authHeader) {
         console.log('no token')
         return res.status(403).json({ success: false, message: 'No token' });
      }

      const token = authHeader.startsWith('Bearer ')
         ? authHeader.slice(7)
         : authHeader;

      try{

         const user = jwt.verify(token, secret);
         req.decoded = user;
         next();

      }catch(err){

         return res.status(403).json({
            status: 'NOT OK',
            message: err.message
         });

      }

    };
}