import jwt from "./native";

class HmacSha256{

    hmac_sha256: Function;
    data: string | null;
    secretKey: string; 
    hash: Buffer | null;


    constructor(secretKey: string, hmac_sha256: Function){
        this.hmac_sha256 = hmac_sha256;
        this.data = null;
        this.secretKey = secretKey;
        this.hash = null;
    }

    update = (data: string) => {
        if(!this.data){
            this.data = data;
        }else{
            this.data += data;
        }
        return this;
    }

    digest = (format: string) => {
        if(this.data){
            const buffer = Buffer.from(this.data); 
            const secretKeyBuffer = Buffer.from(this.secretKey);
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

export function create_hmac_sha256(secretKey: string){
    return new HmacSha256(secretKey, jwt.hmac_sha256);
}

export function base64urlEncode(input: Buffer | string){
    const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);

    try{
        return jwt.base64url_encode(buffer, buffer.length);
    }catch(e){
        console.log(e);
    }
} 

export function base64urlDecode(input: Buffer | string){
    const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);

    try{
        return jwt.base64url_decode(buffer, buffer.length);
    }catch(e){
        console.log(e);
    }
}