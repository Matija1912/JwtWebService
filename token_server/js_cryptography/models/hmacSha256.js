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
            const buffer = Buffer.isBuffer(this.data) ? this.data : Buffer.from(this.data);
            const secretKeyBuffer = Buffer.isBuffer(this.secretKey) ? this.secretKey : Buffer.from(this.secretKey);
            if(format.toLowerCase() == 'hex'){
                try{
                    return this.hmac_sha256(buffer, buffer.length, secretKeyBuffer, secretKeyBuffer.length).toString('hex');
                }catch(e){
                    console.log(e)
                }
            }
    
            if(format.toLowerCase() == 'raw' || format.toLowerCase() == 'bin' || format.toLowerCase() == 'binary'){
                return this.hmac_sha256(buffer, buffer.length, secretKeyBuffer, secretKeyBuffer.length);
            }

        }
    }
}