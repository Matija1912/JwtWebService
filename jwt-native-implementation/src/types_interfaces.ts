export interface JwtHeader {
    alg: string | Algorithm;
    typ?: string | undefined;
}

export interface JwtPayload {
    [key: string]: any;         //custom key value pairs
    iss?: string | undefined;   //issuer of the token
    sub?: string | undefined;   //subject (user)
    aud?: string | string[] | undefined;
    exp?: number | undefined;   //expires (in)
    nbf?: number | undefined;   //not before
    iat?: number | undefined;   //issued at
    jti?: string | undefined;   //token id
}

export interface Jwt {
    header: JwtHeader;
    payload: JwtPayload | string;
    signature: string;
}


export type Secret = string | Buffer;

type Algorithm = "HS256" | "RS256"; 

export interface SignatureOptions {
    algorithm?: Algorithm | undefined, // This will be a part of header and not the payload
    // expiresIn and notBefore values should be passed as seconds 
    expiresIn?: number,
    notBefore?: number,
    audience?: string | string[] | undefined,
    subject?: string | undefined,
    issuer?: string | undefined,
    noTimestamp?: boolean | undefined,
    header?: JwtHeader | undefined // This is how we define our header properties (this will not be a part of payload)
};

export interface VerifyOptions {
    algorithm?: Algorithm | undefined,
    complete?: boolean | undefined;
}