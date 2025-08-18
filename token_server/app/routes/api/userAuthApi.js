module.exports = (express, pool, jwt, secret, middleware) => {
     const userAuthApi = express.Router();

     userAuthApi.use(middleware(jwt, secret, pool));

     userAuthApi.post('/registerUser', async (req, res) => {

          
          const userSchema = req.body.userSchema;
          const userData = req.body.userData;

          for (let key in userSchema){
               const { required, type } = userSchema[key];
               const value = userData[key];
               
               if (required && (value === undefined || value === null)) {
                    errors.push(`Missing required field: ${key}`);
                    continue;
               }
              
               if (value === undefined || value === null) continue;

               switch (type) {
                    case "string":
                    if (typeof value !== "string") {
                         errors.push(`Invalid type for ${key}: expected string, got ${typeof value}`);
                    }
                    break;

                    case "number":
                    if (typeof value !== "number" || Number.isNaN(value)) {
                         errors.push(`Invalid type for ${key}: expected number, got ${typeof value}`);
                    }
                    break;

                    case "boolean":
                    if (typeof value !== "boolean") {
                         errors.push(`Invalid type for ${key}: expected boolean, got ${typeof value}`);
                    }
                    break;

                    case "date":
                    // Accept either Date objects or valid date strings
                    const d = new Date(value);
                    if (isNaN(d.getTime())) {
                         errors.push(`Invalid type for ${key}: expected date, got ${value}`);
                    }
                    break;

                    default:
                    errors.push(`Unknown type "${type}" for field: ${key}`);
               }

          }

          
          return res.status(201).send({
               data: req.body
          })



     //    try{
     //        const user = req.decoded;

     //        if (!user) {
     //            return res.status(400).json({
     //                status: 'NOT OK',
     //                message: 'Auth token issue.'
     //            });
     //        }
     //        const projectData = req.body;

     //        const secret = randomBytes(64);
     //        const hashedSecret = jwt.crypto.createSha256().update(secret).digest('hex')           

     //        const result = await pool.query(
     //            'INSERT INTO projects (account_id, name, description, secret, user_schema) values ($1, $2, $3, $4, $5)'+
     //            'RETURNING id, project_key, name, description, user_schema',
     //            [user.id, projectData.name, projectData.description, hashedSecret, JSON.stringify(projectData.customFields)]
     //        )

     //         return res.status(201).json({
     //            status: 'OK',
     //            secret: secret.toString('hex'),
     //            project: result.rows[0]
     //        });

     //    }catch(err){
     //        console.error('Project creatin error:', err);
     //        return res.status(500).json({ 
     //            status: 'ERROR',
     //             message: 'Server error' 
     //            });
     //    }
    })

    return userAuthApi;

}