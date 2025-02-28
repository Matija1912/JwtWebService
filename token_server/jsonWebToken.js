const crypto = require("crypto");
const { Token } = require("./token");
const { type } = require("os");
const { TokenError } = require("./tokenError");

module.exports = {

    getStringData: function (data) {
        let stringData = '';
        if(data == null || data == undefined || data === ''){
            return {error: "No data passed."};
        }
    
        if(typeof data === 'object'){
            
            stringData = JSON.stringify(data);

        }else if(typeof data === 'number'){
    
            stringData = data.toString();

        }else{
            stringData = data;
        }
       return stringData;
    },

    signToken: function (data, secret, exp) {
        const stringData = this.getStringData(data);

        if(typeof stringData === 'string'){
            const hash = crypto.createHmac('sha256', secret)
            .update(stringData)
            .digest('hex');

            const token = new Token(data, hash, exp);

            return token;
        }else{
            throw new TokenError("Can't sign the token. " + stringData.error, "Not valid");
 
        }
    },

    verifyToken: function (token, secret) {
        const data = this.getStringData(token.data);
        const hash = crypto.createHmac('sha256', secret)
                            .update(data)
                            .digest('hex');
        if(token.hash === hash){
            if(token.exp !== undefined && typeof token.exp === 'number'){
                const now = Math.round(new Date().getTime()/1000);
                const elapsed = now - token.createdAt;
                if(elapsed > token.exp){
                    throw new TokenError("Verification failed. Token has expired.", "Token expired.");
                
                }
                
            }
            return token
        }else{
            throw new TokenError("Verification failed. Token has been tampered with.", "Invalid token.");
        }
    }

}