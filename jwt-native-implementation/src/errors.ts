export class InvalidToken extends Error{
    constructor(msg: string){
        super(msg);
    }
}