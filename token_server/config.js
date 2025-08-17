module.exports = {
    port : process.env.PORT || 8081,
    pool: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'Z9#uB3tX@8hR1!pL2sY^',
        database: 'jws',
        debug: false,
        max: 100
    },
    secret: 'jws!45!@#787%!ryfigv132fg3#HN~a'
}