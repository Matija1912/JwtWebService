module.exports = (express, pool, jwt, secret, middleware, randomBytes) => {


    const projectsApiRouter = express.Router();

    projectsApiRouter.use(middleware(jwt, secret));

    projectsApiRouter.get('/getUsersProjects', async (req, res) => {
        try{ 
            const user = req.decoded;

            if (!user) {
                return res.status(400).json({
                    status: 'NOT OK',
                    message: 'Auth token issue.'
                });
            }

            const result = await pool.query(
                'SELECT * FROM projects WHERE account_id = $1',
                [user.id]
            );        

            return res.status(201).json({
                status: 'OK',
                projects: result.rows
            });
        }catch(err){
            console.error('Projects query error:', err);
            return res.status(500).json({ 
                status: 'ERROR',
                 message: 'Server error' 
                });
        }


        
    })

    projectsApiRouter.post('/createNewProject', async (req, res) => {
        try{
            const user = req.decoded;

            if (!user) {
                return res.status(400).json({
                    status: 'NOT OK',
                    message: 'Auth token issue.'
                });
            }
            const projectData = req.body;

            const secret = randomBytes(64);
            const hashedSecret = jwt.crypto.createSha256().update(secret).digest('hex')           

            const result = await pool.query(
                'INSERT INTO projects (account_id, name, description, secret, user_schema) values ($1, $2, $3, $4, $5)',
                [user.id, projectData.name, projectData.description, hashedSecret, JSON.stringify(projectData.customFields)]
            )

             return res.status(201).json({
                status: 'OK',
                secret: secret.toString('hex')
            });

        }catch(err){
            console.error('Project creatin error:', err);
            return res.status(500).json({ 
                status: 'ERROR',
                 message: 'Server error' 
                });
        }
    })

    return projectsApiRouter;

}

