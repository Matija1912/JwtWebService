module.exports = {
    port : process.env.PORT || 8081,
    pool: {
        connectionLimit: 100,
        host: 'localhost',
        user: 'root',
        password: 'Z9#uB3tX@8hR1!pL2sY^',
        database: 'jws',
        debug: false
    },
    secret: 'jws!45!@#787%!ryfigv132fg3#HN~a'
}