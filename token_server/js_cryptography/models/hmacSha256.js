class DataTypeError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "DataTypeError";
        this.status = status;
    }
}

export class HmacSha256{
    constructor(secretKey, hmac_sha256){
        this.hmac_sha256 = hmac_sha256;
        this.data = null;
        this.secretKey = secretKey;
        this.hash = null;
    }

    update = (data) => {
        if(typeof(data) != 'string'){
            throw new DataTypeError('Message has to be of type string.');
        }else{
            if(!this.data){
                this.data = data;
            }else{
                this.data += data;
            }
            return this;
        }
    }

    digest = (format) => {
        if(this.data){

            if(format.toLowerCase() == 'hex'){
                try{
                    return this.hmac_sha256(this.data, this.secretKey).toString('hex');
                }catch(e){
                    console.log(e)
                }
            }
    
            if(format.toLowerCase() == 'raw' || format.toLowerCase() == 'bin' || format.toLowerCase() == 'binary'){
                return this.hmac_sha256(this.data, this.secretKey)
            }

        }
    }
}