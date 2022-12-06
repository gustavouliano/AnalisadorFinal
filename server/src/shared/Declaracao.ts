import GeradorAssembly from "../analisadores/GeradorAssembly";
import Token from "./Token";

export class Declaracao {

    public tipo: Token;
    public esquerda: Token;
    public direita: Token;
    
    constructor(tipo: Token, esquerda: Token, direita: Token){
        this.tipo = tipo;
        this.esquerda = esquerda;
        this.direita = direita;
    }


    getAssemblyFormat(aVariaveis: Array<any>){
        let sData = '';
        let sText = '';

        console.log(aVariaveis);
        var aVarEsq = GeradorAssembly.getVariavelFromLexema(this.esquerda.lexema, aVariaveis);
        console.log('TESTEEEEEEE');
        console.log(aVarEsq);
        if (!aVarEsq){
            // Se não tem a variável esq, estou declarando uma nova variável!
            sData += this.esquerda.lexema + ': .'
            switch(this.tipo.token){
                case 'string':
                    sData += 'asciiz ""'
                    break;
                case 'int':
                    sData += 'word 0'
                    break;
                default:
                    break;
            }
            aVarEsq = ['', this.esquerda.lexema];
            aVariaveis.push(aVarEsq);
        }
        if (aVarEsq && !aVarEsq[0]){
            // Se não tem registrador, vou criar.
            aVarEsq[0] = GeradorAssembly.getProximoRegistradorLivre(aVariaveis);
            sText += 'lw ' + aVarEsq[0] + ', ' + aVarEsq[1] + '\n';
        }

        if (this.direita.token == 'Constante'){
            sText += 'li $a1, ' + this.direita.lexema;
        }
        else if (this.direita.token == 'Identificador'){
            sText += 'lw $a1, ' + this.direita.lexema;
        }
        sText += '\n'
        sText += `move ${aVarEsq[0]}, $a1`;
        return {data: sData, text: sText};
    }
}