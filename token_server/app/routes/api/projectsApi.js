module.exports = (express, pool, jwt, secret, middleware, randomBytes, apiUrl) => {


    const projectsApiRouter = express.Router();

    projectsApiRouter.use(middleware(jwt, secret));

    projectsApiRouter.get('/getUsersProjects', async (req, res) => {
        try{ 
            const user = req.decoded;
            
            const publicApiUrl = apiUrl

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
                projects: result.rows,
                apiUrl: publicApiUrl
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

            const secret = randomBytes(64).toString('hex');
            const hashedSecret = jwt.crypto.createSha256().update(secret).digest('hex')   
            
            console.log('secret: ' + secret)
            console.log('hash: ' + hashedSecret)

            const result = await pool.query(
                'INSERT INTO projects (account_id, name, description, secret, user_schema) values ($1, $2, $3, $4, $5)'+
                'RETURNING id, project_key, name, description, user_schema',
                [user.id, projectData.name, projectData.description, hashedSecret, JSON.stringify(projectData.customFields)]
            )

             return res.status(201).json({
                status: 'OK',
                secret: secret.toString('hex'),
                project: result.rows[0]
            });

        }catch(err){
            console.error('Project creatin error:', err);
            return res.status(500).json({ 
                status: 'ERROR',
                 message: 'Server error' 
                });
        }
    })

    projectsApiRouter.get('/getProject', async (req, res) => {
        try{ 
            const user = req.decoded;
            const {projectKey} = req.query;

            if (!user) {
                return res.status(400).json({
                    status: 'NOT OK',
                    message: 'Auth token issue.'
                });
            }

            let result = await pool.query(
                'SELECT id, project_key, name, description, user_schema FROM projects WHERE account_id = $1 AND project_key = $2 LIMIT 1',
                [user.id, projectKey]
            );        

            const customFields = result.rows[0].user_schema;

            const userSchema = {
                email: {
                    type: 'string',
                    required: true
                },
                password: {
                    type: 'string',
                    required: true
                },
                
            }

            for (let field of customFields){
                userSchema[field.name] = {
                    type: field.type,
                    required: field.required
                }
            }

            result.rows[0].user_schema = userSchema;
            
            return res.status(201).json({
                status: 'OK',
                project: result.rows[0]
            });
        }catch(err){
            console.error('Projects query error:', err);
            return res.status(500).json({ 
                status: 'ERROR',
                 message: 'Server error' 
                });
        }


        
    })

    return projectsApiRouter;

}


//MIAS secret: 3242beb69673dd82017bd49860d4ad18805a6ba250e1ff6260ef5c5ed8f8e8574a60c42bd7780b1c62170d8fbd3ec92055e58fdda09b521ff195b1831c071467