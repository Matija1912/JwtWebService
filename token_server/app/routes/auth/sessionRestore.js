module.exports = (express, jwt, secret, middleware) => {
    const sessionRestoreRouter = express.Router();

    sessionRestoreRouter.use(middleware(jwt, secret));

    sessionRestoreRouter.get('/me', async (req, res) => {

        res.send({status:200, user:req.decoded});

    })

    return sessionRestoreRouter;
}