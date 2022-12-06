import Token from "./Token";

export class CondicaoParametro {

    public esq: Token;
    public operador: Token;
    public dir: Token;

    constructor(esq: Token, operador: Token, dir: Token){
        this.esq = esq;
        this.operador = operador;
        this.dir = dir;
    }
}