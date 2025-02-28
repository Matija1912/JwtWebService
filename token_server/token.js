export class Token{
    createdAt = Math.round(new Date().getTime()/1000);
    constructor(data, hash, exp){
        this.data = data;
        this.hash = hash;
        this.exp = exp
    }
}