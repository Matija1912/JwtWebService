module.exports = (express, pool) => {
    const apiRouter = express.Router();

    apiRouter.get('/test', async (req, res) => {
        // try{
        //     let conn = await pool.getConnection();
        //     let [result] = await conn.query('SELECT * FROM accounts');
        //     conn.release();
        //     res.json({
        //         status: 'OK',
        //         users: result
        //     });
        // }catch(e){
        //     res.json({
        //         status: 'NOT OK'
        //     });
        // }
    })

    return apiRouter;

}