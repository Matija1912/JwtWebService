module.exports = (express, pool, argon2, jwt, secret) => {
    const authRouter = express.Router();

    authRouter.post('/login', async (req, res) => {
        try{
            const {email, password} = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    status: 'NOT OK',
                    message: 'Email and password required.'
                });
            }

            const emailNormalized = String(email).toLowerCase();

            const [result] = await pool.execute(
                'SELECT * FROM accounts WHERE email = ? LIMIT 1', [emailNormalized]
            );

            if (result.length == 0){
                return res.status(401).json({
                    status: 'NOT OK',
                    message: 'Invalid credentials'
                })
            }

            const user = result[0];
            const isValid = await argon2.verify(user.password_hash, password);

            if (!isValid) {
                return res.status(401).json({
                    status: 'NOT OK',
                    message: 'Invalid credentials'
                });
            }


            const token = jwt.sign({
                id: user.id,
                email: user.email,
                username: user.username
            }, secret, {
                expiresIn: 7200
            })

            return res.status(200).json({
                status: 'OK',
                message: 'Login successful',
                account: {id: user.id, username: user.username, email: user.email},
                token: token
            });


        }catch(err){
            console.error('Login error: ', err);
            return res.status(500).json({
                status: 'ERROR',
                message: 'Server error'
            });
        }
    })

    authRouter.post('/register', async (req, res) => {
        try{
            const {username, email, password} = req.body;
            if (!username || !email || !password) {
                return res.status(400).json({
                    status: 'NOT OK',
                    message: 'Account data not provided.'
                });
            }

            const usernameNorm = String(username).trim();
            const emailNormalized = String(email).toLowerCase();

            if(usernameNorm.length < 5){
                return res.status(400).json({
                    status: 'NOT OK',
                    message: 'Username too short.'
                });
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalized)) {
                return res.status(400).json({ 
                    status: 'NOT OK',
                    message: 'Invalid email.' 
                });
            }

            if (String(password).length < 8){
                return res.status(400).json({
                    status: 'NOT OK',
                    message: 'Password too short.'
                });
            }

            const passwordHash = await argon2.hash(password)

            const [result] = await pool.execute(
                'INSERT INTO accounts (username, email, password_hash) VALUES (?, ?, ?)',
                [usernameNorm, emailNormalized, passwordHash]
            );        

            return res.status(201).json({
                status: 'OK',
                accountId: result.insertId,
                message: 'User registered successfully'
            });
        }catch(err){
            if (err && err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ 
                    status: 'NOT OK', 
                    message: 'Email already exists' 
                });
            }

            console.error('Register error:', err);
            return res.status(500).json({ 
                status: 'ERROR',
                 message: 'Server error' 
                });
        }

    })

    return authRouter;
}