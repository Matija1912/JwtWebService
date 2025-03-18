import { base64urlDecode } from './algorithms';
import { InvalidToken } from './errors';
import {hmac_sha256, base64url_decode, base64url_encode} from './native'
import {Jwt, Secret, SignatureOptions, JwtHeader, JwtPayload, VerifyOptions} from './types_interfaces'


export function decode(data: string){
    return base64url_decode(Buffer.from(data), Buffer.from(data).length);
}

export function sign(
    payload: object,
    secretOrPrivateKey: Secret, // Secret key with HMAC SHA256 and Private key with asymetric RS256 algorithm
    options?: SignatureOptions

): string{
    const iat = Math.floor(Date.now() / 1000);
    const payloadData: Buffer = Buffer.from(JSON.stringify({
        ...payload,
        ...(options?.noTimestamp ? {} : {iat: iat}),
        ...(options?.notBefore !== undefined ? {nbf: options.notBefore + iat} : {}),
        ...(options?.expiresIn !== undefined ? {exp:options.expiresIn + iat} : {}),
        ...(options?.audience !== undefined ? {aud: options.audience} : {}),
        ...(options?.issuer !== undefined ? {iss: options.issuer} : {}),
        ...(options?.subject !== undefined ? {sub: options.subject} : {})
    }));

    const headerData: Buffer = Buffer.from(JSON.stringify({
        ...(options?.algorithm !== undefined ? {alg: options.algorithm} : {alg: "HS256"}),
        ...(options?.header?.typ !== undefined ? {typ: options.header.typ} : {typ: "JWT"})
    }));

    if((options === undefined) || (options.algorithm === undefined) || (options.algorithm === "HS256")){
        // const headerB64U = base64url_encode(headerData, headerData.length).toString();
        // const payloadB64U = base64url_encode(payloadData, payloadData.length).toString();
        
        // HMACSHA256(
        //     base64UrlEncode(header) + "." +
        //     base64UrlEncode(payload),
        //     secret)

        const b64u = Buffer.from(base64url_encode(headerData, headerData.length).toString() + "." + base64url_encode(payloadData, payloadData.length).toString());
        const secret = Buffer.isBuffer(secretOrPrivateKey) ? secretOrPrivateKey : Buffer.from(secretOrPrivateKey);

        const signature = hmac_sha256(b64u, b64u.length, secret, secret.length);

        return base64url_encode(headerData, headerData.length).toString() + "." + base64url_encode(payloadData, payloadData.length).toString() + "." + base64url_encode(signature, signature.length).toString();

    }else if(options.algorithm === "RS256"){
        // Asymetric cryptography => To be implemented
        return "Asymetric";
    }

    return "asd";
}

export function verify(
    token: string,
    secretOrPrivateKey: Secret,  // Secret key with HMAC SHA256 and Private key with asymetric RS256 algorithm
    options?: VerifyOptions
): Jwt | JwtPayload | string {

    const jwtRegex = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
    if(!jwtRegex.test(token)){
        throw new InvalidToken("Invalid token format.");
    }

    const jwt = token.split(".");
    const secret = Buffer.isBuffer(secretOrPrivateKey) ? secretOrPrivateKey : Buffer.from(secretOrPrivateKey);

    const b64u = Buffer.from(jwt[0] + "." + jwt[1]);
    const signature = base64url_decode(Buffer.from(jwt[2]), Buffer.from(jwt[2]).length);
    
    const checkSignature = hmac_sha256(b64u, b64u.length, secret, secret.length);

    if(checkSignature.toString("hex") === signature.toString("hex")){
        const payload: JwtPayload = JSON.parse(base64url_decode(Buffer.from(jwt[1]), Buffer.from(jwt[1]).length).toString());

        if(payload.exp){
            if((Date.now() / 1000) > payload.exp)
            throw new InvalidToken("Token has expired.");
        }

        return payload;
    }else{
        throw new InvalidToken("Token has been tampered with.");
    }

    return "";
}