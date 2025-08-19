module.exports = (express, pool, jwt, secret, middleware, argon2) => {
     const userAuthApi = express.Router();

     userDataValidation = (userSchema, userData, dataTypeErrors, clientInputErrors) => {

          if(Object.keys(userSchema).length !== Object.keys(userData).length){
                    dataTypeErrors.push('Number of properties provided in user data does not fit the user schema');
               }

          for (let key in userSchema){
               const { required, type } = userSchema[key];
               const value = userData[key];
               
               if (required && (value === undefined || value === null)) {
                    dataTypeErrors.push(`Missing required field: ${key}`);
                    continue;
               }
              
               if (value === undefined || value === null) continue;

               switch (type) {
                    case "string":

                         if (typeof value !== "string") {
                              dataTypeErrors.push(`Invalid type for ${key}: expected string, got ${typeof value}`);
                         }

                         if(key === 'email'){
                              const emailNormalized = String(value).toLowerCase();
                              if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalized)) {
                                   clientInputErrors.push('Invalid email format');
                              }
                         }

                         if(key === 'password'){
                              if (String(value).length < 8) {
                                   clientInputErrors.push('Password must be 8 characters or longer.');
                              }
                         }

                    break;

                    case "number":
                         if (typeof value !== "number" || Number.isNaN(value)) {
                              dataTypeErrors.push(`Invalid type for ${key}: expected number, got ${typeof value}`);
                         }
                    break;

                    case "boolean":
                         if (typeof value !== "boolean") {
                              dataTypeErrors.push(`Invalid type for ${key}: expected boolean, got ${typeof value}`);
                         }
                    break;

                    case "date":
                         const d = new Date(value);
                         if (isNaN(d.getTime())) {
                              dataTypeErrors.push(`Invalid type for ${key}: expected date, got ${value}`);
                         }
                    break;

                    default:
                    dataTypeErrors.push(`Unknown type "${type}" for field: ${key}`);
               }

          }

     }

     userAuthApi.use(middleware(jwt, secret, pool));

     userAuthApi.post('/registerUser', async (req, res) => {
          
          const userSchema = req.body.userSchema;
          const userData = req.body.userData;

          const dataTypeErrors = [];
          const clientInputErrors = [];
          const serverErrors = []

          userDataValidation(userSchema, userData, dataTypeErrors, clientInputErrors);

          if (dataTypeErrors.length > 0 || clientInputErrors.length > 0) {
               const response = { status: "NOT OK" };

               if (dataTypeErrors.length > 0) {
                    response.dataTypeErrors = dataTypeErrors;
               }
               if (clientInputErrors.length > 0) {
                    response.clientInputErrors = clientInputErrors;
               }

               return res.status(400).json(response);
          }

          try{
               const { email, password, ...customFields} = userData;
               const project_key = req.body.projectKey
               
               const passwordHash = await argon2.hash(password);

               const result = await pool.query(
                    'INSERT INTO users (email, password_hash, custom_fields, project_key) ' +
                    'VALUES ($1, $2, $3, $4) RETURNING id, email, custom_fields',
                    [email, passwordHash, customFields, project_key]
               );

               const insertedUser = result.rows[0];

               return res.status(201).json({
                    status: 'OK',
                    message: 'User created',
                    user: insertedUser
               });

          }catch(err){
               if(err.code === '23505'){
                    clientInputErrors.push('Email already exists');
                    return res.status(409).json({ 
                         status: 'NOT OK',
                         clientInputErrors: clientInputErrors 
                    });
               }
               serverErrors.push('Server error');
               return res.status(500).json({ 
                    status: 'ERROR',
                    serverErrors: serverErrors
               });
          }

    })

    userAuthApi.post('/loginUser', async (req, res) => {
     
          const projectKey = req.body.projectKey;
          const { email, password } = req.body.loginData;

          const clientInputErrors = [];
          const serverErrors = []

          try{
               const result = await pool.query(
                    'SELECT id, email, password_hash, custom_fields from users ' +
                    'WHERE project_key = $1 AND email = $2 LIMIT 1',
                    [projectKey, email]
               );
               
               if(result.rows.length === 0){
                    clientInputErrors.push('Invalid credentials');
                    return res.status(401).json({
                         status: 'NOT OK',
                         clientInputErrors: clientInputErrors 
                    })
               }

               const fetchedUser = {
                    id: result.rows[0].id,
                    email: result.rows[0].email,
                    passwordHash : result.rows[0].password_hash,
                    customFields: result.rows[0].custom_fields
               }

               
               const isValid = await argon2.verify(fetchedUser.passwordHash, password);

               if (!isValid) {
                    clientInputErrors.push('Invalid credentials');
                    return res.status(401).json({
                         status: 'NOT OK',
                         clientInputErrors: clientInputErrors 
                    })
               }

               const token = jwt.sign({
                    id: fetchedUser.id,
                    email: fetchedUser.email,
                    customFields: fetchedUser.customFields
               }, secret, {
                    expiresIn: req.body.tokenExpiration
               })

               return res.status(200).json({
                    status: 'OK',
                    message: 'Login successful',
                    user: { 
                         id: fetchedUser.id,
                         email: fetchedUser.email,
                         customFields: fetchedUser.customFields
                    },
                    token: token
               });


          }catch(err){
               serverErrors.push('Server error');
               return res.status(500).json({ 
                    status: 'ERROR',
                    serverErrors: serverErrors
               });
          }

    })


     userAuthApi.post('/verifyToken', async (req, res) => {
     
          const projectKey = req.body.projectKey;
          const token = req.body.token;

          try{

               const user = jwt.verify(token, secret);
               return res.status(200).json({ 
                    status: 'OK',
                    user: user
               });

          }catch (err){;
               return res.status(500).json({ 
                    status: 'TOKEN ERROR',
                    message: err.message
               });

          }

    })

    return userAuthApi;

}