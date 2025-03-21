interface JwtHeader {
    alg: string | Algorithm;
    typ?: string | undefined;
}
interface JwtPayload {
    [key: string]: any;
    iss?: string | undefined;
    sub?: string | undefined;
    aud?: string | string[] | undefined;
    exp?: number | undefined;
    nbf?: number | undefined;
    iat?: number | undefined;
    jti?: string | undefined;
}
interface Jwt {
    header: JwtHeader;
    payload: JwtPayload | string;
    signature: string;
}
type Secret = string | Buffer;
type Algorithm = "HS256" | "RS256";
interface SignatureOptions {
    algorithm?: Algorithm | undefined;
    expiresIn?: number;
    notBefore?: number;
    audience?: string | string[] | undefined;
    subject?: string | undefined;
    issuer?: string | undefined;
    noTimestamp?: boolean | undefined;
    header?: JwtHeader | undefined;
}
interface VerifyOptions {
    algorithm?: Algorithm | undefined;
    complete?: boolean | undefined;
    audience?: string | RegExp | string[] | undefined;
}

declare function decode(data: string): any;
declare function sign(payload: object, secretOrPrivateKey: Secret, // Secret key with HMAC SHA256 and Private key with asymetric RS256 algorithm
options?: SignatureOptions): string;
declare function verify(token: string, secretOrPrivateKey: Secret, // Secret key with HMAC SHA256 and Private key with asymetric RS256 algorithm
options?: VerifyOptions): Jwt | JwtPayload | string;

export { decode, sign, verify };
