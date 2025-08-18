module.exports = (jwt, secret, pool) => {
    return async (req, res, next) => {
      
      const { projectKey, secretKey } = req.body;
      const secretKeyHash = jwt.crypto.createSha256().update(secretKey).digest('hex')

      try{

        if (!projectKey || !secretKey) {
          return res.status(400).json({
            status: 'NOT OK',
            message: 'Project key or secret key not provided.'
          });
        }

       

        const result = await pool.query(
                'SELECT * FROM projects WHERE project_key = $1 LIMIT 1',
                [projectKey]
            );

            if (result.rows.length !== 1) {
              return res.status(403).json({ 
                status: 'Forbidden',
                message: 'Invalid credentials.'
              });
            }


            const project = result.rows[0];
            const expectedHash = project.secret;
           
            if (secretKeyHash !== expectedHash) {
              return res.status(403).json({ 
                status: 'Forbidden',
                message: 'Invalid credentials.'
              });
            }

            const customFields = project.user_schema;

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

            req.body.userSchema = userSchema;

            next();

        }catch(err){
            return res.status(500).json({ 
                status: 'ERROR',
                 message: 'Server error or invalid uuid' 
                });
        }

    };
}