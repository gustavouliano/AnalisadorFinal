import { CondicaoParametro } from "../shared/CondicaoParametro";
import { Declaracao } from "../shared/Declaracao";
import { FunctionClass } from "../shared/FunctionClass";
import { IfClass } from "../shared/IfClass";
import { InterfaceMessage } from "../shared/InterfaceMessage";
import { Print } from "../shared/Print";
import Token from "../shared/Token";
import { Variavel } from "../shared/Variavel";
import { WhileClass } from "../shared/WhileClass";
import { tabelaGoTo } from "../tabelas/tabelaSintatica";

class Semantico implements InterfaceMessage {

    public firsts: Array<string>;
    public escopo: Array<any>;
    public message: string;

    readonly VARIAVEL_PARAMETRO    = 4;
    readonly VARIAVEL_PARAMETRO2   = 9;
    readonly FECHA_PARENTESE_WHILE = 20; // Reduce dentro do parênteses do while.
    readonly FECHA_CHAVE_WHILE     = 32;
    readonly FECHA_PARENTESE_IF    = 40;
    readonly REDUCE_PRINT          = 17;
    // Semantico.FECHA_PARENTESE_WHILE = 22; // Com comparação.
    
    constructor(){
        this.firsts = [
            'Function',
            'if',
            'while'
        ]
        this.escopo = [];
        this.message = 'OK';
    }
    
    /**
     * Analisa um reduce (De um variável declarada).
     * @param {Number} iEstado - Estado após reduce 
     * @param {Token[]} aListaTokens  - Lista de tokens
     * @param {Number} iIndice - Indíce da Lista de Tokens do momento.
     */
    analisaReduce(iEstado: number|string, aListaTokens: Array<any>, iIndice: number|string){
        iIndice = Number(iIndice);
        if ((iEstado == this.VARIAVEL_PARAMETRO
            && tabelaGoTo[iEstado][aListaTokens[iIndice].token] == 210)
            || (iEstado == this.VARIAVEL_PARAMETRO2
                && tabelaGoTo[iEstado][aListaTokens[iIndice].token] == 201)){
            var oVariavel = new Variavel(aListaTokens[iIndice].lexema, aListaTokens[iIndice - 1].token);
            this.escopo[this.escopo.length - 1].addVariavel(oVariavel);
            console.log(iEstado);
        }
        else if (iEstado == this.FECHA_PARENTESE_WHILE
            || iEstado == this.FECHA_PARENTESE_IF){
            return this.avaliaEstado(iEstado, aListaTokens, iIndice);
        }
        else if(iEstado == this.FECHA_CHAVE_WHILE){
            if (aListaTokens[iIndice - 1].token == 'Constante' || aListaTokens[iIndice - 3].token == 'Identificador'){
                return this.analisaDeclaracao(aListaTokens, iIndice - 4);
            }
            else if(['Identificador', 'Constante'].includes(aListaTokens[iIndice - 2].token)
                        && aListaTokens[iIndice - 5].token == 'Identificador'){
                console.log('Entrou declaração String');
                return this.analisaDeclaracao(aListaTokens, iIndice - 6);
            }
        }
        else if (iEstado == this.REDUCE_PRINT && (aListaTokens[iIndice - 6].token == 'Print' || aListaTokens[iIndice - 4].token == 'Print')){
            console.log('Entrou Criação PRINT');
            return this.analisaPrint(iEstado, aListaTokens, iIndice);
        }
        return true;
    }

    avaliaEstado(iEstado: number|string, aListaTokens: Array<any>, iIndice: number|string){
        iIndice = Number(iIndice);
        console.log('Estado no avaliaEstado: ' + iEstado);
        // if (iEstado == this.FECHA_PARENTESE_WHILE_SIMPLES){
        //     var oToken = aListaTokens[iIndice - 1];
        //     if (oToken.token == 'Constante'){
        //         return true;
        //     }
        //     else if (oToken.token == 'Identificador'){
        //         return this.variavelExiste();
        //     }
        // }
        if (iEstado == this.FECHA_PARENTESE_WHILE
            || iEstado == this.FECHA_PARENTESE_IF){
            console.log('ENTROU AVALIA WHILE|IF PARAMETROS');
            var oTokenUm = aListaTokens[iIndice - 2];
            var oTokenDois = aListaTokens[iIndice];
            console.log(oTokenUm.lexema + ' existe: ' + this.variavelExiste(oTokenUm));
            console.log(oTokenDois.lexema + ' existe: ' + this.variavelExiste(oTokenDois));
            var oCondicao = new CondicaoParametro(oTokenUm, aListaTokens[iIndice - 1], oTokenDois);
            this.escopo[this.escopo.length - 1].setCondicao(oCondicao);
            return this.variavelExiste(oTokenUm) && this.variavelExiste(oTokenDois);
        }
        return true;
    }

    variavelExiste(token: Token){
        var self = this;
        if (token.token == 'Constante'){
            return true;
        }
        else if (token.token == 'Identificador'){
            return self.escopo.some(function(oEscopo, iIndice){
                return self.escopo[iIndice].variaveis.some(function(oEl: Variavel){
                    return oEl.nome == token.lexema;
                });
            })
        }
    }

    analisaDeclaracao(aListaTokens: Array<any>, iIndice: number|string){
        iIndice = Number(iIndice);
        var sTipo = aListaTokens[iIndice].token;
        var oToken1 = aListaTokens[iIndice + 1];
        var oToken2 = aListaTokens[iIndice + 3];

        if (this.variavelExiste(oToken1)){
            console.log('Não é permitido redeclarar uma variável: ' + oToken1.lexema);
            this.message = 'Não é permitido redeclarar uma variável: ' + oToken1.lexema;
            return false; //Se a variável já existe, não pode recriá-la...
        }

        if (this.variavelExiste(oToken2)){
            if (oToken2.token == 'Constante' && ['int', 'double'].includes(sTipo)){
                let oVariavel = new Variavel(oToken1.lexema, sTipo);
                const oDeclaracao = new Declaracao(aListaTokens[iIndice], oToken1, oToken2);
                this.escopo[this.escopo.length - 1].addVariavel(oVariavel);
                this.escopo[this.escopo.length - 1].addBloco(oDeclaracao);
                return true;
            }
            else{
                let oVariavel = this.getVarFromLexema(oToken2.lexema);
                console.log(oVariavel);
                console.log(sTipo);
                if (oVariavel && oVariavel.tipo == sTipo){
                    oVariavel = new Variavel(oToken1.lexema, sTipo);
                    var oDeclaracao = new Declaracao(aListaTokens[iIndice], oToken1, oToken2);
                    this.escopo[this.escopo.length - 1].addVariavel(oVariavel);
                    this.escopo[this.escopo.length - 1].addBloco(oDeclaracao);
                    return true;
                }
                else {
                    console.log('Variável não compatível durante atribuição.');
                    this.message = 'Variável não compatível durante atribuição.';
                    if (!oVariavel){
                        console.log('Tentou atribuir uma constante à um tipo não numérico.');
                    }
                }
            }
        }
        else if(oToken2.token == 'Aspas simples'){
            if (sTipo == 'string'){
                var oVariavel = new Variavel(oToken1.lexema, sTipo);
                this.escopo[this.escopo.length - 1].addVariavel(oVariavel);
                return true;
            }
            else{
                console.log('Tentou adicionar uma String à uma varíavel de outro tipo');    
                this.message = 'Tentou adicionar uma String à uma varíavel de outro tipo';
            }
        }
        else{
            console.log(`Variável ${oToken2.lexema} não existe.`);
        }
        return false;
    }

    /**
     * @TODO Não da de fazer no reduce, no if quebra, fazer quanda achar o Token 'Print' - lido com topo 46
     */
    analisaPrint(iEstado: number|string, aListaVariaveis: Array<any>, iIndice: number|string){
        iIndice = Number(iIndice);
        console.log(iEstado);
        console.log(aListaVariaveis);
        console.log(iIndice);
        // console.log(aListaVariaveis[iIndice]);
        if (aListaVariaveis[iIndice - 2].token == 'Aspas simples'){
            // Está printando um texto qualquer.
            const print = new Print(aListaVariaveis[iIndice - 3], 'string');
            this.escopo[this.escopo.length - 1].addBloco(print);
            return true;
        }
        
        if (aListaVariaveis[iIndice - 2].token == 'Identificador'){
            // Está printando um 
            var bVarExiste = this.variavelExiste(aListaVariaveis[iIndice - 2]);
            if (!bVarExiste){
                console.log(`Variável ${aListaVariaveis[iIndice - 2].lexema} não existe.`);
                this.message = `Variável ${aListaVariaveis[iIndice - 2].lexema} não existe.`;
                return false;
            }
            var variavel = this.getVarFromLexema(aListaVariaveis[iIndice - 2].lexema);
            const print = new Print(aListaVariaveis[iIndice - 2], 'Identificador', variavel ? variavel.tipo : undefined);
            this.escopo[this.escopo.length - 1].addBloco(print);
            return true;
        }
        return false
    }

    criaEscopo(token: Token){
        if (!this.firsts.includes(token.token)){
            return;
        }
        var oEscopo = null;

        switch(token.token){
            case 'Function':
                oEscopo = new FunctionClass(token);
                break;
            case 'while':
                oEscopo = new WhileClass(token);
                break;
            case 'if':
                oEscopo = new IfClass(token);
                break;
        }
        if (oEscopo){
            if (this.escopo.length){
                this.escopo[this.escopo.length - 1].addBloco(oEscopo);
            }
            this.escopo.push(oEscopo);
        }
    }

    getVarFromLexema(lexema: string): Variavel|null|undefined{
        var self = this;
        var oVariavel = null;
        this.escopo.some(function(oEscopo: any, indice: number){
            return self.escopo[indice].variaveis.find(function(oEl: Variavel){
                if (oEl.nome == lexema){
                    oVariavel = oEl;
                    return true;
                }
            }.bind(self));
        }.bind(self))
        return oVariavel;
    }

    getMessage(): string {
        return this.message;
    }

}

export default Semantico;
