export class SecretKeyError extends Error {
    constructor(message, status) {
        super(message);
        this.name = "SecretKeyError";
        this.status = status;
    }
}