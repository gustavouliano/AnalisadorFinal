import { Escopo } from "./Escopo";
import Token from "./Token";

export class FunctionClass extends Escopo {
    
    constructor(token: Token){
        super(token);
    }

    getAssemblyFormat(aVaraiveis: Array<any>){
        var sData = '';
        this.variaveis.forEach((oVariavel) => {
            sData += oVariavel.nome + ': .'
            switch(oVariavel.tipo){
                case 'string':
                    sData += 'asciiz "Valor de exemplo"';
                    break;
                case 'int':
                    sData += 'word 0'
                    break;
                default:
                    break;
            }
            sData += "\n";
            aVaraiveis.push(['', oVariavel.nome]);
        });

        return {data: sData, texto: ''};
    }
}