module.exports = (express, pool, jwt, secret, middleware, randomBytes, apiUrl, argon2) => {


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

    projectsApiRouter.post('/regenerateSecret', async (req, res) => {
       try {
        const user = req.decoded;
        const {projectKey} = req.body;

        const newSecret = randomBytes(64).toString('hex');
        const hashedSecret = jwt.crypto.createSha256().update(newSecret).digest('hex');   


        const result = pool.query('UPDATE projects SET secret = $1 WHERE project_key = $2 AND account_id = $3',
            [hashedSecret, projectKey, user.id]
        )

        return res.status(201).json({
                status: 'OK',
                secret: newSecret.toString('hex'),
            });
        

       } catch (err) {
         console.error('Project secret regeneration error:', err);
            return res.status(500).json({ 
                    status: 'ERROR',
                    message: 'Server error' 
                });
       }
    })

    projectsApiRouter.post('/deleteProject', async (req, res) => {
        try {
           

            const { projectKey, password, secretKey, user } = req.body;

            const result = await pool.query('SELECT * FROM projects p ' +
                'JOIN accounts a ON p.account_id = a.id ' + 
                'WHERE p.project_key = $1 AND email = $2 LIMIT 1'
                ,
                [projectKey, user.email]
            )


            if(result.rows.length === 0){
                return res.status(400).json({
                    status: 'NOT OK',
                    message: 'No project found.'
                })
            }

            const passwordResult = result.rows[0].password_hash;
            
            const isValid = await argon2.verify(passwordResult, password);

            if (!isValid) {
                console.log('delition error')
                return res.status(401).json({
                    status: 'NOT OK',
                    message: 'Invalid Password'
                });
            }

            const secretHash = jwt.crypto.createSha256().update(secretKey).digest('hex');

            if (secretHash == result.rows[0].secret){

                const deleteResult = await pool.query('DELETE FROM projects WHERE project_key = $1 AND account_id = $2',
                    [projectKey, result.rows[0].account_id]
                )

                 return res.status(200).json({
                    status: 'OK',
                    message: 'Project deleted'
                });
            }else{
                console.log('delition error')
                return res.status(401).json({
                    status: 'NOT OK',
                    message: 'Invalid secret key'
                });
            }

        } catch (err) {
            
        }
    })

    projectsApiRouter.get('/projectUsers', async (req, res) => {
        try{
            const account = req.decoded;
            const projectKey = req.query.projectKey;
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 10) || 50;

            const projectResult = await pool.query('SELECT * FROM projects WHERE project_key = $1 AND account_id = $2 LIMIT 1',
                [projectKey, account.id]
            );

            if(projectResult.rows.length === 0){
                return res.status(401).json({
                    status: 'NOT OK',
                    message: 'No such project'
                });
            }

            const offset = (page - 1) * pageSize;
            const usersResult = await pool.query('SELECT id, email, created_at, custom_fields FROM users WHERE project_key = $1 LIMIT $2 OFFSET $3',
                [projectKey, pageSize, offset]
            );

            const countResult = await pool.query(
                'SELECT COUNT(*) FROM users WHERE project_key = $1',
                [projectKey]
            );

            return res.status(200).json({
                    status: 'OK',
                    users: usersResult.rows,
                    totalCount: parseInt(countResult.rows[0].count, 10),
                    page,
                    pageSize
                });

        } catch (err) {
            return res.status(500).json({
                    status: 'ERROR',
                    message: 'server error'
                });
        }
    })

    projectsApiRouter.get('/getUserByEmail', async (req, res) => {
        try{

            const account = req.decoded;
            const { projectKey, email } = req.query;
            
            const projectResult = await pool.query('SELECT * FROM projects WHERE project_key = $1 AND account_id = $2 LIMIT 1',
                [projectKey, account.id]
            );

            if(projectResult.rows.length === 0){
                return res.status(401).json({
                    status: 'NOT OK',
                    message: 'No such project'
                });
            }


            const result = await pool.query('SELECT id, email, created_at, custom_fields FROM users WHERE project_key = $1 AND email = $2 LIMIT 1', 
                [projectKey, email]
            )

            return res.status(200).json({
                    status: 'OK',
                    users: result.rows[0]
                });


        }catch(err){
             return res.status(500).json({
                    status: 'ERROR',
                    message: 'server error'
                });
        }

    })

    return projectsApiRouter;

}


//MIAS secret: 3242beb69673dd82017bd49860d4ad18805a6ba250e1ff6260ef5c5ed8f8e8574a60c42bd7780b1c62170d8fbd3ec92055e58fdda09b521ff195b1831c071467