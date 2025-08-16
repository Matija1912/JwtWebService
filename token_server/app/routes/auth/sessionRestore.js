const middleware = require('./middleware')
module.exports = (express, pool, jwt, secret) => {
    const sessionRestoreRouter = express.Router();

    sessionRestoreRouter.use(middleware(jwt, secret));

    sessionRestoreRouter.get('/me', async (req, res) => {

        console.log(req.decoded);
        res.send({status:200, user:req.decoded});

    })

    return sessionRestoreRouter;
}