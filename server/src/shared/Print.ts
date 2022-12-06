import GeradorAssembly from "../analisadores/GeradorAssembly";
import Token from "./Token";

export class Print {

    public valor: Token;
    public tipo: string;
    public tipoIdentificador?: string;

    /**
     * @param {Token} valor
     * @param {String} tipo - 'string|Identificador'
     */
     constructor(valor: Token, tipo: string, tipoIdentifiacdor?: string){
        this.valor = valor;
        this.tipo = tipo;
        this.tipoIdentificador = tipoIdentifiacdor
    }

    getAssemblyFormat(variaveis: Array<any>){
        var sData = '';
        var sText = '';

        if (this.tipo == 'string'){
            sData += 'textoPrint: .asciiz "' + this.valor.lexema + '"';
            sText += 'li $v0, 4\n'
            sText += 'la $a0, textoPrint\n';
        }
        else if (this.tipo == 'Identificador'){
            console.log(this.tipoIdentificador);
            var variavel = GeradorAssembly.getVariavelFromLexema(this.valor.lexema, variaveis);
            if (!variavel){
                variavel = ['', this.valor.lexema];
                variaveis.push(variavel);
            }
            if (!variavel[0]){
                variavel[0] = GeradorAssembly.getProximoRegistradorLivre(variaveis);
            }
            switch(this.tipoIdentificador){
                case 'string':
                    sText += 'li $v0, 4\n';
                    sText += 'la $a0, ' + variavel[1] + '\n';
                    break;
                case 'int':
                    sText += 'li $v0, 1\n'
                    sText += 'lw $a0, ' + variavel[1] + '\n';
                    // sText += 'la $a0, ' + variavel[1] + '\n';
                    break;
            }
            // sText += 'lw $a0, ' + this.valor.lexema + '\n'
        }
        sText += 'syscall';
        return {data: sData, text: sText};
    }

}