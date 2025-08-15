const middleware = require('./middleware')
module.exports = (express, pool, jwt, secret) => {
    const sessionRestoreRouter = express.Router();

    sessionRestoreRouter.use(middleware(jwt, secret));

    sessionRestoreRouter.get('/me', async (req, res) => {

        const t = req.body.token || req.params.token || req.headers['x-access-token'] || req.query.token;

        console.log(t);
        return res.json({
            status: "/me"
        });
    })

    return sessionRestoreRouter;
}