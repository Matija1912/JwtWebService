declare class HmacSha256 {
    hmac_sha256: Function;
    data: string | null;
    secretKey: string;
    hash: Buffer | null;
    constructor(secretKey: string, hmac_sha256: Function);
    update: (data: string) => this;
    digest: (format: string) => any;
}
declare function create_hmac_sha256(secretKey: string): HmacSha256;

export { create_hmac_sha256 };
