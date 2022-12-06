import { CondicaoParametro } from "./CondicaoParametro";
import { Escopo } from "./Escopo";
import Token from "./Token";

export class IfClass extends Escopo {

    public condicao: CondicaoParametro|null = null;

    constructor(token: Token){
        super(token);
    }
    
    /**
     * Define a condição do parâmetro.
     * @param {CondicaoParametro} condicao 
     */
    setCondicao(condicao: CondicaoParametro){
        this.condicao = condicao;
    }

    getAssemblyFormat(aVariaveis: Array<any>){
        var sData = '';
        var sText = '';

        if (this.condicao){
            if (this.condicao.esq.token == 'Constante'){
                sText += 'li $a0, ' + this.condicao.esq.lexema + "\n";
            }
            else{
                sText += 'lw $a0, ' + this.condicao.esq.lexema + '\n';
            }
            sText += 'beq $a0, $zero, label'
        }
        return {data: sData, text: sText };
    }
}