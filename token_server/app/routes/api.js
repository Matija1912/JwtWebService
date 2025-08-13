module.exports = (express) => {
    const apiRouter = express.Router();

    apiRouter.get('/', (req, res) => {
        res.send("api response.");
    })

    return apiRouter;

}