import Token from "./Token";
import { Variavel } from "./Variavel";

export class Escopo {

    public token: Token;
    public variaveis: Array<Variavel>;
    public blocos: Array<any>;

    constructor(token: Token){
        this.token = token;
        this.variaveis = []; // Lista de Variavel
        this.blocos = [];    // Lista de Escopo
    }

    addBloco(escopo: any){
        this.blocos.push(escopo);
    }

    addVariavel(variavel: Variavel){
        this.variaveis.push(variavel);
    }
}