module.exports = {
    port : process.env.PORT || 8081,
    host: process.env.HOST || '0.0.0.0',
    //backendUrl: process.env.BASE_URL || 'http://localhost:8081',
    //cloudflare tunnel
    backendUrl: process.env.BASE_URL || 'https://harmony-titanium-thick-numbers.trycloudflare.com',
    pool: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: 'Z9#uB3tX@8hR1!pL2sY^',
        database: 'jws',
        debug: false,
        max: 100
    },
    secret: 'jws!45!@#787%!ryfigv132fg3#HN~a',
}